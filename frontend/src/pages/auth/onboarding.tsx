import React from 'react'
import { Helmet } from 'react-helmet'
import Background from '@/components/auth/Background'
import AuthNavbar from '@/components/auth/AuthNavbar'
import Onboarding
 from '@/components/auth/Onboarding'
export default function onboarding() {
  return (
    <section id="onboarding">
    {/* Title */}
    <Helmet>
        <title>Personalize Your Journey! | Kolehiyo</title>
    </Helmet>

    {/* Main Content */}
        <div className="min-h-screen">
            <Background />
            <AuthNavbar /> 
            <Onboarding /> 
        </div>
    </section>
  )
}
