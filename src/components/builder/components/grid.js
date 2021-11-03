import { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { times } from 'src/tools'
import { Target } from './grid/target'
import { Box } from './grid/box'
import { getItems } from './tools'

const unitSize = 70

export const Grid = ({
  title = 'Use the unit squares to cover the rectangle.',
  width = 2,
  height = 2,
}) => {
  const [items, setItems] = useState({
    source: [],
    target: [],
  })

  useEffect(() => {
    setItems({
      source: getItems(width * height, 0, ' '),
      target: [],
    })
  }, [width, height])

  const handleDropComplete =
    (fromList, fromIndex) =>
    ({ targetList, targetIndex }) => {
      if (fromList === targetList) {
        const item = { ...items[fromList][fromIndex] }

        const sourceItems = [...items[fromList]]
        sourceItems[fromIndex] = undefined
        sourceItems[targetIndex] = item

        setItems({ ...items, [fromList]: sourceItems })
      } else {
        const item = { ...items[fromList][fromIndex] }

        const sourceItems = [...items[fromList]]
        sourceItems[fromIndex] = undefined

        const targetItems = [...items[targetList]]
        targetItems[targetIndex] = item

        console.log(sourceItems, targetItems)

        setItems({ source: sourceItems, target: targetItems })
      }
    }

  return (
    <>
      <p dangerouslySetInnerHTML={{ __html: title }} />
      <DndProvider backend={HTML5Backend}>
        <div className="basket-source">
          {items.source
            .filter((x) => x)
            .map((x, i) => (
              <Box
                type="box"
                key={x}
                item={x}
                onDropComplete={handleDropComplete('source', i)}
              >
                {x.content}
              </Box>
            ))}
        </div>

        <div
          className="dnd-grid"
          style={{
            width: width * unitSize,
            height: height * unitSize,
            gridTemplateColumns: `repeat(${width}, 1fr)`,
            gridTemplateRows: `repeat(${height}, 1fr)`,
          }}
        >
          {times(width * height).map((x, i) => {
            if (items.target[i]) {
              return (
                <div key={x} className="dnd-cell">
                  <Box
                    type="box"
                    item={x}
                    onDropComplete={handleDropComplete('target', i)}
                  >
                    {x.content}
                  </Box>
                </div>
              )
            }
            return (
              <Target key={x} accept="box" targetList="target" targetIndex={i}>
                {' '}
              </Target>
            )
          })}
        </div>
      </DndProvider>
    </>
  )
}
