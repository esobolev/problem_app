import { useEffect, useState } from 'react'
import { toJSON, CUSTOM } from 'src/tools'

import { useBuilderStates } from 'src/hooks/useBuilderStates'
import { NumberTableViewer } from './viewer'
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

  const [width, setWidth] = useState(10)
  const [height, setHeight] = useState(10)

  useEffect(() => {
    if (pExtra) {
      const extra = toJSON(pExtra)

      if (problem_type === extra.problemType) {
        setAnswerTrue(answer_true)
      }

      if (extra?.width && extra?.height) {
        setWidth(extra.width)
        setHeight(extra.height)
      } else {
        setExtra({ width: 10, height: 10 })
      }

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
    setWidth(10)
    setHeight(10)
  }

  const updateExtra = () => {
    const newExtra = {
      problemType: problem_type,
      buttons,
      buttonsType,
      width,
      height,
    }
    setExtra(newExtra)
  }

  useEffect(() => {
    updateExtra()
  }, [buttons, buttonsType, width, height])

  const handleItemChange = (e) => setAnswerTrue(e.target.value)

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
      Viewer={NumberTableViewer}
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
            <div className="col-lg-2 pt-15">Width</div>
            <div className="col-lg-2">
              <div className="input-block mb-0">
                <input
                  className="item answer-true"
                  value={width}
                  onChange={(e) => {
                    setWidth(Number(e.target.value))
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-lg-2 pt-15">Height</div>
            <div className="col-lg-2">
              <div className="input-block mb-0">
                <input
                  className="item answer-true"
                  value={height}
                  onChange={(e) => {
                    setHeight(Number(e.target.value))
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-lg-2 pt-15">Answer true</div>
            <div className="col-lg-2">
              <div className="input-block mb-0">
                <input
                  onChange={handleItemChange}
                  className="item answer-true"
                  value={answerTrue}
                />
              </div>
            </div>
            <div className="col-lg-4 pt-15">Comma separated</div>
          </div>
        </div>
      </div>
    </LayoutBuilder>
  )
}

Builder.propTypes = {
  ...BuilderAttributes,
}

export { Builder as NumberTableBuilder }
