import {
  InputAnswerAttributes,
  InputAnswerReviewAttributes,
} from '../common/answer_type'

const LineAnswer = ({ items, answerUser, handleAnswer, digitType }) => (
  <div className="block items">
    <div className="left" />
    {(items || []).map((x, i) =>
      x.hidden ? (
        <div key={`item-${i}`} className="item">
          <div className="before" />
          <input
            value={answerUser && answerUser[i]}
            onChange={handleAnswer(i)}
          />
        </div>
      ) : (
        <div key={`item-${i}`} className="item">
          <div className="before" />
          <div>
            {digitType}
            {digitType === 'roman' ? romanize(x.value) : x.value}
          </div>
        </div>
      ),
    )}
    <div className="right" />
  </div>
)
LineAnswer.propTypes = {
  ...InputAnswerAttributes,
}

const LineAnswerReview = ({ items, answerUser, answerTrue, digitType }) => (
  <div className="block items mb-30">
    {/* {JSON.stringify(answerUser)}
      {JSON.stringify(answerTrue)} */}
    <div className="left" />
    {(items || []).map((x, i) =>
      answerUser[i] ? (
        <div key={`item-${i}`} className="item">
          <div className="before" />
          <div
            className={`${
              String(answerUser[i]) === String(answerTrue[i]) ? 'true' : 'fail'
            }`}
          >
            {digitType === 'roman' ? romanize(answerUser[i]) : answerUser[i]}
          </div>
          {String(answerUser[i]) !== String(answerTrue[i]) && (
            <div className="true mt-10">{answerTrue[i]}</div>
          )}
        </div>
      ) : (
        <div key={`item-${i}`} className="item">
          <div className="before" />
          <div>
            {digitType === 'roman' ? romanize(answerUser[i]) : answerUser[i]}
          </div>
        </div>
      ),
    )}
    <div className="right" />
  </div>
)
LineAnswerReview.propTypes = {
  ...InputAnswerReviewAttributes,
}

const OrderAnswerReview = ({ items, answerUser, answerTrue }) => (
  <div className="block items mb-30">
    {(items || []).map((x, i) =>
      answerUser[i] === answerTrue[i] ? (
        <div key={`item-${i}`} className="item">
          <div className="true">{answerUser[i]}</div>
        </div>
      ) : (
        <div key={`item-${i}`} className="item">
          <div className="fail">{answerUser[i]}</div>
          <div className="true mt-10">{answerTrue[i]}</div>
        </div>
      ),
    )}
  </div>
)
OrderAnswerReview.propTypes = {
  ...InputAnswerReviewAttributes,
}

export { LineAnswer, LineAnswerReview, OrderAnswerReview }
