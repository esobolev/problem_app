import { useState, useEffect } from 'react'
import { FormatInput } from 'src/components/common'
import {
  getRandomArbitrary,
  times,
  toJSON,
  CUSTOM_BUTTONS,
  CUSTOM,
} from 'src/tools'

import { useBuilderStates } from 'src/hooks/useBuilderStates'
import { MoneyViewer } from './viewer'
import BuilderAttributes from '../common/builder_type'
import LayoutBuilder from '../common/layout_builder'

/*
const defaultItem = {
  '1 ¢': { count: 0, value: 1, sides: [] },
  '5 ¢': { count: 0, value: 5, sides: [] },
  '10 ¢': { count: 0, value: 10, sides: [] },
  '25 ¢': { count: 0, value: 25, sides: [] },
  '$1': { count: 0, value: 100 },
  '$5': { count: 0, value: 500 },
  '$10': { count: 0, value: 1000 },
  '$20': { count: 0, value: 2000 },
  '$50': { count: 0, value: 5000 },
  '$100': { count: 0, value: 10000 },
};
*/

const randomMoney = () => {
  const items = {
    '1 ¢': { count: getRandomArbitrary(0, 3), value: 1, sides: [] },
    '5 ¢': { count: getRandomArbitrary(0, 3), value: 5, sides: [] },
    '10 ¢': { count: getRandomArbitrary(0, 3), value: 10, sides: [] },
    '25 ¢': { count: getRandomArbitrary(0, 3), value: 25, sides: [] },
    $1: { count: getRandomArbitrary(0, 3), value: 100 },
    $5: { count: getRandomArbitrary(0, 3), value: 500 },
    $10: { count: getRandomArbitrary(0, 1), value: 1000 },
    $20: { count: getRandomArbitrary(0, 1), value: 2000 },
    $50: { count: 0, value: 5000 },
    $100: { count: 0, value: 10000 },
  }

  items['1 ¢'].sides = times(items['1 ¢'].count).map((_) =>
    getRandomArbitrary(1, 3),
  )
  items['5 ¢'].sides = times(items['5 ¢'].count).map((_) =>
    getRandomArbitrary(1, 3),
  )
  items['10 ¢'].sides = times(items['10 ¢'].count).map((_) =>
    getRandomArbitrary(1, 3),
  )
  items['25 ¢'].sides = times(items['25 ¢'].count).map((_) =>
    getRandomArbitrary(1, 3),
  )

  return items
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

  useEffect(() => {
    try {
      console.log('pExtra', pExtra)
      const existItem = toJSON(pExtra)

      if (existItem && existItem.items) {
        setExtra(existItem)
        setTitle(question)
        setPicture(question_picture)
        setHint(pHint)
        setHintPicture(pHintPicture)
        setSolution(pSolution)
        setSolutionPicture(pSolutionPicture)
        answer_true && setAnswerTrue(String(answer_true))

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
    if (Object.entries(extra?.items || []).length <= 0) return

    const sum = Object.entries(extra.items).reduce(
      (acc, val) => acc + val[1].count * val[1].value,
      0,
    )
    setAnswerTrue(sum)
  }, [extra?.items])

  const setDefaultParams = () => {
    setDefaultBuilderParams()

    const newItems = randomMoney()
    setExtra({ items: newItems })

    setButtonsType(CUSTOM)
    setButtons([])
    setGeneratedButtons([])

    setIsInitBuilder(true)
  }

  // ======= UI Handlers ===========
  const handleItemChange = (index) => (e) => {
    const newItems = { ...extra.items }
    newItems[index].count = e.target.value

    if (index.indexOf('¢') !== -1) {
      newItems[index].sides = times(newItems[index].count).map((_) =>
        getRandomArbitrary(1, 3),
      )
    }

    setExtra({ items: newItems })
  }

  const handleGenerateMoney = (e) => {
    e.preventDefault()

    const newItems = randomMoney()
    setExtra({ items: newItems })
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

  if (isLoading) {
    return <div>Wait while saving is in progress</div>
  }

  if (!isInitBuilder) {
    return <div>Waiting for init builder</div>
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
      Viewer={MoneyViewer}
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
            or
            <a onClick={handleGenerateMoney} href="#">
              Generate
            </a>
          </span>
        </div>

        <div className="form builder-form">
          {Object.keys(extra.items).map((key) => (
            <div className="wrap-item" key={`item-${key}`}>
              {key}{' '}
              <FormatInput
                type="number"
                onChange={handleItemChange(key)}
                className="item money-input"
                value={extra.items[key].count}
              />
            </div>
          ))}
        </div>
      </div>
    </LayoutBuilder>
  )
}

Builder.propTypes = {
  ...BuilderAttributes,
}

export { Builder as MoneyBuilder }
