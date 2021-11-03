import TimeField from 'react-simple-timefield'
import {
  InputAnswerAttributes,
  InputAnswerReviewAttributes,
} from '../common/answer_type'

// Answer Input
const InputTimeAnswer = ({ extra, answerUser, handleAnswer }) => {
  const exAnswerUser = answerUser || {}

  console.log('exAnswerUser', exAnswerUser, typeof exAnswerUser)

  return (
    <div className="block items flex-wrap">
      {(extra.items || []).map((x, i) => (
        <div key={`item-${i}`} className="item clock-item-input">
          <TimeField
            className="item time-input"
            value={exAnswerUser[i]}
            onChange={handleAnswer(i)}
          />
        </div>
      ))}
    </div>
  )
}

InputTimeAnswer.propTypes = {
  ...InputAnswerAttributes,
}

// Review Answer Input with True answer
const InputTimeAnswerReview = ({ extra, answerUser, answerTrue }) => {
  const exAnswerUser = answerUser || {}

  return (
    <div className="block items flex-wrap">
      {(extra.items || []).map((x, i) => (
        <div key={`item-${i}`} className="item clock-item-input">
          {exAnswerUser[i] === answerTrue[i] ? (
            <div className="clock-answer true">{answerUser[i]}</div>
          ) : (
            <>
              <div>
                <div className="clock-answer fail">{answerUser[i]}</div>
              </div>
              <div>
                <div className="clock-answer true mt-10">{answerTrue[i]}</div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

InputTimeAnswerReview.propTypes = {
  ...InputAnswerReviewAttributes,
}

// AnswerButtons

const AnswerButtons = ({ extra, answerUser = '', handleAnswer = () => {} }) => (
  <div className="buttons-row buttons-center">
    {extra.buttons.map((item, i) => (
      <button
        type="button"
        key={`button-${i}`}
        className={
          answerUser === item.value ? 'second-btn btn-active' : 'second-btn'
        }
        onClick={() => {
          handleAnswer(item.value)
        }}
      >
        {item.label}
      </button>
    ))}
  </div>
)
AnswerButtons.propTypes = {
  ...InputAnswerAttributes,
}

const AnswerButtonsReview = ({ extra, answerUser = '', answerTrue = null }) => {
  const getAnswerStyle = (item, answerTrue, answerUser) => {
    if (answerUser === item.value) {
      return answerUser === answerTrue
        ? 'second-btn true user'
        : 'second-btn fail user'
    }
    if (answerTrue === item.value) {
      return 'second-btn true'
    }
    return 'second-btn'
  }

  return (
    <div className="buttons-row buttons-center">
      {extra.buttons.map((item, i) => (
        <span
          key={`span-${i}`}
          className={getAnswerStyle(item, answerTrue, answerUser)}
        >
          {item.label}
        </span>
      ))}
    </div>
  )
}

AnswerButtonsReview.propTypes = {
  ...InputAnswerReviewAttributes,
}

export {
  InputTimeAnswer,
  InputTimeAnswerReview,
  AnswerButtons,
  AnswerButtonsReview,
}
