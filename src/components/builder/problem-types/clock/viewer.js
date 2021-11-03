import { useState, useEffect } from 'react'
import {
  toJSON,
  RIGHT,
  WRONG,
  arrayToObject,
  INPUT,
  CUSTOM_BUTTONS,
  getClockAngle,
  trimAnswer,
} from 'src/tools'
import { useViewerStates } from 'src/hooks/useViewerStates'
import ResultLayout from '../../results/result-layout'
import ViewerAttributes from '../common/viewer_type'
import { TitleWithImageViewer } from '../common/title_with_image'
import ViewerPresenter from '../common/viewer_presenter'
import { InputTimeAnswer, InputTimeAnswerReview } from './answer_types' // local
import { AnswerButtons, AnswerButtonsReview } from '../common/answer_type'

// Clocks Helper View
const Clocks = ({ extra }) => {
  const imagePath = `/account/images/dest/types/clock/${
    extra.clockFaceType || 'roman'
  }`

  return (
    <div className="block items flex-wrap mb-0">
      {(extra.items || []).map((x, i) => {
        const [hh, mm] = (x.value || '12:00').split(':')
        const hAngle = getClockAngle(Number(hh), Number(mm))

        return (
          <div key={`item-${i}`} className="item clock-item">
            <div className="clock">
              <img width={200} src={`${imagePath}/cifer.svg`} alt="" />
              <img
                style={{ transform: `rotate(${hAngle}deg)` }}
                width={200}
                src={`${imagePath}/hour.svg`}
                alt=""
              />
              <img
                style={{ transform: `rotate(${6 * Number(mm)}deg)` }}
                width={200}
                src={`${imagePath}/min.svg`}
                alt=""
              />
              <img width={200} src={`${imagePath}/point.svg`} alt="" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ClockViewer(props) {
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

  const [items, setItems] = useState([])
  const [isAnswerFiled, setIsAnswerFiled] = useState(false)

  useEffect(() => {
    const newExtra = toJSON(pExtra)

    if (newExtra) {
      const { items: newItems = [] } = newExtra
      setExtra(newExtra)
      setItems(newItems)

      setAnswerType(pAnswerType || INPUT)
      if (pAnswerType === CUSTOM_BUTTONS) {
        setAnswersTrue(String(pAnswerTrue))
        setAnswerUser(String(pAnswerUser))
      } else {
        setAnswersTrue(arrayToObject(items.map((x) => x.value)))
        pAnswerUser && setAnswerUser(toJSON(pAnswerUser))
      }
      setAnswerState(pAnswerState)
      setAnswerLog(pAnswerLog)
      setAnswerTime(0)

      setIsInitViewer(true)
    } else {
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
    if (isLiveCheck && isAnswerFiled) {
      checkAnswer()
    }
  }, [isLiveCheck, isAnswerFiled])

  useEffect(() => {
    const total = Array.isArray(items) ? Object.values(items).length : 0
    const filled = Array.isArray(answerUser)
      ? Object.values(answerUser).length
      : 0

    setIsAnswerFiled(total === filled)
  }, [items, answerUser])

  const setDefaultParams = () => {
    setDefaultViewerParams()
    setIsInitViewer(true)
  }

  // UI Handlers

  const handleAnswer = (index) => (event) => {
    const newAnswerUser = { ...answerUser }
    newAnswerUser[index] = event.target.value
    setAnswerUser(newAnswerUser)
  }

  const checkAnswer = () => {
    const pAnswerTrue = Object.values(items).map((x) => x.value)
    const pAnswerUser = Object.values(answerUser)

    const isPassTest = trimAnswer(pAnswerTrue) == trimAnswer(pAnswerUser)

    setAnswerState(isPassTest ? RIGHT : WRONG)
    setAnswerTime(answerTime + 1)
    handleAnswerCallback(isPassTest, JSON.stringify(answerUser))
  }

  if (!extra) return <div>No extra</div>

  if (!isInitViewer) {
    return <div>Wait while the component is initialized</div>
  }

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
      <div className={`sequence-viewer problem-view t-${answerType}`}>
        <TitleWithImageViewer title={question} picture={question_picture} />

        <ViewerPresenter hideDetails={question_picture} answerType={answerType}>
          <Clocks extra={extra} />
        </ViewerPresenter>

        {INPUT === answerType && (
          <>
            {reviewMode ? (
              <InputTimeAnswerReview
                extra={extra}
                answerUser={answerUser}
                answerTrue={answerTrue}
              />
            ) : (
              <InputTimeAnswer
                extra={extra}
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
                answerTrue={answerTrue}
              />
            )}
          </>
        )}
      </div>
    </ResultLayout>
  )
}

ClockViewer.propTypes = {
  ...ViewerAttributes,
}

export default { ClockViewer }
