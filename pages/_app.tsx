import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: "#B1A5D5",
      main: "#673AB7",
      dark: "#5341A0"
    },
    secondary: {
      light: "#000000",
      main: "#FFFFFF",
      dark: "#5341A0"
    }
  },
  typography: {
    h1: {
      color: "#ffffff",
      fontSize: "4rem",
      textAlign: "center"
    },
    h2: {
      color: "#ffffff",
      fontSize: "1.5rem",
      textAlign: "center"
    },
    h3: {
      color: "#AFA3D4",
      fontSize: "1.5rem"
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          fontSize: "1.2rem"
        }
      }
    }
  }
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      < Component {...pageProps } />
    </ThemeProvider>
  )
}

export default MyApp
