import { useEffect, useState, useRef } from 'react'

const MAX_HOUR = 12

const TimeInput = ({
  // initTime = '',
  onTimeChange = () => {},
  onFocusHandler = () => {},
  onBlurHandler = () => {},
  name = null,
  type = 'tel',
  className = '',
  disabled = false,
  placeholder = ' ',
  value = '12:00',
}) => {
  const [lastVal, setLastVal] = useState('')
  const [time, setTime] = useState('')
  const input = useRef(null)

  useEffect(() => {
    setTime(value)
  }, [value])

  // useEffect(() => {
  //   input.current && input.current.focus();
  // }, [input.current])

  const isValid = (val) => {
    const regexp = /^\d{0,2}?:?\d{0,2}$/ /// ^\d{0,2}?\:?\d{0,2}$/;

    const [hoursStr, minutesStr] = val.split(':')

    if (!regexp.test(val)) {
      return false
    }

    const hours = Number(hoursStr)
    const minutes = Number(minutesStr)

    const isValidHour = (hour) =>
      Number.isInteger(hour) && hour > 0 && hour <= MAX_HOUR
    const isValidMinutes = (minutes) =>
      (Number.isInteger(minutes) && hours >= 0 && hours <= MAX_HOUR) ||
      Number.isNaN(minutes) ||
      (hours === MAX_HOUR && Number(minutes) === 0)

    // console.log('isValidHour', hours, isValidHour(hours))
    // console.log('isValidMinutes', minutes, isValidMinutes(minutes))

    if (!isValidHour(hours) || !isValidMinutes(minutes)) {
      return false
    }

    if (minutes < 10 && Number(minutesStr[0]) > 5) {
      return false
    }

    const valArr = val.indexOf(':') !== -1 ? val.split(':') : [val]

    // check mm and HH
    if (
      valArr[0] &&
      valArr[0].length > 0 &&
      (Number.parseInt(valArr[0], 10) < 0 ||
        Number.parseInt(valArr[0], 10) > 23)
    ) {
      return false
    }

    if (
      valArr[1] &&
      valArr[1].length > 0 &&
      (Number.parseInt(valArr[1], 10) < 0 ||
        Number.parseInt(valArr[1], 10) > 59)
    ) {
      return false
    }

    return true
  }

  const onChangeHandler = (val) => {
    if (val === time) {
      return
    }
    if (isValid(val)) {
      if (val.length === 2 && lastVal.length !== 3 && val.indexOf(':') === -1) {
        val += ':'
      }

      if (val.length === 2 && lastVal.length === 3) {
        val = val.slice(0, 1)
      }

      if (val.length > 5) {
        return false
      }

      setLastVal(val)
      setTime(val)

      if (val.length === 5) {
        onTimeChange(val)
      }
    }
  }

  return (
    <input
      ref={input}
      name={name}
      className={className}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      value={time}
      onChange={(e) => onChangeHandler(e.target.value)}
      onFocus={onFocusHandler ? (e) => onFocusHandler(e) : undefined}
      onBlur={onBlurHandler ? (e) => onBlurHandler(e) : undefined}
    />
  )
}

export default TimeInput
