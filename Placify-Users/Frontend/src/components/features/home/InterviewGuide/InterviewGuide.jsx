import { Box, Container } from '@chakra-ui/react'
import InterviewGuideHeader from './InterviewGuideHeader'
import InterviewSteps from './InterviewSteps'

const InterviewGuide = () => {
  return (
    <Box
      id="interview-guide"
      py={40}
      bg="#1a1a1a"
      position="relative"
      overflow="hidden"
    >
      <Container maxW="1400px">
        <InterviewGuideHeader />
        <InterviewSteps />
      </Container>
    </Box>
  )
}

export default InterviewGuide
