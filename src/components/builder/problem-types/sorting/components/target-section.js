import { useDrop } from 'react-dnd'
import { ItemTypes } from './item-types'

function selectBackgroundColor(isActive, canDrop) {
  if (isActive) {
    return '#eaf9db'
  }
  if (canDrop) {
    return '#d8f3f7'
  }
  return '#fff'
}

const TargetSection = ({
  line = null,
  targetItem = null,
  allowedDropEffect = 'move',
  children,
}) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => ({
      name: `${allowedDropEffect} Dustbin`,
      allowedDropEffect,
      targetItem,
      line,
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const isActive = canDrop && isOver
  const backgroundColor = selectBackgroundColor(isActive, canDrop)

  return (
    <div ref={drop} className="item item-drop" style={{ backgroundColor }}>
      {children}
    </div>
  )
}

export default Target
