import { useState, useEffect } from 'react'
import { Select } from 'src/components/select'

import { toJSON, CUSTOM } from 'src/tools'

import { useBuilderStates } from 'src/hooks/useBuilderStates'
import { SequenceViewer } from './viewer'
import BuilderAttributes from '../common/builder_type'
import LayoutBuilder from '../common/layout_builder'

const MIN_ITEMS_COUNT = 8
const DEFAULT_START = 20
const DEFAULT_STEP = 5

const defaultItem = { value: 0, hidden: false }

const checkFormat = (data) => {
  let valid = true

  if (!Array.isArray(data)) return false

  for (const item of data) {
    if (!item?.value || item?.hidden === undefined) {
      valid = false
      break
    }
  }
  return valid
}

const generateItemValue = (start, operation, step, i) => {
  let next = ''

  if (i > 0) {
    try {
      operation === '*' || operation === '/'
        ? (next = eval(`${start} ${operation} (${step} ** ${i})`))
        : (next = eval(`${start} ${operation} (${step} * ${i})`))
    } catch (error) {
      console.log(error)
    }
  } else {
    next = start
  }
  return next
}

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
    setDefaultBuilderParams,
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
  } = useBuilderStates()

  const [items, setItems] = useState([])
  const [start, setStart] = useState(null)
  const [operation, setOperation] = useState('+')
  const [step, setStep] = useState(null)
  const [hiddenTemplate, setHiddenTemplate] = useState([])

  const [digitType, setDigitType] = useState('arabic')

  useEffect(() => {
    const existItems = toJSON(pExtra) || {}

    setExtra(pExtra)
    setTitle(question)
    setPicture(question_picture)
    setHint(pHint)
    setHintPicture(pHintPicture)
    setSolution(pSolution)
    setSolutionPicture(pSolutionPicture)
    setAnswerTrue(answer_true)

    setButtonsType(pExtra?.buttonsType || CUSTOM)
    setButtons(pExtra?.buttons || [])
    setGeneratedButtons(pExtra?.buttons || [])

    setDigitType(pExtra?.digitType || 'arabic')

    if (checkFormat(existItems)) {
      setItems(existItems)
      setIsInitBuilder(true)
    } else {
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

  useEffect(() => {
    console.log('Template', start, operation, step)

    if (!start || !operation || !step) return

    const len = items.length === 0 ? MIN_ITEMS_COUNT : items.length

    const template = [...hiddenTemplate]
    if (template.length > 0) {
      template.slice(0, items.length)
    } else {
      for (let i = template.length; i < len; i++) {
        template[i] = Math.round(Math.random())
      }
    }
    setHiddenTemplate(template)
  }, [items.length])

  useEffect(() => {
    console.log('Generate', start, operation, step)

    if (!start || !operation || !step) return

    const template = [...hiddenTemplate]

    const fill = new Array(items.length || MIN_ITEMS_COUNT)
      .fill(0)
      .map((_, i) => {
        const next = generateItemValue(start, operation, step, i)

        if (template[i] === undefined) {
          template[i] = Math.round(Math.random())
        }

        return { value: next, hidden: template[i] }
      })
    setHiddenTemplate(template)

    setItems(fill)
  }, [start, operation, step, items.length])

  useEffect(() => {
    if (answer_type === 'order') {
      const newItems = items.reduce((acc, item, idx) => {
        acc[idx] = String(item.value)
        return acc
      }, {})
      setAnswerTrue(newItems)
    } else {
      const newItems = items.reduce((acc, item, idx) => {
        item.hidden ? (acc[idx] = String(item.value)) : null
        return acc
      }, {})
      setAnswerTrue(newItems)
    }
  }, [items, answer_type])

  const setDefaultParams = () => {
    setDefaultBuilderParams()
    setStart(DEFAULT_START)
    setStep(DEFAULT_STEP)
    setOperation('+')
    setIsInitBuilder(true)
  }

  const updateExtra = () => {
    /*
    const newExtra = {
      problem_type,
      items,
      buttons,
      buttonsType,
    }
    setExtra(newExtra)
    */
    setExtra(items)
  }

  useEffect(() => {
    updateExtra()
  }, [items, digitType])
  // }, [problem_type, items, buttons, buttonsType])

  const handleStartChange = (e) => setStart(e.target.value)
  const handleOperationChange = (value) => setOperation(value)
  const handleStepChange = (e) => setStep(e.target.value)

  const handleItemChange = (index) => (e) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], value: e.target.value }
    setItems(newItems)

    setStart('')
    setStep('')
    // setOperation('')
  }

  const handleHiddenClick = (index, value) => () => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], hidden: value }
    setItems(newItems)
  }

  const handleRemoveClick = (index) => (e) => {
    e.preventDefault()
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleAddClick = () => {
    setItems([...items, defaultItem])
  }

  const handleSave = async () => {
    setIsLoading(true)
    await onSave({
      question: title,
      question_picture: picture,
      answer_true: JSON.stringify(answerTrue),
      extra: JSON.stringify(items),
      hint,
      hint_picture: hintPicture,
      solution,
      solution_picture: solutionPicture,
      buttons_images: buttonImages,
      solution_images: solutionImages,
    })
    setIsLoading(false)
  }

  const onChangeDigitType = (e) => {
    setDigitType(e.target.value)
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
      Viewer={SequenceViewer}
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
        <div className="block-title visual-line">
          Visual line
          <span />
        </div>

        <div className="form-block mb-30">
          <div className="row form-group mb-15">
            {/* <div className='col-lg-2'>
            </div> */}
            <div className="col-lg-1">Starts</div>
            <div className="col-lg-2" style={{ maxWidth: 100 }}>
              Operation
            </div>
            <div className="col-lg-1">Step</div>
          </div>

          <div className="row form-group">
            {/* <div className='col-lg-2'>
              <label className="col-form-label">Type</label>
            </div> */}
            <div className="col-lg-1">
              <div className="input-block">
                <input type="text" onChange={handleStartChange} value={start} />
              </div>
            </div>
            <div className="col-lg-2" style={{ maxWidth: 100 }}>
              <div className="input-block">
                <Select
                  placeholder="Type"
                  value={operation}
                  onChange={(item) => {
                    handleOperationChange(item.value)
                  }}
                  options={[
                    { label: '+', value: '+' },
                    { label: '-', value: '-' },
                    { label: '×', value: '*' },
                    { label: '÷', value: '/' },
                  ]}
                />
              </div>
            </div>
            <div className="col-lg-1">
              <div className="input-block">
                <input type="text" onChange={handleStepChange} value={step} />
              </div>
            </div>

            <div className="col-2">
              <div className="radio mt-15">
                <input
                  type="radio"
                  value="arabic"
                  onChange={onChangeDigitType}
                  checked={digitType === 'arabic'}
                />
                <span className="radio-ico" />
                <p>Modern/Arabic</p>
              </div>
            </div>
            <div className="col-3">
              <div className="radio mt-15">
                <input
                  type="radio"
                  value="roman"
                  onChange={onChangeDigitType}
                  checked={digitType === 'roman'}
                />
                <span className="radio-ico" />
                <p>Roman</p>
              </div>
            </div>
          </div>
        </div>

        <div className="form builder-form">
          {items.map((x, i) => (
            <div className="wrap-item" key={`item-${i}`}>
              <input
                onChange={handleItemChange(i)}
                className="item"
                value={x.value}
              />
              {answer_type !== 'order' && (
                <div className="column-btns">
                  <button
                    className={`second-btn ${x.hidden ? 'btn-active' : ''}`}
                    onClick={handleHiddenClick(i, false)}
                    type="button"
                  >
                    show
                  </button>
                  <button
                    className={`second-btn ${!x.hidden ? 'btn-active' : ''}`}
                    onClick={handleHiddenClick(i, true)}
                    type="button"
                  >
                    hide
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* <a className='second-btn' onClick={handleRemoveClick(i)}  href='#'>-</a> */}
          <div className="plus-minus-btns">
            <button
              className="primary-btn"
              onClick={handleAddClick}
              type="button"
            >
              +
            </button>
            <button
              className="second-btn"
              onClick={handleRemoveClick(items.length - 1)}
              type="button"
            >
              -
            </button>
          </div>
        </div>
      </div>
    </LayoutBuilder>
  )
}

Builder.propTypes = {
  ...BuilderAttributes,
}

export { Builder as SequenceBuilder }
