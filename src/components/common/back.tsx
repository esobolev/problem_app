import { FC, ReactElement } from 'react'
import { useHistory } from 'react-router-dom'

interface BackLinkProps {
  to: string | null
}

export const BackLink: FC<BackLinkProps> = ({ to = null }): ReactElement => {
  const history = useHistory()

  const handleClick = () => {
    if(to) {
      history.push(to)
    } else  {
      history.goBack()
    }
  }

  return (
    <button type="button" onClick={handleClick} className="sectionHb-back">
      <i className="hb-ico back-arrow" />
      Back
    </button>
  )
}
