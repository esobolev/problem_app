import { useDrop } from 'react-dnd'
import Box from './components/box'
import { ItemTypes } from './components/item-types'
import { basketTypeEnum } from './builder'

function selectBackgroundColor(isActive, canDrop) {
  if (isActive) {
    return '#eaf9db'
  }
  if (canDrop) {
    return '#d8f3f7'
  }
  return '#fff'
}

const Basket = ({
  value,
  name,
  // allowedDropEffect,
  answerUser: pAnswerUser = [],
  handleReDropComplete,
  type,
}) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.BOX,
    drop: () => ({
      name,
      allowedDropEffect: 'DROP_TO_BASKET',
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })
  const answerUser = pAnswerUser || []

  const isActive = canDrop && isOver
  const backgroundColor = selectBackgroundColor(isActive, canDrop)

  console.log('Basket', name, pAnswerUser, 'answerUser', answerUser)

  const mainStyle =
    type === basketTypeEnum.colors
      ? { borderColor: value.color || '#5A5656', backgroundColor }
      : undefined
  const headStyle =
    type === basketTypeEnum.colors
      ? {
          backgroundColor: value.color || '#5A5656',
          borderBottomColor: value.color || '#5A5656',
        }
      : undefined

  return (
    <div ref={drop} className="basket" style={mainStyle}>
      <div className="head" style={headStyle}>
        {value.title}
      </div>
      <div className="contain">
        {answerUser.map((x, i) => (
          <Box
            className="box"
            key={`item-${i}`}
            name={x.value}
            onDropComplete={handleReDropComplete(i, x, name)}
          >
            <img key={`item-${i}`} src={x.value} alt="" />
          </Box>
        ))}
      </div>
    </div>
  )
}

export default Basket
