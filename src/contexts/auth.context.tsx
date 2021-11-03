/* eslint-disable no-console */
import { createContext, useContext, useState, useEffect, ReactElement, FC } from 'react'
import {
  getProfileRequest,
  updateProfileRequest,
  logoutRequest,
  logoutRedirect,
} from 'src/services/api.service'
import { cookies, storage } from 'src/services/storage'
import { UpdateUserData, UserData } from 'src/services/dto'

interface State {
  isFetched: boolean
  needRedirect: boolean
}

interface Props {
  user: UserData | null
  state: State
  cache: any
  logout: () => void
  getUser: () => void
  setUser: (value: React.SetStateAction<UserData | undefined>) => void
  setToken: (token: string | null) => void
  setViewStates: (data: any) => void
  setCache: () => void
}


const AuthContext = createContext<Props>({} as Props)

// eslint-disable-next-line react/prop-types
const AuthProvider: FC = ({ children }): ReactElement => {
  const [user, setUser] = useState<UserData>()
  const [cacheState, setCacheState] = useState({})
  const [state, setState] = useState({ isFetched: false, needRedirect: false })

  const setToken = (token: string | null) => {
    if (!token) {
      console.log('Delete cookie expires', token)
      cookies.setItem('token', '', {
        domain: `.${process.env.REACT_APP_DOMAIN}`,
        expires: 'Thu, 01 Jan 1970 00:00:01 GMT;',
      })
      storage.removeItem('token')
    } else {
      console.log('Save cookie', token)
      cookies.setItem('token', token, {
        domain: `.${process.env.REACT_APP_DOMAIN}`,
      })
    }
  }

  const getUser = async () => {
    const token = cookies.getItem('token')

    console.log('Load cookie', token)

    if (!token || token === 'null') {
      console.log('No token')
      setUser(undefined)
      setCacheState({})
      setToken(null)
      setState({ isFetched: true, needRedirect: false })
      return null
    }

    try {
      console.log('getProfileRequest')
      const response = await getProfileRequest()
      const { user: u } = response.data

      console.log('user', u)

      // Check role
      // if (!user || !roles.includes(user.role)) {
      //   history.replace('/login')
      //   return ;
      // }

      setUser(u)
      setState({ isFetched: true, needRedirect: false })
      return u
    } catch (error) {
      console.log('getProfileRequest err', error)
      console.log('error status', error?.response?.status)

      /*
          setUser(null)
          setCacheState({})
          setToken(null)
          */

      setState({ isFetched: true, needRedirect: false })
    }

    return null;
  }

  const setViewStates = async (data = {}) => {
    try {
      if (!user) return;

      const viewStates = { ...(user.view_states ?? {}), ...data }

      setUser({ ...user, view_states: viewStates })
      await updateProfileRequest({ view_states: viewStates } as UpdateUserData)
    } catch (error) {
      console.log('Error setViewStates', error)
    }
  }

  const setCache = async (data = {}) => {
    setCacheState({ ...cacheState, ...data })
  }

  const logout = async () => {
    try {
      await logoutRequest()
      setToken(null)
      setUser(undefined)
      setCacheState({})
    } catch (error) {
      console.log(error)
    }

    setState({ isFetched: true, needRedirect: true })
    logoutRedirect()
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        state,
        cache: cacheState,
        logout,
        getUser,
        setUser,
        setToken,
        setViewStates,
        setCache,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
