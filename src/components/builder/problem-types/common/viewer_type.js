import PropTypes from 'prop-types'

const ViewerAttributes = {
  id: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  answer_type: PropTypes.string.isRequired,
  problem_type: PropTypes.string.isRequired,
  answer_true: PropTypes.string.isRequired,
  // extra: PropTypes.oneOf([PropTypes.string, PropTypes.object]),
  extra: PropTypes.string,
  actionButtons: PropTypes.node,
  handleAnswerCallback: PropTypes.func,
  onSave: PropTypes.func,
  isLiveCheck: PropTypes.bool,
  playMode: PropTypes.bool,
  reviewMode: PropTypes.bool,
  answerUser: PropTypes.string.isRequired,
  answerState: PropTypes.string.isRequired,
  question_picture: PropTypes.string,
}

export default ViewerAttributes
