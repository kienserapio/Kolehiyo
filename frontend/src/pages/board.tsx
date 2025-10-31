import React from 'react'
import { Helmet } from 'react-helmet'
import HeroSection from '@/components/board/HeroSection'
import UserNavbar from '@/components/UserNavbar'
import { nextDay } from 'date-fns'
import BoardContainer from '@/components/board/BoardContainer'

export default function board() {
  return (
    <section id="board">
    {/* Title */}
    <Helmet>
        <title>My Board | Kolehiyo</title>
    </Helmet>

    {/* Main Content */}
    <div className="min-h-screen">
        <UserNavbar />
        <HeroSection />
        <BoardContainer />
    </div>

    </section>
  )
}
