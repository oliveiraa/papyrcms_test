import React, { useState } from 'react'
import axios from 'axios'
import Error from 'next/error'
import Router, { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'
import { Input } from '@/components'
import styles from './forgotPassword.module.scss'

const ForgotPasswordPage = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validation, setValidation] = useState('')
  const { query } = useRouter()
  const { token } = query

  if (typeof token !== 'string') return <Error statusCode={403} />

  const handleSubmit = (event: any) => {
    event.preventDefault()

    const params = {
      password,
      confirmPassword,
      token,
    }

    axios
      .post('/api/auth/requestPasswordChange', params)
      .then((response) => {
        setValidation(response.data.message)
        Router.push('/login')
      })
      .catch((error) => {
        console.error(error)
        setValidation(error.response.data.message)
      })
  }

  const data = jwt.decode(token)
  if (!data || typeof data === 'string')
    return <Error statusCode={403} />

  const { email } = data

  return (
    <div className={styles.main}>
      <h3
        className={`heading-tertiary u-margin-bottom-small ${styles.title}`}
      >
        Reset Password for {email}
      </h3>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          id="password"
          label="New Password"
          name="password"
          type="password"
          value={password}
          onChange={(event: any) => setPassword(event.target.value)}
        />

        <Input
          id="confirm_password"
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event: any) =>
            setConfirmPassword(event.target.value)
          }
        />

        <p className={styles.valiation}>{validation}</p>

        <input className="button button-primary" type="submit" />
      </form>
    </div>
  )
}

export default ForgotPasswordPage
