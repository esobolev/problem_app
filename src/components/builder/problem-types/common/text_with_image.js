import { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { getQuestionImageUrl, getImages } from 'src/tools'
import { uploadEditorSolutionImage } from 'src/services/api.service'

// Builder
const TextWithImageBuilder = ({
  full = false,
  title,
  onTitleChange,
  picture,
  onPictureChange,

  // images = [],
  // setImages = () => {},
}) => {
  const [text, setText] = useState(EditorState.createEmpty())
  const [isInit, setIsInit] = useState(false)

  // const [images, setImages] = useState([])

  useEffect(() => {
    if (!title) return
    if (isInit) return

    textToEditorState(title)
    setIsInit(true)
  }, [title])

  const handleTextChange = (editorState) => {
    setText(editorState)
    onTitleChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }
  /*
  const handleSelectFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onloadend = function(e) {
        onPictureChange(e.target.result)
      }

      reader.readAsDataURL(e.target.files[0]);
    }
  }

  const handleRemoveFile = (e) => {
    e.preventDefault()
    onPictureChange(null)
  }
*/
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

  // Images

  // console.log(title, 'out =>', images)
  const uploadSummaryCallback = useCallback(
    (file) =>
      // console.log(title, 'In useCallback =>', images)

      new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onloadend = async () => {
          try {
            const formData = { images: [reader.result] }

            const response = await uploadEditorSolutionImage(formData)

            const url = Array.isArray(response.data.items)
              ? response.data.items[0]
              : ''

            // console.log(title, 'images', images)
            // setImages([...images, url])

            // let imgs = getImages(title);
            // imgs = imgs.map(x => x.replace(`${process.env.REACT_APP_S3_HOST}/`, ''))
            // setImages(imgs)

            resolve({
              data: {
                link: `${process.env.REACT_APP_S3_HOST}/${url}`,
              },
            })
          } catch (error) {
            reject(error)
          }
        }

        reader.readAsDataURL(file)
      }),
    [],
  )

  const configEditor = {
    options: ['inline'],
    inline: {
      options: ['bold', 'italic', 'underline'],
    },
  }

  const configEditorFull = {
    image: {
      urlEnabled: false,
      uploadCallback: uploadSummaryCallback,
      previewImage: true,
      alt: { present: true, mandatory: false },
      inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
    },
  }

  return (
    <div className="block">
      <div className="row">
        <div className="col-lg-12">
          <Editor
            editorState={text}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={handleTextChange}
            toolbar={full ? configEditorFull : configEditor}
          />
        </div>
        {/* <div className='col-lg-2'>
          {picture
            ? (
              <div className='thumb'>
                <div className='thumbInner'>
                <img src={imgSrc} alt='' />
                  <a onClick={handleRemoveFile} className='remove' href='#'><img src='/account/img/remove.svg' alt='' /></a>
                </div>
              </div>
            ) : (
            <div className="drop">
              <input type="file" onChange={handleSelectFile} />
              <i className="hb-ico drop-plus-ico"></i>
              <div>Select a file to upload</div>
            </div>
          )}
        </div> */}
      </div>
    </div>
  )
}

TextWithImageBuilder.propTypes = {
  full: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  picture: PropTypes.string,
  onPictureChange: PropTypes.func.isRequired,

  images: PropTypes.arrayOf(PropTypes.string),
  setImages: PropTypes.func,
}

export { TextWithImageBuilder }
