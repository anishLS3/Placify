import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import InterviewStepCard from './InterviewStepCard'

const MotionBox = motion(Box)

const InterviewSteps = () => {
  const steps = [
    {
      stepNumber: 1,
      title: "Clarify the problem statement",
      description: "Before attempting to solve a problem, it is important to understand the problem clearly. Hence it is important to ask right questions."
    },
    {
      stepNumber: 2,
      title: "Constraints",
      description: "If there is a clear understanding of the problem statement, the next step is to determine whether there are any specific constraints that must be followed."
    },
    {
      stepNumber: 3,
      title: "Observations",
      description: "Every problem has a peculiar behaviour associated with it. So don't forget to tell the interviewer about all of the observations of that problem."
    },
    {
      stepNumber: 4,
      title: "Approaches",
      description: "This is the most crucial part in the entire interview process. If you intend to solve the problem with a data structure, explain why you want to do so. If you're stuck, use the brute force method."
    },
    {
      stepNumber: 5,
      title: "Discuss your approach",
      description: "When you've narrowed down your plan and believe you have a solution, talk to the interviewer about it. Accept if the interviewer proposes something new and begin thinking along those lines. Don't be too rigid in your thinking."
    },
    {
      stepNumber: 6,
      title: "Edge Cases and counter examples",
      description: "If the solution for the problem is decided, make sure to test it for all possible edge-cases."
    },
    {
      stepNumber: 7,
      title: "Writing the Code",
      description: "Make sure to check the following: The code should be readable and understandable. Add comments to your code. Before showing the code to the interviewer, dry run it with a few examples."
    }
  ]

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <Box
        display="flex"
        gap={6}
        overflowX="auto"
        pb={4}
        sx={{
          '&::-webkit-scrollbar': {
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0,0,0,0.3)',
          },
        }}
      >
        {steps.map((step, index) => (
          <InterviewStepCard
            key={index}
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.description}
          />
        ))}
      </Box>
    </MotionBox>
  )
}

export default InterviewSteps
