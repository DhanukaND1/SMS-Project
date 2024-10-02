const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

 const app = express();

// Middleware
 app.use(cors());
 app.use(express.json());

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

//end point for send mail
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  console.log(req.body);

});

 const PORT = 5001;
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));