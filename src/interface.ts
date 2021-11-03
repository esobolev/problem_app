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
