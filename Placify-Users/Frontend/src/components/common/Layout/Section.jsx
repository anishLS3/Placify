import { Box } from '@chakra-ui/react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useRef } from 'react'

const MotionBox = motion(Box)

const Section = ({ children, bg, id }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  })
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], ["-3deg", "0deg", "3deg"])
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.2, 0])

  return (
    <Box
      as="section"
      ref={sectionRef}
      h="100vh"
      w="100%"
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      position="relative"
      bg={bg}
      overflow="hidden"
      p={0}
      m={0}
      id={id}
      sx={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)",
          opacity: backgroundOpacity,
          transform: useTransform(scrollYProgress, [0, 1], ["scale(0.8)", "scale(1.2)"])
        }}
      />
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        style={{
          background: "linear-gradient(45deg, rgba(66, 153, 225, 0.1) 0%, rgba(236, 201, 75, 0.1) 100%)",
          opacity: backgroundOpacity
        }}
        animate={{
          background: [
            "linear-gradient(45deg, rgba(66, 153, 225, 0.1) 0%, rgba(236, 201, 75, 0.1) 100%)",
            "linear-gradient(45deg, rgba(236, 201, 75, 0.1) 0%, rgba(66, 153, 225, 0.1) 100%)"
          ]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <MotionBox
        ref={ref}
        style={{ 
          y, 
          scale,
          opacity,
          rotateX,
        }}
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={inView ? { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.8,
            type: "spring",
            bounce: 0.3
          }
        } : {}}
        whileInView={{
          rotateX: "0deg",
          transition: {
            duration: 1,
            type: "spring",
            stiffness: 100
          }
        }}
        width="100%"
      >
        {children}
      </MotionBox>
    </Box>
  )
}

export default Section
