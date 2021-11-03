import { memo } from 'react'
import { useDrop } from 'react-dnd'

export const Target = memo(({ accept, targetList, targetIndex, children }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    // drop: onDrop,
    drop: () => ({
      allowedDropEffect: 'move',
      targetList,
      targetIndex,
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const isActive = isOver && canDrop
  let backgroundColor = '#fafafa'

  if (isActive) {
    backgroundColor = 'lightgreen'
  } else if (canDrop) {
    backgroundColor = '#c8f2ff'
  }

  return (
    <div ref={drop} className="dnd-cell" style={{ backgroundColor }}>
      {children}
    </div>
  )
})
