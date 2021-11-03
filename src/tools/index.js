/* eslint-disable */
import { create, all } from 'mathjs'

const config = {
  // Default type of number
  // Available options: 'number' (default), 'BigNumber', or 'Fraction'
  number: 'Fraction',
}

// create a mathjs instance with everything included
export const math = create(all, config)

// Tools
export const isClass = (val, className) => (val ? className : '')

export const shuffle = (array) => array.sort(() => Math.random() - 0.5)

export const toggle = (arr, item) =>
  arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]

export const filterByKeys = (arr, keys) =>
  Object.keys(arr)
    .filter((value) => keys.includes(value))
    .reduce((acc, val) => {
      acc[val] = arr[val]
      return acc
    }, {})

export const getRandomArbitrary = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const rand = `const getRandomArbitrary = (min, max) => {
  return  Math.floor(Math.random() * (max - min + 1) + min);
}`

export const times = (n) =>
  '0'
    .repeat(n)
    .split('')
    .map((_, i) => i)

export const randomValue = (arr = []) =>
  arr[getRandomArbitrary(0, arr.length - 1)]

export const randItem = `const randItem = (arr = []) => arr.map(x => x.toString())[getRandomArbitrary(0, arr.length-1)]`

export const strToMathJax = (str) => {
  const fStr = String(str)
    .replace(/\//g, '\\over')
    .split(' ')
    .map((x) => `{${x}}`)
    .join('')
  return `$$${fStr}$$`
}

export const getMultiRandom = (arr, n) => {
  const result = new Array(n)
  let len = arr.length
  const taken = new Array(len)
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available')
  while (n--) {
    const x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }
  return result
}

// export const shallowEqual = (obj1, obj2) => (
//   JSON.stringify(new Map(Object.entries(obj1))) === JSON.stringify(new Map(Object.entries(obj2)))
// );

export function shallowEqualObjects(objA, objB) {
  // if (objA === objB) {
  //   return true;
  // }

  // if (!objA || !objB) {
  //   return false;
  // }

  const aKeys = Object.keys(objA)
  const bKeys = Object.keys(objB)
  const len = aKeys.length

  if (bKeys.length !== len) {
    return false
  }

  for (let i = 0; i < len; i++) {
    const key = aKeys[i]

    if (
      objA[key] !== objB[key] ||
      !Object.prototype.hasOwnProperty.call(objB, key)
    ) {
      return false
    }
  }

  return true
}

// Circles
export const isPointInCircle = (x, y, xc, yc, R) =>
  (x - xc) ** 2 + (y - yc) ** 2 < R * R

/// CONSTANTS

export const INPUT = 'input'
export const BUTTONS = 'buttons'
export const CUSTOM_BUTTONS = 'custom_buttons'
export const COMPARE_WORDS = 'phrase'
export const COMPARE_SIGN = 'sign'
export const ORDER = 'order'
export const DRAG = 'drag'

export const EVEN_ODD = 'even_odd'
export const TRUE_FALSE = 'true_false'
export const CUSTOM = 'custom'
export const IMAGES = 'images'

export const PAGE_LAYOUTS_ENUM = {
  one_per_page: 'one_per_page',
  single_on_page: 'single_on_page',
  two_columns: 'two_columns',
}

export const PAGE_LAYOUTS = [
  // { value: 'one_per_page', title: 'One problem per page' },
  { value: 'one_per_page', title: 'One question at the time' },
  { value: 'single_on_page', title: 'Single page practice' },
  { value: 'two_columns', title: 'Single page practice: 2 columns' },
]

export const ANSWER_TYPES = [
  { value: 'input', title: 'Input' },
  { value: 'checkbox', title: 'Checkbox' },
  { value: 'radio', title: 'Radio' },
  { value: 'select', title: 'Select' },
]

export const ANSWER_TYPES_ENUM = {
  input: 'input',
  checkbox: 'checkbox',
  radio: 'radio',
  clock: 'clock',
  select: 'select',
  // custom_buttons: CUSTOM_BUTTONS,
}

export const PROBLEM_TYPES = [
  {
    title: 'Clock',
    value: 'clock',
    answerTypes: [
      { title: 'Input', value: 'input' },
      { title: 'Custom Buttons', value: CUSTOM_BUTTONS },
    ],
  },
  {
    title: 'Counting',
    value: 'counting',
    answerTypes: [
      { title: 'Input', value: 'input' },
      // { title: '1-10 Buttons', value: 'ten_buttons'},
      { title: 'Custom Buttons', value: CUSTOM_BUTTONS },
    ],
  },
  {
    title: 'Compare',
    value: 'compare',
    answerTypes: [
      { title: 'Words', value: 'phrase' },
      { title: 'Sign', value: 'sign' },
      { title: 'Custom Buttons', value: CUSTOM_BUTTONS },
    ],
  },
  {
    title: 'Even/Odd',
    value: 'even_odd',
    answerTypes: [
      { title: 'Buttons', value: 'buttons' },
      // { title: 'Checkboxes', value: 'checkboxes'},
      // { title: 'Drag and Drop', value: 'drag_and_drop'},
      // { title: 'Custom Buttons', value: CUSTOM_BUTTONS},
    ],
  },
  {
    title: 'Sequences',
    value: 'sequence',
    answerTypes: [
      { title: 'Inputs', value: 'inputs-items' },
      { title: 'Line & Inputs', value: 'line' },
      { title: 'Set in order', value: 'order' },
      // { title: 'Custom Buttons', value: CUSTOM_BUTTONS},
    ],
  },
  {
    title: 'Number line',
    value: 'number_line',
    answerTypes: [
      { title: 'Line', value: 'line' },
      { title: 'Jump ', value: 'jump' },
      // { title: 'Custom Buttons', value: CUSTOM_BUTTONS},
    ],
  },
  {
    title: 'Number stories',
    value: 'number_story',
    answerTypes: [
      { title: 'Input', value: 'input' },
      { title: 'Multichoice', value: 'radio' },
      { title: 'Custom Buttons', value: CUSTOM_BUTTONS },
    ],
  },

  {
    title: 'Money',
    value: 'money',
    answerTypes: [
      { title: 'Input', value: 'input' },
      { title: 'Custom Buttons', value: CUSTOM_BUTTONS },
    ],
  },
  {
    title: 'Math problems',
    value: 'math_problem',
    answerTypes: [
      { title: 'Input', value: 'input' },
      { title: 'Custom Buttons', value: CUSTOM_BUTTONS },
    ],
  },
  {
    title: 'Patterns',
    value: 'pattern',
    answerTypes: [
      { title: 'Drag and Drop', value: 'drag' },
      // { title: 'Custom Buttons', value: CUSTOM_BUTTONS},
    ],
  },
  {
    title: 'Diagrams',
    value: 'diagram',
    answerTypes: [
      { title: 'Drag and Drop', value: 'drag' },
      // { title: 'Custom Buttons', value: CUSTOM_BUTTONS},
    ],
  },
  {
    title: 'Sorting',
    value: 'sorting',
    answerTypes: [
      { title: 'Drag and Drop', value: 'drag' },
      // { title: 'Custom Buttons', value: CUSTOM_BUTTONS},
    ],
  },
  {
    title: 'Area',
    value: 'area',
    answerTypes: [
      { title: 'Input', value: 'input' },
      { title: 'Custom Buttons', value: CUSTOM_BUTTONS },
    ],
  },
  {
    title: 'Tables',
    value: 'table',
    answerTypes: [
      { title: 'Input', value: 'input' },
      // { title: 'Custom Buttons', value: CUSTOM_BUTTONS},
    ],
  },
  {
    title: 'Number Tables',
    value: 'number_table',
    answerTypes: [{ title: 'Input', value: 'input' }],
  },
  {
    title: 'Calendars',
    value: 'calendar',
    answerTypes: [{ title: 'Input', value: 'input' }],
  },
]

export const PROBLEM_TYPES_ENUM = {
  sequence: 'sequence',
  number_line: 'number_line',
  number_story: 'number_story',
  clock: 'clock',
  money: 'money',
  compare: 'compare',
  even_odd: 'even_odd',
  counting: 'counting',
  math_problem: 'math_problem',
  // puzzle: 'puzzle',
  pattern: 'pattern',
  diagram: 'diagram',
  sorting: 'sorting',
  area: 'area',
  table: 'table',
  number_table: 'number_table',
  calendar: 'calendar',
  no_problem_type: '',
}

export const answerStr = (val) => {
  const item = ANSWER_TYPES.find((x) => x.value === val)
  return item ? item.title : ''
}

export const problemStr = (val) => {
  const item = PROBLEM_TYPES.find((x) => x.value === val)
  return item ? item.title : ''
}

export const pageStr = (val) => {
  const item = PAGE_LAYOUTS.find((x) => x.value === val)
  return item ? item.title : ''
}

// export const shuffle = (array) => {
//   var currentIndex = array.length, temporaryValue, randomIndex;

//   // While there remain elements to shuffle...
//   while (0 !== currentIndex) {

//     // Pick a remaining element...
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex -= 1;

//     // And swap it with the current element.
//     temporaryValue = array[currentIndex];
//     array[currentIndex] = array[randomIndex];
//     array[randomIndex] = temporaryValue;
//   }

//   return array;
// }

export function convertToFormData(data, formData, parentKey) {
  if (data === null || data === undefined) return null

  formData = formData || new FormData()

  if (
    typeof data === 'object' &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach((key) =>
      convertToFormData(
        data[key],
        formData,
        !parentKey
          ? key
          : data[key] instanceof File
          ? parentKey
          : `${parentKey}[${key}]`,
      ),
    )
  } else {
    formData.append(parentKey, data)
  }

  return formData
}

export const agesData = [
  { id: '4-5', name: '4-5' },
  { id: '5-6', name: '5-6' },
  { id: '6-7', name: '6-7' },
  { id: '7-8', name: '7-8' },
  { id: '8-9', name: '8-9' },
  { id: '9-10', name: '9-10' },
  { id: '10-11', name: '10-11' },
  { id: '11-12', name: '11-12' },
  { id: '12-13', name: '12-13' },
  { id: '13-14', name: '13-14' },
  { id: '14-15', name: '14-15' },
  { id: '15-16', name: '15-16' },
  { id: '16-17', name: '16-17' },
  { id: '17-18', name: '17-18' },
]

export const subjectData = [
  { id: 1, name: 'Math' },
  { id: 2, name: 'English' },
  { id: 3, name: 'Science' },
  { id: 4, name: 'Social Studies' },
]

export const ROLES = {
  teacher: 1,
  student: 2,
  parent: 3,
  author: 4,
}

export const PrintableStatusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'in review', label: 'In review' },
  { value: 'active', label: 'Active' },
  { value: 'rejected', label: 'Rejected' },
]

export const PRINT_STATUS_ENUM = {
  draft: 'draft',
  in_review: 'in review',
  active: 'active',
  rejected: 'rejected',
}

export const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const yearList = times(30).map((x) => 2021 - x)

export const getLabelByValue = (arr, val) =>
  arr.find((x) => x.value === val)?.label || 'No name'

export const getImages = (string) => {
  const imgRex = /<img.*?src="(.*?)"[^>]+>/g
  const images = []
  let img
  while ((img = imgRex.exec(string))) {
    images.push(img[1])
  }
  return images
}

export const toJSON = (value) => {
  let parsed = {}

  if (!value) return parsed

  try {
    parsed = typeof value === 'string' ? JSON.parse(value) : value
  } catch (error) {
    console.log('Error parse json', value, error)
  }

  return parsed
}

export const toAnswerObject = (strValue) =>
  strValue.split(',').reduce((acc, val) => {
    acc[val] = true
    return acc
  }, {})

export const arrayToObject = (arr) => {
  const obj = arr.reduce((acc, val, idx) => {
    acc[idx] = val
    return acc
  }, {})

  return obj
}

export const getClockAngle = (hours, minutes) => {
  hours %= 12
  return hours * 30 + (Number(minutes) / 60) * 30
}

export const strMoney = (money) =>
  `${Number.parseInt(money / 100, 10)}.${
    money % 100 > 0 ? money % 100 : `0${money % 100}`
  }`

export const RIGHT = 'right'
export const WRONG = 'wrong'

export const romanize = (num) => {
  if (Number.isNaN(num)) return Number.NaN
  const digits = String(+num).split('')
  const key = [
    '',
    'C',
    'CC',
    'CCC',
    'CD',
    'D',
    'DC',
    'DCC',
    'DCCC',
    'CM',
    '',
    'X',
    'XX',
    'XXX',
    'XL',
    'L',
    'LX',
    'LXX',
    'LXXX',
    'XC',
    '',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
  ]
  let roman = ''
  let i = 3
  while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman
  return new Array(+digits.join('') + 1).join('M') + roman
}

export const getQuestionImageUrl = (question_picture) =>
  question_picture
    ? question_picture.indexOf('question_pictures') === 0
      ? `${process.env.REACT_APP_S3_HOST}/${question_picture}`
      : question_picture
    : null

export const trimAnswer = (val) => String(val).toLocaleLowerCase().trim()

export const intersection = (array1, array2) =>
  array1.filter((value) => array2.includes(value))

// export const toggle = (S, x) => {
//   S[x] = 1 - (S[x]|0);
// }

export const isNull = (val) => val === null || val === undefined || val === ''

export const getSequence = ({
  minValue,
  maxValue,
  inc = 1,
  reverse = 0,
  hCount = 2
}) => {
  let values = maxValue - minValue + 1 // /Math.abs(inc)

  if (values > 10) values = 10

  const count = getRandomArbitrary(values / 2, values)

  const fromMin = minValue
  const fromMax = maxValue - count

  const from = getRandomArbitrary(fromMin, fromMax)
  console.log({ fromMin, fromMax, from, count })

  let sequence = times(count).map((_, i) => from + i * inc)
  const answers = {}

  console.log({ sequence })

  let hiddenCount = 0
  sequence = sequence.map((x) => {
    let hidden = getRandomArbitrary(0, 1)

    if (hidden) {
      hiddenCount += 1
    }

    if (hiddenCount >= hCount) {
      hiddenCount = 0
      hidden = 0
    }

    return {
      value: x,
      hidden,
    }
  })

  if (reverse) {
    sequence = sequence.reverse()
  }

  // const answers = sequence.filter(x => x.hidden === 1)
  sequence.forEach((x, i) => {
    if (x.hidden) {
      answers[i] = x.value
    }
  })

  console.log('sequence', sequence)
  console.log('answers', answers)

  return { sequence, answers }
}

export const getTables = ({
  minValue,
  maxValue,
  minCount,
  maxCount,
  inc = 1,
  // reverse = 0,
  fixedHidden = 0,
}) => {
  let question = 'Fill in the correct answers'
  let incValue = inc

  if (Array.isArray(inc)) {
    const [min, max] = inc
    incValue = getRandomArbitrary(min, max)
  }

  const count = getRandomArbitrary(minCount, maxCount)

  const fromMin = minValue - incValue
  const fromMax = maxValue + incValue

  const answers = []
  let items = times(count).map(() => getRandomArbitrary(fromMin, fromMax))

  items = [...new Set(items)]

  items = items.map((x, i) => {
    let hidden = getRandomArbitrary(1, 2)

    if (i === 0) {
      hidden = 0
    } else if (fixedHidden > 0) {
      hidden = fixedHidden
    } else {
      if (hidden === 1) {
        answers[i] = { label: x }
      }
      if (hidden === 2) {
        answers[i] = { value: x }
      }
    }

    return {
      label: String(x),
      value: String(x + incValue),
      hiddenLabel: hidden === 1,
      hiddenValue: hidden === 2,
    }
  })

  question =
    incValue > 0
      ? `Additional ${incValue}`
      : `Subtraction ${Math.abs(incValue)}`

  const extra = {
    type: 'table',
    buttons: [],
    buttonsType: 'custom',
    resource: question,
    headers: {
      label: 'In',
      value: 'Out',
    },
    items,
    problemType: 'table',
  }

  return { extra, answers, question }
}

export const getFractions = (body) => {
  const question = 'Fill in the correct answers'
  let answer_true = math.format(math.evaluate(body), { fraction: 'ratio' })

  if (answer_true === '0/1') {
    answer_true = 0
  }

  const extra = {
    problemType: 'math_problem',
    type: 'fraction',
    body,
  }

  return { extra, answer_true, question }
}
