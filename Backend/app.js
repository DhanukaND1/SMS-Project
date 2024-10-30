const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendgrid = require('@sendgrid/mail');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

// Middleware
 

 // CORS configuration with FRONTEND_URL from .env
app.use(cors({
  origin: process.env.FRONTEND_URL, // Use environment variable
  credentials: true, // Allow credentials (cookies, session)
}));

app.use(session({
  secret: process.env.SESSION_SECRET, // Use environment variable
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/signupDB',
      ttl: 14 * 24 * 60 * 60 // Session expiration time (14 days in seconds)
  }),
  cookie: {
      maxAge: 1 * 60 * 60 * 1000, // 1 day
      httpOnly: true, // Ensure the cookie is only accessible by the server
      secure: false, // Set to true if using HTTPS
      sameSite: 'lax' // Helps prevent CSRF attacks
  }
}));

// Parse JSON bodies before handling routes
app.use(express.json());

// Set the SendGrid API key from environment variables
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

mongoose.connect('mongodb://localhost:27017/signupDB', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Session configuration


 

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

// Collection for Resources
const Resource = mongoose.model('Resource', new mongoose.Schema({
  batchyear: { type: String, required: true },
  description: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
}))

//collection for forgotpass
const Forgotpass = mongoose.model("Forgotpass", new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  resetToken: String,
  resetTokenExpiration: Date
}));

//endpoint for signup student
app.post('/api/signupStudent', async (req, res) => {
  const { sid, sname, mail, year, dept, mentor, rePass } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(rePass, 10);

    const newUser = new Student({ sid, sname, mail, year, dept, mentor, rePass: hashedPassword });
    await newUser.save();
    res.json({ success: true, message: 'User registered successfully!' });

  } catch (error) {
    console.log('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Error registering user.', error: error.message });
  }
});

//end point for check  student mail
app.post('/api/check-user-student', async (req, res) => {
  const { mail } = req.body;

  try {
    const existingUser = await Student.findOne({ mail });
    if (existingUser) {
      return res.status(200).json({ success: false, message: 'Email already registered.' });
    }
    return res.status(200).json({ success: true, message: 'Email available.' });
  } catch (error) {
    console.log("Error while checking email.", error);
    res.status(500).json({ success: false, message: "Error while checking email.", error: error.message });
  }
});

//end point for check  mentor mail
app.post('/api/check-user-mentor', async (req, res) => {
  const { mail } = req.body;

  try {
    const existingUser = await Mentor.findOne({ mail });
    if (existingUser) {
      return res.status(200).json({ success: false, message: 'Email already registered.' });
    }
    return res.status(200).json({ success: true, message: 'Email available.' });
  } catch (error) {
    console.log("Error while checking Email.", error);
    res.status(500).json({ success: false, message: "Error while checking Email.", error: error.message });
  }
});

//end point for signup mentor
app.post('/api/signupMentor', async (req, res) => {
  const { name, dept, mail, phone, user, pass1 } = req.body;
  //  console.log('Request body:', req.body);
  try {

    const hashedPassword = await bcrypt.hash(pass1, 10);

    const newUser = new Mentor({ name, dept, mail, phone, user, pass1: hashedPassword });
    await newUser.save();
    res.json({ success: true, message: 'User registered successfully!' });

  } catch (error) {
    console.log('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Error registering user.', error: error.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {

    const { mail, password, role } = req.body;
    console.log(req.body);
    try {
      if (role === 'Student') {
        const student = await Student.findOne({ mail });
        if (!student) {
          console.log('Email not found');
          return res.status(404).json({ success: false, message: 'Email not found' });
          
        }
        const isMatch = await bcrypt.compare(password, student.rePass);
        if (!isMatch) {
          console.log('Password not matched');
          return res.status(500).json({ success: false, message: 'Password not matched' });
        }

        req.session.user = { name: student.sname, email: student.mail, role: 'Student' };
        console.log('Session User:', req.session.user);
        return res.status(200).json({ success: true, role: 'Student', message: 'Login successful!' });
      }

      if (role === 'Mentor') {
        const mentor = await Mentor.findOne({ mail });
        if (!mentor) {
          console.log('Email not found');
          return res.status(404).json({ success: false, message: 'Email not found' });
        }

        const isMatch = await bcrypt.compare(password, mentor.pass1);
        if (!isMatch) {
          console.log('Password not matched');
          return res.status(500).json({ success: false, message: 'Password not matched' });
        }

        req.session.user = { name: mentor.name, email: mentor.mail, role: 'Mentor' };
        return res.status(200).json({ success: true, message: 'Login successful!', role: 'Mentor' });
      }
    } catch (error) {
      console.error('Error in login:', error.response.data); // This will log the error to the console
      res.status(500).json({ error: 'Internal server error' });
    }
  
});


// Get current logged-in user (either mentor or student)
app.get('/api/dashboard', async (req, res) => {

  if (req.session.user) {
      const { name, email, role } = req.session.user;
      if (role === 'Mentor') {

          // Return mentor-specific response
          
          return res.json({ name, email, role: 'Mentor' });

      } else if (role === 'Student') {
          try {
              // Fetch student data including the mentor's name
              const student = await Student.findOne({ mail:email });
              if (student) {
                  return res.json({
                      name: student.sname,
                      email: student.mail,
                      batchyear: student.year,
                      role: 'Student',
                      mentor: student.mentor // Send the mentor's name in the response
                  });
              } else {
                  return res.status(404).json({ error: "Student not found" });
              }
          } catch (error) {
              return res.status(500).json({ error: "Internal server error" });
          }
      } else {
          return res.status(400).json({ error: "Invalid role" });
      }
  } else {
      return res.status(401).json({ error: "No user logged in" });
  }
});

//logout route
app.post('/api/logout',async (req,res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out.' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.status(200).json({ message: 'Logged out successfully.' });
  });
});

// Forgot password route
app.post('/api/forgot-password', async (req, res) => {
  const { mail } = req.body;
  console.log(req.body);
  let user;

  try {
    // Check if the email belongs to a Mentor or Student
    user = await Mentor.findOne({ mail }) || await Student.findOne({ mail });
    console.log(user);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate a reset token and expiration time
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour

    // Store the reset token and its expiration in the user's document
    let forgotPassRecord = await Forgotpass.findOne({ email: user.mail });
    console.log(forgotPassRecord);
    if (forgotPassRecord) {
      forgotPassRecord.resetToken = resetToken;
      forgotPassRecord.resetTokenExpiration = resetTokenExpires;
    } else {
      // Create a new Forgotpass document
      forgotPassRecord = new Forgotpass({
        email: user.mail,
        resetToken,
        resetTokenExpiration: resetTokenExpires
      });
    }
    await forgotPassRecord.save();

    // Create the password reset link
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const msg = {
      to: user.mail,
      from: 'studentmentoring.noreply@gmail.com',
      subject: `Password Reset Request for ${user.sname || user.name}`,

      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
    };


    const response = await sendgrid.send(msg);
    console.log(response);
    res.json({ success: true, message: 'Password reset email sent' });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, message: 'Error sending email' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { token, repass } = req.body;

  try {
    // Find the reset token in the ForgotPass collection
    const resetRecord = await Forgotpass.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

    if (!resetRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Find the user by email (from the reset record)
    const student = await Student.findOne({ mail: resetRecord.email });
    const mentor = await Mentor.findOne({ mail: resetRecord.email });
    const hashedPassword = await bcrypt.hash(repass, 10);

    if (!student && !mentor) {
      return res.status(404).json({ success: false, message: 'User not found for the given email.' });
    }

    if (student) {

      // Update the user's password
      student.rePass = hashedPassword;
      await student.save();

      // Optionally, delete the reset token entry (cleanup)
      await Forgotpass.deleteOne({ resetToken: token });

    }

    if (mentor) {

      // Update the user's password
      mentor.pass1 = hashedPassword;
      await mentor.save();

      // Optionally, delete the reset token entry (cleanup)
      await Forgotpass.deleteOne({ resetToken: token });

    }

    res.status(200).json({ success: true, message: 'Password updated successfully! Now you can close this window and go back to the login page' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting password', error });
    console.log(error);
  }
});

// Get current logged-in user (either mentor or student)
app.get('/api/dashboard', async (req, res) => {
  if (req.session.user) {
    const { name, mail, role } = req.session.user;

    if (role === 'mentor') {
      // Return mentor-specific response
      return res.json({ name, mail, role: 'mentor' });
    } else if (role === 'student') {
      try {
        // Fetch student data including the mentor's name
        const student = await Student.findOne({ mail });
        if (student) {
          return res.json({
            name: student.sname,
            mail: student.mail,
            batchyear: student.year,
            role: 'student',
            mentor: student.mentor // Send the mentor's name in the response
          });
        } else {
          return res.status(404).json({ error: "Student not found" });
        }
      } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }
  } else {
    return res.status(401).json({ error: "No user logged in" });
  }
});

// Get Mentors to Student Sign up dashboard
app.get('/api/mentors', async (req, res) => {
  const department = req.query.department;
  try {
    const mentors = department
      ? await Mentor.find({ dept: department }, 'name') // Filter by department if provided
      : await Mentor.find({}, 'name'); // Otherwise, return all mentors
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Student by Mentor and Batch Year
app.get('/api/students', async (req, res) => {
  const { mentorName, batchyear } = req.query;
  // console.log('Mentor:', mentorName, 'Batch Year:', batchyear);  // Log to confirm the values

  try {
    const students = await Student.find({ mentor: mentorName, year: batchyear });
    // console.log(students);
    if (students.length === 0) {
      return res.status(404).json({ message: 'No student found for this mentor and batch year.' });
    }
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer
const upload = multer({ storage });

// Route to serve satatic files from the 'uploads' folder
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to handle resource uploads
app.post('/api/uploadResource', upload.single('file'), async (req, res) => {
  const { batchyear, description } = req.body;
  const fileUrl = req.file ? `/api/uploads/${req.file.filename}` : null;

  try {
    const newResource = new Resource({
      batchyear,
      description,
      fileUrl
    });

    await newResource.save();
    res.status(201).json({ message: 'Resource uploaded successfully', resource: newResource });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload resource' });
  }
});

// Route to get resources by batch year and file type
app.get('/api/resourcesdash', async (req, res) => {
  const { batchyear, type } = req.query;

  console.log('Received batch:', batchyear, 'and type:', type);

  // Check if batchyear and type are arrays and get the first element if they are
  const actualBatchYear = Array.isArray(batchyear) ? batchyear[0] : batchyear;
  const actualType = Array.isArray(type) ? type[0] : type;

  const typeFilter = {
      pdf: /\.(pdf|jpeg|png)$/,
      video: /\.(mp4|mkv|webm)$/,
      audio: /\.(mp3|wav|mpeg)$/,
  };

  // Check if parameters are provided
  if (!actualBatchYear || !actualType) {
      return res.status(400).json({ message: 'Batch year and resource type are required.' });
  }

  try {
      const resources = await Resource.find({
          batchyear: actualBatchYear,
          fileUrl: { $regex: typeFilter[actualType], $options: 'i' }
      });

      if (resources.length === 0) {
          return res.status(404).json({ message: 'No resources found' });
      }
      res.status(200).json(resources);
  } catch (error) {
      console.error('Error fetching resources from DB:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Start the server
const port = process.env.PORT1 || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));