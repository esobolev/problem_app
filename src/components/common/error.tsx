import { FC, ReactElement } from "react"

interface ErrorFiledProps {
  formik: any
  name: string
}

export const ErrorField: FC<ErrorFiledProps> = ({ formik, name }): ReactElement => {
  if (formik.errors[name] && formik.touched[name]) {
    return (
      <label id="email-error" htmlFor="email" className="error-field">
        {formik.errors[name]}
      </label>
    )
  }

  return <></>
}
