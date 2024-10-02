import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentSignup from './Components/StudentSignup/StudentSignup.jsx'
import MentorSignup from './Components/MentorSignup/MentorSignup.jsx'
import Login from './Components/Login/Login.jsx'
import Role from './Components/Role/Role.jsx';
import Home from './Home.jsx';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword.jsx';
import StudentDashboard from './Components/StudentDashboard/StudentDashboard.jsx';
import MentorDashboard from './Components/MentorDashboard/MentorDashboard.jsx'


const App = () => {
  return (
    <div>
     
      
      <Router>
      <Routes>
        <Route path='/' element={<Home /> } />
        <Route path="/login" element={<Login />} />
        <Route path="/role" element={<Role />} />
        <Route path="/mentor-signup" element={<MentorSignup />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/student-dashboard' element={<StudentDashboard />} />
        <Route path='/mentor-dashboard' element={<MentorDashboard />} />
      </Routes>
    </Router>
        
    </div>
  )
}

export default App
