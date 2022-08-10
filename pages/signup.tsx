import type { NextPage } from 'next'
import { Box, TextField, Button, Link, } from '@mui/material'
import Sign from '../components/Sign'
import { useRouter } from 'next/router'
import React from 'react'

const SignUp: NextPage = () => {
  const history = useRouter()
  const submitHandler = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    alert("singup")
  }
  return (
    <Sign>
      <Box component="form" noValidate onSubmit={submitHandler} sx={{
        mt: 1,
        position: 'relative'
      }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="EMAIL"
          name="email"
          autoComplete="email"
          variant="standard"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="USERNAME"
          name="username"
          autoComplete="username"
          variant="standard"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="PASSWORD"
          type="password"
          id="password"
          autoComplete="current-password"
          variant="standard"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirm-password"
          label="CONFIRM PASSWORD"
          type="password"
          id="confirm-password"
          autoComplete=""
          variant="standard"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 4, mb: 2 }}
        >
          Sign In
        </Button>
        <Link
          variant="body2"
          underline='hover'
          sx={{
            cursor: "pointer",
            color: "#000",
            mt: 2,
            textAlign: "center"
          }}
          onClick={() => {
            history.push("/signin")
          }}
          component={"h3"}
        >
          {"Already have an account? Sign In"}
        </Link>
      </Box>
    </Sign>
  )
}

export default SignUp