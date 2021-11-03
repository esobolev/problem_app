export default function WrapItem({
  item,
  index,
  handleHiddenClick = null,
  // handleShapeClick,
  className,
  handleItemClick,
  handlePositionClick = null,
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
            className={`second-btn ${item.position === 0 ? 'btn-active' : ''}`}
            onClick={handlePositionClick(index, 0)}
            type="button"
          >
            left
          </button>
          <button
            className={`second-btn ${item.position === 1 ? 'btn-active' : ''}`}
            onClick={handlePositionClick(index, 1)}
            type="button"
          >
            right
          </button>
        </div>
      )}
    </div>
  )
}
