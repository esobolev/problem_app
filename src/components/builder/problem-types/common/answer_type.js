import PropTypes from 'prop-types'

// Types
const InputAnswerAttributes = {
  answerUser: PropTypes.string.isRequired,
  handleAnswer: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.any),
}

const InputAnswerReviewAttributes = {
  answerUser: PropTypes.string.isRequired,
  answerTrue: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.any),
}

// Inputs
const InputAnswer = ({ answerUser, handleAnswer }) => (
  <div className="input_block text-center">
    <input
      className="input-answer input-answer-gray input-answer-phrase"
      type="text"
      // min={0}
      onChange={(e) => {
        handleAnswer(e.target.value)
      }}
      value={answerUser}
    />
  </div>
)
InputAnswer.propTypes = {
  ...InputAnswerAttributes,
}

const InputAnswerReview = ({ answerUser, answerTrue }) => {
  if (String(answerTrue) === String(answerUser)) {
    return (
      <div className="input_block text-center">
        <div className="answer-true user">{answerTrue}</div>
      </div>
    )
  }

  return (
    <>
      <div className="input_block text-center">
        {String(answerTrue)} - {String(answerUser)}
        <div className="answer-fail user">{answerUser}</div>
      </div>
      <div className="input_block text-center">
        <div className="answer-true mt-15">{answerTrue}</div>
      </div>
    </>
  )
}
InputAnswerReview.propTypes = {
  ...InputAnswerReviewAttributes,
}

const AnswerButtons = ({
  items = [],
  answerUser = '',
  handleAnswer = () => {},
}) => {
  const isPressed = (answer, value) =>
    Array.isArray(answer)
      ? answer.includes(String(value))
      : String(answer) === String(value)

  console.log('answerUser', answerUser)

  return (
    <div className="buttons-row buttons-center answer-buttons">
      {items
        .filter((x) => x.value !== null)
        .filter((x) => !(!x.label && !x.img))
        .map((item, i) => (
          <button
            type="button"
            key={`button-${i}`}
            className={
              isPressed(answerUser, item.value)
                ? 'second-btn btn-active'
                : 'second-btn'
            }
            onClick={() => {
              handleAnswer(item.value)
            }}
          >
            {item.img ? (
              <img src={item.img} alt="" />
            ) : item.label ? (
              <span>{item.label}</span>
            ) : null}
          </button>
        ))}
    </div>
  )
}
AnswerButtons.propTypes = {
  ...InputAnswerAttributes,
}

const AnswerButtonsReview = ({
  items = [],
  answerUser = '',
  answerTrue = null,
}) => {
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
      {items
        .filter((x) => x.value !== null)
        .filter((x) => !(!x.label && !x.img))
        .map((item, i) => (
          <span
            key={`span-${i}`}
            className={getAnswerStyle(item, answerTrue, answerUser)}
          >
            {item.img ? (
              <img src={item.img} alt="" />
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        ))}
    </div>
  )
}

AnswerButtonsReview.propTypes = {
  ...InputAnswerReviewAttributes,
}

export {
  InputAnswerAttributes,
  InputAnswerReviewAttributes,
  InputAnswer,
  InputAnswerReview,
  AnswerButtons,
  AnswerButtonsReview,
}
