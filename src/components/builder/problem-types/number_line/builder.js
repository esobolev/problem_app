import { useState, useEffect } from 'react'
import { Select } from 'src/components/select'
import { toJSON, shuffle, CUSTOM, CUSTOM_BUTTONS } from 'src/tools'

import { useBuilderStates } from 'src/hooks/useBuilderStates'
import { NumberLineViewer } from './viewer'
import BuilderAttributes from '../common/builder_type'
import LayoutBuilder from '../common/layout_builder'

const MIN_ITEMS_COUNT = 10
const DEFAULT_START = 1
const DEFAULT_STEP = 1

const defaultItem = { value: 0, isCorrect: false }

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

  const [start, setStart] = useState(null)
  const [operation, setOperation] = useState('+')
  const [step, setStep] = useState(null)

  const [left, setLeft] = useState(4)
  const [oper, setOper] = useState('+')
  const [right, setRight] = useState(3)

  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(MIN_ITEMS_COUNT)

  useEffect(() => {
    try {
      setTitle(question)
      setPicture(question_picture)
      setHint(pHint)
      setHintPicture(pHintPicture)
      setSolution(pSolution)
      setSolutionPicture(pSolutionPicture)
      setAnswerTrue(answer_true)

      setButtonsType(buttonsType)
      setButtons(buttons)
      setGeneratedButtons(buttons)

      const {
        items: newItems = [],
        problemType,
        left: pLeft,
        right: pRight,
        oper: pOper,
      } = toJSON(pExtra)

      setExtra(pExtra)

      setButtonsType(pExtra?.buttonsType || CUSTOM)
      setButtons(pExtra?.buttons || [])
      setGeneratedButtons(pExtra?.buttons || [])

      if (problemType !== problem_type) {
        setDefaultParams()
        return
      }
      setItems(newItems)
      setAnswerTrue(toJSON(answer_true))

      setLeft(pLeft || 4)
      setOper(pOper || '+')
      setRight(pRight || 3)

      setFrom(newItems[0].value)
      setTo(newItems[newItems.length - 1].value)

      setIsInitBuilder(true)
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

  useEffect(() => {
    console.log('Generate', start, operation, step)

    if (!start || !operation || !step) return

    let fill = []

    if (answer_type === 'jump') {
      for (let i = from; i <= to; i++) {
        fill.push({ value: i, isCorrect: false })
      }
    } else if (answer_type === 'line') {
      fill = new Array(items?.length || MIN_ITEMS_COUNT).fill(0).map((_, i) => {
        const next = generateItemValue(start, operation, step, i)

        return { value: next, isCorrect: false }
      })
    }

    setItems(fill)
    setAnswerTrue({})
  }, [start, operation, step, answer_type, items?.length.from, to])

  useEffect(() => {
    setExtra({ items, problemType: problem_type, left, right, oper, buttons })
  }, [items, left, right, oper, buttons])

  useEffect(() => {
    if (!left || !right) return

    let customButtons = [
      { label: `${left}${oper}${right}`, value: `${left}${oper}${right}` },
    ]

    // eslint-disable-next-line unicorn/prefer-ternary
    if (oper === '+') {
      customButtons = [
        ...customButtons,
        { label: `${right}${oper}${left}`, value: `${right}${oper}${left}` },
        {
          label: `${Number(left) + Number(right)}-${right}`,
          value: `${Number(left) + Number(right)}-${right}`,
        },
        { label: `${left}-${right}`, value: `${left}-${right}` },
      ]
    } else {
      customButtons = [
        ...customButtons,
        {
          label: `${Number(left) + Number(right)}+${right}`,
          value: `${Number(left) + Number(right)}+${right}`,
        },
        {
          label: `${Number(left) - Number(right)}+${right}`,
          value: `${Number(left) - Number(right)}-${right}`,
        },
        { label: `${left}+${right}`, value: `${left}+${right}` },
      ]
    }
    setAnswerTrue({ 0: customButtons[0].value })
    setButtons(shuffle(customButtons))
  }, [left, oper, right])

  const setDefaultParams = () => {
    setStart(DEFAULT_START)
    setStep(DEFAULT_STEP)
    setOperation('+')
    setDefaultBuilderParams()
    setAnswerTrue({})
    setIsInitBuilder(true)
  }

  const handleStartChange = (e) => setStart(Number(e.target.value) || '')
  const handleOperationChange = (value) => setOperation(value)
  const handleStepChange = (e) => setStep(Number(e.target.value) || '')

  const handleItemChange = (index) => (e) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], value: e.target.value }
    setItems(newItems)
    setStart('')
    setStep('')
    // setOperation('')
  }

  const handleCorrectClick = (index, value) => () => {
    const answers = { ...answerTrue }
    answers[index] = !answers[index]
    setAnswerTrue(answers)
  }

  const handleRemoveClick = (index) => (e) => {
    e.preventDefault()
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleAddClick = () => {
    const newItems = [...items, defaultItem]
    console.log('handleAddClick', newItems)
    setTo(newItems[newItems.length - 1].value)
    setItems([...items, defaultItem])
  }

  const handleSave = async () => {
    setIsLoading(true)
    await onSave({
      question: title,
      question_picture: picture,
      answer_true: JSON.stringify(answerTrue),
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

  // console.log('itemsitems', items)

  const generateLine = () => {
    const fill = []
    for (let i = from; i <= to; i++) {
      fill.push({ value: i, isCorrect: false })
    }
    setItems(fill)
  }

  const handleFromChange = (e) => setFrom(Number(e.target.value) || '')
  const handleToChange = (e) => setTo(Number(e.target.value) || '')
  const handleApplyChange = (e) => {
    e.preventDefault()
    generateLine()
  }

  const handleGenerateTimes = (e) => {
    e.preventDefault()
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
      Viewer={NumberLineViewer}
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
        {answer_type === 'line' && (
          <>
            <div className="block-title visual-line">
              Visual line
              <span />
            </div>

            <div className="form-bg mb-30">
              <div className="row">
                <div className="col-1 pt-30">Line:</div>
                <div className="col-10">
                  <div className="builder-form">
                    <div className="input-block ww-100">
                      <div className="pb-5">Starts</div>
                      <input
                        type="text"
                        onChange={handleStartChange}
                        value={start}
                      />
                    </div>

                    <div
                      className="input-block ww-100
                    ww-100"
                    >
                      <div className="pb-5">Operation</div>
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

                    <div className="input-block ww-100">
                      <div className="pb-5">Step</div>
                      <input
                        type="text"
                        onChange={handleStepChange}
                        value={step}
                      />
                    </div>

                    {/* <div className='input-block ww-100'>
                      <button type='button' className='primary-btn'>Generate</button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {answer_type === 'jump' && (
          <>
            <div className="block-title">
              Visual line{' '}
              <span>
                {' '}
                or{' '}
                <a onClick={handleGenerateTimes} href="#">
                  Generate
                </a>
              </span>
            </div>

            <div className="form-bg mb-30">
              <div className="row">
                <div className="col-1 pt-30">Line:</div>
                <div className="col-10">
                  <div className="builder-form">
                    <div className="input-block ww-100">
                      <div className="pb-5">From</div>
                      <input
                        type="text"
                        onChange={handleFromChange}
                        value={from}
                      />
                    </div>

                    <div className="input-block ww-100">
                      <div className="pb-5">End</div>
                      <input type="text" onChange={handleToChange} value={to} />
                    </div>

                    <div className="input-block ww-100">
                      <div className="pb-5">&nbsp;</div>
                      <button
                        type="button"
                        className="primary-btn normal-btn"
                        onClick={handleApplyChange}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="block-title visual-line">Answer</div>

        {answer_type === 'line' && answerTrue && (
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
                      className={`second-btn ${
                        answerTrue[i] ? 'btn-active' : ''
                      }`}
                      onClick={handleCorrectClick(i, false)}
                      type="button"
                    >
                      true
                    </button>
                    {/* <button className={`second-btn ${!answerTrue[i] ? 'btn-active' : ''}`} onClick={handleCorrectClick(i, true)} type="button">false</button> */}
                  </div>
                )}
              </div>
            ))}

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
        )}

        {answer_type === 'jump' && (
          <div className="form builder-form">
            <div className="input-block ww-100">
              <div className="pb-5">Left</div>
              <input
                type="text"
                onChange={(e) => {
                  setLeft(e.target.value)
                }}
                value={left}
              />
            </div>

            <div className="input-block ww-100">
              <div className="pb-5">Operation</div>
              <Select
                placeholder="Operation"
                value={oper}
                onChange={(item) => {
                  setOper(item.value)
                }}
                options={[
                  { label: '+', value: '+' },
                  { label: '-', value: '-' },
                ]}
              />
            </div>

            <div className="input-block ww-100">
              <div className="pb-5">Right</div>
              <input
                type="text"
                onChange={(e) => {
                  setRight(e.target.value)
                }}
                value={right}
              />
            </div>
          </div>
        )}
      </div>
    </LayoutBuilder>
  )
}

Builder.propTypes = {
  ...BuilderAttributes,
}

export { Builder as NumberLineBuilder }
