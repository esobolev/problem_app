import PropTypes from 'prop-types'
import usePopupContext from 'src/hooks/usePopupContext'

const PredefinedButton = ({
  value = '',
  items = [],
  handleSelect = () => {},
}) => {
  const dialogContext = usePopupContext()

  const handleSelectTitle = (e) => {
    e.preventDefault()

    dialogContext({
      title: 'Select predefined question',
      content: (
        <ul className="title-option">
          {items.map((x, i) => (
            <li
              key={`item-${i}`}
              className={value == x ? 'active' : ''}
              onClick={() => {
                handleSelect(x)
                dialogContext({ visible: false })
              }}
            >
              {x}
            </li>
          ))}
        </ul>
      ),
      visible: true,
      hideActions: true,
      handleOk: async () => {
        dialogContext({ visible: false })
      },
      handleCancel: () => {
        dialogContext({ visible: false })
      },
    })
  }

  return (
    <a onClick={handleSelectTitle} href="#">
      Select predefined
    </a>
  )
}

PredefinedButton.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string,
  handleSelect: PropTypes.func.isRequired,
}

export default PredefinedButton
