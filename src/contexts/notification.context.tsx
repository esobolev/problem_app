/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/ban-types */
import { createContext, FC, ReactElement, useContext, useState } from 'react'
import { Notification, Message } from 'src/components/notification'
import { Modal } from 'src/components/modal'
import { Loading } from 'src/components/common'

interface Props {
  showNotificationHelper: (msg: Message) => void
  showErrorHelper: (err: any) => void
  showConfirm: (msg: Message) => void
  wrapCallback: (func: Function, hide: boolean) => void
  wrapError: (func: Function) => void
  isLoading: boolean
}

const NotificationContext = createContext<Props>({} as Props)

const NotificationProvider: FC = ({ children }): ReactElement => {
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstLoading, setIsFirstLoading] = useState(false)
  const [isShowNotification, setIsShowNotification] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)
  const [message, setMessage] = useState<Message>({
    type: 'success',
    title: 'Title',
    body: 'Body',
  })

  const showNotificationHelper = (msg: Message) => {
    setMessage(msg)
    setIsShowNotification(true)
    setTimeout(() => {
      setIsShowNotification(false)
    }, 3000)
  }

  const showErrorHelper = (err: any) => {
    showNotificationHelper({
      type: 'fail',
      title: 'Error',
      body:
        err?.response?.data?.message || err?.message || 'Something wrong',
    })
  }

  const showConfirm = (msg: Message) => {
    setMessage(msg)
    setIsShowModal(true)
  }

  const wrapCallback = async (func: Function, hide = false) => {
    setIsLoading(true)
    hide && setIsFirstLoading(true)
    try {
      await func()
    } catch (error) {
      showErrorHelper(error)
    } finally {
      setIsLoading(false)
      hide && setIsFirstLoading(false)
    }
  }

  const wrapError = async (func: Function) => {
    try {
      await func()
    } catch (error) {
      showErrorHelper(error)
    }
  }

  const exportValues = {
    showNotificationHelper,
    showErrorHelper,
    showConfirm,
    wrapCallback,
    wrapError,
    isLoading,
  }

  return (
    <NotificationContext.Provider value={exportValues}>
      {children}
      {isLoading && <Loading hideContent={isFirstLoading} />}
      {isShowNotification && <Notification message={message} />}
      {isShowModal && (
        <Modal
          message={message}
          onClose={() => {
            setIsShowModal(false)
          }}
        />
      )}
    </NotificationContext.Provider>
  )
}

const useNotification = () => useContext(NotificationContext)

export { NotificationProvider, useNotification }
