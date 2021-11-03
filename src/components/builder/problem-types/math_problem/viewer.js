import { useState, useEffect } from 'react'
// import { MathComponent } from 'mathjax-react'
import MathJax from 'react-mathjax-preview'
import {
  strToMathJax,
  toJSON,
  RIGHT,
  WRONG,
  romanize,
  INPUT,
  trimAnswer,
  toggle,
  isNull,
  math,
} from 'src/tools'
import { useViewerStates } from 'src/hooks/useViewerStates'
import ResultLayout from '../../results/result-layout'
import ViewerAttributes from '../common/viewer_type'
import { variantsData } from './builder'
import {
  InputAnswer,
  InputAnswerReview,
  AnswerButtons,
  AnswerButtonsReview,
} from '../common/answer_type'
import { ColumnMathProblem, CustomExpressionProblem } from './answer_types'

// import { TitleWithImageViewer } from '../common/title_with_image'
import ViewerPresenter from '../common/viewer_presenter'

export function MathProblemViewer(props) {
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

  const [formula, setFormula] = useState('')
  const [isAnswerFiled, setIsAnswerFiled] = useState(false)

  useEffect(() => {
    const newExtra = toJSON(pExtra)

    console.log('pExtra', id, newExtra)

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
    setExtra({ type: variantsData.math.value, left: '', right: '' })
    setIsInitViewer(true)
  }

  // UI Handlers
  const checkAnswer = () => {
    let isPassTest = false
    console.log('checkAnswer 1', isLiveCheck, answerUser)

    // eslint-disable-next-line unicorn/prefer-ternary
    if (extra.type === 'fraction') {
      isPassTest = math.equal(
        math.fraction(answerTrue),
        math.fraction(answerUser || ''),
      )
    } else {
      isPassTest = trimAnswer(answerUser) === trimAnswer(answerTrue)
    }
    setAnswerState(isPassTest ? RIGHT : WRONG)
    setAnswerTime(answerTime + 1)
    handleAnswerCallback(isPassTest, answerUser)
  }

  const handleAnswer = (value) => {
    const answers = (answerTrue || '').split(',').map((x) => String(x))

    if (answers.length > 1 && extra?.type !== 'custom_expression') {
      let newAnswerUser = answerUser || []

      newAnswerUser = toggle(newAnswerUser, String(value))
      setAnswerUser(newAnswerUser)
      setIsAnswerFiled(newAnswerUser.length)
    } else {
      setAnswerUser(value)
      setIsAnswerFiled(!isNull(value))
    }
  }

  useEffect(() => {
    // console.log('X auto_math', extra)
    if (extra?.type === 'auto_math') {
      const preStr = `{${extra?.body}=`
      const f = strToMathJax(preStr)
      console.log('formula', f)
      setFormula(f)
    } else if (extra?.type === 'fraction') {
      const preStr = `${extra?.body} =`
      const f = strToMathJax(preStr)
      console.log('2formula', f)
      setFormula(f)
    } else {
      const ops = {
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷',
      }

      let preStr =
        extra?.digitType === 'roman'
          ? `{${romanize(extra?.variants?.left)} ${
              ops[extra?.variants?.operation]
            } ${romanize(extra?.variants?.right)}}=`
          : `{${extra?.variants?.left} ${ops[extra?.variants?.operation]} ${
              extra?.variants?.right
            }}=`

      if (extra?.type === variantsData.covert.value) {
        preStr = `${romanize(extra?.variants?.left)}=`
      }

      // console.log('extra.type11', preStr)

      // console.log('preStr', preStr)
      const f = strToMathJax(preStr)
      console.log('1formula', f)
      setFormula(f)
    }
  }, [extra?.variants, answerType, extra?.type])

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
        {/* <TitleWithImageViewer title={question} picture={question_picture} /> */}

        <ViewerPresenter hideDetails={question_picture} answerType={answerType}>
          {/* {variantsData.math.value === extra.type && */}
          <>
            <div className="row mb-30">
              <div className="col-lg-12 input_block text-center">
                <h3
                  className={`${
                    extra?.sub_type === 'column'
                      ? 'math-column'
                      : 'math-problem-formula'
                  }`}
                >
                  {extra?.type === 'custom_expression' ? (
                    <CustomExpressionProblem
                      body={extra?.body || ''}
                      answerUser={answerUser}
                      handleAnswer={handleAnswer}
                    />
                  ) : (
                    <>
                      {extra?.type === 'auto_math' ? (
                        extra?.sub_type === 'column' ? (
                          <ColumnMathProblem body={extra?.body} />
                        ) : (
                          <div className="math-auto">
                            {extra?.body
                              .replaceAll('*', '×')
                              .replaceAll('/', '÷')}
                            ={' '}
                          </div>
                        )
                      ) : (
                        <MathJax
                          math={formula}
                          config={{ showMathMenu: false }}
                        />
                      )}
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
                    </>
                  )}
                </h3>
              </div>
            </div>
          </>
          {/* } */}
        </ViewerPresenter>

        {['custom_buttons'].includes(answerType) && (
          <>
            {reviewMode ? (
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
      </div>
    </ResultLayout>
  )
}

MathProblemViewer.propTypes = {
  ...ViewerAttributes,
}

export default { MathProblemViewer }
