import { useDrop } from 'react-dnd'
import { ItemTypes } from './item-types'

// const style = {
//   height: '12rem',
//   width: '12rem',
//   marginRight: '1.5rem',
//   marginBottom: '1.5rem',
//   color: 'white',
//   padding: '1rem',
//   textAlign: 'center',
//   fontSize: '1rem',
//   lineHeight: 'normal',
//   float: 'left',
// };

function selectBackgroundColor(isActive, canDrop) {
  if (isActive) {
    return '#eaf9db'
  }
  if (canDrop) {
    return '#d8f3f7'
  }
  return '#fff'
}

const Target = ({
  line = null,
  targetItem = null,
  allowedDropEffect = 'move',
  children,
}) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => ({
      name: allowedDropEffect,
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
    <div
      ref={drop}
      className="item-bot item item-drop"
      style={{ backgroundColor }}
    >
      {children}
    </div>
  )
}

export default Target
