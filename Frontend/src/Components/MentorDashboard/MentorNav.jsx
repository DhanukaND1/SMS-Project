import React from 'react'
import img1 from '../../assets/1.webp';

function MentorNav() {
    return (
        <div>
            <nav className='navbar'>
                <div className='navbar-left'>
                    <h1>Mentor Dashboard</h1>
                    <p>University Of Colombo
                    Faculty of Technology</p>
                </div>
                <div className='navbar-right'>
                    <div className='navbar-icon'>
                        <i className='fas fa-comment-dots'></i>
                    </div>
                    <div className='navbar-icon notification-active'>
                        <i className='fas fa-bell'></i>
                    </div>
                    <div className='navbar-profile'>
                        <img src={img1} alt='profile' className='profile-pic-small' />
                        <i className='fas fa-chevron-down'></i>
                    </div>
                </div>
            </nav>    
        </div>
    )
}

export default MentorNav
