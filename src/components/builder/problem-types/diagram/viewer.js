import { useState, useEffect, memo } from 'react'
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
import DropContainer from './components/drop-container'

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
    <div className="box no-border" name={item.name}>
      <img src={item.name} alt="" style={style} />
    </div>
  )
}

const DiagramViewer = memo((props) => {
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

  const [isAnswerFiled, setIsAnswerFiled] = useState(true) // TODO: setIsAnswerFiled

  const [leftProperty, setLeftProperty] = useState(null)
  const [rightProperty, setRightProperty] = useState(null)

  useEffect(() => {
    if (pExtra) {
      const {
        items: newItems,
        answers: newAnswers,
        leftProperty: newLeftProperty,
        rightProperty: newRightProperty,
      } = toJSON(pExtra)

      setExtra(pExtra)
      setAnswerType(pAnswerType || DRAG)
      setAnswersTrue(pAnswerTrue)
      pAnswerUser && setAnswerUser(toJSON(pAnswerUser))
      setAnswerState(pAnswerState)
      setAnswerLog(pAnswerLog)
      setAnswerTime(0)

      items && setItems(newItems)
      setAnswers(newAnswers)
      setLeftProperty(newLeftProperty)
      setRightProperty(newRightProperty)

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
    if (!Array.isArray(answerUser) || !Array.isArray(items)) return;

    console.log('AA', answerUser, items);

    console.log(
      isLiveCheck,
      Object.values(answerUser).length,
      items.filter((x) => x.hidden).length,
    )

    if (
      isLiveCheck &&
      Object.values(answerUser).length === items.filter((x) => x.hidden).length
    ) {
      checkAnswer()
    }
  }, [isLiveCheck, answerUser, items])

  useEffect(() => {
    // setIsAnswerFiled(Object.values(answerUser).length === items.filter(x => x.hidden).length)
    console.log(items)
  }, [answerUser])

  const setDefaultParams = () => {
    setDefaultViewerParams()
    setAnswerType(DRAG)
    setIsInitViewer(true)
  }

  // UI Handlers

  const checkAnswer = () => {
    let isPassTest = true

    console.log({ answers, items, answerUser });

    Array.isArray(items) && items.forEach((x, i) => {
      console.log(x)
      if (x.hidden) {
        if (trimAnswer(x.value) !== trimAnswer(answerUser[i].dragItem.value)) {
          isPassTest = false
        }
      }
    })

    console.log('checkAnswer isPassTest:', isPassTest)

    if (!isPassTest) {
      setAnswerUser({})
    }

    setAnswerState(isPassTest ? RIGHT : WRONG)
    setAnswerTime(answerTime + 1)
    handleAnswerCallback(isPassTest, JSON.stringify(answerUser))
  }

  const handleAnswerMove = (values) => {
    console.log(values)
    setAnswerUser(values);
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
            {answerType === DRAG && (
              <DropContainer
                items={items}
                answers={answers}
                leftProperty={leftProperty}
                rightProperty={rightProperty}
                handleAnswerMove={handleAnswerMove}
              />
            )}
            <MyPreview />
          </DndProvider>
        </ViewerPresenter>
      </div>
    </ResultLayout>
  )
})

DiagramViewer.propTypes = {
  ...ViewerAttributes,
}

export { DiagramViewer }
