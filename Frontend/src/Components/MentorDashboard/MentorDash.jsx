import React from 'react'
import MentorNav from './MentorNav'
import MentorHero from './MentorHero'
import Footer from '../Footer/Footer'
import Sidebar from '../Sidebar/Sidebar.jsx'
import './Mentor.css'

function MentorDash() {
    return (
        <div>
            <Sidebar />
            {/* <MentorNav /> */}
            <MentorHero />
            <Footer />
        </div>
    )
}

export default MentorDash
