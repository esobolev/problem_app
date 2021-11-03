import { useState, useEffect, useCallback } from 'react'
import { Select } from 'src/components/select'
import { useBuilderStates } from 'src/hooks/useBuilderStates'
import { getRandomArbitrary, times, CUSTOM, CUSTOM_BUTTONS } from 'src/tools'
import { uploadCustomButtonsImage } from 'src/services/api.service'
import { fetchImageCollections } from '../../services/image.collection'

import { CompareViewer } from './viewer'
import BuilderAttributes from '../common/builder_type'
import LayoutBuilder from '../common/layout_builder'

export const variantsData = {
  numbers: { label: 'Numbers', value: 'numbers' },
  images: { label: 'Images', value: 'images' },
  table: { label: 'Table', value: 'table' },
  fractions: { label: 'Fractions', value: 'fractions' },
  // colors: { label: 'Colors', value: 'colors' },
  // line: { label: 'Line numbers in order', value: 'line' },
}

export const wordButtons = [
  { label: 'is greater than', value: '>' },
  { label: 'is less than', value: '<' },
  { label: 'is equal than', value: '=' },
]

export const signButtons = [
  { label: '>', value: '>' },
  { label: '<', value: '<' },
  { label: '=', value: '=' },
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

  const [variantType, setVariantType] = useState(variantsData.numbers.value)
  const [variants, setVariants] = useState({ left: '10', right: '5' })
  const [images, setImages] = useState({ left: null, right: null })
  const [fractions, setFractions] = useState({ left: '1/2', right: '2/3' })
  const [fractionsError, setFractionsError] = useState({
    left: false,
    right: false,
  })

  const [themes, setThemes] = useState([])
  const [themeDictionary, setThemeDictionary] = useState({})
  const [asImages, setAsImages] = useState(false)
  const [collectionName, setCollectionName] = useState('')
  const [imagesView, setImagesView] = useState({ left: [], right: [] })

  const [resource, setResource] = useState('Bicycle')
  const [headers, setHeaders] = useState({
    label: 'Day',
    value: 'Number of Bicycle',
  })
  const [items, setItems] = useState([
    { label: 'Monday', value: '10' },
    { label: 'Thursday', value: '5' },
  ])
  const [digitType, setDigitType] = useState('arabic')

  useEffect(() => {
    console.log(problem_type, id, 'answerTrue', answerTrue)
  }, [id, problem_type, answerTrue])

  const is = useCallback((val) => variantType === val, [variantType])

  const isInvalidate = () => {
    // console.log('aa', fractionsError.left, fractionsError.right)

    if (is(variantsData.fractions.value)) {
      return fractionsError.left || fractionsError.right
    }

    return false
  }

  const updateExtra = () => {
    const rest = {
      type: variantType,
      buttons,
      buttonsType,
    }

    if (is(variantsData.numbers.value)) {
      setExtra({
        ...rest,
        variants,
        asImages,
        imagesView,
        collectionName,
        digitType,
      })
    } else if (is(variantsData.images.value)) {
      setExtra({
        ...rest,
        images,
      })
    } else if (is(variantsData.table.value)) {
      setExtra({
        ...rest,
        resource,
        headers,
        items,
      })
    } else if (is(variantsData.fractions.value)) {
      setExtra({
        ...rest,
        fractions,
      })
    }
  }

  useEffect(() => {
    const fetch = async () => {
      const { names, collections } = await fetchImageCollections()

      setThemeDictionary(names)
      setThemes(collections)

      if ((Object.keys(collections) || []).length > 0) {
        setCollectionName(Object.keys(collections)[0])
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    console.log('pExtra', answer_true, pExtra)

    try {
      setTitle(question)
      setPicture(question_picture)
      setHint(pHint)
      setHintPicture(pHintPicture)
      setSolution(pSolution)
      setSolutionPicture(pSolutionPicture)
      answer_true && setAnswerTrue(String(answer_true))

      if (pExtra.type) {
        setExtra(pExtra)
        setVariantType(pExtra.type)
        setDigitType(pExtra.digitType || 'arabic')

        if (pExtra.type === variantsData.table.value) {
          setItems(pExtra.items)
          setHeaders(pExtra.headers)
          setResource(pExtra.resource)
        } else if (pExtra.type === variantsData.numbers.value) {
          setVariants(pExtra.variants)
          setAsImages(pExtra.asImages)
          setImagesView(pExtra.imagesView)
          setCollectionName(pExtra.collectionName)
        } else if (pExtra.type === variantsData.images.value) {
          setImages(pExtra.images)
        } else if (pExtra.type === variantsData.fractions.value) {
          setFractions(pExtra.fractions)
        }

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
    updateExtra()
  }, [
    variantType,
    variants,
    fractions,
    images,
    items,
    resource,
    headers,
    asImages,
    imagesView,
    buttons,
    digitType,
  ])

  useEffect(() => {
    shuffleImages()
  }, [variantType, variants, asImages, collectionName])

  useEffect(() => {
    calcRightAnswer()
  }, [variants])

  useEffect(() => {
    validateFractionValues()
  }, [fractions.left, fractions.right])

  useEffect(() => {
    calcRightAnswer()
  }, [fractionsError])

  const setDefaultParams = () => {
    setDefaultBuilderParams()

    setVariantType(variantsData.numbers.value)
    setVariants({ left: '10', right: '5' })
    setImages({ left: null, right: null })
    setFractions({ left: '1/2', right: '2/3' })
    setFractionsError({ left: false, right: false })

    setIsInitBuilder(true)
  }

  const handleVariantTypeChange = (value) => {
    setVariantType(value)
  }

  const handleItemChange = (value) => () => {
    setAnswerTrue(value)
  }

  const calcRightAnswer = () => {
    if (answer_type === CUSTOM_BUTTONS) return

    console.log('calcRightAnswer', answer_type, variantsData.numbers.value)

    if (is(variantsData.numbers.value)) {
      const left = Number(variants.left)
      const right = Number(variants.right)

      if (left > right) {
        setAnswerTrue(signButtons[0].value)
      } else if (left < right) {
        setAnswerTrue(signButtons[1].value)
      } else {
        setAnswerTrue(signButtons[2].value)
      }
    } else if (is(variantsData.fractions.value)) {
      setAnswerTrue('?')

      if (fractionsError.left || fractionsError.right) return

      const [leftDivider, leftDenominator] = fractions.left.split('/')
      const [rightDivider, rightDenominator] = fractions.right.split('/')

      if (
        Number(leftDivider) * Number(rightDenominator) >
        Number(rightDivider) * Number(leftDenominator)
      ) {
        setAnswerTrue(signButtons[0].value)
      } else if (
        Number(leftDivider) * Number(rightDenominator) <
        Number(rightDivider) * Number(leftDenominator)
      ) {
        setAnswerTrue(signButtons[1].value)
      } else {
        setAnswerTrue(signButtons[2].value)
      }
    }
  }

  const handleGenerateTimes = (e) => {
    e.preventDefault()

    if (variantType === variantsData.numbers.value) {
      const left = getRandomArbitrary(0, 100)
      const right = getRandomArbitrary(0, 100)

      setVariants({ left, right })
    } else if (variantType === variantsData.table.value) {
      let max = -1

      const newItems = items.map((item) => {
        const val = getRandomArbitrary(0, 50)
        max = val > max ? val : max
        return { ...item, value: val }
      })

      setAnswerTrue(max)
      setItems(newItems)
    } else if (variantType === variantsData.fractions.value) {
      const leftDivider = getRandomArbitrary(1, 10)
      const leftDenominator = getRandomArbitrary(leftDivider, 10)

      const rightDivider = getRandomArbitrary(1, 10)
      const rightDenominator = getRandomArbitrary(rightDivider, 10)

      setFractions({
        left: `${leftDivider}/${leftDenominator}`,
        right: `${rightDivider}/${rightDenominator}`,
      })
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

  // const handleSelectFile = (name) => (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const reader = new FileReader();

  //     reader.onloadend = function(e) {
  //       setImages({ ...images, [name]: e.target.result })
  //     }

  //     reader.readAsDataURL(e.target.files[0]); // convert to base64 string
  //   }
  // }

  const handleSelectFile = (name) => (event) => {
    const file = event.target.files[0]

    const reader = new FileReader()
    reader.onloadend = async function (e) {
      const result = await uploadCustomButtonsImage({
        images: [e.target.result],
      })

      setButtonImages([...buttonImages, ...result.data.items])
      setImages({ ...images, [name]: result.data.items[0] })
    }

    // Read the image
    reader.readAsDataURL(file)
  }

  const handleRemoveFile = (name) => (e) => {
    e.preventDefault()
    setImages({ ...images, [name]: null })
  }

  const validateFractionValues = () => {
    const validation = {
      left: !/^\d+\/\d+$/.test(fractions.left) && !/^\d+$/.test(fractions.left),
      right:
        !/^\d+\/\d+$/.test(fractions.right) && !/^\d+$/.test(fractions.right),
    }

    console.log('validation', validation)

    setFractionsError(validation)
  }

  const handleFractionInputChange = (position) => (e) => {
    const { value } = e.target

    setFractions({
      ...fractions,
      [position]: value,
    })
  }

  const handleCollectionChange = (value) => {
    setCollectionName(value)
  }

  const handleAsImages = (e) => {
    // e.preventDefault()
    setAsImages(!asImages)
  }

  const handleRefresh = () => {
    shuffleImages()
  }

  const shuffleImages = () => {
    const collection = themes[collectionName]

    if (!collection) return

    const prefixUrl = `${process.env.REACT_APP_S3_HOST}/image_collection`

    const imgView = {
      left: times(variants.left)
        .map(() => getRandomArbitrary(0, collection.length - 1))
        .map((idx) => `${prefixUrl}/${collectionName}/${collection[idx]}`),
      right: times(variants.right)
        .map(() => getRandomArbitrary(0, collection.length - 1))
        .map((idx) => `${prefixUrl}/${collectionName}/${collection[idx]}`),
    }

    console.log('imgView', imgView)

    setImagesView(imgView)
  }

  const handleSave = async () => {
    if (isInvalidate()) {
      alert('Check filled params')
      return
    }

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

  const onChangeDigitType = (e) => {
    setDigitType(e.target.value)
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
      Viewer={CompareViewer}
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
      <div className="block-title">
        Visual line
        <span>
          {' '}
          or{' '}
          <a onClick={handleGenerateTimes} href="#">
            Generate
          </a>
        </span>
      </div>
      <div className="form-block">
        <div className="row form-group mb-15">
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

          <div className="col-3">
            <div className="radio mt-15">
              <input
                type="radio"
                value="arabic"
                onChange={onChangeDigitType}
                checked={digitType === 'arabic'}
              />
              <span className="radio-ico" />
              <p>Modern/Arabic</p>
            </div>
          </div>
          <div className="col-3">
            <div className="radio mt-15">
              <input
                type="radio"
                value="roman"
                onChange={onChangeDigitType}
                checked={digitType === 'roman'}
              />
              <span className="radio-ico" />
              <p>Roman</p>
            </div>
          </div>
        </div>

        {/* Numbers */}
        {is(variantsData.numbers.value) && (
          <>
            <div className="row form-group mb-15">
              <div className="col-lg-2">
                <label className="col-form-label">Numbers</label>
              </div>
              <div className="col-lg-2">
                <div className="input-block">
                  <input
                    type="number"
                    value={variants?.left}
                    onChange={(e) => {
                      setVariants({ ...variants, left: e.target.value })
                    }}
                    className={variants?.left === '' ? 'error-color' : ''}
                  />
                </div>
              </div>
              <div className="col-lg-2">
                <div className="input-block text-justify">
                  <input
                    disabled
                    className=""
                    value={answerTrue}
                    style={{
                      backgroundColor: '#eaeaea',
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: 18,
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-2">
                <div className="input-block">
                  <input
                    type="number"
                    value={variants?.right}
                    onChange={(e) => {
                      setVariants({ ...variants, right: e.target.value })
                    }}
                    className={variants?.right === '' ? 'error-color' : ''}
                  />
                </div>
              </div>
            </div>

            <div className="row form-group">
              <div className="col-lg-2">
                <label className="col-form-label">Options</label>
              </div>
              <div className="col-lg-3">
                <div className="col-form-label">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      checked={asImages}
                      onChange={handleAsImages}
                    />
                    <i className="checkbox-ico" />
                    as images
                  </div>
                </div>
              </div>
            </div>

            {asImages && (
              <div className="row form-group mt-15 mb-15">
                <div className="col-lg-2">
                  <label className="col-form-label">Themes</label>
                </div>
                <div className="col-lg-3">
                  <div className="input-block">
                    <Select
                      placeholder="Collection"
                      value={collectionName}
                      onChange={(item) => {
                        handleCollectionChange(item.value)
                      }}
                      options={Object.keys(themeDictionary).map((x) => ({
                        label: themeDictionary[x],
                        value: x,
                      }))}
                    />
                  </div>
                </div>
                <div className="col-lg-1">
                  <button
                    onClick={handleRefresh}
                    className="second-btn"
                    type="button"
                  >
                    Shuffle
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Images */}
        {is(variantsData.images.value) && (
          <>
            <div className="row form-group mb-15">
              <div className="col-lg-2">
                <label className="col-form-label">Variants</label>
              </div>
              <div className="col-lg-2">
                <div className="input-block">
                  {images.left ? (
                    <div className="thumb">
                      <div className="thumbInner">
                        <img
                          src={`${process.env.REACT_APP_S3_HOST}/${extra?.images?.left}`}
                        />
                        <a
                          onClick={handleRemoveFile('left')}
                          className="remove"
                          href="#"
                        >
                          <img src="/account/img/remove.svg" alt="" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="drop">
                      <input type="file" onChange={handleSelectFile('left')} />
                      <i className="hb-ico drop-plus-ico" />
                      <span className="drop-title">
                        Select a file to upload
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-2">
                <div className="input-block text-justify">
                  <input
                    disabled
                    className=""
                    value={answerTrue}
                    style={{
                      backgroundColor: '#eaeaea',
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: 18,
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-2">
                <div className="input-block">
                  {images.right ? (
                    <div className="thumb">
                      <div className="thumbInner">
                        <img
                          src={`${process.env.REACT_APP_S3_HOST}/${extra?.images?.right}`}
                        />
                        <a
                          onClick={handleRemoveFile('right')}
                          className="remove"
                          href="#"
                        >
                          <img src="/account/img/remove.svg" alt="" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="drop">
                      <input type="file" onChange={handleSelectFile('right')} />
                      <i className="hb-ico drop-plus-ico" />
                      <span className="drop-title">
                        Select a file to upload
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row form-group">
              <div className="col-lg-2">
                <label className="col-form-label">Answer true</label>
              </div>

              {wordButtons.map((item) => (
                <div
                  key={item.value}
                  className="radio col-lg-2"
                  style={{ marginLeft: 20, marginTop: 5 }}
                >
                  <div className="input-block">
                    <input
                      type="radio"
                      name="answerTrue"
                      value={item.value}
                      onChange={handleItemChange(item.value)}
                      checked={answerTrue === item.value}
                    />
                    <span className="radio-ico" />
                    <p>{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Table  */}
        {is(variantsData.table.value) && (
          <>
            <div className="row form-group mb-15">
              <div className="col-lg-2">
                <label className="col-form-label">Headers</label>
              </div>
              <div className="col-lg-10">
                <div className="row form-group mb-15">
                  <div className="col-lg-10">
                    <div className="input-block">
                      <input
                        className=""
                        value={resource}
                        onChange={(e) => {
                          setResource(e.target.value)
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="row form-group mb-15">
                  <div className="col-lg-5">
                    <div className="input-block">
                      <input
                        className=""
                        value={headers.label}
                        onChange={(e) => {
                          setHeaders({ ...headers, label: e.target.value })
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="input-block">
                      <input
                        className=""
                        value={headers.value}
                        onChange={(e) => {
                          setHeaders({ ...headers, value: e.target.value })
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row form-group mb-15">
              <div className="col-lg-2">
                <label className="col-form-label">Variants</label>
              </div>

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
                            name="answerTrue"
                            value={item.value}
                            onChange={handleItemChange(item.value)}
                            checked={String(answerTrue) === String(item.value)}
                          />
                          <span className="radio-ico" />
                          <p>&nbsp;</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="input-block">
                        <input
                          className=""
                          value={item.label}
                          onChange={handleChangeRow(i, 'label')}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
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

        {/* Fractions */}
        {is(variantsData.fractions.value) && (
          <div className="row form-group">
            <div className="col-lg-2">
              <label className="col-form-label">Fractions</label>
            </div>
            <div className="col-lg-2">
              <div className="input-block">
                <input
                  type="text"
                  value={fractions?.left}
                  onChange={handleFractionInputChange('left')}
                  className={fractionsError.left ? 'error-color' : ''}
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="input-block text-justify">
                <input
                  disabled
                  className=""
                  value={answerTrue}
                  style={{
                    backgroundColor: '#eaeaea',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="input-block">
                <input
                  type="text"
                  value={fractions?.right}
                  onChange={handleFractionInputChange('right')}
                  className={fractionsError.right === '' ? 'error-color' : ''}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutBuilder>
  )
}

Builder.propTypes = {
  ...BuilderAttributes,
}

export { Builder as CompareBuilder }
