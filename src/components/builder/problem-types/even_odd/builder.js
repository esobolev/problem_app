import { useState, useEffect, useCallback } from 'react'
import { Select } from 'src/components/select'
import { getRandomArbitrary, CUSTOM } from 'src/tools'

import { useBuilderStates } from 'src/hooks/useBuilderStates'
import { EvenOddViewer } from './viewer'
import { AnswerRadioButtons } from './answer_types'

import BuilderAttributes from '../common/builder_type'
import LayoutBuilder from '../common/layout_builder'

// const defaultTitles = [
//   'Is this number even or odd?',
//   'Check all the even numbers',
//   'Check all the odd numbers',
//   'Is there an even or an odd number in the picture?',
//   'Is the result of a math expression an even or an odd number?'
// ];

export const variantsData = {
  number: { label: 'Number', value: 'number' },
  image: { label: 'Image', value: 'image' },
  array_of_numbers: { label: 'Array of numbers', value: 'array_of_numbers' },
  math_expression: { label: 'Math Expression', value: 'math_expression' },
}

export const answersData = [
  { label: 'Even', value: 'even' },
  { label: 'Odd', value: 'odd' },
]

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

  // const [answerTrue, setAnswerTrue] = useState(answer_true || answersData[0].value)
  const [answerTrueItems, setAnswerTrueItems] = useState({
    0: 'odd',
    1: 'even',
  })

  const [variantType, setVariantType] = useState(variantsData.number.value)
  const [variants, setVariants] = useState({ main: 5 })
  const [images, setImages] = useState({ main: null })
  const [math, setMath] = useState({ main: '3 + 8' })

  const [items, setItems] = useState([{ value: 5 }, { value: 10 }])

  const updateExtra = () => {
    const type = variantType

    if (type === variantsData.number.value) {
      setExtra({ type, variants })
    } else if (type === variantsData.image.value) {
      setExtra({ type, images })
    } else if (type === variantsData.math_expression.value) {
      setExtra({ type, math })
    } else if (type === variantsData.array_of_numbers.value) {
      setExtra({ type, items })
    }
  }

  useEffect(() => {
    if (pExtra) {
      setExtra(pExtra)
      setVariantType(pExtra.type)

      console.log('useEffect', { pExtra })

      const { type } = pExtra

      if (type === variantsData.number.value) {
        setVariants(pExtra.variants)
      } else if (type === variantsData.image.value) {
        setImages(pExtra.images)
      } else if (type === variantsData.math_expression.value) {
        setMath(pExtra.math)
      } else if (type === variantsData.array_of_numbers.value) {
        setItems(pExtra.items)
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

  useEffect(() => {
    updateExtra()
  }, [variantType, variants, images, math, items])

  const setDefaultParams = () => {
    setDefaultBuilderParams()
    setExtra({ variants, type: variantType })
    setIsInitBuilder(true)
  }

  // UI Handlers

  const handleVariantTypeChange = (value) => {
    setVariantType(value)
  }

  const handleAnswerChange = (value) => () => {
    setAnswerTrue(value)
  }

  const handleItemChange = (i, value) => () => {
    setAnswerTrueItems({ ...answerTrueItems, [i]: value })
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

  const handleGenerateTimes = (e) => {
    e.preventDefault()

    if (variantType === variantsData.number.value) {
      const main = getRandomArbitrary(0, 99)

      setVariants({ main })
      setAnswerTrue(answersData[main % 2].value)
    } else if (variantType === variantsData.math_expression.value) {
      const left = getRandomArbitrary(0, 99)
      const right = getRandomArbitrary(0, 99)
      const operation = ['+', '-'][getRandomArbitrary(0, 1)]

      setMath({
        main: `${left > right ? left : right} ${operation} ${
          left > right ? right : left
        }`,
      })
    } else if (variantType === variantsData.array_of_numbers.value) {
      const answers = {}
      const newItems = items.map((_, i) => {
        const val = getRandomArbitrary(0, 50)
        answers[i] = val % 2 === 0 ? 'even' : 'odd'
        return { value: val }
      })
      console.log(newItems, answers)

      setAnswerTrueItems(answers)
      setItems(newItems)
    }
  }

  const handleAddRow = (e) => {
    e.preventDefault()
    setItems([...items, { label: '', value: '' }])
  }

  const handleRemoveRow = (idx) => (e) => {
    e.preventDefault()
    setItems(items.filter((item, i) => i !== idx))
  }

  const handleChangeRow = (idx, name) => (e) => {
    const newItems = items.map((item, i) =>
      i === idx ? { ...item, [name]: e.target.value } : item,
    )
    setItems(newItems)
  }

  const is = useCallback((val) => variantType === val, [variantType])

  const handleSelectFile = (name) => (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()

      reader.onloadend = function (e) {
        setImages({ ...images, [name]: e.target.result })
      }

      reader.readAsDataURL(e.target.files[0]) // convert to base64 string
    }
  }

  const handleRemoveFile = (name) => (e) => {
    e.preventDefault()
    setImages({ ...images, [name]: null })
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
      Viewer={EvenOddViewer}
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
            <a onClick={handleGenerateTimes} href="#">
              Generate
            </a>
          </span>
        </div>
        <div className="form-block">
          <div className="row form-group mb-15 ">
            <div className="col-lg-2">
              <label className="col-form-label">Type</label>
            </div>
            <div className="col-lg-4">
              <div className="input-block">
                <Select
                  placeholder="Type"
                  value={variantType}
                  onChange={(item) => {
                    handleVariantTypeChange(item.value)
                  }}
                  options={Object.values(variantsData)}
                />
              </div>
            </div>
          </div>

          {/* Numbers and images  */}
          {is(variantsData.number.value) && (
            <>
              <div className="row form-group mb-15">
                <div className="col-lg-2">
                  <label className="col-form-label">Number</label>
                </div>
                <div className="col-lg-2">
                  <div className="input-block">
                    <input
                      type="number"
                      value={variants?.main}
                      onChange={(e) => {
                        setVariants({ main: e.target.value })
                      }}
                    />
                  </div>
                </div>
              </div>

              <AnswerRadioButtons
                items={answersData}
                answerTrue={answerTrue}
                handleAnswerChange={handleAnswerChange}
              />
            </>
          )}

          {/* Image  */}
          {is(variantsData.image.value) && (
            <>
              <div className="row form-group mb-15">
                <div className="col-lg-2">
                  <label className="col-form-label">Image</label>
                </div>
                <div className="col-lg-2">
                  <div className="input-block">
                    {images.main ? (
                      <div className="thumb">
                        <div className="thumbInner">
                          <img src={extra?.images?.main} />
                          <a
                            onClick={handleRemoveFile('main')}
                            className="remove"
                            href="#"
                          >
                            <img src="/account/img/remove.svg" alt="" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="drop">
                        <input
                          type="file"
                          onChange={handleSelectFile('main')}
                        />
                        <i className="hb-ico drop-plus-ico" />
                        <span className="drop-title">
                          Select a file to upload
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <AnswerRadioButtons
                items={answersData}
                answerTrue={answerTrue}
                handleAnswerChange={handleAnswerChange}
              />
            </>
          )}

          {/* Math expression  */}
          {is(variantsData.math_expression.value) && (
            <>
              <div className="row form-group mb-15">
                <div className="col-lg-2">
                  <label className="col-form-label">Math expression</label>
                </div>
                <div className="col-lg-4">
                  <div className="input-block">
                    <input
                      type="text"
                      value={math.main}
                      onChange={(e) => {
                        setMath({ main: e.target.value })
                      }}
                    />
                  </div>
                </div>
              </div>

              <AnswerRadioButtons
                items={answersData}
                answerTrue={answerTrue}
                handleAnswerChange={handleAnswerChange}
              />
            </>
          )}

          {/* Array of numbers  */}
          {is(variantsData.array_of_numbers.value) && (
            <>
              <div className="row form-group mb-15">
                <div className="col-lg-2">
                  <label className="col-form-label">Variants</label>
                </div>
                <div className="col-lg-1">
                  <label className="col-form-label">Even?</label>
                </div>
                <div className="col-lg-1">
                  <label className="col-form-label">Odd?</label>
                </div>
              </div>

              <div className="row form-group mb-15">
                <div className="col-lg-2" />

                <div className="col-lg-10">
                  {items.map((item, i) => (
                    <div key={i} className="row form-group">
                      <div className="col-lg-1">
                        <div
                          className="input-block"
                          style={{ paddingTop: 8, paddingLeft: 8 }}
                        >
                          <div className="radio">
                            <input
                              type="radio"
                              name={`answerTrue[${i}]`}
                              value="even"
                              onChange={handleItemChange(i, 'even')}
                              checked={(answerTrueItems || {})[i] === 'even'}
                            />
                            <span className="radio-ico" />
                            <p>&nbsp;</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-1">
                        <div
                          className="input-block"
                          style={{ paddingTop: 8, paddingLeft: 8 }}
                        >
                          <div className="radio">
                            <input
                              type="radio"
                              name={`answerTrue[${i}]`}
                              value="odd"
                              onChange={handleItemChange(i, 'odd')}
                              checked={(answerTrueItems || {})[i] === 'odd'}
                            />
                            <span className="radio-ico" />
                            <p>&nbsp;</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-2">
                        <div className="input-block">
                          <input
                            className=""
                            value={item.value}
                            onChange={handleChangeRow(i, 'value')}
                          />
                        </div>
                      </div>

                      <div className="col-lg-1">
                        <div className="input-block" style={{ paddingTop: 10 }}>
                          <a onClick={handleRemoveRow(i)} href="#">
                            <img src="/account/img/remove.svg" alt="" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="row form-group">
                <div className="col-lg-2" />
                <div className="col-lg-1">
                  <div className="input-block">
                    <button onClick={handleAddRow} className="primary-btn">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </LayoutBuilder>
  )
}

Builder.propTypes = {
  ...BuilderAttributes,
}

export { Builder as EvenOddBuilder }
