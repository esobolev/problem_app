import { useState, useEffect } from 'react'
import { Select } from 'src/components/select'
import {
  getMultiRandom,
  isPointInCircle,
  randomValue,
  shuffle,
  CUSTOM,
} from 'src/tools'

import { useBuilderStates } from 'src/hooks/useBuilderStates'
import BuilderAttributes from '../common/builder_type'
import LayoutBuilder from '../common/layout_builder'

import { DiagramViewer } from './viewer'
import WrapItem from './wrap-item'

import {
  collections,
  colors,
  leftPropertyOptions,
  rightPropertyOptions,
} from '../common/constants'

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

  const [loaded, setLoaded] = useState(false)
  const [items, setItems] = useState([])
  const [answers, setAnswers] = useState([])

  // const [extra, setExtra] = useState({ items, answers });

  const [leftProperty, setLeftProperty] = useState(leftPropertyOptions[0].value)
  const [rightProperty, setRightProperty] = useState(
    rightPropertyOptions[0].value,
  )

  useEffect(() => {
    try {
      // console.log('useEffect diagram', id, answer_true);
      // console.log(pExtra);

      const {
        problem_type: pProblemType,
        items,
        answers,
        leftProperty = null,
        rightProperty = null,
      } = pExtra

      if (Array.isArray(items) && pProblemType === problem_type) {
        setExtra(pExtra)
        setItems(items)
        setAnswers(answers || [])

        leftProperty && setLeftProperty(leftProperty)
        rightProperty && setRightProperty(rightProperty)

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

        setIsInitBuilder(true)
      } else {
        setDefaultParams()
      }
    } catch (error) {
      console.log(error)
      setDefaultParams()
    } finally {
      setLoaded(true)
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
    setExtra({ problem_type, items, answers, leftProperty, rightProperty })
  }, [problem_type, items, answers, leftProperty, rightProperty])

  const setDefaultParams = () => {
    setDefaultBuilderParams()
    setExtra({ items, answers })
    generateProblem()
    setIsInitBuilder(true)
  }

  const generatePoints = (count, offsetCenterCircleX = 0) => {
    console.log('generatePoints')

    const MIN_ITEMS_COUNT = 10
    const ORIG_R = 125

    const offsetBorder = 20
    const R = ORIG_R - offsetBorder

    const wBox = 30

    const pts = []

    let i = 0
    while (i < MIN_ITEMS_COUNT) {
      const a = Math.random() * 2 * Math.PI
      const r = R * Math.sqrt(Math.random())

      const x = r * Math.cos(a) + ORIG_R - wBox / 2 + offsetCenterCircleX
      const y = r * Math.sin(a) + ORIG_R - wBox / 2

      // console.log({ x, y })

      if (y < 45) continue

      let isNormal = true
      // eslint-disable-next-line unicorn/no-for-loop
      for (let j = 0; j < pts.length; j++) {
        // console.log(Math.abs(x - pts[j].x), wBox && Math.abs(y - pts[j].y))
        if (Math.abs(x - pts[j].x) < wBox && Math.abs(y - pts[j].y) < wBox) {
          isNormal = false
        }
      }

      if (isNormal) {
        pts.push({ x, y })
        i++
      }
    }

    return pts
  }


  const wrapUrl = (x) =>
    `${process.env.REACT_APP_S3_HOST}/image_collection/2D/${x}.svg`

  const generateProblem = () => {
    console.log('generateProblem')

    const MIN_ITEMS_COUNT = 15
    const ORIG_R = 125
    const RIGHT_CIRCLE_OFFSET_X = 150

    const offsetBorder = 20
    const R = ORIG_R - offsetBorder

    const wBox = 30

    const pts = {
      left: [],
      middle: [],
      right: [],
    }

    pts.left = generatePoints(MIN_ITEMS_COUNT, 0)

    pts.middle = pts.left.filter((pt) =>
      isPointInCircle(
        pt.x,
        pt.y,
        ORIG_R + RIGHT_CIRCLE_OFFSET_X,
        ORIG_R,
        ORIG_R - offsetBorder,
      ),
    )
    pts.left = pts.left.filter(
      (pt) =>
        !isPointInCircle(
          pt.x,
          pt.y,
          ORIG_R + RIGHT_CIRCLE_OFFSET_X - wBox / 2 - 10,
          ORIG_R,
          ORIG_R + offsetBorder,
        ),
    )

    pts.right = generatePoints(MIN_ITEMS_COUNT, RIGHT_CIRCLE_OFFSET_X - 10)
    // pts.middle = [...pts.middle , pts.right.filter(pt => isPointInCircle(pt.x, pt.y, ORIG_R, ORIG_R, ORIG_R - offsetBorder ) )]
    pts.middle = pts.right.filter((pt) =>
      isPointInCircle(pt.x, pt.y, ORIG_R, ORIG_R, ORIG_R - wBox / 2 - 10),
    )

    pts.right = pts.right.filter(
      (pt) =>
        !isPointInCircle(pt.x, pt.y, ORIG_R, ORIG_R, ORIG_R + offsetBorder),
    )

    console.log(pts)

    pts.left = pts.left.map((x) => ({
      ...x,
      value: wrapUrl(`${leftProperty}_${randomValue(rightPropertyOptions)?.value}`),
    }))
    pts.middle = pts.middle.map((x) => ({
      ...x,
      value: wrapUrl(`${leftProperty}_${rightProperty}`),
    }))
    pts.right = pts.right.map((x) => ({
      ...x,
      value: wrapUrl(`${randomValue(leftPropertyOptions)?.value}_${rightProperty}`),
    }))

    // Generate answers
    const onlyAnswers = []

    pts.left.forEach((x) => (onlyAnswers[x.value] = 1))
    pts.right.forEach((x) => (onlyAnswers[x.value] = 1))
    pts.middle.forEach((x) => (onlyAnswers[x.value] = 1))

    let ans = Object.keys(onlyAnswers)
    ans = getMultiRandom(ans, 3)
    ans = [
      ...ans,
      wrapUrl(`${randomValue(leftPropertyOptions)?.value}_${
        randomValue(rightPropertyOptions)?.value
      }`),
    ]
    ans = shuffle(ans)


    ans = ans.map((x) => ({ value: x }))

    console.log('ans', ans)

    setItems(pts)
    setAnswers(ans)
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

  const handleLeftPropertyChange = (item) => {
    setLeftProperty(item.value)
  }

  const handleRightPropertyChange = (item) => {
    setRightProperty(item.value)
  }

  useEffect(() => {
    generateProblem()
  }, [leftProperty, rightProperty])

  // Answers line
  const handleShapeAnswerClick = (index) => (name) => {
    const newAnswers = [...answers]
    newAnswers[index] = { ...newAnswers[index], value: name }
    setAnswers(newAnswers)
  }

  const handleRemoveAnswerClick = (index) => (e) => {
    e.preventDefault()
    const newAnswers = answers.filter((_, i) => i !== index)
    setAnswers(newAnswers)
  }

  const handleAddAnswerClick = () => {
    setAnswers([...answers, defaultItem])
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
      Viewer={DiagramViewer}
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

        <div className="form-block">
          <div className="row form-group">
            <div className="col-lg-1">
              <label className="col-form-label">Left</label>
            </div>
            <div className="col-lg-3">
              <div className="input-block">
                <Select
                  placeholder="Type"
                  value={leftProperty}
                  onChange={handleLeftPropertyChange}
                  options={leftPropertyOptions}
                />
              </div>
            </div>
            <div className="col-lg-1">
              <label className="col-form-label">Right</label>
            </div>
            <div className="col-lg-3">
              <div className="input-block">
                <Select
                  placeholder="Type"
                  value={rightProperty}
                  onChange={handleRightPropertyChange}
                  options={rightPropertyOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block">
        <div className="block-title">Answer line 2</div>

        <div className="form builder-form">
          {answers.map((x, i) => (
            <WrapItem
              key={i}
              index={i}
              item={x}
              handleShapeClick={handleShapeAnswerClick(i)}
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
      </div>
    </LayoutBuilder>
  )
}

Builder.propTypes = {
  ...BuilderAttributes,
}

export { Builder as DiagramBuilder }
