import { PROBLEM_TYPES_ENUM } from 'src/tools'
// import { SequenceViewer } from './problem-types/sequence/viewer'
import { NumberStoryViewer } from './problem-types/number_story/viewer'
import { NumberLineViewer } from './problem-types/number_line/viewer'
// import { ClockViewer } from './problem-types/clock/viewer'
// import { MoneyViewer } from './problem-types/money/viewer'
// import { CompareViewer } from './problem-types/compare/viewer'
// import { EvenOddViewer } from './problem-types/even_odd'
// import { CountingViewer } from './problem-types/counting/viewer'
// import { MathProblemViewer } from './problem-types/math_problem/viewer'
// import { PatternViewer } from './problem-types/pattern/viewer'
// import { DiagramViewer } from './problem-types/diagram/viewer'
// import { SortingViewer } from './problem-types/sorting/viewer'
// import { AreaViewer } from './problem-types/area/viewer'
// import { TableViewer } from './problem-types/table/viewer'
// import { NumberTableViewer } from './problem-types/number_table/viewer'
// import { CalendarViewer } from './problem-types/calendar/viewer'

// TODO
export type ViewerTypeSwitcherProps = any;

export default function ViewerTypeSwitcher(props: ViewerTypeSwitcherProps) {
  const { problem_type } = props;

  switch (props.problem_type) {
    // case PROBLEM_TYPES_ENUM.sequence: {
    //   return <SequenceViewer {...props} />
    // }

    case PROBLEM_TYPES_ENUM.number_story: {
      return <NumberStoryViewer {...props} />
    }

    case PROBLEM_TYPES_ENUM.number_line: {
      return <NumberLineViewer {...props} />
    }

    // case PROBLEM_TYPES_ENUM.clock: {
    //   return <ClockViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.money: {
    //   return <MoneyViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.compare: {
    //   return <CompareViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.even_odd: {
    //   return <EvenOddViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.counting: {
    //   return <CountingViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.math_problem: {
    //   return <MathProblemViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.pattern: {
    //   return <PatternViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.diagram: {
    //   return <DiagramViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.sorting: {
    //   return <SortingViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.area: {
    //   return <AreaViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.table: {
    //   return <TableViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.number_table: {
    //   return <NumberTableViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.calendar: {
    //   return <CalendarViewer {...props} />
    // }

    // case PROBLEM_TYPES_ENUM.no_problem_type: {
    //   return <div>No problem type</div>
    // }

    default: {
      return <div>{problem_type} - Unsupported viewer type</div>
    }
  }
}
