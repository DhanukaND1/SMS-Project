import React, { useState } from 'react';
import './Navbar.css';
import logo from '../../assets/sms-img.jpg';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  return (
    <nav className='navi root'>
      <img src={logo} alt="" className='logo'/>
      <div className='txt'>
        <h3>STUDENT MENTORING SYSTEM</h3>
        <h5>UNIVERSITY OF COLOMBO</h5>
        <h5>FACULTY OF TECHNOLOGY</h5>
      </div>
      <div className="menu-cont">
        <button className='menu'onClick={toggleMenu}> 
          <i className="fas fa-bars"></i>
        </button>
        <label>Menu</label>
      </div>
      <ul id={mobileMenu ? "" : "hide-menu"} className='mnu'>
        <ScrollLink to="home" smooth={true} duration={500} offset={-200} className='nav'>
          <li className='lst'>Home</li>
        </ScrollLink>
        <ScrollLink to="about" smooth={true} duration={500} offset={-120} className='nav'>
          <li className='lst'>About</li>
        </ScrollLink>
        <RouterLink to='/Role' className='nav'>
          <li className='lst' id='sign'>Signup</li>
        </RouterLink>
        <RouterLink to='/Login' className='nav'>
          <li className='lst' id='log'>Login</li>
        </RouterLink>
      </ul>
    </nav>
  );
};

export default Navbar;
