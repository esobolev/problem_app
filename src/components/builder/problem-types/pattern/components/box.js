/* import { memo } from 'react';

const styles = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  cursor: 'move',
};

export const Box = memo(function Box({ title, yellow, preview }) {
  const backgroundColor = yellow ? 'yellow' : 'white';
  return (
    <div style={{ ...styles, backgroundColor }} role={ preview ? 'BoxPreview' : 'Box' }>
      {title}
    </div>);
});
*/

// const boxImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K';

import {
  DragSource,
  DragPreviewImage,
  useDrag,
  useDragDropManager,
} from 'react-dnd'
import { ItemTypes } from './item-types'

// const style = {
//   border: '1px dashed gray',
//   backgroundColor: 'white',
//   padding: '0.5rem 1rem',
//   marginRight: '1.5rem',
//   marginBottom: '1.5rem',
//   float: 'left',
// };

const Box = ({ className, name, onDropComplete, children }) => {
  // const dragDropManager = useDragDropManager()

  const [{ opacity }, drag, preview] = useDrag({
    item: {
      name,
      type: ItemTypes.BOX,
    },
    end(item, monitor) {
      const dropResult = monitor.getDropResult()

      console.log({ item, dropResult })

      if (item && dropResult) {
        onDropComplete(dropResult)
      }
    },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  })

  return (
    <div ref={drag} className={className} style={{ opacity }}>
      {children}
    </div>
  )
}

export default Box
