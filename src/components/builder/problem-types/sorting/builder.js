import { useState, useRef, useEffect } from 'react'
import {
  shuffle,
  times,
  getRandomArbitrary,
  getMultiRandom,
  intersection,
  CUSTOM,
} from 'src/tools'

import { useBuilderStates } from 'src/hooks/useBuilderStates'
import { useOnClickOutside } from 'src/hooks/useOnClickOutside'
import BuilderAttributes from '../common/builder_type'
import LayoutBuilder from '../common/layout_builder'

import { SortingViewer } from './viewer'
import WrapItem from './wrap-item'

import { collections, colors, hexColors } from '../common/constants'

import ShapesMenu from '../common/shapes-menu'

const MIN_ITEMS_COUNT = 6

export const defaultItem = { value: null, position: 0 }
export const basketTypeEnum = {
  colors: 'color',
  simple: 'simple',
  giftBox: 'giftBox',
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

  const [items, setItems] = useState([])
  const [answers, setAnswers] = useState([])

  const [basketsCount, setBasketsCount] = useState(0)
  const [baskets, setBaskets] = useState([])
  const [basketsType, setBasketsType] = useState(basketTypeEnum.giftBox)

  const refMenu = useRef()
  const [selectedItemIndex, setSelectedItemIndex] = useState(null)
  const [selectedItemList, setSelectedItemList] = useState(null)
  const [isShapesOpen, setIsShapesOpen] = useState(false)

  useEffect(() => {
    try {
      const {
        items: savedItems = [],
        answers: savedAnswers,
        baskets: savedBaskets,
        basketsType: savedBasketsType,
      } = pExtra

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

      if (Array.isArray(items)) {
        setExtra(pExtra)
        setItems(savedItems)
        setAnswers(savedAnswers || [])
        setBasketsCount(savedBaskets ? savedBaskets.length : 2)
        savedBaskets && setBaskets(savedBaskets)
        savedBasketsType && setBasketsType(savedBasketsType)
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
    setExtra({ items, answers, baskets, basketsType })
  }, [items, answers, baskets, basketsType])

  useEffect(() => {
    if (baskets.length > basketsCount) {
      setBaskets(baskets.splice(0, basketsCount))
    } else {
      setBaskets([
        ...baskets,
        ...times(basketsCount - baskets.length).map((_, i) => ({
          title: `Basket ${i + baskets.length + 1}`,
          color: '#333',
        })),
      ])
    }
  }, [basketsCount])

  const setDefaultParams = () => {
    setDefaultBuilderParams()
    setExtra({ items, answers })
    generateProblem()
    setIsInitBuilder(true)
  }

  const generateProblem = () => {
    const shapes = getMultiRandom(collections, 6)
    const clr = getMultiRandom(colors, 2)

    const items = times(MIN_ITEMS_COUNT).map((i) => {
      const r1 = getRandomArbitrary(0, 5)
      const r2 = getRandomArbitrary(0, 1)

      return { value: `${process.env.REACT_APP_S3_HOST}/image_collection/2D/${shapes[r1]}_${clr[r2]}.svg`, position: r2 }
    })

    setItems(items)
    setAnswers(items)
    // setBaskets([
    //   { ...baskets[0], color: hexColors[clr[0]], type: 'colors' },
    //   { ...baskets[1], color: hexColors[clr[1]], type: 'colors' }
    // ]);
  }

  // const handleShapeClick = (index) => (name) => {
  //   const newItems = [ ...items ];
  //   newItems[index] = { ...newItems[index], value: name };
  //   setItems(newItems);
  // }

  const handlePositionClick = (index, value) => () => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], position: value }
    setItems(newItems)
  }

  const handleRemoveClick = (index) => (e) => {
    e.preventDefault()
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleAddClick = () => {
    setItems([...items, defaultItem])
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

  const handleGenerateClick = (e) => {
    e.preventDefault()

    generateProblem()
  }

  const onChangeBasketType = (e) => {
    setBasketsType(e.target.value)
  }

  const onChangeBasketCount = (e) => {
    setBasketsCount(Number(e.target.value))
  }

  const handleItemClick = (index, list) => () => {
    setSelectedItemIndex(index)
    setSelectedItemList(list)
    setIsShapesOpen(true)
  }

  const handleShapeClick = (name, modification) => {
    const newItems = [...items]
    newItems[selectedItemIndex] = {
      ...newItems[selectedItemIndex],
      value: name,
      modification,
    }
    setItems(newItems)

    setIsShapesOpen(false)
    setSelectedItemIndex(null)
    setSelectedItemList(null)
  }

  const viewerAnswerCallback = (values) => {
    console.log('values:', values)

    if (!values) return;

    let newItems = {...items};

    Object.keys(values).forEach((key, i) => {
      console.log('aaa');
    })
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
      Viewer={SortingViewer}
      viewerAnswerCallback={viewerAnswerCallback}
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
            <a onClick={handleGenerateClick} href="#">
              Generate
            </a>
          </span>
        </div>

        <div ref={refMenu}>
          <ShapesMenu active={isShapesOpen} onClick={handleShapeClick} />
        </div>

        <div className="form builder-form">
          {(items || []).map((x, i) => (
            <WrapItem
              key={i}
              index={i}
              item={x}
              handlePositionClick={handlePositionClick}
              handleItemClick={handleItemClick(i, 'items')}
            />
          ))}

          <div className="plus-minus-btns">
            <button
              className="primary-btn"
              onClick={handleAddClick}
              type="button"
            >
              +
            </button>
            <button
              disabled={items.length <= 4}
              className="second-btn"
              onClick={handleRemoveClick(items.length - 1)}
              type="button"
            >
              -
            </button>
          </div>
        </div>
      </div>

      <div className="block">
        <div className="block-title">Answer line</div>
        <div className="form-bg">
          <div className="row mt-20">
            <div className="col-1">Boxes</div>
            <div className="col-2">
              <div className="radio">
                <input
                  type="radio"
                  value={2}
                  onChange={onChangeBasketCount}
                  checked={basketsCount === 2}
                />
                <span className="radio-ico" />
                <p>2-Boxes</p>
              </div>
            </div>
            <div className="col-2">
              <div className="radio">
                <input
                  type="radio"
                  value={3}
                  onChange={onChangeBasketCount}
                  checked={basketsCount === 3}
                />
                <span className="radio-ico" />
                <p>3-Boxes</p>
              </div>
            </div>
            <div className="col-2">
              <div className="radio">
                <input
                  type="radio"
                  value={1}
                  onChange={onChangeBasketCount}
                  checked={basketsCount === 1}
                />
                <span className="radio-ico" />
                <p>Inline</p>
              </div>
            </div>
          </div>

          <div className="row mt-20">
            <div className="col-1 pt-10">Title</div>
            {baskets.map((x, i) => (
              <div key={`key-${i}`} className="col-3">
                <div className="input-block mb-0">
                  <input
                    className="item"
                    type="text"
                    value={baskets[i].title}
                    onChange={(e) => {
                      const newBaskets = [...baskets]
                      newBaskets[i].title = e.target.value
                      setBaskets(newBaskets)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="row mt-20">
            <div className="col-1 pt-1">Type</div>
            <div className="col-2">
              <div className="radio">
                <input
                  type="radio"
                  value={basketTypeEnum.colors}
                  onChange={onChangeBasketType}
                  checked={basketsType === basketTypeEnum.colors}
                />
                <span className="radio-ico" />
                <p>Colors</p>
              </div>
            </div>
            <div className="col-2">
              <div className="radio">
                <input
                  type="radio"
                  value={basketTypeEnum.simple}
                  onChange={onChangeBasketType}
                  checked={basketsType === basketTypeEnum.simple}
                />
                <span className="radio-ico" />
                <p>Simple</p>
              </div>
            </div>
            <div className="col-2">
              <div className="radio">
                <input
                  type="radio"
                  value={basketTypeEnum.giftBox}
                  onChange={onChangeBasketType}
                  checked={basketsType === basketTypeEnum.giftBox}
                />
                <span className="radio-ico" />
                <p>Gift box</p>
              </div>
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

export { Builder as SortingBuilder }
