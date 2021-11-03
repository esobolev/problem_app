import { FC, ReactElement } from "react"

const COLORS = [
  { value: '1', color: '#FFC01E' },
  { value: '2', color: '#58B4A7' },
  { value: '3', color: '#FC9956' },
  { value: '4', color: '#3C87CD' },
  { value: '5', color: '#FA6FB2' },
  { value: '6', color: '#8471BB' },
  { value: '7', color: '#FF7676' },
]

interface ColorSelectProps {
  value: string
  onChange: (val: string) => void
}

export const ColorSelect:FC<ColorSelectProps> = ({ value, onChange }): ReactElement => {

  const handleColorClick = (color: string) => () => {
    onChange(color)
  }

  return (
    <ul className="colors">
      {COLORS.map((x) => (
        <li key={x.value}>
          <div className="colorCheckbox">
            <input
              type="radio"
              name="color"
              value={x.value}
              checked={value === x.value}
              onClick={handleColorClick(x.value)}
            />
            <i
              className="colorCheckbox-ico"
              style={{ backgroundColor: x.color }}
            />
            <i className="after">
              <svg
                width="8"
                height="5"
                viewBox="0 0 8 5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.15156 0.648632C7.04895 0.54681 6.88229 0.54681 6.77968 0.648632L3.05887 4.3447L1.42295 2.73195C1.32034 2.63013 1.15368 2.63013 1.05107 2.73195C0.94847 2.83377 0.94847 2.99862 1.05107 3.10018L2.87372 4.89678C2.97528 4.9973 3.14429 4.9973 3.24585 4.89678L7.15156 1.01686C7.25442 0.915297 7.25442 0.750194 7.15156 0.648632C7.04895 0.54681 7.25442 0.750194 7.15156 0.648632Z"
                  fill="white"
                />
              </svg>
            </i>
          </div>
        </li>
      ))}
    </ul>
  )
}
