import PropTypes from 'prop-types'

const BuilderAttributes = {
  question: PropTypes.string.isRequired,
  answer_type: PropTypes.string.isRequired,
  problem_type: PropTypes.string.isRequired,
  answer_true: PropTypes.string.isRequired,
  extra: PropTypes.object,
  onSave: PropTypes.func,
  hint: PropTypes.string.isRequired,
  hint_picture: PropTypes.string.isRequired,
  solution: PropTypes.string.isRequired,
  solution_picture: PropTypes.string.isRequired,
}

export default BuilderAttributes
