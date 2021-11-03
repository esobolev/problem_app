import { RIGHT, WRONG } from 'src/tools'
import PracticeResult from './practice-result'

const ResultLayout = ({
  playMode = false,
  reviewMode = false,

  answerType = null,
  answerTrue = null,
  answerUser = null,

  checkAnswer,
  actionButtons,

  answerTime = null,
  answerState = null,
  answerLog = [],

  isAnswerFiled = true,

  children,
}) => (
  <>
    <div className={`review-block review-block-${answerState}`}>
      {children}
      {/*
          answerLog: {JSON.stringify(answerLog)}
          answerState: {answerState ? 'Y' : 'N'} {answerState}
        */}
      {reviewMode && (
        <>
          {answerState === RIGHT && (
            <div className="answer-bottom-line">
              <svg
                width="35"
                height="35"
                viewBox="0 0 35 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32.8962 17.514C32.8962 26.0091 26.0096 32.8957 17.5145 32.8957C9.01942 32.8957 2.13281 26.0091 2.13281 17.514C2.13281 9.01894 9.01942 2.13232 17.5145 2.13232C26.0096 2.13232 32.8962 9.01894 32.8962 17.514Z"
                  stroke="#9DD765"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.89319 15.0696C10.7191 15.0696 11.3887 14.4 11.3887 13.5741C11.3887 12.7482 10.7191 12.0786 9.89319 12.0786C9.06725 12.0786 8.39771 12.7482 8.39771 13.5741C8.39771 14.4 9.06725 15.0696 9.89319 15.0696Z"
                  fill="#9DD765"
                />
                <path
                  d="M25.1071 15.0696C25.933 15.0696 26.6025 14.4 26.6025 13.5741C26.6025 12.7482 25.933 12.0786 25.1071 12.0786C24.2811 12.0786 23.6116 12.7482 23.6116 13.5741C23.6116 14.4 24.2811 15.0696 25.1071 15.0696Z"
                  fill="#9DD765"
                />
                <mask id="path-4-inside-1" fill="white">
                  <path d="M26.5735 20.3325C25.3657 24.215 21.7708 27.0047 17.4856 27.0047C13.2293 27.0047 9.60559 24.1863 8.39771 20.3325" />
                </mask>
                <path
                  d="M28.4833 20.9267C28.8114 19.8719 28.2224 18.7509 27.1677 18.4228C26.113 18.0947 24.992 18.6837 24.6638 19.7384L28.4833 20.9267ZM10.3062 19.7343C9.9758 18.6803 8.85354 18.0937 7.79953 18.4241C6.74552 18.7544 6.15889 19.8767 6.48925 20.9307L10.3062 19.7343ZM24.6638 19.7384C23.7098 22.8049 20.8741 25.0047 17.4856 25.0047V29.0047C22.6675 29.0047 27.0215 25.6251 28.4833 20.9267L24.6638 19.7384ZM17.4856 25.0047C14.1291 25.0047 11.2604 22.7787 10.3062 19.7343L6.48925 20.9307C7.95083 25.5938 12.3295 29.0047 17.4856 29.0047V25.0047Z"
                  fill="#9DD765"
                  mask="url(#path-4-inside-1)"
                />
                <path
                  d="M10.7256 20L9 20.834"
                  stroke="#9DD765"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M25 20L26.7256 20.834"
                  stroke="#9DD765"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>You’ve got it!</span>
            </div>
          )}

          {answerState === WRONG && (
            <div className="answer-bottom-line">
              <svg
                width="35"
                height="35"
                viewBox="0 0 35 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32.8957 17.514C32.8957 26.0091 26.0091 32.8957 17.514 32.8957C9.01894 32.8957 2.13232 26.0091 2.13232 17.514C2.13232 9.01894 9.01894 2.13232 17.514 2.13232C26.0091 2.13232 32.8957 9.01894 32.8957 17.514Z"
                  stroke="#369CB7"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.89294 15.0696C10.7189 15.0696 11.3884 14.4 11.3884 13.5741C11.3884 12.7482 10.7189 12.0786 9.89294 12.0786C9.06701 12.0786 8.39746 12.7482 8.39746 13.5741C8.39746 14.4 9.06701 15.0696 9.89294 15.0696Z"
                  fill="#369CB7"
                />
                <path
                  d="M25.1063 15.0696C25.9323 15.0696 26.6018 14.4 26.6018 13.5741C26.6018 12.7482 25.9323 12.0786 25.1063 12.0786C24.2804 12.0786 23.6108 12.7482 23.6108 13.5741C23.6108 14.4 24.2804 15.0696 25.1063 15.0696Z"
                  fill="#369CB7"
                />
                <path
                  d="M13 21.1967C14.3675 21.7049 15.9915 22 17.7578 22C19.7236 22 21.547 21.6393 23 21"
                  stroke="#369CB7"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                You’ve corrected the mistake: just double-check it next time!
              </span>
            </div>
          )}

          {reviewMode && !answerState && (
            <div className="answer-bottom-line">
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.4457 15.8913C12.2441 15.8913 12.8913 15.2441 12.8913 14.4457C12.8913 13.6472 12.2441 13 11.4457 13C10.6472 13 10 13.6472 10 14.4457C10 15.2441 10.6472 15.8913 11.4457 15.8913Z"
                  fill="#9C9595"
                />
                <path
                  d="M22.1527 15.8913C22.9511 15.8913 23.5984 15.2441 23.5984 14.4457C23.5984 13.6472 22.9511 13 22.1527 13C21.3543 13 20.707 13.6472 20.707 14.4457C20.707 15.2441 21.3543 15.8913 22.1527 15.8913Z"
                  fill="#9C9595"
                />
                <path
                  d="M31.3335 16.5142C31.3335 24.6986 24.6986 31.3335 16.5142 31.3335C8.32967 31.3335 1.69482 24.6986 1.69482 16.5142C1.69482 8.32967 8.32966 1.69482 16.5142 1.69482C24.6986 1.69482 31.3335 8.32967 31.3335 16.5142Z"
                  stroke="#9C9595"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 23C19 24.7865 17.7595 26 16.5 26C15.2405 26 14 24.7865 14 23C14 21.2135 15.2405 20 16.5 20C17.7595 20 19 21.2135 19 23Z"
                  stroke="#9C9595"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>Not answered</span>
            </div>
          )}
        </>
      )}
    </div>
    {playMode && (
      <PracticeResult
        answerTrue={answerTrue}
        answerUser={answerUser}
        answerState={answerState}
        answerLog={answerLog}
        checkAnswer={checkAnswer}
        answerTime={answerTime}
        actionButtons={actionButtons}
        isAnswerFiled={isAnswerFiled}
      />
    )}
  </>
)

export default ResultLayout
