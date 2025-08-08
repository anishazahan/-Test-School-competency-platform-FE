export type Role = "admin" | "student" | "supervisor"

export type Tokens = {
  accessToken: string
  refreshToken?: string
}

export type User = {
  _id: string
  name: string
  email: string
  role: Role
  isVerified: boolean
}

export type UserListItem = Pick<User, "_id" | "name" | "email" | "role" | "isVerified">

export type Choice = { id: string; text: string }

export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

export type Question = {
  _id: string
  competency: string
  level: Level
  text: string
  choices: Choice[]
  correctChoiceId: string
  createdAt?: string
  updatedAt?: string
}

export type PublicQuestion = Pick<Question, "_id" | "text" | "choices">

export type Pagination<T> = {
  items: T[]
  totalPages: number
}

export type ExamStep = "STEP_1" | "STEP_2" | "STEP_3"

export type ExamStatusResponse = {
  status: "not_started" | "in_progress" | "completed" | "locked"
  currentStep: ExamStep | null
  dueAt: string | null
  completed: boolean
  result: { level: Level | "C1" | "C2" } | null
}

export type StartStepResponse = {
  step: ExamStep | null
  dueAt: string
  attemptId: string
}

export type GetQuestionsResponse = {
  questions: PublicQuestion[]
}

export type SubmitStepRequest = {
  answers: { questionId: string; choiceId: string }[]
}

export type SubmitStepResponse = {
  message: string
  correct: number
  total: number
  pct: number
  nextStep: ExamStep | null
  finalLevel: Level | null
}

export type Certificate = {
  _id: string
  userId: string
  level: Level | "C1" | "C2" | "A2" | "B2" | "A1" | "B1"
  createdAt: string
  attemptId?: string
}
