import { useState } from 'react'

export const useBuilderStates = () => {
  const [title, setTitle] = useState('')
  const [picture, setPicture] = useState(null)

  const [answerTrue, setAnswerTrue] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [extra, setExtra] = useState(null)

  const [buttonsType, setButtonsType] = useState('')
  const [buttons, setButtons] = useState([])
  const [buttonImages, setButtonImages] = useState([])
  const [generatedButtons, setGeneratedButtons] = useState([])
  const [isValid, setIsValid] = useState(false)

  const [isInitBuilder, setIsInitBuilder] = useState(false)

  const [hint, setHint] = useState('')
  const [hintPicture, setHintPicture] = useState(null)
  const [solution, setSolution] = useState('')
  const [solutionPicture, setSolutionPicture] = useState(null)
  const [solutionImages, setSolutionImages] = useState([])

  const setDefaultBuilderParams = () => {
    setTitle('')
    setPicture(null)
    setAnswerTrue(null)
    setExtra(null)
    setIsLoading(false)
    setButtonsType('custom')
    setButtons([])
    setGeneratedButtons([])
    setIsValid(true)
    // setIsInitBuilder(true)
  }

  return {
    title,
    setTitle,
    picture,
    setPicture,
    answerTrue,
    setAnswerTrue,
    extra,
    setExtra,

    isLoading,
    setIsLoading,

    buttonsType,
    setButtonsType,
    buttons,
    setButtons,
    buttonImages,
    setButtonImages,
    generatedButtons,
    setGeneratedButtons,

    isValid,
    setIsValid,
    isInitBuilder,
    setIsInitBuilder,

    hint,
    setHint,
    hintPicture,
    setHintPicture,
    solution,
    setSolution,
    solutionPicture,
    setSolutionPicture,
    solutionImages,
    setSolutionImages,

    setDefaultBuilderParams,
  }
}
