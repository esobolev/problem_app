import { useEffect } from 'react'
import PropTypes from 'prop-types'

import {
  // getRandomArbitrary,
  // times,
  // shuffle,
  // CUSTOM_BUTTONS,
  EVEN_ODD,
  TRUE_FALSE,
  CUSTOM,
  IMAGES,
} from 'src/tools'
import { uploadCustomButtonsImage } from 'src/services/api.service'

const CustomButtonsBuilder = ({
  buttonsType = EVEN_ODD,
  setButtonsType,
  buttons = [],
  setButtons,
  buttonImages,
  setButtonImages,
  generatedButtons,
  answerTrue,
  setAnswerTrue,
  isValid,
  setIsValid,
}) => {
  const defaultItem = { label: '0', value: '0', hidden: false, img: '' }

  useEffect(() => {
    let newButtons = []

    if (buttonsType === EVEN_ODD) {
      newButtons = [
        { label: 'Even', value: 'even' },
        { label: 'Odd', value: 'odd' },
      ]
    } else if (buttonsType === TRUE_FALSE) {
      newButtons = [
        { label: 'True', value: 'true' },
        { label: 'False', value: 'false' },
      ]
    } else if (buttonsType === CUSTOM) {
      newButtons =
        (generatedButtons || []).length > 0
          ? [...generatedButtons]
          : [
              { label: '1', value: '1', hidden: false },
              { label: '2', value: '2', hidden: false },
            ]
    } else if (buttonsType === IMAGES) {
      newButtons =
        (generatedButtons || []).length > 0 ? [...generatedButtons] : []
    } else {
      newButtons = []
    }

    setButtons(newButtons)
    // setAnswerTrue(null)
  }, [buttonsType, generatedButtons])

  useEffect(() => {
    console.log('Check', buttons, String(answerTrue))

    if (!answerTrue) {
      setIsValid(false)
      return
    }

    if (Array.isArray(answerTrue)) {
      setIsValid(answerTrue.length > 0)
    } else {
      const valid = !!buttons.find(
        (x) => String(x.value) === String(answerTrue),
      )
      setIsValid(valid)
    }
  }, [answerTrue, buttonsType, buttons])

  const handleItemChange = (index) => (e) => {
    e.preventDefault()
    const newItems = [...buttons]
    newItems[index] = {
      label: String(e.target.value),
      value: String(e.target.value),
    }
    console.log('newItems', newItems)
    setButtons(newItems)
  }

  const handleRemoveClick = (index) => (e) => {
    e.preventDefault()
    const newItems = buttons.filter((_, i) => i !== index)
    setButtons(newItems)
  }

  const handleAddClick = () => {
    setButtons([...buttons, defaultItem])
  }

  const handleSingleCorrectClick = (value) => (e) => {
    e.preventDefault()
    const strValue = String(value)
    setAnswerTrue(strValue)
  }

  const handleCorrectClick = (value) => (e) => {
    e.preventDefault()

    const strValue = String(value)
    console.log(answerTrue, strValue)

    if (Array.isArray(answerTrue)) {
      if (answerTrue.includes(strValue)) {
        const newAnswer = answerTrue.filter((x) => String(x) !== strValue)

        if (newAnswer.length == 1) {
          setAnswerTrue(newAnswer[0])
        } else {
          setAnswerTrue(newAnswer)
        }
      } else {
        setAnswerTrue([...answerTrue, strValue])
      }
    } else if (!answerTrue) {
      setAnswerTrue(strValue)
    } else if (String(answerTrue) !== strValue) {
      setAnswerTrue([answerTrue, strValue])
    }
  }
  /*
  const handleSelectFile = (i) => (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onloadend = function(e) {
        // onPictureChange(e.target.result)
        let newButtons = [...buttons]
        newButtons[i] = { label: '', value: i, img: e.target.result }
        newButtons = newButtons.map((x, i) => ({ ...x, value: i }))
        setButtons(newButtons)
      }

      reader.readAsDataURL(e.target.files[0]);
    }
  }
*/
  const handleMultiSelectFile = async (event) => {
    const files = [...event.target.files]
    const loadedFiles = []

    console.log('files', files)

    await Promise.all(
      files.map(
        async (file) =>
          new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = function (e) {
              loadedFiles.push(e.target.result)
              resolve()
            }

            // Read the image
            reader.readAsDataURL(file)
          }),
      ),
    )

    console.log('loadedFiles', loadedFiles)
    const result = await uploadCustomButtonsImage({ images: loadedFiles })

    let newButtons = [...buttons]
    // const last = newButtons.pop()
    newButtons = [
      ...newButtons,
      ...result.data.items.map((x, i) => ({
        label: '',
        value: buttons.length + i,
        img: `${process.env.REACT_APP_S3_HOST}/${x}`,
      })),
      // last,
    ]

    // newButtons = [...result.data.items]

    newButtons = newButtons.map((x, i) => ({ ...x, value: i }))
    console.log(newButtons)
    setButtons(newButtons)

    setButtonImages([...buttonImages, ...result.data.items])
  }

  const handleRemoveFile = (idx) => (e) => {
    e.preventDefault()
    let newButtons = [...buttons]
    newButtons = newButtons.filter((x, i) => i !== idx)

    newButtons = newButtons.map((x, i) => ({ ...x, value: i }))
    setButtons(newButtons)

    if (Array.isArray(answerTrue)) {
      let newAnswerTrue = answerTrue.filter((x) => String(x) !== String(idx))
      newAnswerTrue = newAnswerTrue.map((x) =>
        Number(x) <= Number(idx) ? String(x) : String(Number(x) - 1),
      )
      console.log('newAnswerTrue', newAnswerTrue)
      setAnswerTrue(newAnswerTrue)
    } else if (String(answerTrue) === String(idx)) {
      setAnswerTrue(null)
    }
  }

  const isPressed = (answerTrue, value) =>
    // console.log('isPressed', answerTrue, value)
    Array.isArray(answerTrue)
      ? answerTrue.includes(String(value))
      : String(answerTrue) === String(value)

  return (
    <>
      <div className="row form-group mb-15">
        <div className="col-lg-2">
          <div className="input-block">Buttons Type</div>
        </div>
        <div className="col-lg-2">
          <div className="input-block">
            <div className="radio">
              <input
                type="radio"
                name="buttons_type"
                onChange={(e) => {
                  setButtonsType(e.target.value)
                }}
                value={EVEN_ODD}
                checked={buttonsType === EVEN_ODD}
              />
              <span className="radio-ico" />
              <p>Even/Odd</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <div className="input-block">
            <div className="radio">
              <input
                type="radio"
                name="buttons_type"
                onChange={(e) => {
                  setButtonsType(e.target.value)
                }}
                value={TRUE_FALSE}
                checked={buttonsType === TRUE_FALSE}
              />
              <span className="radio-ico" />
              <p>True/False</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <div className="input-block">
            <div className="radio">
              <input
                type="radio"
                name="buttons_type"
                onChange={(e) => {
                  setButtonsType(e.target.value)
                }}
                value={CUSTOM}
                checked={buttonsType === CUSTOM}
              />
              <span className="radio-ico" />
              <p>Custom</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2">
          <div className="input-block">
            <div className="radio">
              <input
                type="radio"
                name="buttons_type"
                onChange={(e) => {
                  setButtonsType(e.target.value)
                }}
                value={IMAGES}
                checked={buttonsType === IMAGES}
              />
              <span className="radio-ico" />
              <p>Images</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row form-group">
        <div className="col-lg-2 pt-20">
          <div className="input-block">Buttons</div>
        </div>
        <div className="col-lg-10">
          <div className="builder-form mlr-10">
            {[EVEN_ODD, TRUE_FALSE].includes(buttonsType) && (
              <>
                {buttons.map((x, i) => (
                  <div className="wrap-item" key={`item-${i}`}>
                    <span className="item">{x.label}</span>

                    <div className="column-btns">
                      <button
                        type="button"
                        className={`second-btn ${
                          String(answerTrue) === String(x.value)
                            ? 'btn-active'
                            : ''
                        }`}
                        onClick={handleSingleCorrectClick(x.value)}
                      >
                        true
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {CUSTOM === buttonsType && (
              <>
                {buttons.map((x, i) => (
                  <div className="wrap-item" key={`item-${i}`}>
                    <input
                      onChange={handleItemChange(i)}
                      className="item"
                      value={x.value}
                    />

                    <div className="column-btns">
                      <button
                        type="button"
                        className={`second-btn ${
                          isPressed(answerTrue, x.value) ? 'btn-active' : ''
                        }`}
                        onClick={handleCorrectClick(x.value)}
                      >
                        true
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {IMAGES === buttonsType && (
              <div className="custom-buttons-images">
                {buttons.map((x, i) => (
                  <div key={`k-${i}`}>
                    {x.img && (
                      <div className="thumb">
                        <div className="thumbInner">
                          <img src={x.img} alt="" />
                          <a
                            onClick={handleRemoveFile(i)}
                            className="remove"
                            href="#"
                          >
                            <img src="/account/img/remove.svg" alt="" />
                          </a>
                        </div>

                        <button
                          type="button"
                          className={`second-btn ${
                            isPressed(answerTrue, x.value) ? 'btn-active' : ''
                          }`}
                          onClick={handleCorrectClick(x.value)}
                        >
                          true
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div key="add" className="drop">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    // onChange={handleSelectFile(i)}
                    onChange={handleMultiSelectFile}
                  />
                  <i className="hb-ico drop-plus-ico" />
                  <div>Select a file(s) to upload</div>
                </div>
              </div>
            )}

            {buttonsType === CUSTOM && (
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
                  onClick={handleRemoveClick(buttons.length - 1)}
                  type="button"
                >
                  -
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isValid && (
        <div className="row form-group mt-15">
          <div className="col-lg-12">
            <div className="input-block">
              <span className="error">Click true to chose correct answer</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

CustomButtonsBuilder.propTypes = {
  buttonsType: PropTypes.string.isRequired,
  setButtonsType: PropTypes.func.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.object),
  setButtons: PropTypes.func.isRequired,
  buttonImages: PropTypes.arrayOf(PropTypes.object),
  setButtonImages: PropTypes.func.isRequired,
  generatedButtons: PropTypes.arrayOf(PropTypes.object),
  answerTrue: PropTypes.string.isRequired,
  setAnswerTrue: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  setIsValid: PropTypes.func.isRequired,
}

export default CustomButtonsBuilder
