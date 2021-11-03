/* eslint-disable unicorn/better-regex */
import { useState, useEffect, useCallback } from 'react'
import Fraction from 'fraction.js'
import { Select } from 'src/components/select'
import { getRandomArbitrary, times, CUSTOM } from 'src/tools'
// import { getImageCollections } from 'src/services/api.service'

import { useBuilderStates } from 'src/hooks/useBuilderStates'
import { MathProblemViewer } from './viewer'

import BuilderAttributes from '../common/builder_type'
import LayoutBuilder from '../common/layout_builder'

export const variantsData = {
  math: { label: 'Math expression', value: 'math' },
  covert: { label: 'Convert Roman to Arabic', value: 'convert' },
  auto_math: { label: 'Auto math', value: 'auto_math' },
  custom_expression: { label: 'Custom expression', value: 'custom_expression' },
  fraction: { label: 'Fraction', value: 'fraction' },
}

const buttonsCount = 4

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

  const [variantType, setVariantType] = useState(null)
  const [variants, setVariants] = useState(null)

  const [digitType, setDigitType] = useState('arabic')
  const [body, setBody] = useState(null)
  const [subType, setSubType] = useState(null)

  const is = useCallback((val) => variantType === val, [variantType])

  const isInvalidate = () =>
    // if (is(variantsData.fractions.value)) {
    //   return fractionsError.left || fractions.right
    // }

    false

  const updateExtra = () => {
    // if (is(variantsData.math.value)) {
    setExtra({
      body,
      sub_type: subType,
      type: variantType,
      variants,
      digitType,
      buttons,
      buttonsType,
    })
    // }
  }

  useEffect(() => {
    if (pExtra) {
      setExtra(pExtra)
      setVariantType(pExtra.type)

      if (pExtra.type === variantsData.math.value) {
        setVariants(pExtra.variants)
      }

      setButtons(pExtra.buttons || [])
      setDigitType(pExtra.digitType || 'arabic')
      if (is(variantsData.covert.value)) {
        setDigitType('roman')
      }
      setBody(pExtra.body)
      setSubType(pExtra.sub_type)

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
  }, [variantType, variants, digitType, buttons, body, subType])

  useEffect(() => {
    calcRightAnswer()
  }, [variantType, variants, answer_type])

  useEffect(() => {
    if (!answerTrue || answer_type !== 'custom_buttons') return

    // generateAnswers()
  }, [answerTrue, answer_type])

  useEffect(() => {
    if (is(variantsData.custom_expression.value)) {
      const matches = body.match(/\[.+?\]/g)

      if (matches && matches.length > 0) {
        const ans = matches.join(',').replace(/\[|\]/g, '')
        setAnswerTrue(ans)
      }
    }
  }, [body])

  const setDefaultParams = () => {
    setDefaultBuilderParams()
    setVariantType(variantsData.math.value)
    setExtra({ variants, type: variantType })
    setVariants({ left: '10', right: '5', main: 7, operation: '+' })
    setIsInitBuilder(true)
  }

  // UI Handlers
  const handleVariantTypeChange = (value) => {
    setVariantType(value)
  }

  const handleSave = async () => {
    if (isInvalidate()) {
      alert('Fix error')
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

  const calcRightAnswer = () => {
    console.log('calcRightAnswer', variantType)

    if (is(variantsData.math.value)) {
      // const str = `${variants.left}${variants.operation}${variants.right}`;
      try {
        let ret = ''
        if (variants.operation === '+') {
          ret = new Fraction(variants.left).add(variants.right).toFraction(true)
        } else if (variants.operation === '-') {
          ret = new Fraction(variants.left).sub(variants.right).toFraction(true)
        } else if (variants.operation === '*') {
          ret = new Fraction(variants.left).mul(variants.right).toFraction(true)
        } else if (variants.operation === '/') {
          ret = new Fraction(variants.left).div(variants.right).toFraction(true)
        }

        console.log('ret', ret)
        setAnswerTrue(ret)
      } catch (error) {
        console.log(error)
      }
    }
    if (is(variantsData.covert.value)) {
      setAnswerTrue(variants?.left)
    }
  }

  const generateAnswers = () => {
    let customButtons = [Number(answerTrue)]

    times(buttonsCount - 1).forEach((_) => {
      let r
      do {
        const min = Number(answerTrue) - 5 < 1 ? 1 : Number(answerTrue) - 5

        r = getRandomArbitrary(min, min + 10)
        // console.log(r, customButtons)
      } while (customButtons.includes(r))

      customButtons = [...customButtons, r]
    })

    console.log('customButtons', customButtons)

    // setButtons(shuffle(customButtons).map(x => ({ label: x, value: x })))
    setButtons(
      customButtons.sort((a, b) => a - b).map((x) => ({ label: x, value: x })),
    )
  }

  const handleGenerateTimes = (e) => {
    e.preventDefault()

    if (variantType === variantsData.math.value) {
      const left = getRandomArbitrary(0, 99)
      const right = getRandomArbitrary(0, 99)

      setVariants({ left, right, operation: '+' })
    }
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
      Viewer={MathProblemViewer}
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

          {/* Numbers */}
          {is(variantsData.math.value) && (
            <>
              <div className="row mb-30">
                <div className="col-2">Digits:</div>
                <div className="col-3">
                  <div className="radio">
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
                <div className="col-2">
                  <div className="radio">
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
              <div className="row form-group">
                <div className="col-lg-2">
                  <label className="col-form-label">Variants</label>
                </div>
                <div className="col-lg-2">
                  <div className="input-block">
                    <input
                      type="text"
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
                    {/* <input className='' value={variants.operation} /> */}
                    <Select
                      placeholder="Operation"
                      value={variants?.operation}
                      onChange={(item) => {
                        setVariants({ ...variants, operation: item.value })
                      }}
                      options={[
                        { label: '+', value: '+' },
                        { label: '-', value: '-' },
                        { label: '×', value: '*' },
                        { label: '÷', value: '/' },
                      ]}
                    />
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="input-block">
                    <input
                      type="text"
                      value={variants?.right}
                      onChange={(e) => {
                        setVariants({ ...variants, right: e.target.value })
                      }}
                      className={variants?.right === '' ? 'error-color' : ''}
                    />
                  </div>
                </div>
                <div className="col-lg-1">
                  <div className="input-block" style={{ paddingTop: 10 }}>
                    =
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="input-block">
                    <input
                      type="text"
                      disabled
                      value={answerTrue}
                      style={{ backgroundColor: '#fafafa' }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {is(variantsData.covert.value) && (
            <>
              <div className="row form-group">
                <div className="col-lg-2">
                  <label className="col-form-label">Variants</label>
                </div>
                <div className="col-lg-2">
                  <div className="input-block">
                    <input
                      type="text"
                      value={variants?.left}
                      onChange={(e) => {
                        setVariants({ ...variants, left: e.target.value })
                      }}
                      className={variants?.left === '' ? 'error-color' : ''}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {(is(variantsData.auto_math.value) ||
            is(variantsData.fraction.value)) && (
            <>
              <div className="row form-group">
                <div className="col-lg-2">
                  <label className="col-form-label">Problem</label>
                </div>
                <div className="col-lg-8">
                  <div className="input-block">
                    <input
                      type="text"
                      value={body}
                      onChange={(e) => {
                        setBody(e.target.value)
                      }}
                      className={body === '' ? 'error-color' : ''}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {is(variantsData.custom_expression.value) && (
            <>
              <div className="row form-group">
                <div className="col-lg-2">
                  <label className="col-form-label">Problem</label>
                </div>
                <div className="col-lg-4">
                  <div className="input-block">
                    <input
                      type="text"
                      value={body}
                      onChange={(e) => {
                        setBody(e.target.value)
                      }}
                      className={body === '' ? 'error-color' : ''}
                    />
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

export { Builder as MathProblemBuilder }
