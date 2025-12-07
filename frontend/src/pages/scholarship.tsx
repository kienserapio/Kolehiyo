import React from 'react'
import { Helmet } from 'react-helmet'
import HeroSection from '@/components/scholarship/HeroSection'
import UserNavbar from '@/components/UserNavbar'
import ScholarshipSearchBar from '@/components/scholarship/ScholarshipSearchBar'
import ScholarshipContainer from '@/components/scholarship/ScholarshipContainer'
import { nextDay } from 'date-fns'

export default function scholarship() {
  return (
    <section id="scholarship">
    {/* Title */}
    <Helmet>
        <title>Scholarships | Kolehiyo</title>
    </Helmet>

    {/* Main Content */}
    <div className="min-h-screen">
        <UserNavbar />
        <HeroSection />
        <ScholarshipSearchBar />
        <ScholarshipContainer />
    </div>

    </section>
  )
}
