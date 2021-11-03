import { useState, useEffect, memo } from 'react'
// import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import {
  DndProvider,
  TouchTransition,
  MouseTransition,
  usePreview,
} from 'react-dnd-multi-backend'
import { toJSON, RIGHT, WRONG, DRAG, trimAnswer } from 'src/tools'
import { useViewerStates } from 'src/hooks/useViewerStates'
import ResultLayout from '../../results/result-layout'
import ViewerAttributes from '../common/viewer_type'
// import Target from './components/target'
import Box from './components/box'
import { DnDAnswerType, DnDAnswerTypeReview } from './answer_types'

import { TitleWithImageViewer } from '../common/title_with_image'
import ViewerPresenter from '../common/viewer_presenter'

const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: MouseTransition,
      preview: false,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      // Note that you can call your backends with options
      // options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
      // will not dispatch a duplicate `touchstart` event when this backend is activated
      // skipDispatchOnTransition: true
    },
  ],
}

const MyPreview = () => {
  const { display, itemType, item, style } = usePreview()

  if (!display) {
    return null
  }

  console.log('item', item)

  return (
    <Box className="box no-border" name={item.name}>
      <img src={`/account/shapes/${item.name}.svg`} alt="" style={style} />
    </Box>
  )
}

const PatternViewer = memo((props) => {
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
  const [answers, setAnswers] = useState([])

  const [isAnswerFiled, setIsAnswerFiled] = useState(false)

  useEffect(() => {
    try {
      console.log('pExtra', pExtra)
      const { items: newItems, answers: newAnswers } = toJSON(pExtra)

      setItems(newItems)
      setAnswers(newAnswers)

      setExtra(pExtra)
      setAnswerType(pAnswerType || DRAG)
      setAnswersTrue(pAnswerTrue)
      pAnswerUser && setAnswerUser(toJSON(pAnswerUser))
      setAnswerState(pAnswerState)
      setAnswerLog(pAnswerLog)
      setAnswerTime(0)
      setIsInitViewer(true)
    } catch (error) {
      console.log('useEffect :: Viewer :: Sequence', 'setDefaultParams', error)
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
    console.log('Filled', items, answerUser)
    if (
      Array.isArray(items) &&
      typeof answerUser === 'object' &&
      answerUser !== null
    ) {
      setIsAnswerFiled(
        Object.values(answerUser).length ===
          items.filter((x) => x.hidden).length,
      )
    }
  }, [answerUser, items])

  const setDefaultParams = () => {
    setDefaultViewerParams()
    setAnswerType(DRAG)
    setAnswersTrue({})
    setIsInitViewer(true)
  }

  const checkAnswer = () => {
    let isPassTest = true

    items.forEach((x, i) => {
      console.log(x)
      if (x.hidden) {
        if (trimAnswer(x.value) !== trimAnswer(answerUser[i].dragItem.value)) {
          isPassTest = false
        }
      }
    })

    console.log('checkAnswer isPassTest:', isPassTest)

    // if (!isPassTest) {
    //   setAnswerUser({})
    // }

    setAnswerState(isPassTest ? RIGHT : WRONG)
    setAnswerTime(answerTime + 1)
    handleAnswerCallback(isPassTest, JSON.stringify(answerUser))
  }

  const handleDropComplete = (dragIndex, dragItem) => (targetItem) => {
    console.log('handleDropComplete', dragIndex, dragItem, targetItem)

    const newAnswersUser = { ...answerUser }

    if (targetItem.line === 'variants') {
      const newAnswers = [...answers]

      // console.log(...newAnswers)

      const bubble = newAnswers[targetItem?.targetItem]
      newAnswers[targetItem?.targetItem] = newAnswers[dragIndex]
      newAnswers[dragIndex] = bubble

      // console.log(newAnswers)

      Object.keys(newAnswersUser).forEach((x) => {
        if (newAnswersUser[x].dragIndex === dragIndex) {
          newAnswersUser[x].dragIndex = targetItem?.targetItem
        } else if (newAnswersUser[x].dragIndex === targetItem?.targetItem) {
          newAnswersUser[x].dragIndex = dragIndex
        }
      })

      setAnswers(newAnswers)
    } else {
      newAnswersUser[targetItem?.targetItem] = { dragIndex, dragItem }
    }

    console.log({ newAnswersUser })

    setAnswerUser(newAnswersUser)
  }

  const handleReDropComplete = (dragIndex, dragItem) => (targetItem) => {
    console.log('handleReDropComplete', dragIndex, dragItem, targetItem)

    const newAnswersUser = { ...answerUser }

    if (targetItem.name === 'DROP_TO_SOURCE') {
      delete newAnswersUser[dragIndex]
    } else {
      delete newAnswersUser[dragIndex]
      newAnswersUser[targetItem?.targetItem] = { dragIndex, dragItem }
      delete newAnswersUser[dragIndex]
    }

    setAnswerUser(newAnswersUser)
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
      <div className={`pattern-viewer ${answerType} problem-view`}>
        <TitleWithImageViewer title={question} picture={question_picture} />

        <ViewerPresenter hideDetails={question_picture} answerType={answerType}>
          <DndProvider options={HTML5toTouch}>
            {answerType === DRAG && Array.isArray(items) && (
              <>
                {reviewMode ? (
                  <DnDAnswerTypeReview
                    items={items}
                    answerUser={answerUser}
                    answerTrue={answerTrue}
                  />
                ) : (
                  <DnDAnswerType
                    items={items}
                    answerUser={answerUser}
                    answers={answers}
                    handleDropComplete={handleDropComplete}
                    handleReDropComplete={handleReDropComplete}
                  />
                )}
              </>
            )}
            <MyPreview />
          </DndProvider>
        </ViewerPresenter>
      </div>
    </ResultLayout>
  )
})

PatternViewer.propTypes = {
  ...ViewerAttributes,
}

export { PatternViewer }
