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
import Box from './components/box'
import Basket from './basket'
import { DnDAnswerType, DnDAnswerTypeReview } from './answer_types'

import { TitleWithImageViewer } from '../common/title_with_image'
import ViewerPresenter from '../common/viewer_presenter'

import { basketTypeEnum } from './builder'

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
      <img src={item.name} alt="" style={style} />
    </Box>
  )
}

const SortingViewer = memo((props) => {
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
    viewerAnswerCallback = (value) => {}
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
  const [baskets, setBaskets] = useState([])
  const [basketsType, setBasketsType] = useState(basketTypeEnum.colors)

  const [isAnswerFiled, setIsAnswerFiled] = useState(false)

  useEffect(() => {
    try {
      console.log('pExtra', pExtra)
      const {
        items: newItems,
        answers: newAnswers,
        baskets: newBaskets,
        basketsType: newBasketsType,
      } = toJSON(pExtra)

      setItems(newItems)
      setAnswers(newAnswers)
      setBaskets(newBaskets || [])
      setBasketsType(newBasketsType || [])

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
      setIsAnswerFiled(!items.filter((x) => x).length)
    }

    viewerAnswerCallback && viewerAnswerCallback(answerUser);
  }, [answerUser, items])

  const setDefaultParams = () => {
    setDefaultViewerParams()
    setAnswerType(DRAG)
    setAnswersTrue({})
    setIsInitViewer(true)
  }

  const checkAnswer = () => {
    let isPassTest = true

    Object.keys(answerUser).map((name, basketIdex) => {
      answerUser[name].map((item) => {
        if (item.position !== basketIdex) {
          isPassTest = false
        }
      })
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
    console.log('answerUser', answerUser)
    console.log('handleDropComplete', dragIndex, dragItem, targetItem)

    const newAnswersUser = { ...(answerUser || {}) }

    newAnswersUser[targetItem.name] = [
      ...(newAnswersUser[targetItem.name] || []),
      { ...dragItem, index: dragIndex },
    ]
    console.log('!!', newAnswersUser)
    setAnswerUser(newAnswersUser)

    const newItems = [...items]
    newItems[dragIndex] = null

    console.log(newItems)
    setItems(newItems)
  }

  const handleReDropComplete =
    (dragIndex, dragItem, fromBasket) => (targetItem) => {
      console.log(
        'RE handleReDropComplete',
        fromBasket,
        dragIndex,
        dragItem,
        targetItem,
      )

      if (targetItem.allowedDropEffect === 'DROP_TO_BASKET') {
        const newAnswersUser = { ...answerUser }
        newAnswersUser[fromBasket] = newAnswersUser[fromBasket].filter(
          (x, i) => i !== dragIndex,
        )
        newAnswersUser[targetItem.name] = [
          ...newAnswersUser[targetItem.name],
          dragItem,
        ]
        setAnswerUser(newAnswersUser)
      } else if (targetItem.allowedDropEffect === 'DROP_TO_ANSWER') {
        const newItems = [...items]
        newItems[targetItem.targetItem] = dragItem
        setItems(newItems)

        const newAnswersUser = { ...answerUser }
        newAnswersUser[fromBasket] = newAnswersUser[fromBasket].filter(
          (x, i) => i !== dragIndex,
        )
        setAnswerUser(newAnswersUser)
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
                    // handleReDropComplete={handleReDropComplete}
                  />
                )}
              </>
            )}
            <MyPreview />

            <div className={`baskets ${basketsType}`}>
              {baskets.map((x, i) => (
                <Basket
                  key={x}
                  name={`basket_${i}`}
                  value={x}
                  answerUser={(answerUser || {})[`basket_${i}`]}
                  handleReDropComplete={handleReDropComplete}
                  type={basketsType}
                />
              ))}
            </div>
          </DndProvider>
        </ViewerPresenter>
      </div>
    </ResultLayout>
  )
})

SortingViewer.propTypes = {
  ...ViewerAttributes,
}

export { SortingViewer }
