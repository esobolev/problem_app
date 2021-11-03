import { useCallback, useState, useRef, createContext } from 'react'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'

const PopupContext = createContext()

export default PopupContext

export function PopupContextProvider({ children }) {
  const [props, setProps] = useState({
    title: 'title',
    visible: false,
    content: 'content',
    handleOk: () => {},
    handleCancel: () => {},
  })

  const {
    title,
    visible,
    content,
    handleOk,
    handleCancel,
    hideActions = false,
  } = props

  const refModal = useRef()
  useOnClickOutside(refModal, () => handleCancel())

  const setDialogProps = useCallback(
    (value) => {
      setProps({ ...props, ...value })
    },
    [setProps],
  )

  return (
    <PopupContext.Provider value={setDialogProps}>
      {children}
      <div className={`popup-overview ${visible ? 'active' : ''}`} />
      <div ref={refModal} className={`modals popup ${visible ? 'active' : ''}`}>
        <div className="modals__wrapper">
          <div className="modals__head">
            <h3 className="modals__title">
              <span>{title}</span>
            </h3>
            <button
              onClick={handleCancel}
              type="button"
              className="modals__close"
            >
              <img src="/account/images/dest/icons/close.svg" alt="Close" />
            </button>
          </div>

          <div className="modals__body">{content}</div>

          {!hideActions && (
            <p className="actions">
              <button type="button" className="second-btn" onClick={handleCancel}>
                Close
              </button>
              <button type="button" className="primary-btn" onClick={handleOk}>
                OK
              </button>
            </p>
          )}
        </div>
      </div>
    </PopupContext.Provider>
  )
}
