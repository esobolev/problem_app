import React, {
  useCallback,
  useState,
  createContext,
  useRef,
  useContext,
} from 'react'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'

const SideBarContext = createContext()

const SideBarContextProvider = ({ menu, children }) => {
  const refSidebar = useRef()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useOnClickOutside(refSidebar, () => setIsSidebarOpen(false))

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen)
  }, [])

  const hideSideBar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  return (
    <SideBarContext.Provider value={{ toggleSidebar, hideSideBar }}>
      <section className={isSidebarOpen ? 'pageHb header-open' : 'pageHb'}>
        <div ref={refSidebar} className="sidebarHb">
          {menu}
        </div>
        {children}
      </section>
    </SideBarContext.Provider>
  )
}

const useSideBarContext = () => useContext(SideBarContext)

export { SideBarContextProvider, useSideBarContext }
