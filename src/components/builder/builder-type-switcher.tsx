import { PROBLEM_TYPES_ENUM } from 'src/tools'
// import { SequenceBuilder } from './problem-types/sequence/builder'
import { NumberStoryBuilder } from './problem-types/number_story/builder'
// import { NumberLineBuilder } from './problem-types/number_line/builder'
// import { ClockBuilder } from './problem-types/clock/builder'
// import { CompareBuilder } from './problem-types/compare/builder'
// import { EvenOddBuilder } from './problem-types/even_odd/builder'
// import { MoneyBuilder } from './problem-types/money/builder'
// import { CountingBuilder } from './problem-types/counting/builder'
// import { MathProblemBuilder } from './problem-types/math_problem/builder'
// import { PatternBuilder } from './problem-types/pattern/builder'
// import { DiagramBuilder } from './problem-types/diagram/builder'
// import { SortingBuilder } from './problem-types/sorting/builder'
// import { AreaBuilder } from './problem-types/area/builder'
// import { TableBuilder } from './problem-types/table/builder'
// import { NumberTableBuilder } from './problem-types/number_table/builder'
// import { CalendarBuilder } from './problem-types/calendar/builder'

// TODO
export type BuilderTypeSwitcherProps = any;

export default function BuilderTypeSwitcher(props: BuilderTypeSwitcherProps) {
  // console.log('props', props)

  switch (props.problem_type) {
    // case PROBLEM_TYPES_ENUM.sequence: {
    //   return <SequenceBuilder {...props} />
    // }

    case PROBLEM_TYPES_ENUM.number_story: {
      return <NumberStoryBuilder {...props} />
    }

    // case PROBLEM_TYPES_ENUM.number_line: {
    //   return <NumberLineBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.clock: {
    //   return <ClockBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.money: {
    //   return <MoneyBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.compare: {
    //   return <CompareBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.even_odd: {
    //   return <EvenOddBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.counting: {
    //   return <CountingBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.math_problem: {
    //   return <MathProblemBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.pattern: {
    //   return <PatternBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.diagram: {
    //   return <DiagramBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.sorting: {
    //   return <SortingBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.area: {
    //   return <AreaBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.table: {
    //   return <TableBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.number_table: {
    //   return <NumberTableBuilder {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.calendar: {
    //   return <CalendarBuilder {...props} />
    // }

    // case '':
    // case null: {
    //   return <div>Select Problem type</div>
    // }

    default: {
      return <div>Unsupported builder type</div>
    }
  }
}
