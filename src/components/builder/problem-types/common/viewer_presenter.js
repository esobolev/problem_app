import PropTypes from 'prop-types'

// Builder
const ViewerPresenter = ({ hideDetails, answerType, children }) => {
  if (hideDetails) return null

  return answerType ? (
    children
  ) : (
    <div className="title">Please select an answer type first</div>
  )
}

ViewerPresenter.propTypes = {
  hideDetails: PropTypes.string.isRequired,
  answerType: PropTypes.string.isRequired,
  children: PropTypes.children,
}

export default ViewerPresenter
