import { useState, useEffect } from 'react'
import {
  toJSON,
  RIGHT,
  WRONG,
  INPUT,
  trimAnswer,
  toggle,
  isNull,
} from 'src/tools'
import { useViewerStates } from 'src/hooks/useViewerStates'
import ResultLayout from '../../results/result-layout'
import ViewerAttributes from '../common/viewer_type'

import { variantsData } from './builder'
// import { AnswerButtons, AnswerButtonsReview } from '../common/answer_type'

import { TitleWithImageViewer } from '../common/title_with_image'
import ViewerPresenter from '../common/viewer_presenter'

const defaultValue = {
  type: variantsData.table.value,
  left: '',
  right: '',
}
export function TableViewer(props) {
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

    console.log('!newExtra', newExtra)

    if (newExtra) {
      setAnswerType(pAnswerType || INPUT)
      setExtra(newExtra)
      setAnswersTrue(pAnswerTrue)
      // setAnswerUser(pAnswerUser || {})

      console.log('!pAnswerUser', pAnswerUser)
      if (pAnswerUser && Array.isArray(pAnswerUser)) {
        setAnswerUser(pAnswerUser)
      } else {
        const newAnswer = (pExtra.items || []).map((_) => ({
          label: '',
          value: '',
        }))
        setAnswerUser(newAnswer)
      }

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

  useEffect(() => {
    let hiddenCount = 0
    ;(extra?.items || []).forEach((x) => {
      if (x.hiddenLabel) {
        hiddenCount += 1
      }
      if (x.hiddenValue) {
        hiddenCount += 1
      }
    })

    let answerCount = 0
    ;(answerUser || [])
      .filter((x) => x)
      .forEach((x) => {
        if (x.label) {
          answerCount += 1
        }
        if (x.value) {
          answerCount += 1
        }
      })

    setIsAnswerFiled(hiddenCount === answerCount)
  }, [extra?.items, answerUser])

  const setDefaultParams = () => {
    setDefaultViewerParams()
    setExtra(defaultValue)
    setIsInitViewer(true)
  }

  // UI Handlers

  const checkAnswer = () => {
    // const isPassTest = trimAnswer(answerUser) === trimAnswer(answerTrue);
    let isPassTest = true
    extra.items.forEach((item, i) => {
      console.log(i, item, answerUser[i])

      if (item.hiddenLabel && item.label !== answerUser[i]?.label) {
        isPassTest = false
      }
      if (item.hiddenValue && item.value !== answerUser[i]?.value) {
        isPassTest = false
      }
    })

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

  if (!extra) return null

  if (!isInitViewer) {
    return <div>Wait while the component is initialized</div>
  }

  const handleAnswerRow = (idx, name) => (e) => {
    console.log('handleAnswerRow', answerUser)

    const newItems = [...answerUser]
    if (!newItems[idx]) {
      newItems[idx] = {}
    }
    newItems[idx][name] = e.target.value
    setAnswerUser(newItems)
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
          <div className="row">
            <div className="col-lg-3" />
            <div className="col-lg-6 text-center">
              <table className="table compare-table">
                {/* <thead>
                <tr>
                  <th colSpan={2}>{extra.resource}</th>
                </tr>
              </thead> */}
                <tbody>
                  <tr>
                    <th className="bg-blue">
                      <b>{extra.headers?.label}</b>
                    </th>
                    <th className="bg-blue">
                      <b>{extra.headers?.value}</b>
                    </th>
                  </tr>
                  {(extra.items || []).map((item, i) => (
                    <tr key={i}>
                      <th>
                        {item.hiddenLabel ? (
                          <input
                            className="input-field"
                            value={answerUser[i]?.label}
                            onChange={handleAnswerRow(i, 'label')}
                          />
                        ) : (
                          <span>{item.label}</span>
                        )}
                      </th>
                      <th>
                        {item.hiddenValue ? (
                          <input
                            className="input-field"
                            value={answerUser[i]?.value}
                            onChange={handleAnswerRow(i, 'value')}
                          />
                        ) : (
                          <span>{item.value}</span>
                        )}
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-lg-3" />
          </div>
        </ViewerPresenter>
      </div>
    </ResultLayout>
  )
}

TableViewer.propTypes = {
  ...ViewerAttributes,
}

export default { TableViewer }
