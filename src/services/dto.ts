/* eslint-disable @typescript-eslint/ban-types */
export interface PaginateRequest {
  page?: number
  perPage?: number
}

export interface PaginateResponse {
  total: number;
  page: number;
  perPage: number;
}

export interface QueryRequest {
  query: string
}

export interface ImagesRequest {
  images: any[]
}

export interface  MessageResponse {
  message?: string
  error?: string
}


// User and Auth
export interface UpdateUserData {
  avatar: string | null
  description: string | null
  first_name: string
  last_name: string
  location: string | null
  video: File
  email: string
  trialLessonPrice: number | null
  lessonPrice: number | null
  default_grade_id: number | null
  default_subject_id: number | null
  view_states: any
  verified: null | boolean
  weekdays_schedule: null
  holidays_schedule: null
  work_experience: null
  lesson_time: null | number
  trial_lesson_time: null | number
  header_image: null
  social: null
  awards: null
  profession: null|string
  website: null|string

}

export type UserData = UpdateUserData & {
  id: number
  email_verified_at: string | null
  created_at: string | null
  updated_at: string | null
  role_id: number
  stripe_id: string | null
  username: string
  age: number | null
  author: number
  status: string
  deleted_at: string | null
  sales_balance: number
}

export interface LoginRequest {
  login: string
  password: string
  remember: boolean
}

export interface LoginResponse {
  user: UserData
  token: string
}

export interface RegisterRequest {
  email: string
  password: string
  role_id: number
  full_name: string
  age?: number
}

export interface RegisterResponse {
  user: {
    first_name: string
    last_name: string
    email: string
    role_id: number
    age: number
    updated_at: string
    created_at: string
    id: number
  }
  token: string
}

export interface ResetPasswordRequest {
  email: string
}

export interface ResetPasswordResponse {
  message: string
}

export interface UpdateProfile {
  message: string
}


export interface ProfileResponse {
  user: UserData
}

export interface ProfileAvatarRequest {
  user_image: File
}

export interface ProfileVideoRequest {
  user_video: File
}

// Library
export type TopicsRequest = PaginateRequest & {
  ages?: string[]
  subject_id?: number
  grade_id?: number
  levels?: boolean
}

export type LevelsRequest = PaginateRequest & {
  grade_id: number
  topic_id: number
}


// Practices and Tests
export type PracticesRequest = PaginateRequest & {
  subject_id?: number;
  grade_id?: number;
  topic_id?: number;
  status?: string;
  query?: string;
  order?: string;
  level_ids?: number[];
  period?: string;
}

export type PracticesResponse = PaginateResponse & {
  items: any[]; // TODO
}


// Classrooms
export type ClassroomsRequest = PaginateRequest & {
  subject_id?: number;
  grade_id?: number;
  status?: string;
  query?: string;
  order?: string;
}

export interface SingleClassroomRequest {
  name: string;
  description: string;
  grade_id: number;
  subject_id: number[];
  active: number;
  color: string;
  status: string;
  schedule: string;
}

export type ClassroomsResponse = PaginateResponse & {
  items: any[]; // TODO
}


// Teacher Students
export interface StudentsListRequest {
  page?: number;
  perPage?: number;
  classroom_id?: number;
  grade_id?: number;
  subject_id?: number;
  period?: string;
}

interface StudentClassroom {
  id: number;
  name: string;
  description: string | null;
  grade_id: number;
  color: string | null;
  subject_id: number;
  pivot: {
      user_id: number;
      classroom_id: number;
  },
  subject: {
      id: number;
      name: string;
  },
  grade: {
      id: number;
      name: string;
      ages: string;
  }
}

export type StudentsListResponse = PaginateResponse & {
  items: {
    id: number;
    first_name: string;
    last_name: string;

    email: string;
    avatar: string | null;
    location: string | null;
    video: string | null;
    student_classrooms: StudentClassroom[]
  }
}

export type StudentsExtendedListResponse = PaginateResponse & {
  items: {
    id: number;
    first_name: string;

    role_id: number;
    tests_count: number;
    practices_count: number;
    tests_score: number;
    progress: number;
    practices_score: number;
    tests_done: number;
    help: number;

    student_classrooms: StudentClassroom[]
  }
}

// Students Report
export interface StudentsReportRequest {
  classroom_id?: number;
  period?: string;
}

export interface StudentDetailsRequest {
  classroom_id?: number;
  subject_id?: number;
  period?: string;
  start: string;
  end: string;
}

export interface StudentDetailsResponse{
  item: {
    id: number;
    first_name: string;
    email: string;
    email_verified_at: string | null,
    created_at: string | null,
    updated_at: string | null,
    last_name: string,
    role_id: number;
    avatar: string | null,
    location: string | null,
    description: string | null,
    video: string | null,
    stripe_id: string | null,
    trialLessonPrice: number | null,
    lessonPrice: string | null,
    default_grade_id: string | null,
    default_subject_id: string | null,
    username: string,
    age: number;
    view_states: {
        shopStep: number;
        downloadStep: number;
        dashboardTile: number;
    },
    verified: number;
    author: number;
    status: string;
    deleted_at: string | null;
    weekdays_schedule: string | null;
    holidays_schedule: string | null;
    lesson_time: string | null;
    trial_lesson_time: string | null;
    work_experience: [
        {
            company: string | null;
            website: string | null;
            end_year: string | null;
            location: string | null;
            position: string | null;
            end_month: string | null;
            profession: string | null;
            start_year: string | null;
            start_month: string | null;
        }
    ],
    header_image: string | null;
    social: [],
    awards: [
        { image: string; }
    ],
    profession: null,
    website: null,
    sales_balance: number;
    stat90: number;
    stat80: number;
    stat70: number;
    stat69: number;
    tasksStat: [],
    practices_total: number;
    practices_done: number;
    practices_avg_score: number;
    tests_total: number;
    tests_done: number;
    tests_avg_score: number;
  }
}



// ===
export interface CompleteLessonRequest {
  classroom_id?: string;
  task_log_id: string;
}

export interface StartLessonRequest{
  level_id?: string;
  task_id?: string;
}

export interface SubmitAnonymousRequest {
  question_id: string;
  session_id: string;
}

export interface SubmitAnswerRequest {
  correct: boolean;
  time_spent: number;
  answer: any;
  // task_id: practice.id,
  task_log_id: number;
  question_id: number;
}


// Achievements
export interface AchievementsData {
  levels: {
    classroom_levels: any[];
    parent_levels: any[];
    self_levels: any[];
  },
  awards: {
    parent_awards: any[];
    classroom_awards: any[];
  },
  certificates: {
    earned: {
      classroom_certificates: any[];
      parent_certificates: any[];
      self_certificates: any[];
    },
    upcoming:{
      classroom_certificates: any[];
      parent_certificates: any[];
      self_certificates: any[];
    }
  },
  stickers:{
    earned:{
      classroom_stickers: any[];
      self_stickers: any[];
    },
    upcoming:{
      classroom_stickers: any[];
      self_stickers: [
        {
          sticker_image: string | null,
          name: string;
          id: number;
          subject_id: number;
          grade_id: number;
          progress:{
            earned: number;
            total:number;
          },
          subject:{
            id: number;
            name: string;
          },
          grade:{
            id: number;
            name: string;
          }
        }
      ]
    }
  },
  total_points: number;
}

export interface AchievementsDataResponse {
  item: AchievementsData;
}



// Printables
export interface SinglePrintableRequest {
  sales_id: number;
  title: string;
  subject_id: number;
  grades: number[];
  ages: number[];
  description: string;
  resources: string[];
  sort: number;
  active: number;
  price: number;
  file_description: string;
  pages_count: number;
  themes: number[];
  topics: number[];
  file: string[],
  images: string[],
  status: string;
  practice_url: string;
}

export type PrintableResponse = {
  id: number;
  sales_id: number;
  title: string;
  subject_id: number;
  grades: [
    {
      id: number;
      name: string;
      ages: string;
    }
  ];
  ages: string | null;
  description: string;
  images: string[];
  resources: null;
  sort: number | null,
  created_at: string;
  updated_at: string;
  price: number | null;
  file: string[];
  file_description: string;
  author_id: number | null;
  image: string | null;
  pages_count: number | null;
  file_size: number | null;
  themes: number[],
  topics: [
    {
      id: number;
      name: string;
    }
  ];
  new: number;
  slug: string;
  is_best: boolean;
  status: string;
  previous_id: number | null;
  rejected_reason: string | null;
  deleted_at: string | null;
  practice_url: string | null;
  subject: {
    id: number;
    name: string;
  }
}

export type SinglePrintableResponse = PaginateResponse & {
  items: PrintableResponse[]
}

export type PrintablesResponse = PaginateResponse & {
  item: PrintableResponse
}

export interface PrintableTheme {
  id: number;
  name: string;
  sort: number;
  active: number;
  created_at: string;
  updated_at: string;
  parent_id: number | null;
}

export type PrintableThemesResponse = {
  items: PrintableTheme[];
}


// Invite
export type SendInviteRequest = PaginateRequest & {
  student_id: number;
  classroom_id: number;
}

export type GetInvitesRequest = PaginateRequest & {
  status: number;
  type: string;
}

export type GetInvitesResponseData = PaginateResponse & {
  invite: [
    {
      id: number;
      classroom_id: number;
      inviter_email: string;
      inviter_user_id: number;
      invited_email: string;
      invited_user_id: number;
      status: string;
      events: [
        {
            [key: string]: string;
            timestamp: string;
        }
      ],
      created_at: string;
      updated_at: string;
    },
  ],
}

// Events
export interface GetEventsRequest {
  start_date: string;
  end_date: string;
}

export interface EventPart {
  title: string;
  content: string;
  note: string;
  active: boolean;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  recurrence_type: number;
  status: number;
}

export type GetEventsResponse = {
  item: {
    [key: string]: {
      event: [ EventPart & {
        id: number;
        user_id: number;
        created_by_id: number;
        files: null;
        created_at: string | null;
        updated_at: string | null;
      }]
    }
  }
}

export type GetSingleEventResponse = {
  event: EventPart & {
    id: number;
    user_id: number;
    created_by_id: number;
    files: null;
    created_at: string | null;
    updated_at: string | null;
  }
}

export type CreateEventRequest = EventPart;

export type CreateClassroomEventRequest = EventPart & {
  classroom_id: number;
};


// Images
export interface ImagesResponse {
  items: {
    [key: string]: string[];
  }
};
export type ImageCollectionsResponse = ImagesResponse;

export type ImageCollectionNamesResponse = ImagesResponse;

export interface ProblemTypesResponse {
  items: [
    {
      id: number;
      name: string;
      sort: number;
      active: number;
      created_at: string | null;
      updated_at: string | null;
      question_titles_list: string[];
    }
  ]
}

export interface NotificationsResponse {

}

// Images



// Tasks

export interface Question {
  id: number;
  answer_type: string;
  problem_type: string;
  question: string;
  question_picture: string | null;
  answer_true: string | null;
  answer_false: string | null;
  almost: string | null;
  hint: string | null;
  hint_picture: string | null;
  solution: string | null;
  solution_picture: string | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
  extra: string | null;
  data: string | null;
  images: string[] | null;
  question_images: string[] | null;
  answer_true_images: string[] | null;
  answer_false_images: string[] | null;
  level_id: number | null;
  auto: number;
  solution_images: string[] | null;
  hint_images: string[] | null;
};

export interface QuestionRequest {
  answer_type: string;
  problem_type: string;
  question: string;
  question_picture: string;
  answer_true: string;
  answer_false: string;
  almost: string;
  hint: string;
  hint_picture: string;
  solution: string;
  solution_picture: string;
  sort_order: number;
  extra: string | null,
}

export interface SingleTaskResponse {
  item: {
    subject_id: number;
    topic_id: number;
    grade_id: number;
    level_ids: number[];
    description: string;
    active: number;
    color: string;
    title: string;
    page_layout: string;
    time: number;
    total: number;
    show_in_marketplace: number;
    price: number;
    status: string;
    teacher_id: number;
    created_by_id: number;
    updated_at: string;
    created_at: string;
    id: number;
    filled: number;
    grade: {
      id: number;
      name: string;
    };
    subject: {
      id: number;
      name: string;
    };
    topic: {
      id: number;
      name: string;
    };
    created_by: {
      id: number;
      first_name: string;
      last_name: string;
    };
    questions: Question[];
  }
}



export interface TaskRequest {

}

export interface TaskItemResponse {
  topic_id: number;
  grade_id: number;
  description: string;
  active: number;
  subject_id: number;
  type: number;
  status: number;
  color: string;
  title: string;
  page_layout: string;
  time: number;
  total: number;
  level_ids: number[];
  teacher_id: number;
  show_in_marketplace: number;
  price: number;
  created_by_id: number;
  task_generated: number;
  questions: Question[],
  levels: [
    {
      id: number;
      name: string;
      active: number;
      created_at: string | null;
      updated_at: string | null;
      topic_id: number;
      template: string | null;
      answer_type: string;
      problem_type: string;
      answer_true: string | null;
      answer_false: string | null;
      questions_id: number | null;
      conditions: string | null;
      sort: number;
      slug: string;
      deleted_at: string | null;
      hint_user_id: number | null;
      solution_user_id: number | null;
      problem_types_params: string | null;
      default_hint: string | null;
      default_solution: string | null;
      view_type: string | null;
      page_layout: string | null;
      default_question_title: string;
      expression: string | null;
      verified_questions_stats: {
        auto: number;
        manual: number;
      };
      average_score: string | null;
      last_visit: string | null;
      visit_stats: number[ ];
      hint: string | null;
      solution: string | null;
      topic: {
        id: number;
        name: string;
        active: number
        subject_id: string;
        created_at: string | null;
        updated_at: string;
        grade_id: number;
        sort: number;
        deleted_at: string | null;
        sticker_image: string | null;
      };
    }
  ];
  grade: {
    id: number;
    name: string;
  };
  subject: {
    id: number;
    name: string;
  };
  topic: {
    id: number;
    name: string;
  };
}

export interface GuestTaskItemResponse {
  item: TaskItemResponse;
  session_id: string;
}

// Assigns
export interface AssignPracticeToClassroomRequest {
  task_id: number;
  started_at: string;
  finished_at: string;
}

// Public Lesson
export interface Lesson {
  id: number;
  user_id: number;
  title: string;
  subject_id: number;
  general_details: string;
  details: string;
  images: string[],
  sort: number,
  file: string;
  created_at: string;
  updated_at: string;
  grades: [{
    id: number;
    name: string
    ages: string;
  }],
  template: string;
  meta_title: string;
  meta_description: null;
  meta_keywords: null;
  image: string;
  slug: string;
  status: string;
  deleted_at: string | null;
  paid: null,
  content: string;
  ages: string[];
  topics: [{
    id: number;
    name: string;
  }]
  subject: {
    id: number;
    name: string;
  }
}


export type LessonsResponse = PaginateResponse & {
  items: Lesson[];
}

export type SingleLessonResponse = PaginateResponse & {
  items: Lesson[];
}

export interface SingleLessonRequest {
  ages: string[];
  grades: number[];
  title: string;
  subject_id: number;
  description: string;
  sort?: number;
  active?: number;
  price?: number;
  file_description?: string;
  pages_count?: number;
  themes: number[];
  topics: number[];
  file: string[];
  images: string[];
  status: string;

  general_details: string;
  details: string;
  template: string;
  topic_ids: number[];

  subtitle: string;
}



// Childs
export interface CreateChildRequest {
  first_name: string;
  username: string;
  age: number;
  password: string;
}
