import { Box, VStack, SimpleGrid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import PlatformCard from './PlatformCard'

const MotionBox = motion(Box)

const PlatformCards = () => {
  const platforms = [
    {
      href: "https://leetcode.com",
      name: "LeetCode",
      tag: "#1",
      description: "Master data structures and algorithms with 2000+ curated problems",
      stats: ["2M+ Users", "•", "2000+ Problems"],
      topics: "Two Sum • Binary Search • Dynamic Programming",
      borderColor: "rgba(255, 161, 22, 0.2)",
      bgColor: "rgba(255, 161, 22, 0.03)",
      gradientColor: "rgba(255, 161, 22, 0.1)"
    },
    {
      href: "https://www.hackerrank.com",
      name: "HackerRank",
      tag: "Skills",
      description: "Build coding skills with hands-on practice and earn certifications",
      stats: ["7M+ Users", "•", "Certifications"],
      topics: "Python • JavaScript • SQL • Problem Solving",
      borderColor: "rgba(46, 200, 102, 0.2)",
      bgColor: "rgba(46, 200, 102, 0.03)",
      gradientColor: "rgba(46, 200, 102, 0.1)"
    },
    {
      href: "https://codeforces.com",
      name: "Codeforces",
      tag: "Contest",
      description: "Participate in contests and improve your problem-solving speed",
      stats: ["1M+ Users", "•", "Weekly Contests"],
      topics: "Div 2 • Div 3 • Educational Rounds • Global Rounds",
      borderColor: "rgba(31, 142, 205, 0.2)",
      bgColor: "rgba(31, 142, 205, 0.03)",
      gradientColor: "rgba(31, 142, 205, 0.1)"
    },
    {
      href: "https://www.geeksforgeeks.org",
      name: "GeeksforGeeks",
      tag: "Learn",
      description: "Comprehensive tutorials and practice problems for all skill levels",
      stats: ["10M+ Users", "•", "Free Content"],
      topics: "DSA • System Design • Interview Prep • Company Prep",
      borderColor: "rgba(46, 204, 113, 0.2)",
      bgColor: "rgba(46, 204, 113, 0.03)",
      gradientColor: "rgba(46, 204, 113, 0.1)"
    },
    {
      href: "https://www.interviewbit.com",
      name: "InterviewBit",
      tag: "Prep",
      description: "Structured roadmap for technical interviews with company-specific problems",
      stats: ["500K+ Users", "•", "Company Specific"],
      topics: "FAANG • Microsoft • Amazon • Google • Meta",
      borderColor: "rgba(231, 76, 60, 0.2)",
      bgColor: "rgba(231, 76, 60, 0.03)",
      gradientColor: "rgba(231, 76, 60, 0.1)"
    },
    {
      href: "https://www.codechef.com",
      name: "CodeChef",
      tag: "Contest",
      description: "Programming contests and challenges for competitive coding",
      stats: ["3M+ Users", "•", "Monthly Contests"],
      topics: "Long Challenge • Cook-Off • Lunchtime • SnackDown",
      borderColor: "rgba(175, 82, 222, 0.2)",
      bgColor: "rgba(175, 82, 222, 0.03)",
      gradientColor: "rgba(175, 82, 222, 0.1)"
    }
  ]

  return (
    <VStack align="stretch" spacing={0} maxW="1200px" mx="auto">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={1}>
        {platforms.map((platform, index) => (
          <PlatformCard
            key={index}
            href={platform.href}
            name={platform.name}
            tag={platform.tag}
            description={platform.description}
            stats={platform.stats}
            topics={platform.topics}
            borderColor={platform.borderColor}
            bgColor={platform.bgColor}
            gradientColor={platform.gradientColor}
          />
        ))}
      </SimpleGrid>
    </VStack>
  )
}

export default PlatformCards
