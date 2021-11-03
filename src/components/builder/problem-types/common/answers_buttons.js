import PropTypes from 'prop-types'

const AnswerButtons = ({
  answersData = [],
  selectedValue = '',
  handleAnswer = () => {},
}) => (
  <div className="buttons-row buttons-center">
    {answersData.map((item) => (
      <button
        type="button"
        key={item.value}
        className={
          selectedValue === item.value ? 'second-btn btn-active' : 'second-btn'
        }
        onClick={() => {
          handleAnswer(item.value)
        }}
      >
        {item.label}
      </button>
    ))}
  </div>
)

AnswerButtons.propTypes = {
  answersData: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
  ),
  selectedValue: PropTypes.string,
  handleAnswer: PropTypes.func,
}

export default AnswerButtons
