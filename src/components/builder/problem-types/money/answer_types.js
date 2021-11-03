import { FormatInput } from 'src/components/common'
import { strMoney } from 'src/tools'
import {
  InputAnswerAttributes,
  InputAnswerReviewAttributes,
} from '../common/answer_type'

const MoneyInputAnswer = ({
  dollarValue,
  setDollarValue,
  centValue,
  setCentValue,
}) => (
  <div className="block items align-center">
    <span className="money-sign">$</span>
    <FormatInput
      type="number"
      name="time"
      onChange={(e) => {
        setDollarValue(e.target.value)
      }}
      value={dollarValue}
      className="round_input"
      min={0}
      max={1000}
    />
    <span className="money-sign">¢</span>
    <FormatInput
      type="number"
      name="time"
      onChange={(e) => {
        setCentValue(e.target.value)
      }}
      value={centValue}
      className="round_input"
      min={0}
      max={100}
    />
  </div>
)
MoneyInputAnswer.propTypes = {
  ...InputAnswerAttributes,
}

const MoneyInputAnswerReview = ({ answerUser, answerTrue }) => {
  if (String(answerTrue) === String(answerUser)) {
    return (
      <div className="col-lg-12 input_block text-center">
        <div className="answer-true user">${strMoney(answerUser)}</div>
      </div>
    )
  }

  return (
    <>
      <div className="col-lg-12 input_block text-center">
        <div className="answer-fail user">${strMoney(answerUser)}</div>
      </div>
      <div className="col-lg-12 input_block text-center">
        <div className="answer-true mt-15">${strMoney(answerTrue)}</div>
      </div>
    </>
  )
}
MoneyInputAnswerReview.propTypes = {
  ...InputAnswerReviewAttributes,
}

export { MoneyInputAnswer, MoneyInputAnswerReview }
