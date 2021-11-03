import { useDrag } from 'react-dnd'

const style = {
  position: 'absolute',
  cursor: 'move',
  // backgroundColor: 'transparent'
}

export const Box = ({ type, item, onDropComplete, children }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { ...item, type },
    end(endItem, monitor) {
      const dropResult = monitor.getDropResult()
      if (endItem && dropResult) {
        onDropComplete(dropResult)
      }
    },
    // collect: (monitor) => ({
    //     opacity: monitor.isDragging() ? 0.4 : 1,
    // }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  if (isDragging) {
    return <div ref={drag} />
  }

  return (
    <div ref={drag} className="draggable" style={{ ...style }}>
      {children}
    </div>
  )
}
