import { extendTheme } from '@chakra-ui/react'

// Apple-style dark theme for admin panel
const adminTheme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      'html, body': {
        margin: 0,
        padding: 0,
        height: '100%',
        bg: '#000000',
        color: 'white',
      },
      '#root': {
        margin: 0,
        padding: 0,
        height: '100vh',
        bg: '#000000',
      },
    }),
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
    // Apple-style dark colors
    dark: {
      bg: '#000000',
      surface: '#1c1c1e',
      elevated: '#2c2c2e',
      border: '#38383a',
      text: {
        primary: '#ffffff',
        secondary: '#ebebf5',
        tertiary: '#ebebf599',
      },
    },
    // Admin-specific status colors (adjusted for dark theme)
    status: {
      pending: {
        50: '#fff4e6',
        100: '#ffe0b3',
        200: '#ffcc80',
        300: '#ffb84d',
        400: '#ffa41a',
        500: '#ff9000',
        600: '#e67c00',
        700: '#cc6900',
        800: '#b35500',
        900: '#994200',
      },
      approved: {
        50: '#e8f5e8',
        100: '#c3e6c3',
        200: '#9dd69d',
        300: '#77c677',
        400: '#51b751',
        500: '#30d158', // Apple green
        600: '#28a745',
        700: '#1e7e34',
        800: '#155724',
        900: '#0a4019',
      },
      rejected: {
        50: '#ffe6e6',
        100: '#ffb3b3',
        200: '#ff8080',
        300: '#ff4d4d',
        400: '#ff1a1a',
        500: '#ff3b30', // Apple red
        600: '#dc3545',
        700: '#c82333',
        800: '#a71e2a',
        900: '#801119',
      }
    }
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
            bg: 'brand.400',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(20, 130, 230, 0.3)',
          },
          _active: {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        outline: {
          borderColor: 'whiteAlpha.300',
          color: 'white',
          _hover: {
            bg: 'whiteAlpha.100',
            borderColor: 'whiteAlpha.500',
            transform: 'translateY(-1px)',
          },
        },
        ghost: {
          color: 'white',
          _hover: {
            bg: 'whiteAlpha.100',
          },
        }
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          bg: 'dark.surface',
          border: '1px solid',
          borderColor: 'dark.border',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    Table: {
      variants: {
        admin: {
          table: {
            bg: 'dark.surface',
            borderRadius: 'lg',
            overflow: 'hidden',
          },
          thead: {
            bg: 'dark.elevated',
          },
          th: {
            color: 'dark.text.secondary',
            fontWeight: '600',
            fontSize: 'sm',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            borderBottom: '2px solid',
            borderColor: 'dark.border',
          },
          td: {
            borderBottom: '1px solid',
            borderColor: 'dark.border',
            color: 'dark.text.primary',
          },
          tbody: {
            tr: {
              _hover: {
                bg: 'whiteAlpha.50',
              },
            },
          },
        },
      },
    },
    Badge: {
      variants: {
        pending: {
          bg: 'orange.600',
          color: 'white',
        },
        approved: {
          bg: 'status.approved.500',
          color: 'black',
        },
        rejected: {
          bg: 'status.rejected.500',
          color: 'white',
        },
        verified: {
          bg: 'blue.500',
          color: 'white',
        },
      },
    },
    Input: {
      defaultProps: {
        variant: 'filled',
      },
      variants: {
        filled: {
          field: {
            bg: 'rgba(28, 28, 30, 0.8)',
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '14px',
            _placeholder: {
              color: 'rgba(255, 255, 255, 0.5)',
            },
            _hover: {
              bg: 'rgba(44, 44, 46, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            _focus: {
              bg: 'rgba(28, 28, 30, 0.9)',
              borderColor: '#007AFF',
              boxShadow: '0 0 0 1px #007AFF',
              outline: 'none',
            },
            _invalid: {
              borderColor: '#FF3B30',
              boxShadow: '0 0 0 1px #FF3B30',
            },
          },
        },
        outline: {
          field: {
            bg: 'transparent',
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            fontSize: '14px',
            _placeholder: {
              color: 'rgba(255, 255, 255, 0.5)',
            },
            _hover: {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            _focus: {
              borderColor: '#007AFF',
              boxShadow: '0 0 0 1px #007AFF',
              outline: 'none',
            },
          },
        },
      },
    },
    Select: {
      defaultProps: {
        variant: 'filled',
      },
      variants: {
        filled: {
          field: {
            bg: 'rgba(28, 28, 30, 0.8)',
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '14px',
            _hover: {
              bg: 'rgba(44, 44, 46, 0.8)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            _focus: {
              bg: 'rgba(28, 28, 30, 0.9)',
              borderColor: '#007AFF',
              boxShadow: '0 0 0 1px #007AFF',
              outline: 'none',
            },
            option: {
              bg: '#1c1c1e',
              color: '#ffffff',
              _selected: {
                bg: '#007AFF',
                color: '#ffffff',
              },
            },
          },
          icon: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
        outline: {
          field: {
            bg: 'transparent',
            border: '1px solid',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            fontSize: '14px',
            _hover: {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            _focus: {
              borderColor: '#007AFF',
              boxShadow: '0 0 0 1px #007AFF',
              outline: 'none',
            },
          },
        },
      },
    },
    Textarea: {
      defaultProps: {
        variant: 'filled',
      },
      variants: {
        filled: {
          bg: 'rgba(28, 28, 30, 0.8)',
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          fontSize: '14px',
          resize: 'vertical',
          minHeight: '100px',
          _placeholder: {
            color: 'rgba(255, 255, 255, 0.5)',
          },
          _hover: {
            bg: 'rgba(44, 44, 46, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          _focus: {
            bg: 'rgba(28, 28, 30, 0.9)',
            borderColor: '#007AFF',
            boxShadow: '0 0 0 1px #007AFF',
            outline: 'none',
          },
          _invalid: {
            borderColor: '#FF3B30',
            boxShadow: '0 0 0 1px #FF3B30',
          },
        },
        outline: {
          bg: 'transparent',
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          fontSize: '14px',
          resize: 'vertical',
          minHeight: '100px',
          _placeholder: {
            color: 'rgba(255, 255, 255, 0.5)',
          },
          _hover: {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          _focus: {
            borderColor: '#007AFF',
            boxShadow: '0 0 0 1px #007AFF',
            outline: 'none',
          },
        },
      },
    },
    FormLabel: {
      baseStyle: {
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: '500',
        mb: 2,
      },
    },
    FormErrorMessage: {
      baseStyle: {
        color: '#FF3B30',
        fontSize: '12px',
        mt: 1,
      },
    },
    FormHelperText: {
      baseStyle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '12px',
        mt: 1,
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'dark.surface',
          color: 'white',
        },
        overlay: {
          bg: 'blackAlpha.600',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
})

export default adminTheme