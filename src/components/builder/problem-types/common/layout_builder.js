import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { INPUT, CUSTOM_BUTTONS } from 'src/tools'
import Actions from './actions'
// import { TitleWithImageBuilder } from './title_with_image'
// import { TextWithImageBuilder } from './text_with_image'
import ViewerPresenter from './viewer_presenter'
// import CustomButtonsBuilder from './custom_buttons_builder'
import CustomInputBuilder from './custom_input_builder'

const LayoutBuilder = ({
  answerTrue,
  setAnswerTrue,
  isValid,
  setIsValid,

  problemType,
  answerType,
  title,
  setTitle,
  picture,
  setPicture,

  isLoading,
  isInitBuilder,

  handleSave,

  children,
  extra,

  buttonsType,
  setButtonsType,
  buttons,
  setButtons,
  buttonImages,
  setButtonImages,
  generatedButtons,

  Viewer,
  viewerAnswerCallback,

  hint,
  setHint = () => {},
  hintPicture,
  setHintPicture = () => {},
  solution,
  setSolution = () => {},
  solutionPicture,
  setSolutionPicture = () => {},

  solutionImages = [],
  setSolutionImages = () => {},
}) => {
  const [questionTitle, setQuestionTitle] = useState(title)
  const [isShowHintAdSolution, setIsShowHintAdSolution] = useState(false)

  useEffect(() => {
    if (!questionTitle) {
      setQuestionTitle(title)
    }
  }, [title])

  useEffect(() => {
    ;(hint || hintPicture || solution || solutionPicture) &&
      setIsShowHintAdSolution(true)
  }, [hint, hintPicture, solution, solutionPicture])

  // console.log('LayoutBuilder answerTrue', Viewer)

  if (isLoading) {
    return <div>Wait while saving is in progress</div>
  }

  if (!isInitBuilder) {
    return <div>Waiting for init builder</div>
  }

  const isHideDetails = !!picture

  return (
    <div className="sequence question-builder-form">
      {/* <TitleWithImageBuilder
        problemType={problemType}
        title={questionTitle}
        onTitleChange={setTitle}
        picture={picture}
        onPictureChange={setPicture}
      /> */}

      <ViewerPresenter hideDetails={isHideDetails} answerType={answerType}>
        {children}
      </ViewerPresenter>

      {answerType === INPUT && isHideDetails && (
        <>
          <div className="block-title mt-15">Answer</div>
          <div className="form-block">
            <CustomInputBuilder
              answerTrue={answerTrue}
              setAnswerTrue={setAnswerTrue}
              isValid={isValid}
              setIsValid={setIsValid}
            />
          </div>
        </>
      )}

      {/* {answerType === CUSTOM_BUTTONS && (
        <>
          <div className="block-title mt-15">Answer</div>
          <div className="form-block">
            <CustomButtonsBuilder
              buttonsType={buttonsType}
              setButtonsType={setButtonsType}
              buttons={buttons}
              setButtons={setButtons}
              buttonImages={buttonImages}
              setButtonImages={setButtonImages}
              generatedButtons={generatedButtons}
              answerTrue={answerTrue}
              setAnswerTrue={setAnswerTrue}
              isValid={isValid}
              setIsValid={setIsValid}
            />
          </div>
        </>
      )} */}

      <div className="block mt-15">
        <div className="block-title">Preview</div>
        <div className="wrap-practice-viewer">
          <div className="practice-viewer">
            <Viewer
              playMode={false}
              reviewMode={false}
              question={title}
              question_picture={picture}
              answer_true={answerTrue}
              answer_type={answerType}
              extra={JSON.stringify(extra)}

              viewerAnswerCallback={viewerAnswerCallback}
            />
          </div>
        </div>
      </div>

      <div
        className={isShowHintAdSolution ? 'change-all' : 'change-all active'}
      >
        <div
          className="change-text mb-0"
          onClick={(e) => {
            e.preventDefault()
            setIsShowHintAdSolution(!isShowHintAdSolution)
          }}
        >
          <span className="block-title">Hint and Solution</span>
          <i className="hb-ico change-arrow" />
        </div>

        {/* <div
          className="change-wrap"
          style={{ display: isShowHintAdSolution ? 'block' : 'none' }}
        >
          <div className="block mt-15">
            <div className="block-title">Hint</div>
            <TextWithImageBuilder
              full
              title={hint}
              onTitleChange={setHint}
              picture={hintPicture}
              onPictureChange={setHintPicture}
            />
          </div>

          <div className="block mt-15">
            <div className="block-title">Solution</div>
            <TextWithImageBuilder
              full
              title={solution}
              onTitleChange={setSolution}
              picture={solutionPicture}
              onPictureChange={setSolutionPicture}
            />
          </div>
        </div> */}
      </div>

      <Actions handleSave={handleSave} isLoading={isLoading} />
    </div>
  )
}

LayoutBuilder.propTypes = {
  answerTrue: PropTypes.string.isRequired,
  setAnswerTrue: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  setIsValid: PropTypes.func.isRequired,

  problemType: PropTypes.string.isRequired,
  answerType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  picture: PropTypes.string.isRequired,
  setPicture: PropTypes.func.isRequired,

  isLoading: PropTypes.bool.isRequired,
  isInitBuilder: PropTypes.bool.isRequired,

  handleSave: PropTypes.func.isRequired,

  children: PropTypes.children,
  extra: PropTypes.object.isRequired,

  buttonsType: PropTypes.string.isRequired,
  setButtonsType: PropTypes.func.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.object),
  setButtons: PropTypes.func.isRequired,
  generatedButtons: PropTypes.arrayOf(PropTypes.object),

  Viewer: PropTypes.any,
  viewerAnswerCallback: PropTypes.func,

  hint: PropTypes.string.isRequired,
  hintPicture: PropTypes.string.isRequired,
  solution: PropTypes.string.isRequired,
  solutionPicture: PropTypes.string.isRequired,

  setHint: PropTypes.func.isRequired,
  setHintPicture: PropTypes.func.isRequired,
  setSolution: PropTypes.func.isRequired,
  setSolutionPicture: PropTypes.func.isRequired,

  solutionImages: PropTypes.arrayOf(PropTypes.string),
  setSolutionImages: PropTypes.func.isRequired,
}

export default LayoutBuilder
