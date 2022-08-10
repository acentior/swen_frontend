import type { NextPage } from 'next'
import { Box, TextField, Button, Link, } from '@mui/material'
import Sign from '../components/Sign'
import { useRouter } from 'next/router'
import React from 'react'

const SignIn: NextPage = () => {
  const history = useRouter()
  const submitHandler = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    alert("singin")
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
          id="username"
          label="USERNAME"
          name="username"
          autoComplete="username"
          variant="standard"
          autoFocus
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 10, mb: 2 }}
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
            history.push("/signup")
          }}
          component={"h3"}
        >
          {"Not a member yet? Sign Up"}
        </Link>
      </Box>
    </Sign>
  )
}

export default SignIn