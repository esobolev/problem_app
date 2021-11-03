import { useCallback, useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import {
  shuffle,
  toJSON,
  RIGHT,
  WRONG,
  arrayToObject,
  ORDER,
  trimAnswer,
} from 'src/tools'
import { useViewerStates } from 'src/hooks/useViewerStates'
import { Card } from './card'
import ResultLayout from '../../results/result-layout'
import ViewerAttributes from '../common/viewer_type'
import { LineAnswer, LineAnswerReview, OrderAnswerReview } from './answer_types'

import { TitleWithImageViewer } from '../common/title_with_image'
import ViewerPresenter from '../common/viewer_presenter'

export function SequenceViewer(props) {
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
    if (pExtra) {
      let newItems = pExtra ? toJSON(pExtra) : []
      newItems = newItems || []
      setExtra(newItems)

      if (pAnswerType === ORDER) {
        console.log('shuffle');
        newItems = shuffle(newItems)
        setIsAnswerFiled(true)
      }

      setItems(newItems)

      setAnswerType(pAnswerType || 'inputs-items')
      pAnswerTrue && setAnswersTrue(toJSON(pAnswerTrue))
      pAnswerUser && setAnswerUser(toJSON(pAnswerUser))

      setAnswerState(pAnswerState)
      setAnswerLog(pAnswerLog)
      setAnswerTime(0)

      setIsInitViewer(true)
    } else {
      console.log('useEffect :: Viewer :: Sequence', 'setDefaultParams')
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
  }, [isLiveCheck, answerUser, answerType])

  useEffect(() => {
    if (!answerType) return;

    if (answerType === ORDER) {
      const answerUserJoin = Object.values(items || []).map(x => x.value).join(',');
      const answerTrueJoin = Object.values(answerTrue || []).map(x => x).join(',');
      console.log('answerTrue', answerUserJoin, answerTrueJoin);

      setIsAnswerFiled(true)
      setAnswerUser(answerUserJoin)
    } else {
      const total = Object.values(items || []).filter((x) => x.hidden).length
      const filled = answerUser
        ? Object.values(answerUser || []).filter((x) => x).length
        : 0

      console.log('setIsAnswerFiled', total === filled)
      setIsAnswerFiled(total === filled)
    }
  }, [items, answerType, answerUser])

  const setDefaultParams = () => {
    setDefaultViewerParams()
    setAnswerType('inputs-items')
    setIsInitViewer(true)
  }

  // UI Handlers

  const handleAnswer = (index) => (e) => {
    const newAnswers = { ...answerUser }
    newAnswers[index] = e.target.value
    setAnswerUser(newAnswers)
  }

  const checkAnswer = () => {
    if (!answerType) return;

    if (answerType === ORDER) {
      const pAnswerTrue = Object.values(answerTrue)
      const pAnswerUser = items.map((x) => trimAnswer(x.value))

      const orderAnswerUser = arrayToObject(pAnswerUser)

      const isPassTest = trimAnswer(pAnswerTrue) == trimAnswer(pAnswerUser)

      setAnswerState(isPassTest ? RIGHT : WRONG)
      setAnswerTime(answerTime + 1)
      handleAnswerCallback(isPassTest, JSON.stringify(orderAnswerUser))
    } else {
      // const pAnswerTrue = items.filter(x => x.hidden).map(x => x.value)
      const pAnswerTrue = Object.values(answerTrue)
      const pAnswerUser = Object.values(answerUser)
        .filter((x) => x)
        .map((x) => String(x))

      const isPassTest =
        trimAnswer(pAnswerTrue.sort()) == trimAnswer(pAnswerUser.sort())

      setAnswerState(isPassTest ? RIGHT : WRONG)
      setAnswerTime(answerTime + 1)
      handleAnswerCallback(isPassTest, JSON.stringify(answerUser))
    }
  }

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = items[dragIndex]

      setItems(
        update(items, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        }),
      )
    },
    [items],
  )

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
        <TitleWithImageViewer title={question} picture={question_picture} />

        <ViewerPresenter hideDetails={question_picture} answerType={answerType}>
          {answerType === ORDER && (
            <>
              {reviewMode ? (
                <OrderAnswerReview
                  items={items}
                  answerUser={answerUser}
                  answerTrue={answerTrue}
                />
              ) : (
                <DndProvider backend={HTML5Backend}>
                  <div className="block items">
                    {(items || []).map((x, i) => (
                      <Card
                        key={`item-${i}`}
                        index={i}
                        className="drag-item"
                        moveCard={moveCard}
                        text={x.value}
                      />
                    ))}
                  </div>
                </DndProvider>
              )}
            </>
          )}
        </ViewerPresenter>

        {['inputs-items', 'line'].includes(answerType) && (
          <>
            {reviewMode ? (
              <LineAnswerReview
                items={items}
                answerUser={answerUser}
                answerTrue={answerTrue}
                digitType={pExtra?.digitType || 'arabic' }
              />
            ) : (
              <LineAnswer
                items={items}
                answerUser={answerUser}
                handleAnswer={handleAnswer}
                digitType={pExtra?.digitType || 'arabic'}
              />
            )}
          </>
        )}
      </div>
    </ResultLayout>
  )
}

SequenceViewer.propTypes = {
  ...ViewerAttributes,
}

export default { SequenceViewer }
