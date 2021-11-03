import { useState } from 'react'

export const useViewerStates = () => {
  const [extra, setExtra] = useState(null)
  const [answerType, setAnswerType] = useState<null | string>(null)
  const [answerTrue, setAnswersTrue] = useState(null)
  const [answerUser, setAnswerUser] = useState<any | string>(null)
  const [answerState, setAnswerState] = useState(null)
  const [answerLog, setAnswerLog] = useState([])
  const [answerTime, setAnswerTime] = useState(0)
  const [isInitViewer, setIsInitViewer] = useState(false)

  const setDefaultViewerParams = () => {
    setExtra(null)
    setAnswerType('input')
    setAnswersTrue(null)
    // setAnswerUser(null)
    setAnswerUser({})
    setAnswerState(null)
    setAnswerLog([])
    setAnswerTime(0)
    // setIsInitBuilder(true)
  }

  return {
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
  }
}
