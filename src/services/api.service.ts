import axios, { AxiosRequestConfig } from 'axios'
import { getCookie } from 'src/services/storage'
import { openNativeLink } from 'src/tools/open'
import {
  UpdateUserData,
  UserData,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  MessageResponse,
  ProfileResponse,
  ProfileAvatarRequest,
  ProfileVideoRequest,
  TopicsRequest,
  LevelsRequest,
  StartLessonRequest,
  SubmitAnonymousRequest,
  CompleteLessonRequest,
  SubmitAnswerRequest,
  AchievementsDataResponse,
  SendInviteRequest,
  GetInvitesRequest,
  GetInvitesResponseData,
  CreateEventRequest,
  GetEventsRequest,
  GetEventsResponse,
  CreateClassroomEventRequest,
  GetSingleEventResponse,
  ImageCollectionNamesResponse,
  ProblemTypesResponse,
  NotificationsResponse,
  ImageCollectionsResponse,
  ImagesResponse,
  PracticesResponse,
  PracticesRequest,
  ClassroomsRequest,
  ClassroomsResponse,
  SingleClassroomRequest,
  StudentsListRequest,
  StudentsListResponse,
  StudentsExtendedListResponse,
  StudentsReportRequest,
  StudentDetailsRequest,
  StudentDetailsResponse,
  PrintablesResponse,
  PrintableThemesResponse,
  QueryRequest,
  ImagesRequest,
  SinglePrintableRequest,
  SinglePrintableResponse,
  LessonsResponse,
  SingleLessonResponse,
  SingleLessonRequest,
  TaskRequest,
  SingleTaskResponse,
  AssignPracticeToClassroomRequest,
  QuestionRequest,
  CreateChildRequest,
  GuestTaskItemResponse,
} from './dto'

const HOST = process.env.REACT_APP_API_HOST || ''

const getAuthOptions = (): AxiosRequestConfig => {
  const token = getCookie('token')

  const defaultConfig: AxiosRequestConfig = {
    baseURL: `${HOST}/api`,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  }

  if (token) {
    defaultConfig.headers.Authorization = `Bearer ${token}`
  }

  return defaultConfig
}

const request = {
  get: <T>(url: string, options = {}) =>
    axios.get<T>(url, { ...getAuthOptions(), ...options }),

  post: <T>(url: string, data: any, options = {}) =>
    axios.post<T>(url, data, { ...getAuthOptions(), ...options }),

  patch: <T>(url: string, data: any, options = {}) =>
    axios.patch<T>(url, data, { ...getAuthOptions(), ...options }),

  delete: <T>(url: string, options = {}) =>
    axios.delete<T>(url, { ...getAuthOptions(), ...options }),
}


export const loginRequest = (data: LoginRequest) =>
  axios.post<LoginResponse>(`${HOST}/api/login`, data)

export const sendResetPasswordLinkRequest = (data: ResetPasswordRequest) =>
  axios.post<ResetPasswordResponse>(`${HOST}/api/send-reset-password-link`, data)


// With Authorization token
export const logoutRequest = () =>
  request.post(`/logout`, {})

export const registerRequest = (data: RegisterRequest) =>
  request.post<RegisterResponse>(`/registration`, data)

export const getProfileRequest = () =>
  request.get<ProfileResponse>(`/profile`)

export const updateProfileRequest = (data: UpdateUserData) =>
  request.patch<MessageResponse>(`/profile`, data)

export const uploadAvatar = (data: ProfileAvatarRequest) =>
  request.post<ProfileResponse>(`/profile/picture`, data )

export const deleteAvatar = () =>
  request.delete<MessageResponse>(`/profile/picture`)

export const uploadVideo = (data: ProfileVideoRequest) =>
  request.post<ProfileResponse>(`/profile/video`, data)

export const deleteVideo = () =>
  request.delete<MessageResponse>(`/profile/video`)

export const getTopicsRequest = (data: TopicsRequest) =>
  request.get(`/topics`, { params: data })

export const getLevelsRequest = (data: LevelsRequest) =>
  request.get(`/levels`, { params: data })




// Practices
export const getResourcesRequest = (type = 'practices', data: PracticesRequest, role: string) =>
  request.get<PracticesResponse>(`/${role}/${type}`, { params: data })

export const createResourceRequest = (type = 'practices', data: TaskRequest) =>
  request.post<SingleTaskResponse>(`/teacher/${type}`, data, getAuthOptions())

export const updateResourceRequest = (type = 'practices', id: number, data: TaskRequest) =>
  request.patch<SingleTaskResponse>(`/teacher/${type}/${id}`, data, getAuthOptions())

export const getResourceRequest = (type = 'practices', id: number) =>
  request.get<SingleTaskResponse>(`/teacher/${type}/${id}`, getAuthOptions())

export const deleteResourceRequest = (type = 'practices', id: number) =>
  request.delete<MessageResponse>(`/teacher/${type}/${id}`, getAuthOptions())

// Assign practice to Classrooms
export const assignPracticeToClassroomRequest = (classroomId: number, data: AssignPracticeToClassroomRequest) =>
  request.post<MessageResponse>(`/teacher/classrooms/${classroomId}/queue`, data)

// Assign practice to Student
export const assignPracticeToStudentRequest = (studentId: number, data: AssignPracticeToClassroomRequest, role: string) => {
  const url =
    role === 'parent'
      ? `/parent/child/${studentId}/queue`
      : `/teacher/students/${studentId}/queue`

  return request.post<MessageResponse>(url, data)
}

// export const getMixedTaskRequest = (data) =>
//   request.get(`/get-task-mixed`, { params: data })

// Questions
export const getResourceQuestionsRequest = (type = 'practices', id: number) =>
  request.get(`/teacher/${type}/${id}/items`)

export const createResourceQuestionsRequest = (type = 'practices', id: number, data: QuestionRequest) =>
  request.post(`/teacher/${type}/${id}/items`, data)

export const getResourceQuestionRequest = ( type = 'practices', id: number, questionId: number ) =>
  request.get(`/teacher/${type}/${id}/items/${questionId}`)

export const updateResourceQuestionRequest = (type = 'practices', id: number, questionId: number, data: QuestionRequest ) =>
  request.post(`/teacher/${type}/${id}/items/${questionId}`, data
  )

export const deleteResourceQuestionRequest = (type = 'practices', id: number, questionId: number) =>
  request.delete(`/teacher/${type}/${id}/items/${questionId}`)

// Classrooms
export const getClassroomsRequest = (data: ClassroomsRequest ) =>
  request.get<ClassroomsResponse>(`/teacher/classrooms`, { params: data })

export const createClassroomRequest = (data: SingleClassroomRequest) =>
  request.post(`/teacher/classrooms`, data, getAuthOptions())

export const updateClassroomRequest = (id: number, data: SingleClassroomRequest) =>
  request.patch(`/teacher/classrooms/${id}`, data, getAuthOptions())

export const getClassroomRequest = (id: number) =>
  request.get(`/teacher/classrooms/${id}`, getAuthOptions())

export const deleteClassroomRequest = (id: number) =>
  request.delete(`/teacher/classrooms/${id}`, getAuthOptions())


// Teacher Students
export const getStudentsListRequest = (data: StudentsListRequest) =>
  request.get<StudentsListResponse>(`/teacher/students`, { params: data })

export const getStudentsRequest = (data: StudentsListRequest) =>
  request.get<StudentsExtendedListResponse>(`/teacher/students-extended`, { params: data })

export const getStudentsReportRequest = (data: StudentsReportRequest) =>
  request.get(`/teacher/report`, { params: data })

export const getStudentDetailsRequest = (id: number, data: StudentDetailsRequest) =>
  request.get<StudentDetailsResponse>(`/teacher/students/${id}`, { params: data })


// Invite student
export const sendInviteRequest = (data: SendInviteRequest) =>
  request.post<MessageResponse>(`/teacher/students/invite`, data)

export const getInvitesRequest = (data: GetInvitesRequest) =>
  request.get<GetInvitesResponseData>(`/invite`, { params: data })

export const acceptStudentInviteRequest = (id: number) =>
  request.post(`/student/invite/${id}/accept`, {})

export const rejectStudentInviteRequest = (id: number) =>
  request.post(`/student/invite/${id}/reject`, {})

export const cancelStudentInviteRequest = (id: number) =>
  request.patch(`/student/invite/${id}/cancel`, {})

export const deleteStudentInviteRequest = (id: number) =>
  request.delete(`/student/invite/${id}`)

export const acceptTeacherInviteRequest = (id: number) =>
  request.post(`/teacher/invite/${id}/accept`, {})

export const rejectTeacherInviteRequest = (id: number) =>
  request.post(`/teacher/invite/${id}/reject`, {})

export const cancelTeacherInviteRequest = (id: number) =>
  request.patch(`/teacher/invite/${id}/cancel`, {})

export const deleteTeacherInviteRequest = (id: number) =>
  request.delete(`/teacher/invite/${id}`)


// Teacher Events
export const getTeacherEvents = (data: GetEventsRequest) =>
  request.get<GetEventsResponse>(`/teacher/events`, { params: data })

export const createTeacherEvent = (data: CreateEventRequest) =>
  request.post<MessageResponse>(`/teacher/events`, data)

export const createTeacherClassroomEvent = (data: CreateClassroomEventRequest) =>
  request.post<MessageResponse>(`/teacher/events/create-for-classroom`, data)

export const getTeacherEvent = (id: number) =>
  request.get<GetSingleEventResponse>(`/teacher/events/${id}`)

export const updateTeacherEvent = (id: number, data: CreateEventRequest) =>
  request.patch<MessageResponse>(`/teacher/events/${id}`, data)

// ***** Student APIs ***** //
export const getDashboardLessonsRequest = (data = {}) =>
  request.get(`/student/lessons-week`, { params: data })

export const getStudentLessonsRequest = (data = {}) =>
  request.get(`/student/lessons`, { params: data })

export const getLessonRequest = (id: number) =>
  request.get(`/student/task/${id}`)


// Answers
export const submitAnswerRequest = (data: SubmitAnswerRequest) =>
  request.post(`/student/submit-answer`, data)

export const submitAnonymousRequest = (data: SubmitAnonymousRequest) =>
  request.post(`/guest/complete-question`, data)

export const getTaskStatus = (id: string) =>
  request.get(`/student/task/${id}`)

export const startLessonRequest = (data: StartLessonRequest) =>
  request.post(`/student/task/start`, data)

export const completeLessonRequest = (data: CompleteLessonRequest) =>
  request.post(`/student/task/complete`, data)

// Student Events
export const getStudentEvents = (data: GetEventsRequest) =>
  request.get<GetEventsResponse>(`/student/events`, { params: data })

export const createStudentEvent = (data: CreateEventRequest) =>
  request.post<MessageResponse>(`/student/events`, data)

export const getStudentEvent = (id: number) =>
  request.get(`/student/events/${id}`)

export const updateStudentEvent = (id: number, data: CreateEventRequest) =>
  request.patch(`/student/events/${id}`, data)

// ***** Parent APIs ***** //
export const getChildrenRequest = (data = {}) =>
  request.get(`/parent/children/extended`, { params: data })

export const getChildDetailsRequest = (id: number, data = {}) =>
  request.get(`/parent/children/${id}`, { params: data })

export const createChildRequest = (data: CreateChildRequest) =>
  request.post(`/parent/children`, data, getAuthOptions())

export const updateChildRequest = (id: number, data: CreateChildRequest) =>
  request.patch(`/parent/children/${id}`, data, getAuthOptions())

export const deleteChildRequest = (id: number) =>
  request.delete(`/parent/children/${id}`, getAuthOptions())

export const getChildrenReportRequest = (data = {}) =>
  request.get(`/parent/report`, { ...getAuthOptions(), params: data })

// Guest
export const getGuestTask = (levelId: string, sessionId: string) =>
  request.get<GuestTaskItemResponse>(`/guest/get-task?level_id=${levelId}&session_id=${sessionId}`)

export const getAuthorizeTask = (levelId: string) =>
  request.get<GuestTaskItemResponse>(`/guest/get-task?level_id=${levelId}`)


// ====== General APIs ====== //

// Printables
export const getMyPrintables = (data: QueryRequest) =>
  request.get<PrintablesResponse>(`/printables`, { params: data })

export const getSinglePrintable = (id: number) =>
  request.get<SinglePrintableResponse>(`/printables/${id}`)

export const getPrintableThemes = (data = {}) =>
  request.get<PrintableThemesResponse>(`/printables/themes`, { params: data })

export const createPrintable = (data: SinglePrintableRequest) =>
  request.post<SinglePrintableResponse>(`/printables`, data)

export const updatePrintable = (id: number, data: SinglePrintableRequest) =>
  request.post<SinglePrintableResponse>(`/printables/${id}`, data)

export const deletePrintable = (id: number) =>
  request.delete<MessageResponse>(`/printables/${id}`)

export const deletePrintableFiles = (id: number) =>
  request.delete<MessageResponse>(`/printables/${id}/file`)

export const deletePrintableFile = (id: number, fileId: number) =>
  request.delete<MessageResponse>(`/printables/${id}/file/${fileId}`)

export const duplicatePrintable = (id: number) =>
  request.get<MessageResponse>(`/printables/${id}/copy`)

// Downloads
export const getPurchasedPrintables = (data: QueryRequest) =>
  request.get(`/printables/purchased`, { params: data, })

export const deletePurchasedPrintables = (id: number) =>
  request.delete<MessageResponse>(`/printables/purchased/${id}`)

// Public lessons
export const getPublicLessons = (data: QueryRequest) =>
  request.get<LessonsResponse>(`/lessons`, { ...getAuthOptions(), params: data })

export const getSinglePublicLesson = (id: number) =>
  request.get<SingleLessonResponse>(`/lessons/${id}`)

export const getPublicLessonThemes = (data = {}) =>
  request.get(`/lessons/themes`, { params: data })

export const createPublicLesson = (data: SingleLessonRequest) =>
  request.post<SingleLessonResponse>(`/lessons`, data)

export const updatePublicLesson = (id: number, data: SingleLessonRequest) =>
  request.patch<SingleLessonResponse>(`/lessons/${id}`, data)

export const deletePublicLesson = (id: number) =>
  request.delete<MessageResponse>(`/lessons/${id}`)

export const deletePublicLessonFiles = (id: number) =>
  request.delete<MessageResponse>(`/lessons/${id}/file`)

export const deletePublicLessonFile = (id: number, fileId: number) =>
  request.delete<MessageResponse>(`/lessons/${id}/file/${fileId}`)

export const duplicatePublicLesson = (id: number) =>
  request.get<SingleLessonResponse>(`/lessons/${id}/copy`)

export const uploadEditorImage = (data: ImagesRequest) =>
  request.post<MessageResponse>(`/lessons/upload-images`, data)

// Editor images
export const uploadEditorSolutionImage = (data: ImagesRequest) =>
  request.post<MessageResponse>('/teacher/practices/upload-solution-images', data)

export const uploadCustomButtonsImage = (data: ImagesRequest) =>
  request.post<MessageResponse>(`/teacher/practices/buttons-images`, data)

// Images collections
export const getImageCollections = () =>
  request.get<ImageCollectionsResponse>(`/image-collection`)

export const getUserImages = () =>
  request.get<ImagesResponse>(`/images`)

export const uploadUserImages = (data: ImagesRequest) =>
  request.post<MessageResponse>(`/images`, data)

// Problem types
export const getPredefinedTitles = () =>
  request.get<ProblemTypesResponse>(`/problem-types`)

// Notifications
export const getNotifications = () =>
  request.get<NotificationsResponse>(`/notifications`, {})

// Image collections
export const getImageCollectionNames = () =>
  request.get<ImageCollectionNamesResponse>(`/image-collection-names`)

// GEt student achievements
export const getStudentAchievements = () =>
  request.get<AchievementsDataResponse>(`/student/achievements`)


// Redirects
export const windowRedirectToBackend = (token: string, redirect_to: string) => {
  openNativeLink(`${HOST}/account_callback?access_token=${token}&redirect_to=${redirect_to}`)
}

export const logoutRedirect = () => {
  openNativeLink(`${HOST}/clogout`)
}
