import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Code, Database, Server, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import AssessmentQuestions from "@/components/assessment-questions"

// This would normally be fetched from the database
const categories = [
  {
    id: "aiml",
    name: "AI & Machine Learning",
    icon: <Brain className="h-6 w-6" />,
    assessments: [
      {
        id: "aiml-1",
        title: "Machine Learning Fundamentals",
        description: "Test your understanding of basic machine learning concepts and algorithms.",
        questions: 25,
        timeLimit: 30,
        category: "AI & Machine Learning",
      },
      {
        id: "aiml-2",
        title: "Neural Networks & Deep Learning",
        description: "Evaluate your knowledge of neural network architectures and deep learning principles.",
        questions: 30,
        timeLimit: 45,
        category: "AI & Machine Learning",
      },
      {
        id: "aiml-3",
        title: "Natural Language Processing",
        description: "Test your understanding of NLP techniques and applications.",
        questions: 20,
        timeLimit: 25,
        category: "AI & Machine Learning",
      },
    ],
  },
  {
    id: "webdev",
    name: "Web Development",
    icon: <Code className="h-6 w-6" />,
    assessments: [
      {
        id: "webdev-1",
        title: "Frontend Fundamentals",
        description: "Test your knowledge of HTML, CSS, and JavaScript fundamentals.",
        questions: 30,
        timeLimit: 35,
        category: "Web Development",
      },
      {
        id: "webdev-2",
        title: "React & Modern JavaScript",
        description: "Evaluate your understanding of React and modern JavaScript concepts.",
        questions: 25,
        timeLimit: 30,
        category: "Web Development",
      },
      {
        id: "webdev-3",
        title: "Backend Development",
        description: "Test your knowledge of server-side programming and API development.",
        questions: 28,
        timeLimit: 40,
        category: "Web Development",
      },
    ],
  },
  {
    id: "database",
    name: "Database Systems",
    icon: <Database className="h-6 w-6" />,
    assessments: [
      {
        id: "db-1",
        title: "SQL Fundamentals",
        description: "Test your knowledge of SQL queries and database operations.",
        questions: 25,
        timeLimit: 30,
        category: "Database Systems",
      },
      {
        id: "db-2",
        title: "NoSQL Databases",
        description: "Evaluate your understanding of NoSQL database concepts and technologies.",
        questions: 20,
        timeLimit: 25,
        category: "Database Systems",
      },
      {
        id: "db-3",
        title: "Database Design & Normalization",
        description: "Test your knowledge of database design principles and normalization.",
        questions: 22,
        timeLimit: 35,
        category: "Database Systems",
      },
    ],
  },
  {
    id: "devops",
    name: "Backend & DevOps",
    icon: <Server className="h-6 w-6" />,
    assessments: [
      {
        id: "devops-1",
        title: "Docker & Containerization",
        description: "Test your understanding of Docker and container orchestration.",
        questions: 25,
        timeLimit: 30,
        category: "Backend & DevOps",
      },
      {
        id: "devops-2",
        title: "CI/CD Pipelines",
        description: "Evaluate your knowledge of continuous integration and deployment practices.",
        questions: 20,
        timeLimit: 25,
        category: "Backend & DevOps",
      },
      {
        id: "devops-3",
        title: "Cloud Services & Architecture",
        description: "Test your understanding of cloud platforms and architectural patterns.",
        questions: 28,
        timeLimit: 35,
        category: "Backend & DevOps",
      },
    ],
  },
]

// Flatten all assessments into a single array
const allAssessments = categories.flatMap((category) => category.assessments)

export default function AssessmentPage({ params }: { params: { id: string } }) {
  const assessment = allAssessments.find((a) => a.id === params.id)

  if (!assessment) {
    notFound()
  }

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case "AI & Machine Learning":
        return <Brain className="h-5 w-5" />
      case "Web Development":
        return <Code className="h-5 w-5" />
      case "Database Systems":
        return <Database className="h-5 w-5" />
      case "Backend & DevOps":
        return <Server className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/assessments">
            <Button variant="link" className="text-[#F7374F] p-0 mb-4">
              ← Back to Assessments
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">{assessment.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#522546] p-1 rounded-md">{getCategoryIcon(assessment.category)}</div>
            <span className="text-gray-300">{assessment.category}</span>
          </div>
          <p className="text-gray-300 mb-6">{assessment.description}</p>

          <Card className="bg-[#522546] border-none p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#88304E] p-2 rounded-full">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Questions</p>
                  <p className="text-xl font-semibold">{assessment.questions}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#88304E] p-2 rounded-full">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Time Limit</p>
                  <p className="text-xl font-semibold">{assessment.timeLimit} minutes</p>
                </div>
              </div>
            </div>
          </Card>

          <AssessmentQuestions assessmentId={assessment.id} />
        </div>
      </div>
    </div>
  )
}

