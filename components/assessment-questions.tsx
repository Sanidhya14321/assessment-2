"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock questions - in a real app, these would be fetched from the database
const mockQuestions = {
  "aiml-1": [
    {
      id: 1,
      question: "Which of the following is NOT a type of machine learning?",
      options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Prescriptive Learning"],
      correctAnswer: 3,
    },
    {
      id: 2,
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
      id: 3,
      question: "Which algorithm is commonly used for classification problems?",
      options: ["K-means", "Linear Regression", "Random Forest", "Principal Component Analysis"],
      correctAnswer: 2,
    },
    {
      id: 4,
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
      id: 5,
      question: "Which of the following is an unsupervised learning algorithm?",
      options: ["Decision Trees", "Support Vector Machines", "K-means Clustering", "Logistic Regression"],
      correctAnswer: 2,
    },
  ],
  "webdev-1": [
    {
      id: 1,
      question: "Which HTML tag is used to create a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      correctAnswer: 1,
    },
    {
      id: 2,
      question: "Which CSS property is used to change the text color?",
      options: ["text-color", "font-color", "color", "text-style"],
      correctAnswer: 2,
    },
    {
      id: 3,
      question: 'What does the "C" stand for in CSS?',
      options: ["Computing", "Cascading", "Colorful", "Creative"],
      correctAnswer: 1,
    },
    {
      id: 4,
      question: "Which JavaScript method is used to add an element at the end of an array?",
      options: ["push()", "append()", "add()", "insert()"],
      correctAnswer: 0,
    },
    {
      id: 5,
      question: "What is the correct way to comment in JavaScript?",
      options: ["<!-- This is a comment -->", "/* This is a comment */", "// This is a comment", "# This is a comment"],
      correctAnswer: 2,
    },
  ],
  // Add more questions for other assessments as needed
}

// Default questions for assessments without specific questions
const defaultQuestions = [
  {
    id: 1,
    question: "This is a sample question for this assessment.",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "Another sample question for this assessment.",
    options: ["First choice", "Second choice", "Third choice", "Fourth choice"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "Sample question number three for this assessment.",
    options: ["Selection 1", "Selection 2", "Selection 3", "Selection 4"],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: "Fourth sample question for this assessment.",
    options: ["Answer A", "Answer B", "Answer C", "Answer D"],
    correctAnswer: 3,
  },
  {
    id: 5,
    question: "Final sample question for this assessment.",
    options: ["Choice One", "Choice Two", "Choice Three", "Choice Four"],
    correctAnswer: 0,
  },
]

export default function AssessmentQuestions({ assessmentId }: { assessmentId: string }) {
  const [started, setStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Get questions for this assessment or use default questions
  const questions = mockQuestions[assessmentId as keyof typeof mockQuestions] || defaultQuestions

  // Initialize answers array
  useEffect(() => {
    if (started) {
      setAnswers(new Array(questions.length).fill(null))
      // Set time limit based on assessment (for demo, using 5 minutes)
      setTimeLeft(5 * 60)
    }
  }, [started, questions.length])

  // Timer countdown
  useEffect(() => {
    if (!started || timeLeft <= 0 || showResults) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 10 && prev > 0) {
          setShowTimeWarning(true)
        }
        if (prev <= 0) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [started, timeLeft, showResults])

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = Number.parseInt(value)
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correctCount++
      }
    })

    const percentage = Math.round((correctCount / questions.length) * 100)
    setScore(percentage)
    setShowResults(true)

    // In a real app, you would save the result to the database here
    toast({
      title: "Assessment Completed",
      description: `Your score: ${percentage}%`,
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (showResults) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-[#2C2C2C] border-[#522546]">
          <CardHeader>
            <CardTitle className="text-2xl">Assessment Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{score}%</div>
              <p className="text-gray-300">
                You answered {answers.filter((a, i) => a === questions[i].correctAnswer).length} out of{" "}
                {questions.length} questions correctly.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Question Summary</h3>
              {questions.map((q, index) => (
                <div key={q.id} className="p-4 rounded-lg bg-[#522546]">
                  <p className="font-medium mb-2">
                    Question {index + 1}: {q.question}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded ${
                          optIndex === q.correctAnswer
                            ? "bg-green-900/30 border border-green-500"
                            : answers[index] === optIndex && optIndex !== q.correctAnswer
                              ? "bg-red-900/30 border border-red-500"
                              : "bg-[#2C2C2C]"
                        }`}
                      >
                        {option}
                        {optIndex === q.correctAnswer && (
                          <span className="ml-2 text-green-500 text-sm">(Correct Answer)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/assessments")}>
              Back to Assessments
            </Button>
            <Button onClick={() => router.push("/profile")}>View All Results</Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  if (!started) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-[#2C2C2C] border-[#522546]">
          <CardHeader>
            <CardTitle className="text-2xl">Ready to Begin?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You are about to start an assessment with {questions.length} questions.</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#F7374F]" />
                <span>You will have 5 minutes to complete this assessment.</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#F7374F]" />
                <span>Once started, the timer cannot be paused.</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-[#F7374F] hover:bg-[#88304E]" onClick={() => setStarted(true)}>
              Start Assessment
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return (
    <>
      <Card className="bg-[#2C2C2C] border-[#522546]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
          </div>
          <div className={`flex items-center gap-2 ${timeLeft <= 60 ? "text-red-500" : "text-white"}`}>
            <Clock className="h-5 w-5" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2 bg-[#522546]" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-medium">{questions[currentQuestion].question}</h3>

              <RadioGroup
                value={answers[currentQuestion]?.toString() || ""}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 rounded-lg border border-[#522546] p-3 hover:bg-[#522546]/30 transition-colors"
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestion === questions.length - 1 ? (
              <Button className="bg-[#F7374F] hover:bg-[#88304E]" onClick={() => setShowSubmitDialog(true)}>
                Submit
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={answers[currentQuestion] === null}>
                Next
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time is running out!</AlertDialogTitle>
            <AlertDialogDescription>
              You have less than 10 seconds remaining. Your assessment will be automatically submitted when the timer
              reaches zero.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your assessment? You have answered{" "}
              {answers.filter((a) => a !== null).length} out of {questions.length} questions.
              {answers.includes(null) && <p className="text-red-500 mt-2">Warning: You have unanswered questions.</p>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

