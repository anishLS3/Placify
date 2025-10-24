import { 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  Text, VStack, Box
} from '@chakra-ui/react'

const PreparationDetailsModal = ({ 
  isOpen, 
  onClose, 
  selectedCard 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent 
        bg="white" 
        borderRadius="2xl" 
        maxW="800px" 
        mx={4}
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      >
        <ModalHeader 
          fontSize="3xl" 
          fontWeight="600" 
          color="black" 
          letterSpacing="-0.02em"
          pb={6}
        >
          {selectedCard?.modalContent?.title || "Preparation Guide"}
        </ModalHeader>
        <ModalCloseButton 
          color="black" 
          size="lg" 
          _hover={{ bg: "gray.100" }}
        />
        <ModalBody pb={8}>
          {selectedCard?.modalContent && (
            <VStack align="start" spacing={8}>
              {/* Our approach section */}
              <Box w="full">
                <Text fontSize="xl" fontWeight="600" color="black" mb={4}>
                  {selectedCard.modalContent.approach.title}
                </Text>
                <Text color="gray.700" fontSize="md" lineHeight="1.6" mb={4}>
                  {selectedCard.modalContent.approach.description}
                </Text>
                <VStack align="start" spacing={2}>
                  {selectedCard.modalContent.approach.links.map((link, index) => (
                    <Text 
                      key={index} 
                      color="blue.500" 
                      fontSize="md" 
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                    >
                      {link}
                    </Text>
                  ))}
                </VStack>
              </Box>

              {/* How you can improve section */}
              <Box w="full">
                <Text fontSize="xl" fontWeight="600" color="black" mb={4}>
                  {selectedCard.modalContent.improvement.title}
                </Text>
                <Text color="gray.700" fontSize="md" lineHeight="1.6" mb={4}>
                  {selectedCard.modalContent.improvement.description}
                </Text>
                {selectedCard.modalContent.improvement.links.length > 0 && (
                  <VStack align="start" spacing={2}>
                    {selectedCard.modalContent.improvement.links.map((link, index) => (
                      <Text 
                        key={index} 
                        color="blue.500" 
                        fontSize="md" 
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                      >
                        {link}
                      </Text>
                    ))}
                  </VStack>
                )}
              </Box>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default PreparationDetailsModal
