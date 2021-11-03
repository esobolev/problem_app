import { FC, ReactElement } from "react"
import { Select, OptionType } from 'src/components/select'

interface GradeSelectProps {
  value: string
  onChange: (val: OptionType) => void
}

export const GradeSelect:FC<GradeSelectProps> = ({
  value,
  onChange,
}): ReactElement => (
  <Select
    placeholder="Grade"
    onChange={onChange}
    value={value}
    options={[
      { label: 'All', value: null },
      { label: 'Pre-K', value: 11 },
      { label: 'Kindergarten', value: 12 },
      { label: '1 grade', value: 1 },
      { label: '2 grade', value: 2 },
      { label: '3 grade', value: 3 },
      { label: '4 grade', value: 4 },
      { label: '5 grade', value: 5 },
      { label: '6 grade', value: 6 },
      { label: '7 grade', value: 7 },
      { label: '8 grade', value: 8 },
    ]}
  />
)
