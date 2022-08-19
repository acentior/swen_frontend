import { Grid, Paper, Box, Typography} from '@mui/material'
import React from 'react'
import Link from 'next/link'

const Sign = ({children} : {children : JSX.Element}) => {
  return (
    <Grid container spacing={0} component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={12}
        sm={4}
        md={6}
        sx={{
          display: "flex",
          background: "linear-gradient(to bottom right, #7d59bd, #5241a0) no-repeat center fixed",
          backgroundSize: "cover",
          justifyContent: "center",
          alignItems: "center",
          // textAlign: "center",
        }}
        component={Paper}
        elevation={6}
        square
      >
        <Link href={"/"} passHref={true}>
          <Box component={"img"} src='/logo.png'  sx={{
            cursor: "pointer"
          }} />
        </Link>
        {/* <Image src='/logo.png' width={100} height={100} alt="logo"/> */}
        {/* <Typography variant='h1' m={0} py={5} component="h1">
          SWEN
        </Typography> */}
      </Grid>
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square sx={{
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
      }}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: "center",
            alignItems: 'center',
            position: "relative"
          }}
        >
          { children }
        </Box>
      </Grid>
    </Grid>
    // </Grid>
  )
}

export default Sign