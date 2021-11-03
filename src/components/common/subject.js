import { Select } from 'src/components/select'

const SubjectSelect = ({ onChange, value }) => (
  <Select
    placeholder="Subject"
    onChange={onChange}
    value={value}
    options={[
      { value: null, label: 'All' },
      { value: 1, label: 'Math' },
      { value: 2, label: 'English' },
      { value: 3, label: 'Science' },
      { value: 4, label: 'Social Studies' },
    ]}
  />
)

export default SubjectSelect
