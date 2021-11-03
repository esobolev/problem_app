import { useState, useEffect } from 'react'
import {
  toJSON,
  RIGHT,
  WRONG,
  INPUT,
  BUTTONS,
  CUSTOM_BUTTONS,
  trimAnswer,
  toggle,
  isNull,
} from 'src/tools'
import { useViewerStates } from 'src/hooks/useViewerStates'
import ResultLayout from '../../results/result-layout'
import ViewerAttributes from '../common/viewer_type'
import { variantsData, answersData } from './builder'
import { AnswerButtons, AnswerButtonsReview } from '../common/answer_type'

import { TitleWithImageViewer } from '../common/title_with_image'
import ViewerPresenter from '../common/viewer_presenter'

const defaultValue = {
  type: variantsData.number.value,
  left: '',
  right: '',
}

export function EvenOddViewer(props) {
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
    const newExtra = toJSON(pExtra)

    if (newExtra) {
      setExtra(newExtra)
      setAnswerType(pAnswerType || INPUT)
      setAnswersTrue(pAnswerTrue)
      setAnswerUser(pAnswerUser || '')
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
    if (isLiveCheck && answerUser) {
      checkAnswer()
    }
  }, [isLiveCheck, answerUser])

  const setDefaultParams = () => {
    setDefaultViewerParams()
    setExtra(defaultValue)
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
      setAnswerUser(value)
      setIsAnswerFiled(!isNull(value))
    }
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
      <div className={`${answerType} problem-view`}>
        <TitleWithImageViewer title={question} picture={question_picture} />

        <ViewerPresenter hideDetails={question_picture} answerType={answerType}>
          {variantsData.number.value === extra.type && (
            <div className="row">
              <div className="col-lg-12 input_block text-center">
                <h3 className="variants">
                  <span>{extra?.variants?.main}</span>
                </h3>
              </div>
            </div>
          )}

          {variantsData.image.value === extra.type && (
            <div className="row input-block">
              <div className="col-lg-4" />
              <div className="col-lg-4 text-center">
                <img src={extra?.images?.main} alt="" />
              </div>
              <div className="col-lg-4" />
            </div>
          )}

          {variantsData.math_expression.value === extra.type && (
            <div className="row">
              <div className="col-lg-12 input_block text-center">
                <h3 className="variants">
                  <span>{extra?.math?.main}</span>
                </h3>
              </div>
            </div>
          )}

          {BUTTONS === answerType && (
            <>
              {(variantsData.number.value === extra.type ||
                variantsData.image.value === extra.type ||
                variantsData.math_expression.value === extra.type) &&
              reviewMode ? (
                <AnswerButtonsReview
                  answerType={answerType}
                  items={answersData}
                  answerUser={answerUser}
                  answerTrue={answerTrue}
                />
              ) : (
                <AnswerButtons
                  answerType={answerType}
                  items={answersData}
                  answerUser={answerUser}
                  handleAnswer={handleAnswer}
                />
              )}
            </>
          )}

          {variantsData.array_of_numbers.value === extra.type && (
            <div className="row">
              <div className="col-lg-12 input_block text-center">
                <h3 className="variants">
                  {(extra?.items || []).map((item, i) => (
                    <span key={i}>{item?.value}</span>
                  ))}
                </h3>
              </div>
            </div>
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

          {/* {variantsData.table.value === extra.type &&
            <>
              <div className='row'>
                <div className="col-lg-3"></div>
                <div className="col-lg-6 text-center">
                  <table className="table compare-table">
                    <thead className="thead-dark">
                      <tr>
                        <th colSpan={2}>{extra.resource}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th><b>{extra.headers.label}</b></th>
                        <th><b>{extra.headers.value}</b></th>
                      </tr>
                      {extra.items.map((item, i) => (
                        <tr key={i}>
                          <th>{item.label}</th>
                          <th>{item.value}</th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-lg-3"></div>
              </div>

              <div className="buttons-row buttons-center">
                {extra.items.map(item =>
                  <button type='button' key={item.value} className="second-btn" onClick={handleAnswer(item.value)}>
                    {item.label}
                  </button>
                )}
              </div>
            </>
          } */}
        </ViewerPresenter>
      </div>
    </ResultLayout>
  )
}

EvenOddViewer.propTypes = {
  ...ViewerAttributes,
}

export default { EvenOddViewer }
