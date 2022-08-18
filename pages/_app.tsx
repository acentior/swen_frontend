import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { userService } from '../services';
// import { SnackbarProvider as SnackbarProviderBase, VariantType, useSnackbar } from 'notistack';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
// import { toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
import toast, { Toaster } from 'react-hot-toast';
import DismissableToast from '../components/DismissableToast';
// import { SnackbarProvider } from 'material-ui-snackbar-provider'

// export interface SnackbarProvider extends SnackbarProviderBase {
//   render(): React.ReactNode;
// }

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
    },
    h4: {
      color: "#ffffff",
      fontSize: "1.2rem",
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
  const AnyComponent = Component as any;
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const authCheck = (url: string) => {
    const publicPaths = [
      '/signin',
      '/signup',
    ]
    const path = url
    console.log(path)
    console.log(userService.userValue)
    console.log(publicPaths.includes(path))
    console.log(!userService.userValue && !publicPaths.includes(path))
    if (!userService.userValue && !publicPaths.includes(path) && process.env.NODE_ENV === 'production') {
      setAuthorized(false)

      router.push({
        pathname: '/signin'
      })
    } else {
      setAuthorized(true)
    }
  }

  useEffect(() => {
    // run auth check on initial load
    authCheck(router.asPath)

    // set authorized to false to hide page content while changing routes
    const hideContent = () => setAuthorized(false)
    router.events.on('routeChangeStart', hideContent)

    // run auth check on route change
    router.events.on('routeChangeComplete', authCheck)

    return () => {
      router.events.off('routeChangeStart', hideContent)
      router.events.off('routeChangeComplete', authCheck)
    }
  }, [])

  return (
    <>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
          vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={2000}
        >
        {/* <DismissableToast /> */}
          < AnyComponent {...pageProps} />
        </SnackbarProvider>

      </ThemeProvider>
    </>
  )
}

export default MyApp
