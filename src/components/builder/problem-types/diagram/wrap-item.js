import { useState, useRef } from 'react'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import ShapesMenu from '../common/shapes-menu'

export default function WrapItem({
  item,
  index,
  handleHiddenClick = null,
  handleShapeClick,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const refMenu = useRef()

  useOnClickOutside(refMenu, () => setIsOpen(false))

  const handleClick = () => {
    setIsOpen(true)
  }

  const handleShapeSelect = (name) => {
    console.log('name', name)
    setIsOpen(false)
    handleShapeClick(name)
  }

  return (
    <div className="wrap-item">
      <div ref={refMenu}>
        <ShapesMenu active={isOpen} onClick={handleShapeSelect} />
      </div>

      <div className="shape-select" onClick={handleClick}>
        {item.value ? <img src={item.value} alt="" /> : '-'}
      </div>

      {handleHiddenClick && (
        <div className="column-btns">
          <button
            className={`second-btn ${item.hidden ? 'btn-active' : ''}`}
            onClick={handleHiddenClick(index, false)}
            type="button"
          >
            show
          </button>
          <button
            className={`second-btn ${!item.hidden ? 'btn-active' : ''}`}
            onClick={handleHiddenClick(index, true)}
            type="button"
          >
            hide
          </button>
        </div>
      )}
    </div>
  )
}
