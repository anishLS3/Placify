import { Box, Container, Heading, Text, VStack, SimpleGrid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { AppNavigation, AppFooter } from '@/components/common/Layout'
import { PageHero } from '@/components/common/UI'
import { ContactFormSection, ContactTeamMember } from '@/components/features/contact'

const MotionBox = motion(Box)

const Contact = () => {
  const teamMembers = [
    {
      name: "Anish L S",
      role: "Team Member",
      email: "anish2210828@ssn.edu.in",
      linkedinUrl: "https://www.linkedin.com/in/anishls/",
      color: "blue",
      delay: 0.1
    },
    {
      name: "Danush S",
      role: "Team Member", 
      email: "danush2210689@ssn.edu.in",
      linkedinUrl: "https://www.linkedin.com/in/DanushSenthilkumar/",
      color: "green",
      delay: 0.2
    }
  ]

  return (
    <Box minH="100vh" bg="#000000" position="relative" overflow="hidden">
      <AppNavigation />

      {/* Main Content */}
      <Box pt={20}>
        <PageHero 
          title="Get in touch."
          subtitle="Have questions or need help? We're here to assist you with your placement journey."
        />

        <Container maxW="1400px" px={6} pb={32}>
          {/* Team Section */}
          <MotionBox
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            mb={16}
          >
            <VStack spacing={8} mb={16}>
              <VStack spacing={4} textAlign="center">
                <Heading
                  fontSize={{ base: '3xl', md: '4xl' }}
                  fontWeight="600"
                  color="white"
                  letterSpacing="-0.02em"
                >
                  Meet Our Team
                </Heading>
                <Text fontSize="xl" color="whiteAlpha.600" fontWeight="400" maxW="600px">
                  Get in touch with our team members for any questions or support.
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full" maxW="800px">
                {teamMembers.map((member) => (
                  <ContactTeamMember
                    key={member.name}
                    name={member.name}
                    role={member.role}
                    email={member.email}
                    linkedinUrl={member.linkedinUrl}
                    color={member.color}
                    delay={member.delay}
                  />
                ))}
            </SimpleGrid>
            </VStack>
          </MotionBox>

          {/* Contact Form Section */}
          <ContactFormSection />
        </Container>

        <AppFooter />
      </Box>
    </Box>
  )
}

export default Contact