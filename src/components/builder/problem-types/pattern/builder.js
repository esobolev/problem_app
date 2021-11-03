import { useRef, useState, useEffect } from 'react'
import {
  shuffle,
  times,
  getRandomArbitrary,
  getMultiRandom,
  intersection,
  CUSTOM,
} from 'src/tools'

import { useBuilderStates } from 'src/hooks/useBuilderStates'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import BuilderAttributes from '../common/builder_type'
import LayoutBuilder from '../common/layout_builder'

import { PatternViewer } from './viewer'
import WrapItem from './wrap-item'

import ShapesMenu from '../common/shapes-menu'

import { collections, colors } from '../common/constants'

const MIN_ITEMS_COUNT = 6

const defaultItem = { value: null, hidden: false }

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

  // const [loaded, setLoaded] = useState(false)
  const [items, setItems] = useState([])
  const [answers, setAnswers] = useState([])
  // const [hiddenTemplate, setHiddenTemplate] = useState([])

  const refMenu = useRef()
  const [selectedItemIndex, setSelectedItemIndex] = useState(null)
  const [selectedItemList, setSelectedItemList] = useState(null)
  const [isShapesOpen, setIsShapesOpen] = useState(false)
  useOnClickOutside(refMenu, () => setIsShapesOpen(false))

  useEffect(() => {
    try {
      const { items, answers } = pExtra

      setTitle(question)
      setPicture(question_picture)
      setHint(pHint)
      setHintPicture(pHintPicture)
      setSolution(pSolution)
      setSolutionPicture(pSolutionPicture)
      setAnswerTrue(answer_true)

      setButtonsType(pExtra.buttonsType || CUSTOM)
      setButtons(pExtra.buttons || [])
      setGeneratedButtons(pExtra.buttons || [])

      if (Array.isArray(items)) {
        setExtra(pExtra)
        setItems(items)
        setAnswers(answers || [])
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

  useEffect(() => {
    setExtra({ items, answers })
  }, [items, answers])

  const setDefaultParams = () => {
    setDefaultBuilderParams()
    setExtra({ items, answers })
    generateProblem()
    setIsInitBuilder(true)
  }

  const imagePath = (val) => `/account/shapes/${val}.svg`

  const generateProblem = () => {
    // const r1 = getRandomArbitrary(0, 3);

    // if (r === 0) {
    // 1-2-1-2-1-2
    const [col1, col2, col3] = getMultiRandom(collections, 3)
    const [clr1, clr2, clr3] = getMultiRandom(colors, 3)

    const r = getRandomArbitrary(0, 5)

    let pattern = null

    switch (r) {
      case 0:
        pattern = [`${col1}_${clr1}`, `${col1}_${clr2}`]
        break

      case 1:
        pattern = [`${col1}_${clr1}`, `${col2}_${clr1}`]
        break

      case 2:
        pattern = [`${col1}_${clr1}`, `${col2}_${clr2}`]
        break

      case 3:
        pattern = [`${col1}_${clr1}`, `${col1}_${clr1}`, `${col1}_${clr2}`]
        break

      case 4:
        pattern = [`${col1}_${clr1}`, `${col1}_${clr1}`, `${col2}_${clr1}`]
        break

      case 5:
        pattern = [`${col1}_${clr1}`, `${col1}_${clr1}`, `${col2}_${clr2}`]
        break
      default:
        pattern = []
    }

    const problem = times(MIN_ITEMS_COUNT)
      .map((x) => ({
        value: imagePath(pattern[x % pattern.length]),
        hidden: false,
      }))
      .flat()

    console.log(problem)

    problem[problem.length - 1].hidden = true

    setItems(problem)
    setAnswers(
      shuffle([
        ...problem.slice(-2),
        { value: imagePath(`${col1}_${clr3}`), hidden: false },
        { value: imagePath(`${col3}_${clr1}`), hidden: false },
      ]),
    )

    // }
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

  const handleGenerateClick = (e) => {
    e.preventDefault()

    generateProblem()
  }

  // Answers line
  const handleRemoveAnswerClick = (index) => (e) => {
    e.preventDefault()
    const newAnswers = answers.filter((_, i) => i !== index)
    setAnswers(newAnswers)
  }

  const handleAddAnswerClick = () => {
    setAnswers([...answers, defaultItem])
  }

  const handleItemClick = (index, list) => () => {
    setSelectedItemIndex(index)
    setSelectedItemList(list)
    setIsShapesOpen(true)
  }

  const handleShapeClick = (name, modification) => {
    if (selectedItemList === 'items') {
      const newItems = [...items]
      newItems[selectedItemIndex] = {
        ...newItems[selectedItemIndex],
        value: name,
        modification,
      }
      setItems(newItems)
    } else if (selectedItemList === 'answers') {
      const newAnswers = [...answers]
      newAnswers[selectedItemIndex] = {
        ...newAnswers[selectedItemIndex],
        value: name,
        modification,
      }
      setAnswers(newAnswers)
    }

    setIsShapesOpen(false)
    setSelectedItemIndex(null)
    setSelectedItemList(null)
  }

  const itemValues = items.filter((x) => x.hidden).map((s) => s.value)
  const answerValues = answers.map((s) => s.value)

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
      Viewer={PatternViewer}
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
          Visual line{' '}
          <span>
            {' '}
            or{' '}
            <a onClick={handleGenerateClick} href="#">
              Generate
            </a>
          </span>
        </div>

        <div ref={refMenu}>
          <ShapesMenu active={isShapesOpen} onClick={handleShapeClick} />
        </div>

        <div className="form builder-form">
          {items.map((x, i) => (
            <WrapItem
              key={i}
              index={i}
              item={x}
              handleItemClick={handleItemClick(i, 'items')}
              handleHiddenClick={handleHiddenClick}
            />
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
              disabled={items.length <= 4}
              className="second-btn"
              onClick={handleRemoveClick(items.length - 1)}
              type="button"
            >
              -
            </button>
          </div>
        </div>
      </div>

      <div className="block">
        <div className="block-title">Answer line</div>

        <div
          style={{ boxShadow: '0px 0px 30px #00000026', background: '#ffffff' }}
        >
          <div
            className="form builder-form"
            style={{ boxShadow: 'none', background: 'none' }}
          >
            {answers.map((x, i) => (
              <WrapItem
                className={itemValues.includes(x.value) ? 'correct' : ''}
                key={i}
                index={i}
                item={x}
                // handleShapeClick={handleShapeAnswerClick(i)}
                handleItemClick={handleItemClick(i, 'answers')}
              />
            ))}

            <div className="plus-minus-btns">
              <button
                className="primary-btn"
                onClick={handleAddAnswerClick}
                type="button"
              >
                +
              </button>
              <button
                disabled={answers.length <= 1}
                className="second-btn"
                onClick={handleRemoveAnswerClick(answers.length - 1)}
                type="button"
              >
                -
              </button>
            </div>
          </div>

          <div className="row" style={{ padding: '0 30px 10px 30px ' }}>
            <div className="col-2">Hidden: {itemValues.length}</div>
            <div className="col-3">
              True answers: {intersection(answerValues, itemValues).length}
            </div>
            <div className="col-6">
              {itemValues.length !==
                intersection(answerValues, itemValues).length && (
                <span className="error">
                  Provide all correct answers for hidden fields
                </span>
              )}
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

export { Builder as PatternBuilder }
