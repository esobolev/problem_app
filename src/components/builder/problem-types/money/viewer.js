import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toJSON, RIGHT, WRONG, INPUT, trimAnswer } from 'src/tools'
import { useViewerStates } from 'src/hooks/useViewerStates'
import ResultLayout from '../../results/result-layout'
import ViewerAttributes from '../common/viewer_type'
import { MoneyInputAnswer, MoneyInputAnswerReview } from './answer_types'

import { TitleWithImageViewer } from '../common/title_with_image'
import ViewerPresenter from '../common/viewer_presenter'

export function MoneyViewer(props) {
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

  // const [extra, setExtra] = useState(null);

  const [centValue, setCentValue] = useState(0)
  const [dollarValue, setDollarValue] = useState(0)

  const [resultCoins, setResultCoins] = useState([])
  const [resultDollars, setResultDollars] = useState([])

  const [isAnswerFiled, setIsAnswerFiled] = useState(true) // TODO: setIsAnswerFiled

  useEffect(() => {
    let newExtra = ''

    if (pExtra) {
      try {
        newExtra = toJSON(pExtra)

        setAnswerType(pAnswerType || INPUT)
        setAnswersTrue(pAnswerTrue)
        setAnswerUser(pAnswerUser || 0)
        setAnswerState(pAnswerState)
        setAnswerLog(pAnswerLog)
        setAnswerTime(0)

        setExtra(newExtra)

        const { items = {} } = newExtra

        const all = Object.keys(items).filter(
          (key) => Number(items[key].count) > 0,
        )

        const allCoins = all.filter((x) => x.indexOf('¢') >= 0)
        const allDollar = all.filter((x) => x.indexOf('$') >= 0)

        const newResultCoins = []
        const newResultDollars = []

        allCoins.forEach((x) => {
          new Array(Number(items[x].count)).fill().forEach((_, i) => {
            newResultCoins.push({ value: x, side: items[x].sides[i] })
          })
        })
        allDollar.forEach((x) => {
          new Array(Number(items[x].count)).fill(0).forEach((_) => {
            newResultDollars.push({ value: x })
          })
        })

        setResultCoins(newResultCoins)
        setResultDollars(newResultDollars)
        setCentValue(0)
        setDollarValue(0)

        setIsInitViewer(true)
      } catch (error) {
        console.log('Parse', error)
        setDefaultParams()
      }
    } else {
      newExtra = { items: {} }
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
    if (isLiveCheck && answerUser > 0) {
      checkAnswer()
    }
  }, [isLiveCheck, answerUser])

  useEffect(() => {
    setAnswerUser(Number(dollarValue) * 100 + Number(centValue))
  }, [centValue, dollarValue])

  const setDefaultParams = () => {
    setDefaultViewerParams()
    setExtra({ items: {} })
    setAnswerUser(0)
    setIsInitViewer(true)
  }

  // UI Handlers

  const checkAnswer = () => {
    console.log('answerUser', answerUser, answerTrue)
    const isPassTest = trimAnswer(answerUser) === trimAnswer(answerTrue)

    setAnswerState(isPassTest ? RIGHT : WRONG)
    setAnswerTime(answerTime + 1)
    handleAnswerCallback(isPassTest, String(answerUser))
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
      <div className={`sequence-viewer ${answerType}  problem-view`}>
        <TitleWithImageViewer title={question} picture={question_picture} />

        <ViewerPresenter hideDetails={question_picture} answerType={answerType}>
          <div
            className="block items align-center"
            style={{ paddingLeft: 30 * resultCoins.length }}
          >
            {resultCoins.map((x, i) => (
              <img
                style={{ transform: `translateX(${-30 * i}px)` }}
                src={`/account/images/dest/money/${x.value}-${x.side}.svg`}
                key={`coin-${i}`}
                alt=""
              />
            ))}
          </div>

          <div
            style={{
              transform: `translateX(${-21 * resultDollars.length - 85}px)`,
              height: 140,
              display: 'block',
              width: '100%',
              position: 'relative',
              left: '50%',
            }}
          >
            {resultDollars.map((x, i) => (
              <img
                style={{
                  display: 'block',
                  position: 'absolute',
                  left: `${40 * i}px`,
                }}
                src={`/account/images/dest/money/${x.value}.svg`}
                key={`coin-${i}`}
                alt=""
              />
            ))}
          </div>
        </ViewerPresenter>

        {[INPUT].includes(answerType) && (
          <>
            {reviewMode ? (
              <MoneyInputAnswerReview
                answerUser={answerUser}
                answerTrue={answerTrue}
              />
            ) : (
              <MoneyInputAnswer
                dollarValue={dollarValue}
                setDollarValue={setDollarValue}
                centValue={centValue}
                setCentValue={setCentValue}
              />
            )}
          </>
        )}
      </div>
    </ResultLayout>
  )
}

MoneyViewer.propTypes = {
  ...ViewerAttributes,
  extra: PropTypes.string,
}

export default { MoneyViewer }
