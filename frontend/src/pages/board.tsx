import React from 'react'
import { Helmet } from 'react-helmet'
import HeroSection from '@/components/board/HeroSection'
import UserNavbar from '@/components/UserNavbar'
import { nextDay } from 'date-fns'
import BoardContainer from '@/components/board/BoardContainer'
// 1. Import the new component here
import AnalyticsDashboard from '@/components/board/AnalyticsDashboard'

export default function board() {
  return (
    <section id="board">
    {/* Title */}
    <Helmet>
        <title>My Board | Kolehiyo</title>
    </Helmet>

    {/* Main Content */}
    <div className="min-h-screen bg-gray-50"> {/* Added bg-gray-50 for better contrast */}
        <UserNavbar />
        <HeroSection />
        
        {/* 2. Insert the Analytics Dashboard here */}
        {/* We use 'container mx-auto' to ensure it centers and matches the width of your other content */}
        <div className="container mx-auto px-4 -mb-8 relative z-10">
           <AnalyticsDashboard />
        </div>

        <BoardContainer />
    </div>

    </section>
  )
}