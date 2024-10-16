import React,{useState,useRef,useEffect} from 'react'
import './Navigation.css'
import logo from '../../assets/sms-img.jpg';
import { Link } from 'react-router-dom';

function Navigation() {

  const [mobileMenu,setMobileMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(()=>{
    document.addEventListener("click",handleOutsideClick);
  },[]) 

  const handleOutsideClick = (e) =>{
    if(!menuRef.current.contains(e.target)){setMobileMenu(false)}
  }

  const toogleMenu = () => {
    setMobileMenu(!mobileMenu);
  }

  return (
    <div>
      <nav className="navbar">

      <img src={logo} alt="" className='logoo'/>

      <div className='txt'>
        <h3>STUDENT MENTORING SYSTEM</h3>
        <h5>UNIVERSITY OF COLOMBO</h5>
        <h5>FACULTY OF TECHNOLOGY</h5>
      </div>

      <div className='menu-lbl'>
        <button className='menu-btn' onClick={toogleMenu} ref={menuRef}>{mobileMenu ? <i className='fa-solid fa-xmark xmark'></i>:<i className='fas fa-bars bars'></i>}</button>
        <label className={mobileMenu ? "menu-lable":""}>Menu</label>
      </div>

      <ul className="nav-links" id={mobileMenu ?"":"height-lst"}>
        <li><a href="#">Home</a></li>
        <li><a href="#">Dash Board</a></li>
        <li><a href="#">Session</a></li>
        <li><a href="#">Logout</a></li>
      </ul>

      </nav>
    </div>
  )
}

export default Navigation
