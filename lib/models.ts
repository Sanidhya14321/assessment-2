// Define TypeScript interfaces for our MongoDB documents

export interface User {
  _id?: string
  name: string
  email: string
  password: string // This would be hashed
  role: "user" | "admin"
  createdAt: Date
}

export interface Question {
  question: string
  options: string[]
  correctAnswer: number
}

export interface Assessment {
  _id?: string
  title: string
  category: string
  description: string
  questions: Question[]
  timeLimit: number
  upvotes: number
  downvotes: number
  createdAt: Date
  expiresAt: Date
}

export interface Result {
  _id?: string
  userId: string
  userEmail: string
  userName: string
  assessmentId: string
  assessmentTitle: string
  category: string
  score: number
  answers: number[]
  timeSpent: number
  completedAt: Date
}

