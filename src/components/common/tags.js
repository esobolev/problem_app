import { useState } from 'react'
import { toggle } from 'src/tools'

const Button = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    type="button"
    className={`${active ? 'second-btn active' : 'second-btn'}`}
  >
    <span className="check-ico" />
    {children}
  </button>
)

export default function Tags({ value = [], items = [], onChange = () => {} }) {
  const [showMore, setShowMore] = useState(false)
  const [selectedItems, setSelectedItems] = useState(value)

  const MAX = 10
  let elements = items
  let elementsMore = []

  if (items.length > MAX) {
    elements = items.slice(0, MAX)
    elementsMore = items.slice(MAX)
  }

  const handleClick = (id) => () => {
    const values = toggle(selectedItems, id)
    setSelectedItems(values)
    onChange(values)
  }

  return (
    <div className="tags">
      {elements.map(({ id, name }) => (
        <Button
          key={id}
          onClick={handleClick(id)}
          active={selectedItems.includes(id)}
        >
          {name}
        </Button>
      ))}
      {elementsMore.length > 0 && (
        <>
          {showMore ? (
            elementsMore.map(({ id, name }) => (
              <Button
                key={id}
                onClick={handleClick(id)}
                active={selectedItems.includes(id)}
              >
                {name}
              </Button>
            ))
          ) : (
            <button
              onClick={() => {
                setShowMore(true)
              }}
              type="button"
              className="btn more pannel__btn"
            >
              show more
            </button>
          )}
        </>
      )}
    </div>
  )
}
