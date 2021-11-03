/* eslint-disable no-useless-escape */
/* eslint-disable unicorn/better-regex */
import { useEffect, useState } from 'react'
import {
  InputAnswerAttributes,
  InputAnswerReviewAttributes,
} from '../common/answer_type'

const InputAnswer = ({ answerUser, handleAnswer }) => (
  <input
    className="input-answer input-answer-gray input-answer-phrase"
    type="number"
    onChange={(e) => {
      handleAnswer(e.target.value)
    }}
    value={answerUser}
  />
)
InputAnswer.propTypes = {
  ...InputAnswerAttributes,
}

const InputAnswerReview = ({ answerUser, answerTrue }) => {
  if (String(answerTrue) === String(answerUser)) {
    return (
      <div className="answers-review">
        <div className="answer-true user">{answerTrue}</div>
      </div>
    )
  }

  return (
    <div className="answers-review">
      <div className="answer-fail user">{answerUser}</div>
      <div className="answer-true ml-15">{answerTrue}</div>
    </div>
  )
}
InputAnswerReview.propTypes = {
  ...InputAnswerReviewAttributes,
}

const AnswerButtons = ({
  items = [],
  answerUser = '',
  handleAnswer = () => {},
}) => (
  <div className="buttons-row buttons-center">
    {items.map((item) => (
      <button
        type="button"
        key={item.value}
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
      {items.map((item) => (
        <span
          key={item.value}
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

const ColumnMathProblem = ({ body = '' }) => {
  const lines = body.match(/\+|\-|\*|\/|\d+/g)

  return (
    <div className="column-lines">
      {(lines || []).map((x, i) => (
        <div key={i}>{x}</div>
      ))}
    </div>
  )
}

const CustomExpressionProblem = ({ body = '', handleAnswer = () => {} }) => {
  // const matches = body.match(/\[.+?\]/g)
  const parts = body.replace(/\[.+?\]/g, 'XXX').split('XXX')

  const [answers, setAnswers] = useState({})

  useEffect(() => {
    handleAnswer(Object.values(answers).join(','))
  }, [answers])

  const onChange = (i) => (e) => {
    setAnswers({ ...answers, [i]: e.target.value })
  }

  return (
    <div className="custom-expression math-auto">
      {(parts || []).map((x, i) => (
        <>
          <span key={i}>{x}</span>
          {i < parts.length - 1 && (
            <input
              className="inline-input"
              type="text"
              value={answers[i]}
              onChange={onChange(i)}
            />
          )}
        </>
      ))}
    </div>
  )
}

export {
  InputAnswer,
  InputAnswerReview,
  AnswerButtons,
  AnswerButtonsReview,
  ColumnMathProblem,
  CustomExpressionProblem,
}
