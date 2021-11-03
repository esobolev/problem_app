import { FC, ReactElement, useState, useEffect } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
// import { useBeforeunload } from 'react-beforeunload'
import { addMinutes } from 'date-fns'
import {
  submitAnswerRequest,
  startLessonRequest,
  completeLessonRequest,
  submitAnonymousRequest,
} from '../../services/api.service'
// import { useAuth } from '../../contexts/auth.context'
import ViewerTypeSwitcher from './viewer-type-switcher'
import { PAGE_LAYOUTS_ENUM, RIGHT, WRONG } from '../../tools'

interface ViewerProps {
  defaultQuestionTitle: string
  practice: any
  mode: string
  onFinishClick: () => {}
  sessionId: string
}

export const Viewer: FC<ViewerProps> = ({
  defaultQuestionTitle = null,
  practice: pPractice,
  mode = 'authorize',
  sessionId = null,
  onFinishClick = () => {},
}): ReactElement => {

  return <div>123</div>;

  const [curQuestionIdx, setCurQuestionIdx] = useState(0)
  const [timer, setTimer] = useState(null)

  const [firstAnswer, setFirstAnswer] = useState(true)

  const [allAnswer, setAllAnswer] = useState({})

  const [practice, setPractice] = useState(pPractice)
  // const [question, setQuestion] = useState(null)

  const [taskLogId, setTaskLogId] = useState(null)

  const [isFinished, setIsFinished] = useState(false)
  const [isFinishNeedConfirm, setIsFinishNeedConfirm] = useState(false)

  const [dirty, toggleDirty] = useState(true)

  const [playMode, setPlayMode] = useState(true)
  const [reviewMode, setReviewMode] = useState(false)
  const [isLiveCheck, setIsLiveCheck] = useState(true)

  const [allAnswerIds, setAllAnswerIds] = useState([])
  const [allQuestionIds, setAllQuestionIds] = useState([])
  /*
  useBeforeunload((event) => {
    if (dirty) {
      event.preventDefault()
      return "You'll lose your data!"
    }
  });
*/
  useEffect(() => {
    setAllAnswerIds(Object.keys(allAnswer).map((x) => String(x)))
  }, [allAnswer])

  useEffect(() => {
    console.log('firstAnswer', curQuestionIdx, firstAnswer)
  }, [firstAnswer])

  useEffect(() => {
    if (!pPractice) return

    setAllQuestionIds(pPractice?.questions.map((x) => String(x.id)))

    setIsLiveCheck(pPractice?.page_layout === PAGE_LAYOUTS_ENUM.single_on_page)

    const fetchAsync = async () => {
      const taskLog = pPractice.task_log

      if (taskLog) {
        setTaskLogId(taskLog.id)

        const aAnswers = {}

        taskLog.answers.forEach((x, i) => {
          aAnswers[x.question_id] = x.correct ? RIGHT : WRONG
        })

        setAllAnswer(aAnswers)
        setCurQuestionIdx(Object.keys(aAnswers).length || 0)

        const questions = pPractice.questions.map((q) => {
          const sAnswer = taskLog.answers.filter((x) => x.question_id === q.id)

          return sAnswer && sAnswer.length > 0
            ? {
                ...q,
                answerState: sAnswer[0].correct ? RIGHT : WRONG,
                answerUser: sAnswer[0].answer,
                answerLog: sAnswer,
              }
            : {
                ...q,
                answerState: null,
                answerUser: '',
                answerLog: [],
              }
        })

        pPractice.questions = questions
        setPractice(pPractice)

        // Timer
        const endAt = addMinutes(new Date(taskLog.started_at), pPractice.time)
        const duration =
          (new Date(endAt).getTime() - new Date().getTime()) / 1000

        if (duration > 0) {
          setTimer(duration)
        }
      } else {
        const result = await startLessonRequest(
          pPractice.id
            ? { task_id: pPractice.id }
            : { level_id: pPractice?.level_ids?.[0] },
        )

        const endAt = addMinutes(
          new Date(result.data?.item.started_at),
          pPractice.time,
        )
        const duration =
          (new Date(endAt).getTime() - new Date().getTime()) / 1000

        if (duration > 0) {
          setTimer(duration)
        }

        setTaskLogId(result.data?.item?.id)
      }
    }

    fetchAsync()
  }, [pPractice?.id])

  useEffect(() => {
    if (!practice) return
    if (practice?.questions.length <= 0) return

    console.log(
      'Change curQuestionIdx',
      curQuestionIdx,
      allAnswerIds,
      allQuestionIds,
      taskLogId,
    )
    console.log('Full', allAnswer)

    if (
      allAnswerIds.length === allQuestionIds.length &&
      allAnswerIds.length > 0 &&
      !reviewMode
    ) {
      completeTask()
      setIsFinished(true)
      toggleDirty(false)
      return
    }

    if (curQuestionIdx < practice?.questions.length) {
      // setQuestion(practice?.questions[curQuestionIdx])
      toggleDirty(true)
    } else if (allAnswerIds.length <= allQuestionIds.length) {
      console.log('setIsFinishNeedConfirm')
      setIsFinishNeedConfirm(true)
    } else {
      completeTask()
      setIsFinished(true)
      toggleDirty(false)
    }
  }, [curQuestionIdx, taskLogId, allAnswerIds, allQuestionIds])



  const completeTask = async () => {
    await completeLessonRequest(
      pPractice.id
        ? { task_log_id: taskLogId }
        : { task_log_id: taskLogId, level_id: pPractice?.level_ids?.[0] },
    )
  }

  const clearCurrentAnswer = () => {
    // setAnswer(null);
    // setInputValue('');
    // setAnswerValue(null);
  }

  // const handleHintClick = () => {
  //   setIsShowHint(true);
  // }

  // const handleHintClose = () => {
  //   setIsShowHint(false);
  // }

  const handleSkip = () => {
    // if (firstAnswer) {
    //   let a = {...allAnswer}
    //   a[curQuestionIdx] = WRONG;
    //   setAllAnswer(a);
    // }

    clearCurrentAnswer()
    setCurQuestionIdx(curQuestionIdx + 1)
  }

  const handleAnswerCallback = (id) => async (isPass, answerUser) => {
    console.log(
      'handleAnswerCallback',
      firstAnswer,
      id,
      isPass,
      answerUser,
      'isLiveCheck:',
      isLiveCheck,
    )

    if (isPass) {
      // setAnswer(RIGHT);
      // if (firstAnswer || isLiveCheck) {
      const a = { ...allAnswer }
      a[id] = RIGHT
      setAllAnswer(a)
      // }
      !isLiveCheck &&
        setTimeout(() => {
          handleContinue()
        }, 2000)
    } else {
      // setAnswer(WRONG);
      // if (firstAnswer || isLiveCheck) {
      const a = { ...allAnswer }
      a[id] = WRONG
      setAllAnswer(a)
      // }
    }

    // let newSavedAnswerValues = {...savedAnswerValues};
    // newSavedAnswerValues[practice.questions[idx].id] = x;
    // setSavedAnswerValues(newSavedAnswerValues)

    // console.log('savedAnswerValues', newSavedAnswerValues)

    // TODO: Add to task log

    console.log('mode', mode)

    if (mode === 'authorize') {
      console.log('submitAnswerRequest')

      await submitAnswerRequest({
        correct: isPass,
        time_spent: 0,
        answer: answerUser,
        // task_id: practice.id,
        task_log_id: taskLogId,
        question_id: id,
      })
    } else if (mode === 'anonymous') {
      console.log('submitAnonymousRequest')
      await submitAnonymousRequest({
        question_id: id,
        session_id: sessionId,
      })
    }

    console.log('setFirstAnswer', id, false)
    setFirstAnswer(false)
    // setAnswerValue(x);
  }

  const handleContinue = () => {
    if (curQuestionIdx < practice?.questions.length - 1) {
      setFirstAnswer(true)
      clearCurrentAnswer()
      setCurQuestionIdx(curQuestionIdx + 1)
    } else {
      setCurQuestionIdx(curQuestionIdx + 1)
    }
  }

  // const onChangeAnswer = (val) => {
  //   // setInputValue(val);
  // }

  const handleSelectQuestion = (idx) => () => {
    setCurQuestionIdx(idx)
  }

  const checkSinglePageAnswer = async () => {
    try {
      await completeTask();
    } catch (error) {
      console.log('error', error)
    }
    // setIsFinished(true)
    setPlayMode(false)
    setReviewMode(true)
    setIsFinished(false)
    console.log('allAnswerIds', allAnswer)
  }

  const handleFinish = (e) => {
    e.preventDefault()
    onFinishClick()
  }

  const handleReview = (e) => {
    e.preventDefault()
    setCurQuestionIdx(0)
    setPlayMode(false)
    setReviewMode(true)
    setIsFinished(false)
  }

  // console.log('question', question)

  const handleFinishScreen = async () => {
    await completeTask()
    setIsFinished(true)
    toggleDirty(false)
    window.history.back()
  }

  const handleReturn = () => {
    console.log(allAnswerIds, allQuestionIds)

    const idx = allQuestionIds.findIndex((x) => !allAnswerIds.includes(x))

    console.log('difference', idx)

    setIsFinishNeedConfirm(false)

    setFirstAnswer(true)
    clearCurrentAnswer()

    setCurQuestionIdx(idx)
  }

  if (!practice) return null

  const pCorrect = Object.values(allAnswer).filter((x) => x === RIGHT).length
  const pTotal = practice?.questions?.length

  const pPercent = Number.parseInt((pCorrect / pTotal) * 100, 10)

  const noAnswersCount = allQuestionIds.length - allAnswerIds.length

  if (isFinishNeedConfirm) {
    return (
      <div className="sectionHb-block appraisal">
        <div className="sectionHb-block__wrap">
          <div className="appraisal-row">
            <div className="appraisal-img">
              <img src="/account/img/appraisal/confirm.svg" alt="" />
            </div>
            <div className="appraisal-info">
              <span className="appraisal-subtitle">
                Test score: {pCorrect} / {pTotal}
              </span>
              <h3 className="appraisal-title">
                You didn’t answered {noAnswersCount} questions
              </h3>
              <p className="mb-20">
                Are you sure want to submit your work now?
              </p>
              <a href="#" onClick={handleReturn} className="primary-btn">
                Back to practice
              </a>{' '}
              <a href="#" onClick={handleFinishScreen} className="second-btn">
                Submit anyway
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className="sectionHb-block appraisal">
        <div className="sectionHb-block__wrap">
          <div className="appraisal-row">
            <div className="appraisal-img">
              {pPercent > 99 ? (
                <img src="/account/img/appraisal/img-1.svg" alt="" />
              ) : pPercent >= 80 ? (
                <img src="/account/img/appraisal/img-2.svg" alt="" />
              ) : (
                <img src="/account/img/appraisal/img-3.svg" alt="" />
              )}
            </div>
            <div className="appraisal-info">
              <span className="appraisal-subtitle">
                Test score: {pCorrect} / {pTotal}
              </span>
              <h3 className="appraisal-title">
                {pPercent > 99
                  ? 'Brilliant! Hats off!'
                  : pPercent >= 80
                  ? 'Great effort'
                  : 'You can ask for help!'}
              </h3>
              <span className="appraisal-label">
                {pPercent >= 70
                  ? 'You’ve earned'
                  : 'No stars for this practice'}
              </span>
              <div className="appraisal-stars">
                {pPercent > 99 ? (
                  <img src="/account/img/appraisal/stars-3.svg" alt="" />
                ) : pPercent >= 80 ? (
                  <img src="/account/img/appraisal/stars-2.svg" alt="" />
                ) : pPercent >= 70 ? (
                  <img src="/account/img/appraisal/stars-1.svg" alt="" />
                ) : (
                  <img src="/account/img/appraisal/stars-0.svg" alt="" />
                )}
              </div>
              <div className="appraisal-mistakes">
                <i className="hb-ico mistakes-ico" />
                <span>Mistakes: {pTotal - pCorrect}</span>
              </div>
              {/* <a href='#' onClick={handleFinish} className="second-btn">Finish</a>
              {' '} */}
              <a href="#" onClick={handleReview} className="primary-btn">
                Review
              </a>{' '}
              <a href="#" onClick={handleFinish} className="second-btn">
                Finish
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (practice?.page_layout === PAGE_LAYOUTS_ENUM.two_columns) {
    return (
      <>
        <div className="row mb-30">
          <div className="col-lg-11">
            <h2>{practice.title}</h2>
            <br />
            <p>
              {practice?.subject?.name}, {practice?.grade?.name} grade.{' '}
              {practice?.topic?.name}
            </p>
            <p className="mt-10">
              {(practice?.levels || []).map((x) => x.name).join('. ')}
            </p>
          </div>
          <div className="col-lg-1">
            {timer && (
              <CountdownCircleTimer
                size={60}
                strokeWidth={6}
                strokeLinecap="square"
                isPlaying
                duration={timer}
                colors={[
                  ['#4b7c61', 0.33],
                  ['#F7B801', 0.33],
                  ['#A30000', 0.33],
                ]}
              >
                {({ remainingTime }) => {
                  const minutes = Math.floor(remainingTime / 60)
                  let seconds = remainingTime % 60
                  seconds = seconds < 10 ? `0${seconds}` : seconds

                  return `${minutes}:${seconds}`
                }}
              </CountdownCircleTimer>
            )}
          </div>
        </div>

        <div className="wrap-problem-view two_columns">
          <div className="row questions-list">
            {defaultQuestionTitle && (
              <h3 className="col-12 review-title review-title__small text-center">
                {defaultQuestionTitle}
              </h3>
            )}
            {(practice.questions || []).map((question, i) => (
              <div key={question.id} className="col-lg-6">
                <ViewerTypeSwitcher
                  id={String(question?.id)}
                  playMode={false}
                  reviewMode={reviewMode}
                  handleAnswerCallback={handleAnswerCallback(question.id)}
                  isLiveCheck
                  {...question}
                  question=""
                />
              </div>
            ))}

            {reviewMode && (
              <>
                <div className="col-12 buttons-row buttons-center">
                  <b>Answers:</b>
                </div>
                <div className="col-12 buttons-row buttons-center">
                  <div>
                    Correct: <span className="square-correct">{pCorrect}</span>.
                    Wrong:{' '}
                    <span className="square-wrong">{pTotal - pCorrect}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {!reviewMode && (
            <div className="buttons-row buttons-center">
              <button
                type="button"
                onClick={checkSinglePageAnswer}
                className="primary-btn"
              >
                Submit
              </button>
            </div>
          )}
          {reviewMode && (
            <div className="buttons-row buttons-center">
              <button
                type="button"
                onClick={handleFinishScreen}
                className="primary-btn"
              >
                Finish
              </button>
            </div>
          )}
        </div>
      </>
    )
  }

  if (practice?.page_layout === PAGE_LAYOUTS_ENUM.single_on_page) {
    return (
      <>
        <div className="row mb-30">
          <div className="col-lg-11">
            <h2>{practice.title}</h2>
            <br />
            <p>
              {practice?.subject?.name}, {practice?.grade?.name} grade.{' '}
              {practice?.topic?.name}
            </p>
            <p className="mt-10">
              {(practice?.levels || []).map((x) => x.name).join('. ')}
            </p>
          </div>
          <div className="col-lg-1">
            {timer && (
              <CountdownCircleTimer
                size={60}
                strokeWidth={6}
                strokeLinecap="square"
                isPlaying
                duration={timer}
                colors={[
                  ['#4b7c61', 0.33],
                  ['#F7B801', 0.33],
                  ['#A30000', 0.33],
                ]}
              >
                {({ remainingTime }) => {
                  const minutes = Math.floor(remainingTime / 60)
                  let seconds = remainingTime % 60
                  seconds = seconds < 10 ? `0${seconds}` : seconds

                  return `${minutes}:${seconds}`
                }}
              </CountdownCircleTimer>
            )}
          </div>
        </div>

        <div className="wrap-problem-view single-page-layout">
          <div className="row">
            <div className="col-lg-1" />
            <div className="col-lg-10">
              {defaultQuestionTitle && (
                <h3 className="col-12 review-title review-title__small text-center">
                  {defaultQuestionTitle}
                </h3>
              )}
              {(practice.questions || []).map((question, i) => (
                <ViewerTypeSwitcher
                  key={question.id}
                  id={String(question?.id)}
                  playMode={false}
                  reviewMode={reviewMode}
                  // curQuestionIdx={curQuestionIdx}
                  // onChangeAnswer={onChangeAnswer}
                  handleAnswerCallback={handleAnswerCallback(question.id)}
                  isLiveCheck
                  // answerUser={savedAnswerValues[question?.id]}
                  {...question}
                  question={`${i + 1}. ${question.question}`}
                />
              ))}

              <br />

              <div className="buttons-row buttons-center">
                <button
                  type="button"
                  onClick={checkSinglePageAnswer}
                  className="primary-btn"
                >
                  Submit
                </button>
              </div>
            </div>
            <div className="col-lg-1" />
          </div>
        </div>
      </>
    )
  }

  const getProgressClass = (id, current = false) => {
    // console.log('getProgressClass', id, allAnswer)

    if (allAnswer[id] === RIGHT) return current ? 'success current' : 'success'

    if (allAnswer[id] === WRONG) return current ? 'failed current' : 'failed'

    if (current) return 'current'

    if (allAnswer[id] === undefined) return 'skipped'
  }

  return (
    <div>
      <div className="row mb-20">
        <div className="col-lg-9">
          <div className="practice-title">
            {practice?.subject?.name} {practice?.grade?.name} grade.{' '}
            {practice?.topic?.name}
          </div>
          <p className="mt-10">
            {(practice?.levels || []).map((x) => x.name).join('. ')}
          </p>
          <p> Mode: {mode}</p>
        </div>

        <div className={`col-lg-${timer ? '2' : '3'} answered-line`}>
          <span className="count-title">Answers:</span>
          <span className="count count-failed">
            {Object.values(allAnswer).filter((x) => x === WRONG).length}
            <div className="tooltip-info">
              <p>Wrong</p>
            </div>
          </span>
          <span className="count count-success">
            {Object.values(allAnswer).filter((x) => x === RIGHT).length}
            <div className="tooltip-info">
              <p>Correct</p>
            </div>
          </span>
          <span className="count count-skipped">
            {practice?.questions?.length - Object.keys(allAnswer).length}
            <div className="tooltip-info">
              <p>Not answered</p>
            </div>
          </span>
        </div>

        {timer && (
          <div className="col-lg-1">
            <CountdownCircleTimer
              size={60}
              strokeWidth={6}
              strokeLinecap="square"
              isPlaying
              duration={timer}
              colors={[
                ['#4b7c61', 0.33],
                ['#F7B801', 0.33],
                ['#A30000', 0.33],
              ]}
            >
              {({ remainingTime }) => {
                const minutes = Math.floor(remainingTime / 60)
                let seconds = remainingTime % 60
                seconds = seconds < 10 ? `0${seconds}` : seconds

                return `${minutes}:${seconds}`
              }}
            </CountdownCircleTimer>
          </div>
        )}
      </div>

      <div className="problem-wrap-view">
        <div className="progress progress-static">
          {practice?.questions.map((question, i) =>
            curQuestionIdx === i ? (
              <div
                key={i}
                onClick={handleSelectQuestion(i)}
                className={`progress-col ${getProgressClass(
                  question.id,
                  true,
                )}`}
              >
                {i + 1}/{practice?.questions.length}
              </div>
            ) : (
              <div
                key={i}
                onClick={handleSelectQuestion(i)}
                className={`progress-col ${getProgressClass(question.id)}`}
              />
            ),
          )}
        </div>

        {(practice.questions || []).map((question, i) => (
          <div
            key={question.id}
            style={{ display: curQuestionIdx === i ? 'block' : 'none' }}
          >
            {/* <div>{question.answerUser}</div> */}
            <ViewerTypeSwitcher
              key={question.id}
              curQuestionIdx={curQuestionIdx}
              // onChangeAnswer={onChangeAnswer}
              handleAnswerCallback={handleAnswerCallback(question.id)}
              playMode={playMode}
              reviewMode={reviewMode}
              // answerUser={savedAnswerValues[question?.id]}
              {...question}
              actionButtons={
                <>
                  {curQuestionIdx < practice?.questions?.length && (
                    <button
                      onClick={handleContinue}
                      type="button"
                      className="second-btn"
                    >
                      Later
                    </button>
                  )}
                  {/* answer === RIGHT &&
                    <>
                      {<button onClick={handleContinue} type="button" className="second-btn">
                        {curQuestionIdx === practice.questions.length - 1 ? 'Finish' : 'Continue'}
                      </button>}


                    </>
                  */}

                  {/* {(question?.hint || question?.hint_picture) &&
                    <button
                      type="button"
                      onClick={handleHintClick}
                      className="second-btn"
                    >
                      <img src="/account/images/dest/icons/hint.svg" alt="delete" />
                      <span className="second-btn">Hint</span>
                    </button>
                  } */}
                </>
              }
            />
          </div>
        ))}

        {/* <div className="mask"></div>
        <div className={`mask__modal ${isClass(isShowHint, 'active')}`}></div> */}

        {/* <HintModal active={isShowHint} onClose={handleHintClose}>
          {question?.hint}
        </HintModal> */}
      </div>
    </div>
  )
}
