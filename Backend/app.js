const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgrid = require('@sendgrid/mail');
require('dotenv').config();

 const app = express();

// Middleware
 app.use(cors());
 app.use(express.json());

 // Set the SendGrid API key from environment variables
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

 mongoose.connect('mongodb://localhost:27017/signupDB', {})
   .then(() => console.log('Connected to MongoDB'))
   .catch((err) => console.error('MongoDB connection error:', err));

//collection for student
 const Student = mongoose.model('Student', new mongoose.Schema({
   sid: String,
   sname: String,
   mail: String,
   year: String,
   dept: String,
   mentor: String,
   user: String,
   rePass: String
 }));

//collection for mentor
const Mentor = mongoose.model('Mentor', new mongoose.Schema({
  name: String,
  dept: String,
  mail: String,
  phone: Number,
  user: String,
  pass1: String
}));

//collection for forgotpass
const  Forgotpass = mongoose.model("Forgotpass",new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  resetToken: String,
  resetTokenExpiration: Date
}));

 //endpoint for signup student
 app.post('/api/signupStudent', async (req, res) => {
   const { sid, sname, mail, year, dept, mentor, user, rePass } = req.body;
  
   try {
    
     const hashedPassword = await bcrypt.hash(rePass, 10);

     const newUser = new Student({ sid, sname, mail, year, dept, mentor, user, rePass:hashedPassword });
     await newUser.save();
     res.json({ success: true, message: 'User registered successfully!' });
     
   } catch (error) {
     console.log('Error during signup:', error);
     res.status(500).json({ success: false, message: 'Error registering user.', error: error.message});
   }
 });

//end point for check user student
 app.post('/api/check-user-student', async (req, res) => {
  const { user } = req.body;

  try {
    const existingUser = await Student.findOne({ user });
    if (existingUser) {
      return res.status(200).json({ success: false, message: 'Username already taken.' });
    }
    return res.status(200).json({ success: true, message: 'Username available.' });
  } catch (error) {
    console.log("Error while checking username.", error);
    res.status(500).json({ success: false, message: "Error while checking username.", error: error.message });
  }
});

//end point for check user mentor
app.post('/api/check-user-mentor', async (req, res) => {
  const { user } = req.body;

  try {
    const existingUser = await Mentor.findOne({ user });
    if (existingUser) {
      return res.status(200).json({ success: false, message: 'Username already taken.' });
    }
    return res.status(200).json({ success: true, message: 'Username available.' });
  } catch (error) {
    console.log("Error while checking username.", error);
    res.status(500).json({ success: false, message: "Error while checking username.", error: error.message });
  }
});

//end point for signup mentor
app.post('/api/signupMentor', async (req, res) => {
  const { name, dept, mail, phone, user, pass1 } = req.body;
  //  console.log('Request body:', req.body);
  try {
   
    const hashedPassword = await bcrypt.hash(pass1, 10);

    const newUser = new Mentor({ name, dept, mail, phone, user, pass1:hashedPassword });
    await newUser.save();
    res.json({ success: true, message: 'User registered successfully!' });
    
  } catch (error) {
    console.log('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Error registering user.', error: error.message});
  }
});

//end point for login
app.post('/api/login', async (req,res) => {
  const { role, user, pass} = req.body;
  // console.log('Request body:', req.body);

  try {

    if(role === "Student"){
        const User = await Student.findOne({ user });
    
    if (!User) {
      return res.status(404).json({ success: false, message: 'Username not found' });
    }

    const isMatch = await bcrypt.compare(pass, User.rePass);

    if(!isMatch){
      return res.status(404).json({ success: false, message: 'Password not matched'});
    }
    return res.status(200).json({ success: true, message: 'Login successful!'});
  }

    if(role === "Mentor"){
        const User = await Mentor.findOne({ user });

        if (!User) {
          return res.status(404).json({ success: false, message: 'Username not found' });
        }
    
        const isMatch = await bcrypt.compare(pass, User.pass1);
    
        if(!isMatch){
          return res.status(404).json({ success: false, message: 'Password not matched'});
        }
    
        return res.status(200).json({ success: true, message: 'Login successful!'});

        
    }
  

  } catch (error) {
    console.log('Error during login:', error);
    res.status(500).json({ success: false, message: 'Error login.', error: error.message});
  }
});

// Forgot password route
app.post('/api/forgot-password', async (req, res) => {
  const { mail } = req.body;
  console.log(req.body);
  let user;

  try{
  // Check if the email belongs to a Mentor or Student
  user = await Mentor.findOne({ mail }) || await Student.findOne({ mail });
  console.log(user);
  if (!user) {
      return res.status(404).json({success:false, message:'User not found'});
  }

  // Generate a reset token and expiration time
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpires = Date.now() + 1800000; // Token expires in 1 hour

  // Store the reset token and its expiration in the user's document
  let forgotPassRecord = await Forgotpass.findOne({ email: user.mail });
  console.log(forgotPassRecord);
  if(forgotPassRecord){
    forgotPassRecord.resetToken = resetToken;
    forgotPassRecord.resetTokenExpiration = resetTokenExpires;
  }else{
    // Create a new Forgotpass document
      forgotPassRecord = new Forgotpass({
      email: user.mail,
      resetToken,
      resetTokenExpiration: resetTokenExpires
    });
  }
  await forgotPassRecord.save();

  // Create the password reset link
  const resetUrl = `http://localhost:5001/reset-password/${resetToken}`;

  const msg = {
      to: user.mail,
      from: 'studentmentoring.noreply@gmail.com',
      subject: `Password Reset Request for ${user.sname || user.name}`,

      html:`<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
};
  

  const response = await sendgrid.send(msg);
  console.log(response); 
  res.json({ success: true, message: 'Password reset email sent' });

}catch(error){
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Error sending email' });
  }
}); 

// app.post('/api/reset-password', async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//     // Find the reset token in the ForgotPass collection
//     const resetRecord = await forgotpass.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    
//     if (!resetRecord) {
//       return res.status(400).json({ success: false, message: 'Invalid or expired token' });
//     }

//     // Find the user by email (from the reset record)
//     const user = await Student.findOne({ mail: resetRecord.email });
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update the user's password
//     user.rePass = hashedPassword;
//     await user.save();

//     // Optionally, delete the reset token entry (cleanup)
//     await ForgotPass.deleteOne({ resetToken: token });

//     res.status(200).json({ success: true, message: 'Password updated successfully!' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error resetting password', error });
//   }
// });


 const PORT = 5001;
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));