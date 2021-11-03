import { useCallback, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import update from 'immutability-helper'
import { getLabelByValue } from 'src/tools'
import { ItemTypes } from './item-types'
import { Box } from './box'

import {
  leftPropertyOptions,
  rightPropertyOptions,
} from '../../common/constants'

const styles = {
  width: document.body.offsetWidth < 480 ? 320 : 460,
  height: document.body.offsetWidth < 480 ? 280 : 420,
  position: 'relative',
}

const labelStyles = {
  left: document.body.offsetWidth < 480 ? 70 : 120,
  right: document.body.offsetWidth < 480 ? 70 : 120,
  top: document.body.offsetWidth < 480 ? 10 : 55,
}

const accept = ItemTypes.BOX

export const DropContainer = ({
  items = [],
  answers,
  hideSourceOnDrag,
  leftProperty = '1',
  rightProperty = '2',
  handleAnswerMove = () => {}
}) => {
  const [boxes, setBoxes] = useState({})
  const [points, setPoints] = useState({
    left: [],
    middle: [],
    right: [],
  })

  useEffect(() => {
    if (items.length <= 0) return

    setPoints(items)
  }, [items])

  useEffect(() => {
    const b = (answers || []).map((x, i) => ({
      left: -10 + i * 60,
      top: styles.height - 80,
      ...x,
      value: x.value,
    }))
    setBoxes(b)
  }, [answers])

  const moveBox = useCallback(
    (id, left, top) => {

      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        }),
      )
    },
    [boxes, setBoxes],
  )

  useEffect(() => {
    handleAnswerMove(boxes);
  }, [boxes])

  const dropOptions = {
    accept,
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset()
      const left = Math.round(item.left + delta.x)
      const top = Math.round(item.top + delta.y)
      moveBox(item.id, left, top)
      return null
    },
    collect: (monitor) => ({
      className: monitor.isOver() ? 'path active' : 'path',
    }),
  }

  const [collectBg, dropBg] = useDrop({ ...dropOptions })
  // const [collectMiddle, dropMiddle] = useDrop({ ... dropOptions });
  // const [collectRight, dropRight] = useDrop({ ... dropOptions });
  // const [collectLeft, dropLeft] = useDrop({ ... dropOptions });

  return (
    <div style={styles} className="drop-layer">
      <div
        className="venn-layer"
        ref={dropBg}
        // className={collectBg.className}
      >
        <div
          className="venn-label-left"
          style={{ left: labelStyles.left, top: labelStyles.top }}
        >
          {getLabelByValue(leftPropertyOptions, leftProperty)}
        </div>

        <div
          className="venn-label-right"
          style={{ right: labelStyles.right, top: labelStyles.top }}
        >
          {getLabelByValue(rightPropertyOptions, rightProperty)}
        </div>

        <svg
          width={styles.width - 2}
          height={styles.height - 88}
          viewBox="0 0 462 322"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            // ref={dropBg}
            style={{ zIndex: 1 }}
            // className={collectBg.className}
            d="M461 1H1V321H461V1ZM161 286C186.937 286 211.028 278.101 231 264.577C250.972 278.101 275.063 286 301 286C370.036 286 426 230.036 426 161C426 91.9644 370.036 36 301 36C275.063 36 250.972 43.8993 231 57.4233C211.028 43.8993 186.937 36 161 36C91.9644 36 36 91.9644 36 161C36 230.036 91.9644 286 161 286Z"
            fill="white"
          />
          <path
            d="M1 1V0H0V1H1ZM461 1H462V0H461V1ZM1 321H0V322H1V321ZM461 321V322H462V321H461ZM231 264.577L231.561 263.749L231 263.369L230.439 263.749L231 264.577ZM231 57.4233L230.439 58.2513L231 58.631L231.561 58.2513L231 57.4233ZM1 2H461V0H1V2ZM2 321V1H0V321H2ZM461 320H1V322H461V320ZM460 1V321H462V1H460ZM230.439 263.749C210.628 277.164 186.73 285 161 285V287C187.143 287 211.428 279.037 231.561 265.405L230.439 263.749ZM301 285C275.27 285 251.372 277.164 231.561 263.749L230.439 265.405C250.572 279.037 274.857 287 301 287V285ZM425 161C425 229.483 369.483 285 301 285V287C370.588 287 427 230.588 427 161H425ZM301 37C369.483 37 425 92.5167 425 161H427C427 91.4121 370.588 35 301 35V37ZM231.561 58.2513C251.372 44.8359 275.27 37 301 37V35C274.857 35 250.572 42.9627 230.439 56.5953L231.561 58.2513ZM161 37C186.73 37 210.628 44.8359 230.439 58.2513L231.561 56.5953C211.428 42.9627 187.143 35 161 35V37ZM37 161C37 92.5167 92.5167 37 161 37V35C91.4121 35 35 91.4121 35 161H37ZM161 285C92.5167 285 37 229.483 37 161H35C35 230.588 91.4121 287 161 287V285Z"
            fill="#9DD765"
          />

          <path
            onDragOver={() => {
              console.log('Over Middle')
            }}
            onDragLeave={() => {
              console.log('Leave Middle')
            }}
            style={{ zIndex: 2 }}
            // ref={dropMiddle}
            // className={collectMiddle.className}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M231 264.577C264.188 242.104 286 204.099 286 161C286 117.901 264.188 79.8964 231 57.4233C197.812 79.8964 176 117.901 176 161C176 204.099 197.812 242.104 231 264.577Z"
            fill="white"
          />
          <path
            onDragOver={() => {
              console.log('Over Middle')
            }}
            onDragLeave={() => {
              console.log('Leave Middle')
            }}
            d="M231 264.577L230.439 265.405L231 265.784L231.561 265.405L231 264.577ZM231 57.4233L231.561 56.5953L231 56.2156L230.439 56.5953L231 57.4233ZM285 161C285 203.753 263.364 241.454 230.439 263.749L231.561 265.405C265.011 242.754 287 204.445 287 161H285ZM230.439 58.2513C263.364 80.5463 285 118.247 285 161H287C287 117.555 265.011 79.2464 231.561 56.5953L230.439 58.2513ZM177 161C177 118.247 198.636 80.5463 231.561 58.2513L230.439 56.5953C196.989 79.2464 175 117.555 175 161H177ZM231.561 263.749C198.636 241.454 177 203.753 177 161H175C175 204.445 196.989 242.754 230.439 265.405L231.561 263.749Z"
            fill="#9DD765"
          />

          <path
            style={{ zIndex: 3 }}
            // ref={dropRight}
            // className={collectRight.className}
            fillRule="evenodd "
            clipRule="evenodd"
            d="M231 264.577C264.188 242.104 286 204.099 286 161C286 117.901 264.188 79.8964 231 57.4233C250.972 43.8993 275.063 36 301 36C370.036 36 426 91.9644 426 161C426 230.036 370.036 286 301 286C275.063 286 250.972 278.101 231 264.577Z"
            fill="white"
          />
          <path
            d="M231 264.577L230.439 263.749L229.217 264.577L230.439 265.405L231 264.577ZM231 57.4233L230.439 56.5953L229.217 57.4233L230.439 58.2513L231 57.4233ZM285 161C285 203.753 263.364 241.454 230.439 263.749L231.561 265.405C265.011 242.754 287 204.445 287 161H285ZM230.439 58.2513C263.364 80.5463 285 118.247 285 161H287C287 117.555 265.011 79.2465 231.561 56.5953L230.439 58.2513ZM231.561 58.2513C251.372 44.8359 275.27 37 301 37V35C274.857 35 250.572 42.9627 230.439 56.5953L231.561 58.2513ZM301 37C369.483 37 425 92.5167 425 161H427C427 91.4121 370.588 35 301 35V37ZM425 161C425 229.483 369.483 285 301 285V287C370.588 287 427 230.588 427 161H425ZM301 285C275.27 285 251.372 277.164 231.561 263.749L230.439 265.405C250.572 279.037 274.857 287 301 287V285Z"
            fill="#9DD765"
          />

          <path
            // ref={dropLeft}
            // className={collectLeft.className}
            fillRule="evenodd"
            clipRule="evenodd"
            d="M231 57.4233C197.812 79.8964 176 117.901 176 161C176 204.099 197.812 242.104 231 264.577C211.028 278.101 186.937 286 161 286C91.9644 286 36 230.036 36 161C36 91.9644 91.9644 36 161 36C186.937 36 211.028 43.8993 231 57.4233Z"
            fill="white"
          />
          <path
            d="M231 57.4233L231.561 58.2513L232.783 57.4233L231.561 56.5953L231 57.4233ZM231 264.577L231.561 265.405L232.783 264.577L231.561 263.749L231 264.577ZM177 161C177 118.247 198.636 80.5463 231.561 58.2513L230.439 56.5953C196.989 79.2464 175 117.555 175 161H177ZM231.561 263.749C198.636 241.454 177 203.753 177 161H175C175 204.445 196.989 242.754 230.439 265.405L231.561 263.749ZM230.439 263.749C210.628 277.164 186.73 285 161 285V287C187.143 287 211.428 279.037 231.561 265.405L230.439 263.749ZM161 285C92.5167 285 37 229.483 37 161H35C35 230.588 91.4121 287 161 287V285ZM37 161C37 92.5167 92.5167 37 161 37V35C91.4121 35 35 91.4121 35 161H37ZM161 37C186.73 37 210.628 44.8359 230.439 58.2513L231.561 56.5953C211.428 42.9627 187.143 35 161 35V37Z"
            fill="#9DD765"
          />
        </svg>

        <div
          style={{
            left: 34,
            top: 40,
            position: 'absolute',
            width: 390,
            height: 252,
          }}
        >
          {[...points.left, ...points.middle, ...points.right].map(
            ({ x, y, value }, i) => (
              <div
                key={`r-${i}`}
                style={{
                  left: x,
                  top: y,
                }}
                className="box box-random no-border"
              >
                <img src={value} alt="" />
              </div>
            ),
          )}
        </div>
      </div>

      {Object.keys(boxes).map((key) => {
        const { left, top, value } = boxes[key]

        return (
          <Box
            key={key}
            id={key}
            left={left}
            top={top}
            name={value}
            hideSourceOnDrag={hideSourceOnDrag}
          >
            <img src={value} alt="" />
          </Box>
        )
      })}
    </div>
  )
}

export default DropContainer
