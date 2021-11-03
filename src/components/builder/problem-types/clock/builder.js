import { useState, useEffect } from 'react'
import TimeField from 'react-simple-timefield'
import { useBuilderStates } from 'src/hooks/useBuilderStates'
import { CUSTOM, CUSTOM_BUTTONS } from 'src/tools'
import { ClockViewer } from './viewer'
import BuilderAttributes from '../common/builder_type'

import LayoutBuilder from '../common/layout_builder'

const defaultItem = { value: '12:00' }
const clockFaceTypeEnum = { flat: 'flat', roman: 'roman' }

const Builder = ({
  id = null,
  question,
  problem_type,
  answer_type,
  answer_true = null,
  extra: pExtra = null,
  question_picture = null,
  onSave,
  hint: pHint = '',
  hint_picture: pHintPicture = null,
  solution: pSolution = '',
  solution_picture: pSolutionPicture = null,
}) => {
  const {
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
  } = useBuilderStates()

  const [items, setItems] = useState([])
  const [clockFaceType, setClockFaceType] = useState(clockFaceTypeEnum.flat)

  useEffect(() => {
    try {
      const {
        problem_type: exProblemType,
        items: exItems = [],
        clockFaceType: exClockFaceType = clockFaceTypeEnum.flat,
      } = pExtra

      setTitle(question)
      setPicture(question_picture)
      setHint(pHint)
      setHintPicture(pHintPicture)
      setSolution(pSolution)
      setSolutionPicture(pSolutionPicture)
      setAnswerTrue(answer_true)
      setExtra(pExtra)

      setButtonsType(pExtra.buttonsType || CUSTOM)
      setButtons(pExtra.buttons || [])
      setGeneratedButtons(pExtra.buttons || [])

      if (exProblemType === problem_type && checkFormat(exItems)) {
        setItems(exItems)
        setClockFaceType(exClockFaceType)
        setIsInitBuilder(true)
      } else {
        setDefaultParams()
      }
    } catch (error) {
      console.log(error)
      setDefaultParams()
    }
  }, [
    id,
    problem_type,
    answer_type,
    question,
    question_picture,
    answer_true,
    pExtra,
  ])

  const updateExtra = () => {
    const newExtra = {
      problem_type,
      items,
      clockFaceType,
      buttons,
      buttonsType,
    }

    console.log('updateExtra', newExtra)
    setExtra(newExtra)
  }

  useEffect(() => {
    updateExtra()
  }, [problem_type, items, clockFaceType, buttons, buttonsType])

  const setDefaultParams = () => {
    setDefaultBuilderParams()
    generateProblem() // setItems
    setIsInitBuilder(true)
  }

  // Business Logic
  const checkFormat = (data) => {
    let valid = true

    if (!Array.isArray(data)) return false

    for (const item of data) {
      if (!item?.value) {
        valid = false
        break
      }
    }
    return valid
  }

  const randomTime = () => {
    const hours = Math.round(Math.random() * 12)
    const minutes = (Math.round(Math.random() * 12) * 5) % 60
    const hh = (hours < 10 ? '0' : '') + hours
    const mm = (minutes < 10 ? '0' : '') + minutes

    return `${hh}:${mm}`
  }

  const generateProblem = () => {
    const newItems = (items.length > 0 ? items : [1, 2, 3]).map((_) => ({
      value: randomTime(),
    }))
    setItems(newItems)
  }

  // UI Handlers
  const handleItemChange = (index) => (e) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], value: e.target.value }
    setItems(newItems)
  }

  const handleGenerateTimes = (e) => {
    e.preventDefault()
    generateProblem()
  }

  const handleRemoveClick = (index) => (e) => {
    e.preventDefault()
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleAddClick = (e) => {
    e.preventDefault()
    setItems([...items, defaultItem])
  }

  const onChangeClockFace = (e) => {
    setClockFaceType(e.target.value)
  }

  const handleSave = async () => {
    if (!isValid && answer_type === CUSTOM_BUTTONS) {
      alert('Please select/enter correct answer')
      return
    }

    setIsLoading(true)
    await onSave({
      question: title,
      question_picture: picture,
      answer_true: String(answerTrue),
      extra: JSON.stringify({ ...extra, problemType: problem_type }),
      hint,
      hint_picture: hintPicture,
      solution,
      solution_picture: solutionPicture,
      buttons_images: buttonImages,
      solution_images: solutionImages,
    })
    setIsLoading(false)
  }

  return (
    <LayoutBuilder
      id={id}
      key={id}
      answerTrue={answerTrue}
      setAnswerTrue={setAnswerTrue}
      isValid={isValid}
      setIsValid={setIsValid}
      problemType={problem_type}
      answerType={answer_type}
      title={title}
      setTitle={setTitle}
      picture={picture}
      setPicture={setPicture}
      isLoading={isLoading}
      isInitBuilder={isInitBuilder}
      handleSave={handleSave}
      extra={extra}
      buttonsType={buttonsType}
      setButtonsType={setButtonsType}
      buttons={buttons}
      setButtons={setButtons}
      buttonImages={buttonImages}
      setButtonImages={setButtonImages}
      generatedButtons={generatedButtons}
      Viewer={ClockViewer}
      hint={hint}
      setHint={setHint}
      hintPicture={hintPicture}
      setHintPicture={setHintPicture}
      solution={solution}
      setSolution={setSolution}
      solutionPicture={solutionPicture}
      setSolutionPicture={setSolutionPicture}
      solutionImages={solutionImages}
      setSolutionImages={setSolutionImages}
    >
      <div className="block">
        <div className="block-title">
          Visual line
          <span>
            {' '}
            or{' '}
            <a onClick={handleGenerateTimes} href="#">
              Generate
            </a>
          </span>
        </div>

        <div className="form-bg">
          <div className="row">
            <div className="col-2">Dial</div>
            <div className="col-2">
              <div className="radio">
                <input
                  type="radio"
                  value={clockFaceTypeEnum.flat}
                  onChange={onChangeClockFace}
                  checked={clockFaceType === clockFaceTypeEnum.flat}
                />
                <span className="radio-ico" />
                <p>Modern/Arabic</p>
              </div>
            </div>
            <div className="col-2">
              <div className="radio">
                <input
                  type="radio"
                  value={clockFaceTypeEnum.roman}
                  onChange={onChangeClockFace}
                  checked={clockFaceType === clockFaceTypeEnum.roman}
                />
                <span className="radio-ico" />
                <p>Roman</p>
              </div>
            </div>
          </div>

          <div className="row mt-30">
            <div className="col-2 pt-20">Time</div>
            <div className="col-10">
              <div className="builder-form mlr-10">
                {items.map((x, i) => (
                  <div className="wrap-item" key={`item-${i}`}>
                    <TimeField
                      className="item time-input"
                      onChange={handleItemChange(i)}
                      value={x.value}
                    />
                  </div>
                ))}

                <div className="plus-minus-btns">
                  <button
                    disabled={items.length >= 4}
                    className="primary-btn"
                    onClick={handleAddClick}
                    type="button"
                  >
                    +
                  </button>

                  <button
                    disabled={items.length <= 1}
                    className="second-btn"
                    onClick={handleRemoveClick(items.length - 1)}
                    type="button"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutBuilder>
  )
}

Builder.propTypes = {
  ...BuilderAttributes,
}

export { Builder as ClockBuilder }
