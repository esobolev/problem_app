import { useState, useEffect } from 'react'
import MathJax from 'react-mathjax-preview'
import {
  strToMathJax,
  toJSON,
  RIGHT,
  WRONG,
  CUSTOM_BUTTONS,
  COMPARE_SIGN,
  COMPARE_WORDS,
  WORD,
  romanize,
  trimAnswer,
  toggle,
  isNull,
} from 'src/tools'
import { useViewerStates } from 'src/hooks/useViewerStates'
import ResultLayout from '../../results/result-layout'
import ViewerAttributes from '../common/viewer_type'

import { variantsData, wordButtons, signButtons } from './builder'
import { AnswerButtons, AnswerButtonsReview } from '../common/answer_type'

import { TitleWithImageViewer } from '../common/title_with_image'
import ViewerPresenter from '../common/viewer_presenter'

const defaultValue = {
  type: variantsData.numbers.value,
  left: '',
  right: '',
}
export function CompareViewer(props) {
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
      setAnswerType(pAnswerType || COMPARE_WORDS)
      setExtra(newExtra)
      setAnswersTrue(pAnswerTrue)
      setAnswerUser(pAnswerUser || '')
      setAnswerState(pAnswerState)
      setAnswerLog(answerLog)
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
          {variantsData?.numbers?.value === extra?.type && (
            <>
              <div className="row">
                <div className="col-lg-12 input_block text-center">
                  {extra.asImages ? (
                    <h3 className="variants fractions">
                      <div className="images-counting">
                        {(extra?.imagesView?.left || []).map((url, i) => (
                          <img key={i} src={url} />
                        ))}
                      </div>

                      <span
                        className={`input-compare ${
                          answerType === COMPARE_WORDS
                            ? 'input-answer-phrase'
                            : ''
                        }`}
                      >
                        {answerUser.toString() || '?'}
                      </span>

                      <div className="images-counting">
                        {(extra?.imagesView?.right || []).map((url, i) => (
                          <img key={i} src={url} />
                        ))}
                      </div>
                    </h3>
                  ) : (
                    <h3 className="variants">
                      <span>
                        {extra?.digitType === 'roman'
                          ? romanize(extra?.variants?.left)
                          : extra?.variants?.left}
                      </span>
                      <span
                        className={`input-compare ${
                          answerType === COMPARE_WORDS
                            ? 'input-answer-phrase'
                            : ''
                        }`}
                      >
                        {answerUser.toString() || '?'}
                      </span>
                      <span>
                        {extra?.digitType === 'roman'
                          ? romanize(extra?.variants?.right)
                          : extra?.variants?.right}
                      </span>
                    </h3>
                  )}
                </div>
              </div>
            </>
          )}

          {variantsData?.images?.value === extra?.type && (
            <>
              <div className="row input-block">
                <div className="col-lg-2" />
                <div className="col-lg-3">
                  <img
                    src={`${process.env.REACT_APP_S3_HOST}/${extra?.images?.left}`}
                    alt=""
                  />
                </div>
                <div className="col-lg-2 compare-wrap">
                  <span
                    className={`input-compare ${
                      answerType === COMPARE_WORDS ? 'input-answer-phrase' : ''
                    }`}
                  >
                    {answerUser || '?'}
                  </span>
                </div>
                <div className="col-lg-3">
                  <img
                    src={`${process.env.REACT_APP_S3_HOST}/${extra?.images?.right}`}
                    alt=""
                  />
                </div>
                <div className="col-lg-2" />
              </div>
            </>
          )}

          {variantsData?.table?.value === extra?.type && (
            <>
              <div className="row">
                <div className="col-lg-3" />
                <div className="col-lg-6 text-center">
                  <table className="table compare-table">
                    <thead className="thead-dark">
                      <tr>
                        <th colSpan={2}>{extra.resource}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>
                          <b>{extra.headers.label}</b>
                        </th>
                        <th>
                          <b>{extra.headers.value}</b>
                        </th>
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
                <div className="col-lg-3" />
              </div>
            </>
          )}

          {variantsData?.fractions?.value === extra?.type && (
            <>
              <div className="row">
                <div className="col-lg-12 input_block text-center">
                  <h3 className="variants fractions">
                    <MathJax
                      math={strToMathJax(extra?.fractions?.left)}
                      config={{ showMathMenu: false }}
                    />
                    <span
                      className={`input-compare ${
                        answerType === COMPARE_WORDS
                          ? 'input-answer-phrase'
                          : ''
                      }`}
                    >
                      {answerUser || '?'}
                    </span>
                    <MathJax
                      math={strToMathJax(extra?.fractions?.right)}
                      config={{ showMathMenu: false }}
                    />
                  </h3>
                </div>
              </div>
            </>
          )}
        </ViewerPresenter>

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

        {COMPARE_WORDS === answerType && (
          <>
            {reviewMode || answerState === RIGHT ? (
              <AnswerButtonsReview
                items={wordButtons}
                answerUser={answerUser}
                answerTrue={answerTrue}
              />
            ) : (
              <AnswerButtons
                items={wordButtons}
                answerUser={answerUser}
                handleAnswer={handleAnswer}
              />
            )}
          </>
        )}

        {COMPARE_SIGN === answerType && (
          <>
            {reviewMode || answerState === RIGHT ? (
              <AnswerButtonsReview
                items={signButtons}
                answerUser={answerUser}
                answerTrue={answerTrue}
              />
            ) : (
              <AnswerButtons
                items={signButtons}
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

CompareViewer.propTypes = {
  ...ViewerAttributes,
}

export default { CompareViewer }
