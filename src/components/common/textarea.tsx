import { FC, ReactElement } from 'react'

interface TextareaProps {
  status: string
}

export const Textarea: FC<TextareaProps> = ({ status, ...props }): ReactElement => (
  <div className="input-block">
    <textarea {...props} />
    {status}
  </div>
)
