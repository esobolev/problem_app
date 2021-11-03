import { useState, useEffect } from 'react'
import {
  toJSON,
  RIGHT,
  WRONG,
  INPUT,
  trimAnswer,
  CUSTOM_BUTTONS,
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

// import { TitleWithImageViewer } from '../common/title_with_image'

const defaultValue = {}
export function NumberStoryViewer(props) {
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
    try {
      const newExtra = pExtra ? toJSON(pExtra) : { ...defaultValue }

      setExtra(newExtra)
      setAnswerType(pAnswerType || INPUT)
      setAnswersTrue(pAnswerTrue)
      setAnswerUser(pAnswerUser || '')
      setAnswerState(pAnswerState)
      setAnswerLog(pAnswerLog)
      setAnswerTime(0)
      setIsInitViewer(true)
    } catch (error) {
      console.log('useEffect :: Viewer :: Number story', error)
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
    setAnswerType(INPUT)
    setIsInitViewer(true)
  }

  // UI Handlers

  const checkAnswer = () => {
    const isPassTest =
      trimAnswer(answerUser).replace(/\s/g, '').toLowerCase() ===
      trimAnswer(answerTrue).replace(/\s/g, '').toLowerCase()

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
      setAnswerUser(value)
      setIsAnswerFiled(!isNull(value))
    }
  }

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
      <div className={`problem-view ${answerType}`}>
        {/* <TitleWithImageViewer title={question} picture={question_picture} /> */}

        {answerType === INPUT && (
          <>
            {reviewMode ? (
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
                items={extra?.buttons}
                answerUser={answerUser}
                answerTrue={answerTrue}
              />
            ) : (
              <AnswerButtons
                items={extra?.buttons}
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

NumberStoryViewer.propTypes = {
  ...ViewerAttributes,
}

export default { NumberStoryViewer }
