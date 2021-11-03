/* eslint-disable */
import {
  rand,
  randItem,
  toJSON,
  getRandomArbitrary,
  getSequence,
  getTables,
  getFractions,
} from 'src/tools'

export const generator = (task) => {
  try {
    console.log('generator', task)

    const condition = toJSON(task.condition)
    const { count } = task

    let totalProblems = []
    let retry = 0

    for (let i = 0; i < count; i++) {
      let problem = condition.expression

      console.log('problem', problem)

      problem = `${rand};${randItem};${problem
        .replaceAll('[', 'getRandomArbitrary(')
        .replaceAll(']', ')')
        .replaceAll('{{', 'randItem([')
        .replaceAll('}}', '])')}`
      // .replaceAll('{{', 'randItem([')
      // .replaceAll('}}', '])')
      // .replaceAll('{{', '[')
      // .replaceAll('}}', ']')

      console.log('modify', problem)
      problem = eval(problem)
      console.log('problem2', problem)

      if (totalProblems.includes(problem)) {
        retry++
        i--
      } else {
        totalProblems.push(problem)
      }

      if (retry > count * 3) {
        break
      }
    }

    // console.log('totalProblems', totalProblems)

    totalProblems = totalProblems.map((x) => {
      let body = x
      let answer_true = null
      let buttons = []
      let buttonsType = null

      if (body?.answer_true) {
        answer_true = body.answer_true
      }
      if (body?.buttonsType) {
        buttonsType = body.buttonsType
      }
      if (body?.buttons && Array.isArray(body?.buttons)) {
        buttons = body.buttons.map((x) => ({ label: x, value: x }))
      }

      if (body?.body) {
        body = body.body
      }

      if (condition.problem_type === 'math_problem') {
        if (condition.type === 'custom_expression') {
          if (condition.sub_type === 'missed_number') {
            const matches = body.match(/\d+/g)

            const r = getRandomArbitrary(0, matches.length - 1)

            let index = 0
            body = body.replace(/\d+/g, (x) => {
              console.log(x, index)

              if (index === r) {
                answer_true = x
                index++
                return `[${x}]`
              }
              index++
              return x
            })
          } else if (condition.sub_type === 'missed_sign') {
            // TODO
          }
        } else if (condition.type === 'fraction') {
          const { extra, answer_true, question } = getFractions(body)

          return {
            answer_true,
            problem_type: condition.problem_type,
            answer_type: condition.answer_type,
            auto: 1,
            question,
            extra: JSON.stringify(extra),
          }
        } else if (condition.type === 'math_problem') {
          try {
            answer_true = eval(body)
          } catch (error) {
            console.log('error', error)
          }
        } else {
          try {
            answer_true = eval(body)
          } catch (error) {
            console.log('error', error)
          }
        }

        console.log('answer_true', answer_true)

        return {
          answer_true,
          problem_type: condition.problem_type,
          answer_type: condition.answer_type,
          auto: 1,
          extra: JSON.stringify({
            type: condition.type || 'auto_math',
            body,
            sub_type: condition.sub_type,
            digitType: condition.digitType || 'arabic',
            buttons,
            buttonsType,
          }),
          question: condition.title || 'Solve the problem',
        }
      }
      if (condition.problem_type === 'compare') {
        return {
          answer_true,
          problem_type: condition.problem_type,
          answer_type: condition.answer_type,
          auto: 1,
          extra: JSON.stringify({
            type: 'numbers',
            buttons: [],
            buttonsType: 'custom',
            variants: {
              left: body.left,
              right: body.right,
            },
            asImages: false,
            digitType: 'arabic',
            problemType: 'compare',
          }),
          question:
            condition.title || 'Select phrase below to make true statement',
        }
      }
      if (condition.problem_type === 'sequence') {
        const { sequence, answers } = getSequence(body)

        return {
          answer_true: JSON.stringify(answers),
          problem_type: condition.problem_type,
          answer_type: condition.answer_type,
          auto: 1,
          extra: JSON.stringify(sequence),
          question:
            condition.title || 'Type the missing number in this sequence',
        }
      }
      if (condition.problem_type === 'table') {
        const { extra, answers, question } = getTables(body)

        return {
          answer_true: JSON.stringify(answers),
          problem_type: condition.problem_type,
          answer_type: condition.answer_type,
          auto: 1,
          question,
          extra: JSON.stringify(extra),
        }
      }
    })

    return totalProblems
  } catch (error) {
    console.log('generator error', error)
  }
}
