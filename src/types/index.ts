export type UserTier = "PRIMARY" | "SECONDARY" | "UNIVERSITY" | "BUSINESS"
export type UserRole = "STUDENT" | "ADMIN"
export type PaymentStatus = "INITIATED" | "PENDING" | "SUCCESS" | "FAILED"
export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "EXPIRED" | "CANCELLED"
export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
export type CurriculumNodeType = "MODULE" | "LESSON" | "QUIZ" | "ASSESSMENT"
export type CognitiveBottleneck =
  | "SPATIAL_REASONING"
  | "FORMULA_MISAPPLICATION"
  | "CONCEPTUAL_GAP"
  | "PROCEDURAL_ERROR"
  | "ATTENTION"

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD"
export type QuestionType = "OBJECTIVE" | "THEORY" | "ESSAY" | "ORAL"
export type StudyResourceType = "NOTE" | "VIDEO" | "TEXTBOOK" | "LINK" | "PAST_ANSWER" | "MOCK"
export type PracticeTestStatus = "IN_PROGRESS" | "COMPLETED" | "TIMEOUT"
export type StudyPlanStatus = "ACTIVE" | "COMPLETED" | "PAUSED"

export interface Exam {
  id: string
  name: string
  slug: string
  fullName: string | null
  description: string | null
  country: string | null
  website: string | null
  logoUrl: string | null
  _count?: { subjects: number; pastQuestions: number }
}

export interface Subject {
  id: string
  examId: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  exam?: Exam
  _count?: { pastQuestions: number }
}

export interface PastQuestion {
  id: string
  subjectId: string
  examId: string
  year: number
  questionType: QuestionType
  question: string
  options: string | null
  correctAnswer: string | null
  explanation: string | null
  difficulty: QuestionDifficulty
  marks: number
}

export interface StudyResource {
  id: string
  examId: string | null
  subjectId: string | null
  title: string
  type: StudyResourceType
  url: string | null
  content: string | null
  description: string | null
  tags: string | null
  free: boolean
  exam?: { name: string; slug: string }
  subject?: { name: string; slug: string }
}

export interface PracticeTest {
  id: string
  userId: string
  examId: string | null
  subjectId: string | null
  title: string
  questionCount: number
  timeLimit: number | null
  status: PracticeTestStatus
  score: number | null
  maxScore: number | null
  answers: string | null
  startedAt: string
  completedAt: string | null
}

export interface StudyPlan {
  id: string
  userId: string
  examId: string
  targetDate: string | null
  dailyHours: number
  subjects: string | null
  status: StudyPlanStatus
  createdAt: string
  exam?: { name: string; slug: string }
}
