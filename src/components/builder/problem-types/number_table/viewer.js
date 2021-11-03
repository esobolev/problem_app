import { useState, useEffect } from 'react'
import {
  toJSON,
  RIGHT,
  WRONG,
  INPUT,
  // trimAnswer,
  // CUSTOM_BUTTONS,
  // toggle,
  // isNull,
  times,
} from 'src/tools'
import { useViewerStates } from 'src/hooks/useViewerStates'
import ResultLayout from '../../results/result-layout'
import ViewerAttributes from '../common/viewer_type'
// import {
//   InputAnswer,
//   InputAnswerReview,
//   AnswerButtons,
//   AnswerButtonsReview,
// } from '../common/answer_type'

import { TitleWithImageViewer } from '../common/title_with_image'

const defaultValue = {}
export function NumberTableViewer(props) {
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
      setAnswerUser(pAnswerUser || {})
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

  useEffect(() => {
    const filledAnswers = Object.values(String(answerUser)).length
    const filledTrue = String(answerTrue).split(',').length

    console.log({ filledAnswers, filledTrue })

    setIsAnswerFiled(filledAnswers === filledTrue)
  }, [answerUser])

  const setDefaultParams = () => {
    setDefaultViewerParams()
    setAnswerType(INPUT)
    setIsInitViewer(true)
  }

  // UI Handlers

  const checkAnswer = () => {
    const isPassTest =
      Object.values(answerUser)
        .map((x) => Number(x))
        .sort()
        .toString() ===
      String(answerTrue)
        .split(',')
        .map((x) => Number(x))
        .sort()
        .toString()

    setAnswerState(isPassTest ? RIGHT : WRONG)
    setAnswerTime(answerTime + 1)
    handleAnswerCallback(isPassTest, answerUser)
  }

  // const handleAnswer = (value) => {
  //   let answers = answerTrue.split(',').map(x => String(x))

  //   if (answers.length > 1) {
  //     let newAnswerUser = answerUser || [];

  //     newAnswerUser = toggle(newAnswerUser, String(value))
  //     setAnswerUser(newAnswerUser)
  //     setIsAnswerFiled(newAnswerUser.length)
  //   } else {
  //     setAnswerUser(value)
  //     setIsAnswerFiled(!isNull(value))
  //   }
  // }

  const handleAnswer = (i) => (e) => {
    const newAnswerUser = {
      ...answerUser,
      [i]: e.target.value,
    }
    setAnswerUser(newAnswerUser)
  }

  if (!isInitViewer) {
    return <div>Wait while the component is initialized</div>
  }

  const hiddenFields = new Set(
    String(answerTrue)
      .split(',')
      .map((x) => Number(x)),
  )
  const width = Number(extra?.width) || 10
  const height = Number(extra?.height) || 10

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
        <TitleWithImageViewer title={question} picture={question_picture} />

        <div className="number-table-wrap">
          <table className="number-table-view">
            <tbody>
              {times(height).map((x) => (
                <tr key={x}>
                  {times(width).map((y) => {
                    const val = x * width + y + 1

                    return (
                      <td key={val}>
                        {hiddenFields.has(val) ? (
                          <input
                            className="input-td"
                            type="text"
                            onChange={handleAnswer(val)}
                            value={answerUser[val] || ''}
                          />
                        ) : (
                          val
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ResultLayout>
  )
}

NumberTableViewer.propTypes = {
  ...ViewerAttributes,
}

export default { NumberTableViewer }
