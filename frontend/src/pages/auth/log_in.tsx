import React from 'react'
import { Helmet } from 'react-helmet'
import Background from '@/components/auth/Background'
import AuthNavbar from '@/components/auth/AuthNavbar'
import LogIn from '@/components/auth/LogIn'

export default function sign_up() {
  return (
    <section id="log_in">
    {/* Title */}
    <Helmet>
        <title>Log In | Kolehiyo</title>
    </Helmet>

    {/* Main Content */}
        <div className="min-h-screen">
            <Background />
            <AuthNavbar />
            <LogIn />
        </div>
    </section>
  )
}
