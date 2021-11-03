import Target from './components/target'
import Box from './components/box'
import {
  InputAnswerAttributes,
  InputAnswerReviewAttributes,
} from '../common/answer_type'

// Answer Input
const DnDAnswerType = ({
  items,
  answerUser: pAnswerUser,
  answers,
  handleDropComplete,
  handleReDropComplete,
}) => {
  console.log('XXX', pAnswerUser, items)

  const answerUser =
    typeof pAnswerUser === 'object' && pAnswerUser !== null ? pAnswerUser : {}

  return (
    <>
      <div className="block pattern-items pattern-items-top">
        {items.map((x, i) =>
          x.hidden ? (
            answerUser[i] ? (
              <Box
                className={`box ${x.modification}`}
                key={`item-${i}`}
                name={answerUser[i].dragItem.value}
                onDropComplete={handleReDropComplete(
                  i,
                  answerUser[i].dragIndex,
                )}
              >
                <img src={answerUser[i].dragItem.value} alt="" />
              </Box>
            ) : (
              <Target
                line="all"
                key={`item-${i}`}
                targetItem={i}
                allowedDropEffect="DROP_TO_ANSWER"
              />
            )
          ) : x.value ? (
            <div className={`item ${x.modification}`} key={`item-${i}`}>
              <img src={x.value} alt="" />
            </div>
          ) : (
            <div key={`item-${i}`} className="item item-drop" />
          ),
        )}
      </div>

      <br />

      <div className="buttons-center pattern-items pattern-items-bottom">
        {answers.map((x, i) => {
          if (
            Object.values(answerUser)
              .map((x) => x.dragIndex)
              .includes(i)
          ) {
            return (
              <Target
                line="variants"
                key={`item-${i}`}
                targetItem={i}
                allowedDropEffect="DROP_TO_SOURCE"
              />
            )
          }

          return (
            <Box
              className={`box ${x.modification}`}
              key={`item-${i}`}
              name={x.value}
              onDropComplete={handleDropComplete(i, x)}
            >
              <img src={x.value} alt="" />
            </Box>
          )
        })}
      </div>
    </>
  )
}

DnDAnswerType.propTypes = {
  ...InputAnswerAttributes,
}

// Review Answer Input with True answer
const DnDAnswerTypeReview = ({ items, answerUser, answerTrue }) => (
  <div className="block pattern-items pattern-items-top">
    {items.map((x, i) =>
      x.hidden ? (
        <>
          {answerUser[i]?.dragItem?.value === x.value ? (
            <div key={`item-${i}`} className="item true">
              <img src={`/account/shapes/${x.value}.svg`} alt="" />
            </div>
          ) : (
            <div>
              <div key={`item-${i}`} className="item fail">
                <img
                  src={`/account/shapes/${answerUser[i]?.dragItem?.value}.svg`}
                  alt=""
                />
              </div>
              <div key={`item-${i}`} className="item true mt-10">
                <img src={`/account/shapes/${x.value}.svg`} alt="" />
              </div>
            </div>
          )}
        </>
      ) : (
        <div key={`item-${i}`} className="item">
          <img src={`/account/shapes/${x.value}.svg`} alt="" />
        </div>
      ),
    )}
  </div>
)

DnDAnswerTypeReview.propTypes = {
  ...InputAnswerReviewAttributes,
}

export { DnDAnswerType, DnDAnswerTypeReview }
