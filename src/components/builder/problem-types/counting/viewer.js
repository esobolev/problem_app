import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  times,
  toJSON,
  RIGHT,
  WRONG,
  INPUT,
  CUSTOM_BUTTONS,
  trimAnswer,
  toggle,
  isNull,
} from 'src/tools'
import { useViewerStates } from 'src/hooks/useViewerStates'
import ResultLayout from '../../results/result-layout'
import ViewerAttributes from '../common/viewer_type'
import {
  InputAnswer,
  InputAnswerReview,
  AnswerButtons,
  AnswerButtonsReview,
} from '../common/answer_type'
import { defaultExtra, variantsData } from './builder'

import { TitleWithImageViewer } from '../common/title_with_image'
import ViewerPresenter from '../common/viewer_presenter'

const TEN_BLOCKS = [
  '/account/images/dest/types/counting/lego/Lego_10_blue.svg',
  '/account/images/dest/types/counting/lego/Lego_10_green.svg',
]

const SINGLE_BLOCKS = [
  '/account/images/dest/types/counting/lego/Lego_1_blue.svg',
  '/account/images/dest/types/counting/lego/Lego_1_green.svg',
]

const TEN_BLOCKS_2 = [
  '/account/images/dest/types/counting/lego_2/Lego_10_red.svg',
  '/account/images/dest/types/counting/lego_2/Lego_10_yellow.svg',
]

const SINGLE_BLOCKS_2 = [
  '/account/images/dest/types/counting/lego_2/Lego_1_red.svg',
  '/account/images/dest/types/counting/lego_2/Lego_1_yellow.svg',
]
export function CountingViewer(props) {
  const {
    id = null,
    question = '',
    playMode = true,
    reviewMode = true,
    handleAnswerCallback,
    actionButtons,
    isLiveCheck = false,
    extra: pExtra,
    answer_type: pAnswerType = null,
    answer_true: pAnswerTrue = null,
    answerUser: pAnswerUser = null,
    answerState: pAnswerState = null,
    answerLog: pAnswerLog = [],
    question_picture = null,
  } = props

  const {
    extra,
    setExtra,
    answerType,
    setAnswerType,
    answerTrue,
    setAnswersTrue,
    answerUser,
    setAnswerUser,
    answerState,
    setAnswerState,
    answerLog,
    setAnswerLog,
    answerTime,
    setAnswerTime,
    isInitViewer,
    setIsInitViewer,
    setDefaultViewerParams,
  } = useViewerStates()

  const [isAnswerFiled, setIsAnswerFiled] = useState(false)

  useEffect(() => {
    console.log('useEffect :: CountingViewer', {
      id,
      pExtra,
      pAnswerType,
      pAnswerTrue,
      pAnswerUser,
      pAnswerState,
      pAnswerLog,
    })
    try {
      const newExtra = pExtra ? toJSON(pExtra) : { ...defaultExtra }

      setExtra(newExtra)
      setAnswerType(pAnswerType || INPUT)
      setAnswersTrue(pAnswerTrue)
      setAnswerUser(pAnswerUser || '')
      setAnswerState(pAnswerState)
      setAnswerLog(pAnswerLog)
      setAnswerTime(0)
      setIsInitViewer(true)
    } catch (error) {
      console.log('Parse', error)
      setDefaultParams()
    }
  }, [
    id,
    pAnswerType,
    pAnswerTrue,
    pAnswerUser,
    pAnswerState,
    pExtra,
    pAnswerLog.length,
  ])

  useEffect(() => {
    if (isLiveCheck && answerUser) {
      checkAnswer()
    }
  }, [isLiveCheck, answerUser])

  const setDefaultParams = () => {
    setDefaultViewerParams()
    setIsInitViewer(true)
  }

  // UI Handlers

  const checkAnswer = () => {
    const isPassTest = trimAnswer(answerUser) === trimAnswer(answerTrue)

    setAnswerState(isPassTest ? RIGHT : WRONG)
    setAnswerTime(answerTime + 1)
    handleAnswerCallback(isPassTest, answerUser)
  }

  const handleAnswer = (value) => {
    const answers = answerTrue.split(',').map((x) => String(x))

    if (answers.length > 1) {
      let newAnswerUser = answerUser || []

      newAnswerUser = toggle(newAnswerUser, String(value))
      setAnswerUser(newAnswerUser)
      setIsAnswerFiled(newAnswerUser.length)
    } else {
      console.log('value', value, isNull(value))
      setAnswerUser(value)
      setIsAnswerFiled(!isNull(value))
    }
  }

  if (!extra) return null

  if (!isInitViewer) {
    return <div>Wait while the component is initialized</div>
  }

  const count = extra?.variants?.main ?? 0

  const blocks =
    extra.images && extra.groupBy ? Math.ceil(count / extra.groupBy) : 0

  return (
    <ResultLayout
      playMode={playMode}
      reviewMode={reviewMode}
      answerTrue={answerTrue}
      answerUser={answerUser}
      answerState={answerState}
      answerLog={answerLog}
      checkAnswer={checkAnswer}
      answerTime={answerTime}
      actionButtons={actionButtons}
      isAnswerFiled={isAnswerFiled}
    >
      <div className={`${answerType} problem-view`}>
        <TitleWithImageViewer title={question} picture={question_picture} />

        <ViewerPresenter hideDetails={question_picture} answerType={answerType}>
          {[
            variantsData.counting_up_to_10.value,
            variantsData.counting_by_twos.value,
            variantsData.counting_by_fives.value,
            variantsData.counting_by_tens.value,
          ].includes(extra.type) && (
            <div className="row">
              <div className="images-counting">
                {times(blocks).map((i) => (
                  <div
                    key={i}
                    className={`item-${extra.groupBy} ${
                      i === blocks - 1 && blocks * extra.groupBy > count
                        ? 'no-border'
                        : ''
                    }`}
                  >
                    {times(extra.groupBy).map((url, j) =>
                      i * extra.groupBy + j < count ? (
                        <img
                          key={j}
                          src={extra.images[i * extra.groupBy + j]}
                        />
                      ) : (
                        <img
                          key={j}
                          src={extra.images[count - 1]}
                          className="invisible"
                        />
                      ),
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {[variantsData.lego_bricks.value].includes(extra.type) && (
            <div className="row">
              <div className="images-bricks mb-30">
                {times(Number.parseInt(count / 10)).map((x) => (
                  <div key={x}>
                    <img src={TEN_BLOCKS[x % TEN_BLOCKS.length]} />
                  </div>
                ))}

                <div className="images-rest">
                  {times(Number.parseInt(count % 10)).map((x) => (
                    <div key={x}>
                      <img src={SINGLE_BLOCKS[x % SINGLE_BLOCKS.length]} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </ViewerPresenter>

        {answerType === INPUT && (
          <>
            {reviewMode || answerState === RIGHT ? (
              <InputAnswerReview
                answerUser={answerUser}
                answerTrue={answerTrue}
              />
            ) : (
              <InputAnswer
                answerUser={answerUser}
                handleAnswer={handleAnswer}
              />
            )}
          </>
        )}

        {CUSTOM_BUTTONS === answerType && (
          <>
            {reviewMode || answerState === RIGHT ? (
              <AnswerButtonsReview
                items={extra.buttons}
                answerUser={answerUser}
                answerTrue={answerTrue}
              />
            ) : (
              <AnswerButtons
                items={extra.buttons}
                answerUser={answerUser}
                handleAnswer={handleAnswer}
              />
            )}
          </>
        )}
      </div>
    </ResultLayout>
  )
}

CountingViewer.propTypes = {
  ...ViewerAttributes,
  extra: PropTypes.shape({
    type: PropTypes.string.isRequired,
    variants: PropTypes.shape({ main: PropTypes.string }).isRequired,
    groupBy: PropTypes.number.isRequired,
    collectionName: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    buttons: PropTypes.arrayOf(PropTypes.object),
    buttonsType: PropTypes.string.isRequired,
  }),
}

export default { CountingViewer }
