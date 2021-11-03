import { useState, useEffect } from 'react'
import { toJSON, RIGHT, WRONG, trimAnswer } from 'src/tools'
import { useViewerStates } from 'src/hooks/useViewerStates'
import ResultLayout from '../../results/result-layout'
import ViewerAttributes from '../common/viewer_type'
import {
  NumberLineAnswer,
  NumberLineAnswerReview,
  JumpLineAnswer,
  JumpLineAnswerReview,
} from './answer_types'
// import { TitleWithImageViewer } from '../common/title_with_image'
import ViewerPresenter from '../common/viewer_presenter'

export function NumberLineViewer(props) {
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
  const [isAnswerFiled, setIsAnswerFiled] = useState(true) // TODO: setIsAnswerFiled

  useEffect(() => {
    try {
      const newExtra = toJSON(pExtra)

      console.log('newExtra aa', pAnswerTrue, pAnswerUser)

      const { items: newItems = [] } = newExtra

      setItems(newItems)
      setExtra(newExtra)

      setAnswerType(pAnswerType)
      setAnswersTrue(toJSON(pAnswerTrue))

      if (!playMode) {
        setAnswerUser(toJSON(pAnswerTrue))
      } else {
        setAnswerUser(toJSON(pAnswerUser))
      }

      setAnswerState(pAnswerState)
      setAnswerLog(pAnswerLog)
      setAnswerTime(0)
      setIsInitViewer(true)
    } catch (error) {
      console.log('useEffect :: Viewer :: Number line', error)
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
    if (isLiveCheck && answerUser.length > 0) {
      checkAnswer()
    }
  }, [isLiveCheck, answerUser])

  const setDefaultParams = () => {
    setDefaultViewerParams()
    setAnswerType('line')
    setIsInitViewer(true)
  }

  // UI Handlers

  const handleAnswer = (index) => (e) => {
    e.preventDefault()

    if (!playMode || answerState === RIGHT) return

    const newAnswers = { ...answerUser }
    newAnswers[index] ? delete newAnswers[index] : (newAnswers[index] = true)
    setAnswerUser(newAnswers)
  }

  const handleAnswerButton = (value) => {
    if (!playMode || answerState === RIGHT) return
    console.log(value)

    setAnswerUser({ 0: value })
  }

  const checkAnswer = () => {
    console.log('uAnswerTrue', answerType, answerTrue, answerUser)

    let isPassTest = false

    if (answerType === 'line') {
      const uAnswerTrue = Object.keys(answerTrue).filter((x) => answerTrue[x])
      const uAnswerUser = Object.keys(answerUser).filter((x) => answerUser[x])

      isPassTest =
        trimAnswer(uAnswerTrue.sort()) == trimAnswer(uAnswerUser.sort())
    } else if (answerType === 'jump') {
      const uAnswerTrue = Object.values(answerTrue)
      const uAnswerUser = Object.values(answerUser)

      isPassTest =
        uAnswerTrue.sort().toString() == uAnswerUser.sort().toString()
    } else {
      isPassTest = trimAnswer(answerUser) === trimAnswer(answerTrue)
    }

    console.log('XXX', JSON.stringify(answerUser))

    setAnswerState(isPassTest ? RIGHT : WRONG)
    setAnswerTime(answerTime + 1)
    handleAnswerCallback(isPassTest, JSON.stringify(answerUser))
  }

  if (!extra) return null

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
      <div className={`sequence-viewer ${answerType} problem-view`}>
        {/* <TitleWithImageViewer title={question} picture={question_picture} /> */}

        <ViewerPresenter hideDetails={question_picture} answerType={answerType}>
          {['line'].includes(answerType) && (
            <>
              {reviewMode ? (
                <NumberLineAnswerReview
                  extra={extra}
                  items={items}
                  answerUser={answerUser}
                  answerTrue={answerTrue}
                />
              ) : (
                <NumberLineAnswer
                  extra={extra}
                  items={items}
                  answerUser={answerUser}
                  handleAnswer={handleAnswer}
                />
              )}
            </>
          )}

          {['jump'].includes(answerType) && (
            <>
              {reviewMode ? (
                <JumpLineAnswerReview
                  extra={extra}
                  answerUser={answerUser}
                  answerTrue={answerTrue}
                />
              ) : (
                <JumpLineAnswer
                  extra={extra}
                  answerUser={answerUser}
                  handleAnswer={handleAnswerButton}
                />
              )}
            </>
          )}
        </ViewerPresenter>
      </div>
    </ResultLayout>
  )
}

NumberLineViewer.propTypes = {
  ...ViewerAttributes,
}

export default { NumberLineViewer }
