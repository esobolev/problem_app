import { FC, ReactElement, SyntheticEvent, useState } from 'react'

interface FormatInputProps {
  onChange: (e: SyntheticEvent) => void
}

export const FormatInput: FC<FormatInputProps> = ({ onChange, ...props }): ReactElement => {
  const [value, setValue] = useState<string>('')

  const handleFocus = (event: SyntheticEvent) => (event.target as HTMLInputElement).select()

  const handleChange = (e: SyntheticEvent) => {
    const re = /^[\d\b]+$/

    const target = e.target as HTMLInputElement;

    // if value is not blank, then test the regex
    if (target.value === '' || re.test(target.value)) {
      setValue(Number(target.value) >= 100 ? '99' : target.value)
      onChange(e)
    }
  }

  return (
    <input
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      // style={{ maxWidth: 60 }}
      {...props}
    />
  )
}
