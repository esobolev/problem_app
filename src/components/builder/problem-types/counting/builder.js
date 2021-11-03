import { useState, useEffect, useCallback } from 'react'
import { Select } from 'src/components/select'
import {
  getRandomArbitrary,
  times,
  CUSTOM_BUTTONS,
  CUSTOM,
  IMAGES,
} from 'src/tools'
import { useBuilderStates } from 'src/hooks/useBuilderStates'

import { fetchImageCollections } from '../../services/image.collection'
import { CountingViewer } from './viewer'

import BuilderAttributes from '../common/builder_type'
import LayoutBuilder from '../common/layout_builder'

export const MIX_VALUE = -1

export const variantsData = {
  counting_up_to_10: {
    label: 'Counting by one',
    value: 'counting_up_to_10',
    groupBy: 1,
    max: 50,
  },
  counting_by_twos: {
    label: 'Counting by twos',
    value: 'counting_by_twos',
    groupBy: 2,
    max: 50,
  },
  counting_by_fives: {
    label: 'Counting by fives',
    value: 'counting_by_fives',
    groupBy: 5,
    max: 50,
  },
  counting_by_tens: {
    label: 'Counting by tens',
    value: 'counting_by_tens',
    groupBy: 10,
    max: 100,
  },
  lego_bricks: {
    label: 'Toy blocks',
    value: 'lego_bricks',
    groupBy: 1,
    max: 100,
  },
  only_question_and_image: {
    label: 'Only question and image',
    value: 'only_question_and_image',
  },
}

export const defaultVariants = { main: 0 }
export const defaultVariantType = variantsData.counting_up_to_10.value
export const defaultExtra = {
  type: defaultVariantType,
  variants: defaultVariants,
  collectionName: '',
  images: [],
  groupBy: 1,
  buttons: [],
  buttonsType: CUSTOM,
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

  const [themes, setThemes] = useState([])
  const [themeDictionary, setThemeDictionary] = useState({})
  const [max, setMax] = useState(50)

  const [variantType, setVariantType] = useState(null)
  const [collectionName, setCollectionName] = useState('')
  const [imagePattern, setImagePatternChange] = useState(MIX_VALUE)
  const [images, setImages] = useState([])

  const [variants, setVariants] = useState({ main: null })

  // console.log('IDD', id, answer_true, isInitBuilder)

  const updateExtra = () => {
    const groupBy = getGroupBy()

    const newExtra = {
      type: variantType,
      variants, // : Number(variants.main) > max ? { main: max } : variants,
      collectionName,
      images,
      groupBy,
      buttons,
      buttonsType,
    }

    // console.log('updateExtra', newExtra)
    setExtra(newExtra)
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
    console.log('pExtra', pExtra)

    try {
      setTitle(question)
      setPicture(question_picture)
      setHint(pHint)
      setHintPicture(pHintPicture)
      setSolution(pSolution)
      setSolutionPicture(pSolutionPicture)

      const {
        type,
        collectionName,
        images,
        variants,
        // buttonsType,
        // buttons,
      } = pExtra

      // console.log('answer_true::: ', pExtra.buttonsType, IMAGES, answer_true)
      if (pExtra?.buttonsType === IMAGES) {
        console.log(IMAGES, String(answer_true).split(','))
        setAnswerTrue(String(answer_true).split(','))
      } else {
        setAnswerTrue(String(answer_true))
      }

      setExtra(pExtra)

      if (type && collectionName) {
        setVariantType(type)
        setCollectionName(collectionName)
        setImages(images)

        if (answer_true) {
          setVariants({ main: answer_true })
        } else {
          // let main = getRandomMain()
          const main = 0
          setVariants(variants || { main })
        }

        setButtonsType(pExtra?.buttonsType || CUSTOM)
        setButtons(pExtra?.buttons || [])
        setGeneratedButtons(pExtra?.buttons || [])

        setIsInitBuilder(true)
      } else {
        setDefaultParams()
      }
    } catch (error) {
      console.log(error)
      setDefaultParams()
    }
  }, [
    problem_type,
    answer_type,
    question,
    question_picture,
    answer_true,
    pExtra,
  ])

  useEffect(() => {
    updateExtra()
  }, [variantType, variants.main, collectionName, images, buttons])

  useEffect(() => {
    shuffleImages()
  }, [variantType, variants, collectionName])

  useEffect(() => {
    if (
      !variants.main ||
      answer_type === CUSTOM_BUTTONS ||
      answer_type === IMAGES
    )
      return

    setAnswerTrue(String(variants.main))
  }, [variants.main])

  useEffect(() => {
    const max = variantsData[variantType]?.max || 50

    setMax(max)

    if (Number(variants.main) > max) {
      setVariants({ main: max })
    }
  }, [variantType])

  useEffect(() => {
    if (pExtra?.buttonsType !== buttonsType && buttonsType !== null) {
      setAnswerTrue(null)
    }
  }, [buttonsType])

  const is = useCallback((val) => variantType === val, [variantType])

  const isInvalidate = () => {
    let invalid = false

    invalid = variants?.main > max && answerTrue

    return invalid
  }

  const setDefaultParams = () => {
    setDefaultBuilderParams()
    const main = 0 // getRandomMain()

    setVariantType(defaultVariantType)
    // setCollectionName('')
    setImages([])
    setVariants({ main })
    setExtra({ variants: { main }, type: defaultVariantType })
    setIsInitBuilder(true)
  }

  const getGroupBy = () => {
    const groupBy = variantsData[variantType]?.groupBy || 1
    return groupBy
  }

  const getRandomMain = () => {
    let main = 0

    if (variantType === variantsData.counting_up_to_10.value) {
      main = getRandomArbitrary(1, 10)
    } else if (variantType === variantsData.counting_by_twos.value) {
      main = getRandomArbitrary(5, 50)
    } else if (variantType === variantsData.counting_by_fives.value) {
      main = getRandomArbitrary(12, 50)
    } else if (variantType === variantsData.counting_by_tens.value) {
      main = getRandomArbitrary(15, 100)
    }

    return main
  }

  const shuffleImages = () => {
    const groupBy = getGroupBy()

    const collection = themes[collectionName]

    if (!collection) return []

    const randomize = times(groupBy).map((_) =>
      getRandomArbitrary(0, collection?.length - 1 || 0),
    )

    const newImages = times(variants.main).map((_, i) => {
      const r = getRandomArbitrary(0, collection.length - 1)

      let idx = 0
      if (imagePattern === MIX_VALUE) {
        idx = groupBy > 1 ? randomize[i % groupBy] : r
      } else {
        idx = imagePattern
      }

      const prefixUrl = `${process.env.REACT_APP_S3_HOST}/image_collection`
      const url = `${prefixUrl}/${collectionName}/${collection[idx]}`
      return url
    })

    setImages(newImages)

    return newImages
  }

  const handleVariantTypeChange = (value) => {
    setVariantType(value)
  }

  const handleCollectionChange = (value) => {
    setCollectionName(value)
    setImagePatternChange(MIX_VALUE)
  }

  const handleSave = async () => {
    if (isInvalidate()) {
      alert('Fix error')
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

  const handleGenerateTimes = (e) => {
    e.preventDefault()

    const main = getRandomMain()

    setVariants({ main })
  }

  const handleRefresh = () => {
    shuffleImages()
  }

  const handleNumberChange = (e) => {
    if (!e.target.value) {
      setVariants({ main: '' })
      return
    }

    let num = Number(e.target.value) > max ? max : Number(e.target.value)

    if (Number(e.target.value) <= 0) {
      num = 0
    }

    setVariants({ main: num })
  }

  /*
  const generateAnswers = () => {
    let customButtons = [ Number(variants.main) ];

    times(buttonsCount - 1).forEach(_ => {
      let r;
      do {
        const min = Number(variants.main) - 5 < 1 ? 1 : Number(variants.main) - 5;

        r = getRandomArbitrary(min, min + 10)
        console.log(r, customButtons)
      } while(customButtons.includes(r));

      customButtons = [...customButtons, r]
    })

    console.log('customButtons', customButtons)

    // setButtons(shuffle(customButtons).map(x => ({ label: x, value: x })))


    // setButtons(customButtons.sort((a, b) => a - b).map(x => ({ label: x, value: x })))

    setGeneratedButtons(customButtons.sort((a, b) => a - b).map(x => ({ label: x, value: x })))
  }
  */

  // const handleAnswerGenerate = (e) => {
  //   e.preventDefault();
  //   generateAnswers()
  // }

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
      Viewer={CountingViewer}
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
        </div>

        {/* Numbers and images  */}
        {(is(variantsData.counting_up_to_10.value) ||
          is(variantsData.counting_by_twos.value) ||
          is(variantsData.counting_by_fives.value) ||
          is(variantsData.counting_by_tens.value) ||
          is(variantsData.lego_bricks.value)) && (
          <>
            <div className="row form-group mb-15">
              <div className="col-lg-2">
                <label className="col-form-label">Number</label>
              </div>
              <div className="col-lg-2">
                <div className="input-block">
                  <input
                    type="number"
                    // min="0"
                    value={variants?.main}
                    onChange={handleNumberChange}
                    className={isInvalidate() ? 'error-color' : ''}
                  />
                </div>
              </div>
              <div className="col-lg-2 col-form-label">Max: {max}</div>
            </div>

            {!is(variantsData.lego_bricks.value) && (
              <div className="row form-group">
                <div className="col-lg-2">
                  <label className="col-form-label">Themes</label>
                </div>
                <div className="col-lg-4">
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
      </div>
    </LayoutBuilder>
  )
}

Builder.propTypes = {
  ...BuilderAttributes,
}

export { Builder as CountingBuilder }
