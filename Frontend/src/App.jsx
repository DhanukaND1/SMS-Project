import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentSignup from './Components/StudentSignup/StudentSignup.jsx'
import MentorSignup from './Components/MentorSignup/MentorSignup.jsx'
import Login from './Components/Login/Login.jsx'
import Role from './Components/Role/Role.jsx';
import Home from './Home.jsx';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword.jsx';
import StudentDash from './Components/StudentDashboard/StudentDash.jsx';
import MentorDash from './Components/MentorDashboard/MentorDash.jsx'
import ResetPassword from './Components/ResetPassword/ResetPassword.jsx';
import SessionForm from './Components/SessionForm/SessionForm.jsx';
import SessionContent1 from './Components/SessionContent/SessionContent1.jsx';
import Calendar from './Components/Calendar/Calendar.jsx';
import Profile from './Components/Profile/Profile.jsx';
import StudentEditProfile from './Components/EditProfile/StudentEditProfile.jsx';
import MentorEditProfile from './Components/EditProfile/MentorEditProfile.jsx';



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
        <Route path='/student-dashboard' element={<StudentDash />} />
        <Route path='/mentor-dashboard' element={<MentorDash />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/session-form' element={<SessionForm />} />
        <Route path='/session-page' element={<SessionContent1 />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/edit-student-profile' element={<StudentEditProfile />} />
        <Route path='/edit-mentor-profile' element={<MentorEditProfile />} />
        
      </Routes>
    </Router>
    </div>
  )
}

export default App