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
  // handleReDropComplete,
}) => {
  const answerUser = pAnswerUser || {}
  console.log('XXX', answerUser, items, Object.values(answerUser).flat())

  // const answerUserIndexes = Object.values(answerUser).flat().map(x => Number(x.index));
  // console.log('answerUserIndexes', answerUserIndexes);

  return (
    <>
      <div className="block pattern-items pattern-items-top">
        {items.map((x, i) => (
          <>
            {x ? (
              <Box
                className={`box ${x.modification}`}
                key={`item-${i}`}
                name={x.value}
                onDropComplete={handleDropComplete(i, x)}
              >
                {x.value && <img src={x.value} alt="" />}
              </Box>
            ) : (
              <Target
                line="all"
                key={`item-${i}`}
                targetItem={i}
                allowedDropEffect="DROP_TO_ANSWER"
              />
            )}
          </>
        ))}
      </div>
      <br />
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
              <img src={x.value} alt="" />
            </div>
          ) : (
            <div>
              <div key={`item-${i}`} className="item fail">
                <img src={answerUser[i]?.dragItem?.value} alt="" />
              </div>
              <div key={`item-${i}`} className="item true mt-10">
                <img src={x.value} alt="" />
              </div>
            </div>
          )}
        </>
      ) : (
        <div key={`item-${i}`} className="item">
          <img src={x.value} alt="" />
        </div>
      ),
    )}
  </div>
)

DnDAnswerTypeReview.propTypes = {
  ...InputAnswerReviewAttributes,
}

export { DnDAnswerType, DnDAnswerTypeReview }
