import { Box, Grid, VStack } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import FAQCategory from './FAQCategory'
import FAQItem from './FAQItem'

const MotionBox = motion(Box)

const FAQContent = ({ 
  activeCategory, 
  setActiveCategory, 
  expandedQuestion, 
  setExpandedQuestion 
}) => {
  const categories = [
    { id: 'general', name: 'General Questions' },
    { id: 'support', name: 'Support team' },
    { id: 'misc', name: 'Miscellaneous' },
    { id: 'preparation', name: 'Preparation' },
    { id: 'interview', name: 'Interview Tips' }
  ]

  const faqData = {
    general: [
      {
        question: "What is this platform about?",
        answer: "It's a community-driven space where students share their real placement experiences, interview questions, and preparation tips to help others succeed."
      },
      {
        question: "Who can use this platform?",
        answer: "All college students preparing for placements, internships, or tech interviews can access and contribute to the platform."
      },
      {
        question: "Is there any cost to use the platform?",
        answer: "No, it's completely free for students. You just need to create an account to post or interact."
      },
      {
        question: "Can I edit or delete my shared experience later?",
        answer: "Yes. Once logged in, you can easily edit or remove your posts anytime through your dashboard."
      },
      {
        question: "How are experiences verified?",
        answer: "We rely on a moderation process and community feedback to maintain accuracy and authenticity."
      }
    ],
    support: [
      {
        question: "How can I contact the support team?",
        answer: "You can reach us via the Contact Us page by submitting a form or emailing our support team directly."
      },
      {
        question: "What should I do if I face a technical issue on the website?",
        answer: "Try refreshing or clearing your cache first. If the issue persists, report it through the Support page with screenshots."
      },
      {
        question: "How long does it take to get a response from support?",
        answer: "Our team usually replies within 24–48 hours on working days."
      },
      {
        question: "Can I suggest a new feature for the platform?",
        answer: "Absolutely! We welcome ideas and feedback — use the \"Feature Request\" form to share your suggestions."
      },
      {
        question: "Is my data safe on this platform?",
        answer: "Yes. We use encrypted connections and secure storage practices to protect your personal information."
      }
    ],
    misc: [
      {
        question: "Can I share experiences from off-campus placements too?",
        answer: "Yes! Both on-campus and off-campus placement stories are encouraged."
      },
      {
        question: "Do I need coding skills to use this platform?",
        answer: "Not at all. You can explore, read, and share experiences without writing a single line of code."
      },
      {
        question: "Can I connect with students who posted experiences?",
        answer: "Currently, you can comment or react to posts, and we're planning a direct messaging feature soon."
      },
      {
        question: "Will my name be visible when I post?",
        answer: "You can choose to post anonymously if you prefer privacy."
      },
      {
        question: "Can I share preparation resources or links?",
        answer: "Yes, you can include helpful links, PDFs, or GitHub repos in your experience posts."
      }
    ],
    preparation: [
      {
        question: "Which programming language should I use for coding interviews?",
        answer: "Pick the language you're most comfortable with — common choices include C++, Java, and Python."
      },
      {
        question: "How should I plan my placement preparation timeline?",
        answer: "Start early, at least 6 months before placements, and focus on coding, aptitude, and core subjects."
      },
      {
        question: "What are the best platforms for placement preparation?",
        answer: "Some top choices include LeetCode, GeeksforGeeks, InterviewBit, HackerRank, PrepBytes, CodeStudio, CodeChef, Striver's A2Z DSA Sheet, and Coding Ninjas."
      },
      {
        question: "How do I balance academics and placement prep?",
        answer: "Create a realistic timetable. Focus on consistency over long hours — even 1–2 hours daily is enough with discipline."
      },
      {
        question: "Should I join a placement study group?",
        answer: "Yes! Studying with peers improves motivation, helps you learn faster, and keeps you updated on company drives."
      }
    ],
    interview: [
      {
        question: "How should I prepare for HR interview questions?",
        answer: "Review common HR topics like strengths, weaknesses, and goals. Be honest and back your answers with examples."
      },
      {
        question: "What should I include in my resume for campus placements?",
        answer: "Keep it short, clean, and focused on skills, projects, and achievements relevant to the role."
      },
      {
        question: "How do I manage time while preparing for placements and college exams?",
        answer: "Balance both by creating a structured schedule and sticking to small daily goals."
      },
      {
        question: "How do I handle rejection after a placement interview?",
        answer: "View rejection as feedback, not failure. Reflect, improve, and keep applying — every interview builds confidence."
      },
      {
        question: "How important are communication skills in placements?",
        answer: "Very important. They help you present ideas clearly in both HR and technical rounds. Practice mock interviews to build fluency."
      }
    ]
  }

  const currentQuestions = faqData[activeCategory] || faqData.general

  return (
    <MotionBox
      maxW="6xl"
      mx="auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Box
        bg="whiteAlpha.50"
        borderRadius="2xl"
        p={8}
        border="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Grid templateColumns={{ base: '1fr', lg: '1fr 2fr' }} gap={8}>
          {/* Left Column - Categories */}
          <VStack spacing={3} align="stretch">
            {categories.map((category, index) => (
              <FAQCategory
                key={category.id}
                category={category}
                isActive={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              />
            ))}
          </VStack>

          {/* Right Column - Questions & Answers */}
          <VStack spacing={4} align="stretch">
            {currentQuestions.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isExpanded={expandedQuestion === index}
                onClick={() => setExpandedQuestion(expandedQuestion === index ? -1 : index)}
              />
            ))}
          </VStack>
        </Grid>
      </Box>
    </MotionBox>
  )
}

export default FAQContent
