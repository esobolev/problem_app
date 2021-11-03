/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-multi-assign */
export const storage = window.localStorage

export const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`, 'g'))
  let token = match?.length
    ? match[match.length - 1].trim().replace('token=', '')
    : null

  token = match ? decodeURIComponent(token) : null

  if (!token) {
    token = storage.getItem('token');
  }

  return token
}

export const setCookie = (name, value, props) => {
  storage.setItem('token', value)

  // eslint-disable-next-line no-param-reassign
  props = props || {}

  let exp = props.expires

  if (typeof exp === 'number' && exp) {
    const d = new Date()
    d.setTime(d.getTime() + exp * 1000)
    exp = props.expires = d
  }

  if (exp && exp.toUTCString) {
    props.expires = exp.toUTCString()
  }

  value = encodeURIComponent(value)

  let updatedCookie = `${name}=${value}`

  for (const propName in props) {
    updatedCookie += `; ${propName}`
    const propValue = props[propName]
    if (propValue !== true) {
      updatedCookie += `=${propValue}`
    }
  }

  document.cookie = updatedCookie
}

export const removeCookie = (name) => {
  storage.removeItem('token');
  document.cookie = `${name}=; Max-Age=-99999999;`
}

export const cookies = {
  getItem: getCookie,
  setItem: setCookie,
  remove: removeCookie,
}
