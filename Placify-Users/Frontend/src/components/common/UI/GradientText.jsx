import React from 'react'
import { Text } from '@chakra-ui/react'

const GradientText = ({ 
  children, 
  fontSize = 'inherit', 
  fontWeight = 'inherit',
  gradient = 'primary',
  as = 'span',
  ...props 
}) => {
  const gradients = {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    warning: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    info: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    purple: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    blue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    pink: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    orange: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    green: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    apple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    sunset: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    forest: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    fire: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
  }

  return (
    <Text
      as={as}
      fontSize={fontSize}
      fontWeight={fontWeight}
      sx={{
        background: gradients[gradient],
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
        display: 'inline'
      }}
      {...props}
    >
      {children}
    </Text>
  )
}

export default GradientText
