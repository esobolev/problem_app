import { useState, useEffect } from 'react'
import { randomValue, RIGHT, WRONG, isNull } from 'src/tools'
// import { ColorSelect } from 'src/components/common';

const successTitles = [
  'You must’ve been practicing',
  'Absolutely!',
  'Awesome',
  'Good job!',
  'Good thinking!',
  'How did you do that_',
  'How did you do that',
  'I’m excited to see what you do',
  'Nice going!',
  'Way to go!',
  'Wonderful!',
  'You got it!',
]

const againTitles = [
  'Hey, you did it!',
  'I had no doubts!',
  "it wasn't that hard, right",
  'Now you’ve got it!',
  'That’s the way to do it',
  'There you go!',
  'This is correct answer!',
  'You are quick learner!',
  'You did it that time!',
  'You see',
]

const wrongTitles = [
  'Give it second look',
  'I’m sure you can do it',
  'Keep calm and give it another try!',
  'Let’s double check it',
  'Mistakes are allowed here',
  "Mistakes are proof that you're trying",
  "Mistakes mean you're learning",
  'Mistakes provide valuable lessons!',
  'Oh, no!  That was tricky one',
  'One more time and you’ll nail it!',
  'Oops! Now let’s figure it out!',
]

export default function PracticeResult({
  // isPass,
  // isActive,
  answerTrue = null,
  answerUser = null,

  checkAnswer,
  actionButtons,

  answerTime = null,
  answerState = null,
  answerLog = [],

  isAnswerFiled = true,
}) {
  const [isOpen, setIsOpen] = useState()
  const [title, setTitle] = useState('')

  useEffect(() => {
    console.log('Preload images')
    successTitles.forEach((title) => {
      new Image().src = `/account/images/monkey/1/${title}.svg`
    })
    againTitles.forEach((title) => {
      new Image().src = `/account/images/monkey/2/${title}.svg`
    })
    wrongTitles.forEach((title) => {
      new Image().src = `/account/images/monkey/3/${title}.svg`
    })
  }, [])

  useEffect(() => {
    if (!answerState) return

    setIsOpen(true)
    setTimeout(() => {
      setIsOpen(false)
    }, 1500)

    setTitle(
      answerState === RIGHT
        ? answerTime <= 1
          ? randomValue(successTitles)
          : randomValue(againTitles)
        : randomValue(wrongTitles),
    )
  }, [answerState, answerTime])

  console.log('isAnswerFiled', isAnswerFiled)
  console.log('answerUser', answerUser)

  return (
    <>
      <div className="block">
        {answerState === null ? (
          <span>{'  '}</span>
        ) : answerState === RIGHT ? (
          answerTime <= 1 ? (
            <div
              className={`modalAnimation modalMonkey modalMonkey-green ${
                isOpen ? 'open' : ''
              }`}
            >
              <div className="modalAnimation-wrap">
                <div className="modalMonkey-img">
                  <img src={`/account/images/monkey/1/${title}.svg`} alt="" />
                </div>
                <div className="modalMonkey-info">
                  <div className="modalAnimation-row">
                    <i className="hb-ico modalMonkey-check" />
                    <span>{title}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`modalAnimation modalMonkey modalMonkey-orange ${
                isOpen ? 'open' : ''
              }`}
            >
              <div className="modalAnimation-wrap">
                <div className="modalMonkey-img">
                  <img src={`/account/images/monkey/2/${title}.svg`} alt="" />
                </div>
                <div className="modalMonkey-info">
                  <div className="modalAnimation-row">
                    <i className="hb-ico modalMonkey-check" />
                    <span>{title}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div
            className={`modalAnimation modalMonkey modalMonkey-red ${
              isOpen ? 'open' : ''
            }`}
          >
            <div className="modalAnimation-wrap">
              <div className="modalMonkey-img">
                <img src={`/account/images/monkey/3/${title}.svg`} alt="" />
              </div>
              <div className="modalMonkey-info">
                <div className="modalAnimation-row">
                  <i className="hb-ico modalMonkey-close" />
                  <span>{title}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="buttons-row buttons-center result-bottom-buttons">
        {/* {JSON.stringify(answerUser)}
        {answerUser ? 'Y' : 'N'}
        {isAnswerFiled ? 'Y' : 'N'} */}
        {!isNull(answerUser) && answerState !== RIGHT && isAnswerFiled ? (
          <button onClick={checkAnswer} className="primary-btn" type="button">
            Submit
          </button>
        ) : null}
        {actionButtons}
      </div>
    </>
  )
}
