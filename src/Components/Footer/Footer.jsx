import React from 'react'
import { Link } from 'react-scroll'
import './Footer.css'

const Footer = () => {
  return (
    
    <footer className="foot root">
      <div className="footer-container">
      <div className="left">
        <h2>Contact Us</h2>
        <p>Faculty Of Technology,<br />
          University Of Colombo,<br />
          Mahenwatta, Pitipana,<br />
          Homagama,<br />
          Srilanka.
        </p>
      </div>

      <div className="right">
        <h2>Useful Links</h2>
        <ul>
          <li className='uoc'>University Of Colombo</li>
          <li className='list-link' >
            <Link to="home" smooth={true} duration={500} offset={-200} className='gotop'>Go to top</Link>
          </li>
        </ul>
      </div>
      </div>

      <div className="foot-end">
        <hr />
        <p>&copy; 2024 Faculty Of Technology,
          <span className="frst-br"> University Of Colombo, Sri Lanka.</span>
          <span className="sec-br">All rights reserved.</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer