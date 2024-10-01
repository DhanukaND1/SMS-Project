import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentSignup from './Components/StudentSignup/StudentSignup.jsx'
import MentorSignup from './Components/MentorSignup/MentorSignup.jsx'
import Login from './Components/Login/Login.jsx'
import Role from './Components/Role/Role.jsx';
import Home from './Home.jsx';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword.jsx';



const App = () => {
  return (
    <div>
     
      
      <Router>
      <Routes>
        <Route path='/' element={<Home /> } />
        <Route path="/Login" element={<Login />} />
        <Route path="/Role" element={<Role />} />
        <Route path="/MentorSignup" element={<MentorSignup />} />
        <Route path="/StudentSignup" element={<StudentSignup />} />
        <Route path='/ForgotPassword' element={<ForgotPassword />} />
      </Routes>
    </Router>
        
    </div>
  )
}

export default App
