import { FC, ReactElement } from 'react'
import { OptionType, Select } from 'src/components/select'

interface Option {
  id: string
  name: string
  problem_type: string;
}

interface TopicSelectProps {
  value: string
  onChange: (val: OptionType) => void
  topics: Option[]
  subject_id: string
  grade_id: string
}

export const TopicSelect:FC<TopicSelectProps> = ({
  onChange,
  value,
  topics,
  subject_id,
  grade_id,
  ...props
}): ReactElement => (
  <Select
    placeholder="Topic"
    onChange={onChange}
    value={value}
    options={topics.map((x) => ({
      value: x.id,
      label: x.problem_type ? `⊕ ${x.name}` : x.name,
    }))}
    {...props}
  />
)
