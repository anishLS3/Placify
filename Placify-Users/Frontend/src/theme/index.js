import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        margin: 0,
        padding: 0,
        height: '100%',
      },
      body: {
        marginBottom: 0,
        paddingBottom: 0,
      },
      '#root': {
        margin: 0,
        padding: 0,
        marginBottom: 0,
        paddingBottom: 0,
      },
    },
  },
  fonts: {
    heading: '"Plus Jakarta Sans", sans-serif',
    body: '"Inter", sans-serif',
  },
  colors: {
    brand: {
      50: '#e5f3ff',
      100: '#b8ddff',
      200: '#8ac7ff',
      300: '#5cb1ff',
      400: '#2e9bff',
      500: '#1482e6',
      600: '#0965b4',
      700: '#004982',
      800: '#002d51',
      900: '#001221',
    },
    accent: {
      50: '#ffe5f0',
      100: '#ffb8d1',
      200: '#ff8ab3',
      300: '#ff5c95',
      400: '#ff2e77',
      500: '#e6145d',
      600: '#b40948',
      700: '#820033',
      800: '#51001f',
      900: '#21000c',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          transition: 'all 0.2s',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'lg',
          transition: 'all 0.2s',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: '2xl',
          },
        },
      },
    },
  },
})

export default theme