import React from 'react'
import { Helmet } from 'react-helmet'
import HeroSection from '@/components/college/HeroSection'
import UserNavbar from '@/components/UserNavbar'
import CollegeSearchBar from '@/components/college/CollegeSearchBar'
import { nextDay } from 'date-fns'
import CollegesContainer from '@/components/college/CollegesContainer'

export default function college() {
  return (
    <section id="college">
    {/* Title */}
    <Helmet>
        <title>Colleges | Kolehiyo</title>
    </Helmet>

    {/* Main Content */}
    <div className="min-h-screen">
        <UserNavbar />
        <HeroSection />
        <CollegeSearchBar />
        <CollegesContainer />
    </div>

    </section>
  )
}
