import { useDrag } from 'react-dnd'
import { ItemTypes } from './item-types'

const style = {
  position: 'absolute',
  cursor: 'move',
  backgroundColor: 'transparent',
}

export const Box = ({ id, left, top, name, hideSourceOnDrag, children }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.BOX, id, left, top, name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />
  }

  return (
    <div
      ref={drag}
      style={{ ...style, left, top }}
      className="item box no-border"
      role="Box"
    >
      {children}
    </div>
  )
}
