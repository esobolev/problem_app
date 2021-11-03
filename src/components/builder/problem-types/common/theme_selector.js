import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const ThemeSelector = ({ title, onTitleChange, picture, onPictureChange }) => {
  useEffect(() => {}, [])

  return (
    <div className="block">
      <div className="row">
        <div className="col-lg-12">123</div>
      </div>
    </div>
  )
}

TextWithImageBuilder.propTypes = {
  title: PropTypes.string.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  picture: PropTypes.string,
  onPictureChange: PropTypes.func.isRequired,
}

export { ThemeSelector }
