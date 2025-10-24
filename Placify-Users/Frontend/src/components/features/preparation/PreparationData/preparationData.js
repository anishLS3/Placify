import { 
  FaFileAlt, FaCode, FaBrain, FaCalculator, FaBuilding, FaUserTie
} from 'react-icons/fa'

// Detailed preparation cards data
export const preparationCards = [
  {
    icon: FaFileAlt,
    title: "Resume Building",
    color: "purple",
    stats: "1 Page Max",
    description: "Create a compelling resume that showcases your skills and achievements effectively.",
    modalContent: {
      title: "Resume Building",
      approach: {
        title: "Our approach.",
        description: "A resume is your first impression. Keep it concise, relevant, and honest. Focus on quantifying your achievements and showcasing real impact.",
        links: [
          "Learn more in our Resume Building Guide (PDF)",
          "Explore Striver's Resume Tips"
        ]
      },
      improvement: {
        title: "How you can improve.",
        description: "Use strong action verbs like Developed, Implemented, and Optimized. Always be ready to explain every line of your resume during interviews.",
        links: [
          "Learn more about ATS-Friendly Resume Formats"
        ]
      }
    }
  },
  {
    icon: FaCode,
    title: "Coding & DSA Preparation",
    color: "blue",
    stats: "2-3 Daily",
    description: "Master data structures and algorithms through consistent practice.",
    modalContent: {
      title: "Coding & DSA Preparation",
      approach: {
        title: "Our approach.",
        description: "Companies value logical thinking and problem-solving ability. Mastering data structures and algorithms is key to clearing technical rounds.",
        links: [
          "Learn more in Striver's A2Z DSA Sheet",
          "Practice problems on LeetCode",
          "InterviewBit",
          "and GeeksforGeeks"
        ]
      },
      improvement: {
        title: "How you can improve.",
        description: "Start small: arrays → recursion → linked lists → graphs → dynamic programming. Set daily goals, maintain a GitHub repository for your solutions, and track your progress.",
        links: [
          "Learn more about Building a DSA Roadmap"
        ]
      }
    }
  },
  {
    icon: FaBrain,
    title: "Core CS Subjects",
    color: "green",
    stats: "4 Key Areas",
    description: "Strengthen your theoretical foundation in computer science fundamentals.",
    modalContent: {
      title: "Core CS Subjects",
      approach: {
        title: "Our approach.",
        description: "Understanding computer science fundamentals helps you stand out in interviews. These subjects test your depth of knowledge, not just memory.",
        links: [
          "Learn more about:",
          "Operating Systems – GFG Notes",
          "DBMS – Tutorials & Practice",
          "OOPs – Core Concepts",
          "Computer Networks – Interview Questions"
        ]
      },
      improvement: {
        title: "How you can improve.",
        description: "Relate what you learn to your projects — for example, explain how DBMS concepts shaped your backend or how OOP principles improved your code structure.",
        links: [
          "Learn more from Neso Academy YouTube"
        ]
      }
    }
  },
  {
    icon: FaCalculator,
    title: "Aptitude & Logical Reasoning",
    color: "orange",
    stats: "10 Daily",
    description: "Sharpen your logical and quantitative reasoning skills.",
    modalContent: {
      title: "Aptitude & Logical Reasoning",
      approach: {
        title: "Our approach.",
        description: "Most placement tests begin with aptitude. Speed, accuracy, and clear logic will give you the edge.",
        links: [
          "Learn more in Quantitative Aptitude by R.S. Aggarwal",
          "Practice daily on IndiaBix",
          "or PrepInsta Aptitude"
        ]
      },
      improvement: {
        title: "How you can improve.",
        description: "Set a 20-minute timer while practicing. Track your accuracy and review mistakes weekly.",
        links: [
          "Learn more about Common Aptitude Topics"
        ]
      }
    }
  },
  {
    icon: FaBuilding,
    title: "Company-Specific Preparation",
    color: "red",
    stats: "Target Specific",
    description: "Study smart by focusing on company-specific preparation.",
    modalContent: {
      title: "Company-Specific Preparation",
      approach: {
        title: "Our approach.",
        description: "Each company follows its own interview style and difficulty level. Preparing smartly for each saves time and improves confidence.",
        links: [
          "Learn more in GeeksforGeeks Company-Wise Questions",
          "Explore Interview Experiences",
          "Find Company-Wise Sheets by Striver"
        ]
      },
      improvement: {
        title: "How you can improve.",
        description: "Research the company's tech stack and previous questions before the interview. Understand the role — whether it's SDE, Analyst, or Data Engineer — and tailor your preparation accordingly.",
        links: []
      }
    }
  },
  {
    icon: FaUserTie,
    title: "Interview Preparation",
    color: "teal",
    stats: "Be Ready",
    description: "Present your preparation confidently in technical and HR rounds.",
    modalContent: {
      title: "Interview Preparation",
      approach: {
        title: "Our approach.",
        description: "Your technical and HR interviews test your clarity, communication, and composure. Being confident and genuine often matters more than being perfect.",
        links: [
          "Learn more in Top Interview Questions – GFG",
          "Practice HR rounds with InterviewBit Resources"
        ]
      },
      improvement: {
        title: "How you can improve.",
        description: "Revise your projects and technical concepts. Practice coding on whiteboards or online compilers. For HR rounds, speak naturally — not rehearsed.",
        links: [
          "Learn more about Mock Interview Preparation"
        ]
      }
    }
  }
]
