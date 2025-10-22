import React from 'react'
import { Helmet } from 'react-helmet'
import Background from '@/components/auth/Background'
import AuthNavbar from '@/components/auth/AuthNavbar'
import SignUp from '@/components/auth/SignUp'

export default function sign_up() {
  return (
    <section id="sign_up">
    {/* Title */}
    <Helmet>
        <title>Sign Up | Kolehiyo</title>
    </Helmet>

    {/* Main Content */}
        <div className="min-h-screen">
            <Background />
            <AuthNavbar /> 
            <SignUp /> 
        </div>
    </section>
  )
}
