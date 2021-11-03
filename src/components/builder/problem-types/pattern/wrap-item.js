export default function WrapItem({
  item,
  index,
  handleHiddenClick = null,
  // handleShapeClick,
  className,
  handleItemClick,
  handleShapeClick,
}) {
  const handleClick = () => {
    handleItemClick()
  }

  return (
    <div className={`wrap-item ${className}`}>
      <div className="shape-select" onClick={handleClick}>
        {item.value ? <img src={item.value} alt="" /> : '-'}
      </div>

      {handleHiddenClick && (
        <div className="column-btns">
          <button
            className={`second-btn ${item.hidden ? 'btn-active' : ''}`}
            onClick={handleHiddenClick(index, false)}
            type="button"
          >
            show
          </button>
          <button
            className={`second-btn ${!item.hidden ? 'btn-active' : ''}`}
            onClick={handleHiddenClick(index, true)}
            type="button"
          >
            hide
          </button>
        </div>
      )}
    </div>
  )
}
