import { times } from 'src/tools'
import {
  InputAnswerAttributes,
  InputAnswerReviewAttributes,
} from '../common/answer_type'

const NumberLineAnswer = ({ items, answerUser, handleAnswer }) => {
  const imagePath = `/account/images/dest/types/number_line/`

  return (
    <div className="block items mt-30">
      <div className="left" />

      {items.map((x, i) => (
        <div key={`item-${i}`} className="item">
          <div className="before" />
          <a
            onClick={handleAnswer(i)}
            className={answerUser && answerUser[i] ? 'val selected' : 'val'}
            href="#"
          >
            {x.value}
          </a>
        </div>
      ))}
      <div className="right" />
    </div>
  )
}
NumberLineAnswer.propTypes = {
  ...InputAnswerAttributes,
}

const NumberLineAnswerReview = ({ items, answerUser, answerTrue }) => (
  <div className="block items mt-30">
    <div className="left" />
    {items.map((x, i) => (
      <div key={`item-${i}`} className="item">
        <div className="before" />
        {answerUser && answerUser[i] ? (
          <span
            className={
              answerUser && answerUser[i] && answerTrue[i]
                ? 'val selected true'
                : 'val selected fail'
            }
            href="#"
          >
            {x.value}
          </span>
        ) : (
          <span
            className={answerTrue[i] ? 'val selected true' : 'val'}
            href="#"
          >
            {x.value}
          </span>
        )}
      </div>
    ))}
    <div className="right" />
  </div>
)
NumberLineAnswerReview.propTypes = {
  ...InputAnswerReviewAttributes,
}

//
const JumpLineAnswer = ({ extra, answerUser, handleAnswer }) => {
  if (!extra.items) return null

  const imagePath = `/account/images/dest/types/number_line/${
    extra.oper === '+' ? 'right.svg' : 'left.svg'
  }`

  // extra.items.forEach((x, i) => {
  //   console.log(Number(x.value), '>=', Number(extra.left), '&&',
  //     Number(x.value), '<=', Number(extra.left) + Number(extra.right))
  // })

  const isImageShow = (x) => {
    let isShow = false

    if (extra.oper === '+') {
      isShow =
        Number(x.value) >= Number(extra.left) &&
        Number(x.value) < Number(extra.left) + Number(extra.right)
    } else if (extra.oper === '-') {
      isShow =
        Number(x.value) >= Number(extra.left) - Number(extra.right) &&
        Number(x.value) < Number(extra.left)
    }

    return isShow
  }

  // console.log('answerUser', answerUser)

  return (
    <>
      <div className="block items mt-30">
        {extra.items.length > 0 &&
          extra.items.map((x, i) => (
            <>
              {isImageShow(x) && (
                <img
                  key={i}
                  style={{
                    position: 'absolute',
                    top: -58,
                    left: 58 + i * 60,
                  }}
                  src={imagePath}
                />
              )}
            </>
          ))}

        <div className="left" />
        {extra.items.map((x, i) => (
          <div key={`item-${i}`} className="item">
            <div className="before" />
            <span className="val">{x.value}</span>
          </div>
        ))}
        <div className="right" />
      </div>

      <div className="buttons-row buttons-center">
        {extra.buttons.map((item) => (
          <button
            type="button"
            key={item.value}
            className={
              answerUser && answerUser[0] === item.value
                ? 'second-btn btn-active'
                : 'second-btn'
            }
            onClick={() => {
              handleAnswer(item.value)
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  )
}

JumpLineAnswer.propTypes = {
  ...InputAnswerAttributes,
}

const JumpLineAnswerReview = ({ extra, answerUser, handleAnswer }) => {
  const imagePath = `/account/images/dest/types/number_line/${
    extra.oper === '+' ? 'right.svg' : 'left.svg'
  }`

  // extra.items.forEach((x, i) => {
  //   console.log(Number(x.value + extra.items[0].value), '>=', Number(extra.left), '&&',
  //     Number(x.value + extra.items[0].value), '<=', Number(extra.left) + Number(extra.right))
  // })

  const isImageShow = (x) => {
    let isShow = false

    if (extra.oper === '+') {
      isShow =
        Number(x.value) + Number(extra.items[0].value) > Number(extra.left) &&
        Number(x.value) + Number(extra.items[0].value) <=
          Number(extra.left) + Number(extra.right)
    } else if (extra.oper === '-') {
      isShow =
        Number(x.value) + Number(extra.items[0].value) >
          Number(extra.left) - Number(extra.right) &&
        Number(x.value) + Number(extra.items[0].value) <= Number(extra.left)
    }

    return isShow
  }

  return (
    <>
      <div className="block items mt-30">
        {extra.items.length > 0 &&
          extra.items.map((x, i) => (
            <>
              {isImageShow(x) && (
                <img
                  key={i}
                  style={{
                    position: 'absolute',
                    top: -58,
                    left: 58 + i * 60,
                  }}
                  src={imagePath}
                />
              )}
            </>
          ))}

        <div className="left" />
        {extra.items.map((x, i) => (
          <div key={`item-${i}`} className="item">
            <div className="before" />
            <span className="val">{x.value}</span>
          </div>
        ))}
        <div className="right" />
      </div>
    </>
  )
}
JumpLineAnswerReview.propTypes = {
  ...InputAnswerReviewAttributes,
}

export {
  NumberLineAnswer,
  NumberLineAnswerReview,
  JumpLineAnswer,
  JumpLineAnswerReview,
}
