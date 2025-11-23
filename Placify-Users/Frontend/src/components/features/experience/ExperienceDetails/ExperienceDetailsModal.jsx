import { 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  VStack, HStack, Text, Box, Icon 
} from '@chakra-ui/react'
import { FaLinkedin } from 'react-icons/fa'
import VerificationBadge from '../../../common/VerificationBadge'

const ExperienceDetailsModal = ({ 
  isOpen, 
  onClose, 
  selectedExperience 
}) => {
  if (!selectedExperience) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent bg="white" borderRadius="2xl" mx={4} position="relative">
        {/* Verification Badge for Modal */}
        {selectedExperience.verificationBadge && (
          <VerificationBadge 
            size="lg" 
            top={4} 
            right={4}
            position="absolute"
          />
        )}
        
        <ModalHeader pb={2}>
          <VStack align="start" spacing={2}>
            <HStack spacing={3}>
              <Text fontSize="2xl" fontWeight="600" color="gray.900">
                {selectedExperience.fullName}
              </Text>
              {selectedExperience.verificationBadge && (
                <VerificationBadge 
                  size="sm" 
                  position="relative"
                  top={0}
                  right={0}
                  showTooltip={true}
                />
              )}
              {selectedExperience.linkedinUrl && (
                <Icon 
                  as={FaLinkedin} 
                  color="blue.500" 
                  fontSize="xl" 
                  cursor="pointer"
                  _hover={{ color: "blue.400", transform: "scale(1.1)" }}
                  transition="all 0.2s"
                  onClick={() => window.open(selectedExperience.linkedinUrl, '_blank')}
                />
              )}
            </HStack>
            <Text fontSize="lg" color="blue.500" fontWeight="500">
              {selectedExperience.companyName} - {selectedExperience.jobRole}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(selectedExperience.date).toLocaleDateString()}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pt={0}>
          <VStack align="start" spacing={8}>
            {/* Overall Experience */}
            <Box>
              <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
                Overall Experience
              </Text>
              <Text color="gray.700" lineHeight="1.7" fontSize="md">
                {selectedExperience.overallExperience}
              </Text>
            </Box>

            {/* Personal & Academic Details */}
            <Box>
              <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
                Personal & Academic Details
              </Text>
              <VStack align="start" spacing={2}>
                <Text color="gray.700" fontSize="sm">
                  <strong>College:</strong> {selectedExperience.collegeName}
                </Text>
                <Text color="gray.700" fontSize="sm">
                  <strong>Branch:</strong> {selectedExperience.branch}
                </Text>
                <Text color="gray.700" fontSize="sm">
                  <strong>Batch Year:</strong> {selectedExperience.batchYear}
                </Text>
                <Text color="gray.700" fontSize="sm">
                  <strong>Position Type:</strong> {selectedExperience.positionType}
                </Text>
                <Text color="gray.700" fontSize="sm">
                  <strong>Interview Type:</strong> {selectedExperience.interviewType}
                </Text>
                {selectedExperience.jobLocation && (
                  <Text color="gray.700" fontSize="sm">
                    <strong>Job Location:</strong> {selectedExperience.jobLocation}
                  </Text>
                )}
                {selectedExperience.ctc && (
                  <Text color="gray.700" fontSize="sm">
                    <strong>CTC:</strong> {selectedExperience.ctc}
                  </Text>
                )}
              </VStack>
            </Box>

            {/* Selection Process Details */}
            <Box>
              <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
                Selection Process Details
              </Text>
              <VStack align="start" spacing={2}>
                <Text color="gray.700" fontSize="sm">
                  <strong>Number of Rounds:</strong> {selectedExperience.numberOfRounds}
                </Text>
                <Text color="gray.700" fontSize="sm">
                  <strong>Round Types:</strong> {selectedExperience.roundTypes?.join(', ')}
                </Text>
                <Text color="gray.700" fontSize="sm">
                  <strong>Difficulty Level:</strong> {selectedExperience.difficultyLevel}
                </Text>
              </VStack>
            </Box>

            {/* Detailed Rounds */}
            {selectedExperience.rounds && selectedExperience.rounds.length > 0 && (
              <Box>
                <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
                  Detailed Rounds
                </Text>
                <VStack align="start" spacing={4}>
                  {selectedExperience.rounds.map((round, index) => (
                    <Box key={index} p={4} bg="gray.50" borderRadius="md" w="full">
                      <Text fontWeight="600" color="gray.800" mb={2}>
                        {round.name}
                      </Text>
                      <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                        {round.description}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            {/* Technical & HR Questions */}
            <Box>
              <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
                Questions Asked
              </Text>
              <VStack align="start" spacing={3}>
                {selectedExperience.codingQuestions && (
                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>
                      Coding Questions:
                    </Text>
                    <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                      {selectedExperience.codingQuestions}
                    </Text>
                  </Box>
                )}
                {selectedExperience.technicalQuestions && (
                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>
                      Technical Questions:
                    </Text>
                    <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                      {selectedExperience.technicalQuestions}
                    </Text>
                  </Box>
                )}
                {selectedExperience.hrQuestions && (
                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>
                      HR Questions:
                    </Text>
                    <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                      {selectedExperience.hrQuestions}
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>

            {/* Preparation Tips */}
            <Box>
              <Text fontSize="lg" fontWeight="600" color="gray.900" mb={3}>
                Preparation Tips
              </Text>
              <VStack align="start" spacing={3}>
                {selectedExperience.resourcesUsed && (
                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>
                      Resources Used:
                    </Text>
                    <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                      {selectedExperience.resourcesUsed}
                    </Text>
                  </Box>
                )}
                {selectedExperience.tipsForCandidates && (
                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>
                      Tips for Future Candidates:
                    </Text>
                    <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                      {selectedExperience.tipsForCandidates}
                    </Text>
                  </Box>
                )}
                {selectedExperience.mistakesToAvoid && (
                  <Box>
                    <Text fontWeight="600" color="gray.800" mb={2}>
                      Mistakes to Avoid:
                    </Text>
                    <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                      {selectedExperience.mistakesToAvoid}
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ExperienceDetailsModal
