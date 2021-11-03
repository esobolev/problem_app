import { useState, useEffect, useCallback } from 'react'
import { useBuilderStates } from 'src/hooks/useBuilderStates'
import { getRandomArbitrary, CUSTOM, CUSTOM_BUTTONS } from 'src/tools'
import { TableViewer } from './viewer'
import BuilderAttributes from '../common/builder_type'
import LayoutBuilder from '../common/layout_builder'

export const variantsData = {
  table: { label: 'Table', value: 'table' },
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

  const [variantType, setVariantType] = useState(variantsData.table.value)

  const [resource, setResource] = useState('Additional 2')
  const [headers, setHeaders] = useState({ label: 'In', value: 'Out' })
  const [items, setItems] = useState([
    { label: '2', value: '4', hiddenLabel: false, hiddenValue: false },
    { label: '4', value: '6', hiddenLabel: false, hiddenValue: false },
    { label: '6', value: '8', hiddenLabel: false, hiddenValue: false },
    { label: '8', value: '10', hiddenLabel: false, hiddenValue: false },
    { label: '10', value: '12', hiddenLabel: false, hiddenValue: false },
  ])

  useEffect(() => {
    console.log(problem_type, id, 'answerTrue', answerTrue)
  }, [id, problem_type, answerTrue])

  const is = useCallback((val) => variantType === val, [variantType])

  const isInvalidate = () => false

  const updateExtra = () => {
    const rest = {
      type: variantType,
      buttons,
      buttonsType,
    }

    if (is(variantsData.table.value)) {
      setExtra({
        ...rest,
        resource,
        headers,
        items,
      })
    }
  }

  useEffect(() => {
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

        if (pExtra.type === variantsData.table.value) {
          setItems(pExtra.items)
          setHeaders(pExtra.headers)
          setResource(pExtra.resource)
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
  }, [variantType, items, resource, headers, buttons])

  const setDefaultParams = () => {
    setDefaultBuilderParams()

    setVariantType(variantsData.table.value)
    setIsInitBuilder(true)
  }

  // const handleItemChange = (value) => () => { setAnswerTrue(value) }

  const handleItemChange = (i, valuePart) => {
    const newItems = [...items]
    newItems[i] = {
      ...newItems[i],
      hiddenLabel: false,
      hiddenValue: false,
      ...valuePart,
    }
    setItems(newItems)
  }

  const handleGenerateTimes = (e) => {
    e.preventDefault()

    if (variantType === variantsData.table.value) {
      let max = -1

      const newItems = items.map((item) => {
        const val = getRandomArbitrary(0, 50)
        max = val > max ? val : max
        return { ...item, value: val }
      })

      setAnswerTrue(max)
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
      Viewer={TableViewer}
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
        {/* Table  */}
        <div className="row form-group mb-15">
          <div className="col-lg-2">
            <label className="col-form-label">Headers</label>
          </div>
          <div className="col-lg-10">
            {/* <div className='row form-group mb-15'>
              <div className='col-lg-10'>
                <div className='input-block'>
                  <input className='' value={resource}  onChange={(e) => { setResource(e.target.value) } } />
                </div>
              </div>
            </div> */}

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
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="answerTrue"
                        value={item.label}
                        onChange={() => {
                          handleItemChange(i, {
                            hiddenLabel: !item.hiddenLabel,
                          })
                        }}
                        checked={item.hiddenLabel}
                      />
                      <span className="checkbox-ico" />
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
                <div className="col-lg-1">
                  <div
                    className="input-block"
                    style={{ paddingTop: 8, paddingLeft: 8 }}
                  >
                    <div className="checkbox">
                      <input
                        type="checkbox"
                        name="answerTrue"
                        value={item.value}
                        onChange={() => {
                          handleItemChange(i, {
                            hiddenValue: !item.hiddenValue,
                          })
                        }}
                        checked={item.hiddenValue}
                      />
                      <span className="checkbox-ico" />
                      <p>&nbsp;</p>
                    </div>
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
      </div>
    </LayoutBuilder>
  )
}

Builder.propTypes = {
  ...BuilderAttributes,
}

export { Builder as TableBuilder }
