import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

// Sample assessments data
const sampleAssessments = [
  {
    title: "Machine Learning Fundamentals",
    category: "AI & Machine Learning",
    description: "Test your understanding of basic machine learning concepts and algorithms.",
    questions: [
      {
        question: "Which of the following is NOT a type of machine learning?",
        options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Prescriptive Learning"],
        correctAnswer: 3,
      },
      {
        question: "What is the purpose of the activation function in a neural network?",
        options: [
          "To initialize the weights",
          "To introduce non-linearity",
          "To normalize the input data",
          "To prevent overfitting",
        ],
        correctAnswer: 1,
      },
      {
        question: "Which algorithm is commonly used for classification problems?",
        options: ["K-means", "Linear Regression", "Random Forest", "Principal Component Analysis"],
        correctAnswer: 2,
      },
      {
        question: 'What does the "gradient" refer to in gradient descent?',
        options: [
          "The slope of the error function",
          "The difference between predicted and actual values",
          "The learning rate of the algorithm",
          "The activation of neurons",
        ],
        correctAnswer: 0,
      },
      {
        question: "Which of the following is an unsupervised learning algorithm?",
        options: ["Decision Trees", "Support Vector Machines", "K-means Clustering", "Logistic Regression"],
        correctAnswer: 2,
      },
    ],
    timeLimit: 30,
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
  },
  {
    title: "Frontend Fundamentals",
    category: "Web Development",
    description: "Test your knowledge of HTML, CSS, and JavaScript fundamentals.",
    questions: [
      {
        question: "Which HTML tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctAnswer: 1,
      },
      {
        question: "Which CSS property is used to change the text color?",
        options: ["text-color", "font-color", "color", "text-style"],
        correctAnswer: 2,
      },
      {
        question: 'What does the "C" stand for in CSS?',
        options: ["Computing", "Cascading", "Colorful", "Creative"],
        correctAnswer: 1,
      },
      {
        question: "Which JavaScript method is used to add an element at the end of an array?",
        options: ["push()", "append()", "add()", "insert()"],
        correctAnswer: 0,
      },
      {
        question: "What is the correct way to comment in JavaScript?",
        options: [
          "<!-- This is a comment -->",
          "/* This is a comment */",
          "// This is a comment",
          "# This is a comment",
        ],
        correctAnswer: 2,
      },
    ],
    timeLimit: 30,
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
  },
  {
    title: "SQL Fundamentals",
    category: "Database Systems",
    description: "Test your knowledge of SQL queries and database operations.",
    questions: [
      {
        question: "Which SQL statement is used to retrieve data from a database?",
        options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
        correctAnswer: 1,
      },
      {
        question: "Which SQL clause is used to filter records?",
        options: ["WHERE", "HAVING", "FILTER", "CONDITION"],
        correctAnswer: 0,
      },
      {
        question: "Which SQL statement is used to update data in a database?",
        options: ["SAVE", "MODIFY", "UPDATE", "CHANGE"],
        correctAnswer: 2,
      },
      {
        question: "Which SQL statement is used to delete data from a database?",
        options: ["REMOVE", "DELETE", "CLEAR", "DROP"],
        correctAnswer: 1,
      },
      {
        question: "Which SQL statement is used to add new data to a database?",
        options: ["ADD", "CREATE", "INSERT", "APPEND"],
        correctAnswer: 2,
      },
    ],
    timeLimit: 30,
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
  },
]

// This route is for development purposes only
// It creates sample assessments if none exist
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 })
  }

  try {
    const client = await clientPromise
    const db = client.db("assessment-platform")

    // Check if assessments exist
    const assessmentsCount = await db.collection("assessments").countDocuments()

    if (assessmentsCount === 0) {
      // Insert sample assessments
      await db.collection("assessments").insertMany(sampleAssessments)
      return NextResponse.json({ message: "Sample assessments created successfully", count: sampleAssessments.length })
    }

    return NextResponse.json({ message: "Assessments already exist", count: assessmentsCount })
  } catch (error) {
    console.error("Error seeding assessments:", error)
    return NextResponse.json({ error: "Failed to seed assessments" }, { status: 500 })
  }
}

