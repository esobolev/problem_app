/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react'
import { toJSON, CUSTOM } from 'src/tools'
import { Select } from 'src/components/select'

import { useBuilderStates } from 'src/hooks/useBuilderStates'
import { AreaViewer } from './viewer'
import BuilderAttributes from '../common/builder_type'
import LayoutBuilder from '../common/layout_builder'

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

  const [width, setWidth] = useState(3)
  const [height, setHeight] = useState(2)

  useEffect(() => {
    if (pExtra) {
      const parsedExtra = toJSON(pExtra)

      if (problem_type === parsedExtra.problemType) {
        setWidth(pExtra?.width || 3)
        setHeight(pExtra?.height || 2)
        setAnswerTrue(answer_true)
      }
      setExtra(pExtra)

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
      // eslint-disable-next-line no-use-before-define
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

  const setDefaultParams = () => {
    setDefaultBuilderParams()
    setIsInitBuilder(true)
  }

  const updateExtra = () => {
    const newExtra = {
      problemType: problem_type,
      buttons,
      buttonsType,
      width,
      height,
    }

    console.log('updateExtra', newExtra)
    setExtra(newExtra)
  }

  useEffect(() => {
    updateExtra()
  }, [buttons, width, height])

  useEffect(() => {
    console.log('Update WH', width * height)
    setAnswerTrue(width * height)
  }, [width, height])

  // const handleItemChange = (e) => setAnswerTrue(e.target.value)

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
      Viewer={AreaViewer}
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
        <div className="block-title visual-line">Visual line</div>
        <div className="form-block">
          <div className="row form-group">
            <div className="col-lg-2">
              <label htmlFor="width" className="col-form-label">
                Width
              </label>
            </div>
            <div className="col-lg-2">
              <Select
                id="width"
                placeholder="Width"
                value={extra?.width || 2}
                onChange={(item) => {
                  setWidth(Number(item.value))
                }}
                options={[
                  { label: '1', value: 1 },
                  { label: '2', value: 2 },
                  { label: '3', value: 3 },
                  { label: '4', value: 4 },
                  { label: '5', value: 5 },
                  { label: '6', value: 6 },
                  { label: '7', value: 7 },
                  { label: '8', value: 8 },
                  { label: '9', value: 9 },
                  { label: '10', value: 10 },
                  { label: '11', value: 11 },
                  { label: '12', value: 12 },
                ]}
              />
            </div>
            <div className="col-lg-2">
              <label htmlFor="height" className="col-form-label">
                Height
              </label>
            </div>
            <div className="col-lg-2">
              <Select
                id="height"
                placeholder="Height"
                value={extra?.height || 2}
                onChange={(item) => {
                  setHeight(Number(item.value))
                }}
                options={[
                  { label: '1', value: 1 },
                  { label: '2', value: 2 },
                  { label: '3', value: 3 },
                  { label: '4', value: 4 },
                  { label: '5', value: 5 },
                  { label: '6', value: 6 },
                  { label: '7', value: 7 },
                  { label: '8', value: 8 },
                  { label: '9', value: 9 },
                  { label: '10', value: 10 },
                  { label: '11', value: 11 },
                  { label: '12', value: 12 },
                ]}
              />
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

export { Builder as AreaBuilder }
