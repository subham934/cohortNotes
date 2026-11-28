import React from 'react'
import Link from 'next/link'

const AuthNav = () => {
  return (
    <div>
      <Link href="/authLayout/login">Login</Link>
      <Link href="/authLayout/register">Register</Link>
    </div>
  )
}

export default AuthNav