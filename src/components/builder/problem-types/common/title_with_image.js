import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { usePredefinedTitles } from 'src/hooks/usePredefinedTitles'
import { getQuestionImageUrl } from 'src/tools'
import PredefinedButton from './predefined_dialog'

const configEditor = {
  options: ['inline'],
  inline: {
    options: ['bold', 'italic', 'underline'],
  },
}

// Builder
const TitleWithImageBuilder = ({
  problemType,
  title,
  onTitleChange,
  picture,
  onPictureChange,
}) => {
  const predefinedTitles = usePredefinedTitles(problemType)

  const [text, setText] = useState(EditorState.createEmpty())

  useEffect(() => {
    if (!title) return

    textToEditorState(title)
  }, [title])

  useEffect(() => {
    if (predefinedTitles.length <= 0 || title) return

    onTitleChange(predefinedTitles[0])
  }, [predefinedTitles])

  const handleTextChange = (editorState) => {
    setText(editorState)
    onTitleChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  const handleSelectFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()

      reader.onloadend = function (e) {
        onPictureChange(e.target.result)
      }

      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleRemoveFile = (e) => {
    e.preventDefault()
    onPictureChange(null)
  }

  const textToEditorState = (value) => {
    const blocksFromHtml = htmlToDraft(value)
    const { contentBlocks, entityMap } = blocksFromHtml
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap,
    )
    const editorState = EditorState.createWithContent(contentState)

    setText(editorState)
  }

  const imgSrc = getQuestionImageUrl(picture)

  return (
    <div className="block">
      <div className="block-title">
        Question
        <span>
          {' '}
          or{' '}
          <PredefinedButton
            items={predefinedTitles}
            value={title}
            handleSelect={(value) => {
              textToEditorState(value)
            }}
          />
        </span>
      </div>

      <div className="row">
        <div className="col-lg-10">
          <Editor
            editorState={text}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={handleTextChange}
            toolbar={configEditor}
          />
        </div>
        <div className="col-lg-2">
          {picture ? (
            <div className="thumb">
              <div className="thumbInner">
                <img src={imgSrc} alt="" />
                <a onClick={handleRemoveFile} className="remove" href="#">
                  <img src="/account/img/remove.svg" alt="" />
                </a>
              </div>
            </div>
          ) : (
            <div className="drop">
              <input type="file" onChange={handleSelectFile} />
              <i className="hb-ico drop-plus-ico" />
              <div>Select a file to upload</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

TitleWithImageBuilder.propTypes = {
  problemType: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  picture: PropTypes.string,
  onPictureChange: PropTypes.func.isRequired,
}

// Viewer
const TitleWithImageViewer = ({ title, picture }) => {
  const imgSrc = getQuestionImageUrl(picture)

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div
            className="review-title review-title__small text-center"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
      </div>
      {imgSrc && (
        <div className="row mb-15">
          <div className="col-lg-12 question-image-wrap">
            <img src={imgSrc} alt="" />
          </div>
        </div>
      )}
    </>
  )
}

TitleWithImageViewer.propTypes = {
  title: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
}

export { TitleWithImageBuilder, TitleWithImageViewer }
