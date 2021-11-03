import { useEffect } from 'react'
import PropTypes from 'prop-types'

const CustomInputBuilder = ({
  answerTrue,
  setAnswerTrue,
  isValid,
  setIsValid,
}) => {
  useEffect(() => {
    setIsValid(!!answerTrue)
  }, [answerTrue])

  const handleAnswerChange = (e) => {
    setAnswerTrue(e.target.value)
  }

  return (
    <>
      <div className="row form-group">
        <div className="col-lg-2">
          <div className="input-block mt-15">Answer</div>
        </div>
        <div className="col-lg-4">
          <div className="input-block">
            <input
              type="text"
              onChange={handleAnswerChange}
              value={answerTrue}
            />
          </div>
        </div>
      </div>

      {!isValid && (
        <div className="row form-group mt-15">
          <div className="col-lg-12">
            <div className="input-block">
              <span className="error">Enter correct answer</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

CustomInputBuilder.propTypes = {
  answerTrue: PropTypes.string.isRequired,
  setAnswerTrue: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  setIsValid: PropTypes.func.isRequired,
}

export default CustomInputBuilder
