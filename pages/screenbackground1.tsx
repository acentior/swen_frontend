import { Grid, Typography, Button} from '@mui/material'
import React from 'react'

const screenBackground = () => {
  return (
    <Grid container spacing={0} component="main" sx={{
      height: '100vh',
    }}>
      <Grid
        item
        xs={12}
        sm={4}
        md={6}
        sx={{
          display: "flex",
          flexDirection: 'column',
          backgroundSize: "cover",
          justifyContent: "center",
          alignItems: "center",
          background: "#00000000"
        }}
        component={"div"}
      >
        <Typography variant='h1' m={0} py={5} px={0} component="h1" sx={{
          padding: "0 0 0 0"
        }}>
          SWEN
        </Typography>
        <Typography variant='h2' m={0} py={5} px={0} component="h2" sx={{
          padding: "1rem 0 0 0"
        }}>
          A SAAS Application
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8} md={6} component={"div"} sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
        background: "#00000000",
      }}>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          sx={{ mt: 10, mb: 2, width: "50%" }}
        >
          Sign In
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 10, mb: 2, width: "50%" }}
        >
          Sign Up
        </Button>
      </Grid>
    </Grid>
  )
}

export default screenBackground