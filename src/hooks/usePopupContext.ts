import { useContext } from 'react'
import PopupContext from 'src/contexts/PopupContext'

export default function usePopupContext() {
  return useContext(PopupContext)
}
