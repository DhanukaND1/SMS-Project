const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const UserModel = require('./model/User');
const StudentModel = require('./model/Student');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Load environment variables
dotenv.config();
const app = express();
app.use(express.json());

// CORS configuration with FRONTEND_URL from .env
app.use(cors({
    origin: process.env.FRONTEND_URL, // Use environment variable
    credentials: true, // Allow credentials (cookies, session)
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET, // Use environment variable
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true, // Ensure the cookie is only accessible by the server
        secure: false, // Set to true if using HTTPS
        sameSite: 'lax' // Helps prevent CSRF attacks
    }
}));

// Start the server
app.listen(process.env.PORT2 || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT2}`);
});

// Mentor Signup
// app.post('/Mentorsignup', async (req, res) => {
//     try {
//         const { id, name, department, email, contactnum, username, password } = req.body;
//         const existingUser = await UserModel.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Email already exists' });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new UserModel({ id, name, department, email, contactnum, username, password: hashedPassword });
//         const savedUser = await newUser.save();
//         res.status(201).json(savedUser);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Get Mentors
app.get('/mentors', async (req, res) => {
    const department = req.query.department;
    try {
        const mentors = department
            ? await UserModel.find({ department }, 'name') // Filter by department if provided
            : await UserModel.find({}, 'name'); // Otherwise, return all mentors
        res.status(200).json(mentors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Student Signup
// app.post('/Studentsignup', async (req, res) => {
//     try {
//         const { id, name, email, batchyear, department, mentor, username, password } = req.body;
//         const existingStudent = await StudentModel.findOne({ email });
//         if (existingStudent) {
//             return res.status(400).json({ error: 'Email already exists' });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newStudent = new StudentModel({ id, name, email, batchyear, department, mentor, username, password: hashedPassword });
//         const savedStudent = await newStudent.save();
//         res.status(201).json(savedStudent);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Login Route
// app.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         //Check if the user is a mentor first
//         const mentor = await UserModel.findOne({ email });
//         if (mentor) {
//             const passwrodMatch = await bcrypt.compare(password, mentor.password);
//             if (passwrodMatch) {
//                 req.session.user = { name: mentor.name, email: mentor.email, role: 'mentor' };
//                 req.session.save();
//                 return res.json({ message: "Success", role: 'mentor' });
//             } else {
//                 return res.status(401).json({ error: "Password does not match!" });
//             }
//         }

//         //If no Mentor, check if the user is a student
//         const student = await StudentModel.findOne({ email });
//         if (student) {
//             const passwrodMatch = await bcrypt.compare(password, student.password);
//             if (passwrodMatch) {
//                 req.session.user = { name: student.name, email: student.email, role: 'student' };
//                 req.session.save();
//                 return res.json({ message: "Success", role: "student" });
//             } else {
//                 return res.status(401).json({ error: "Password does not match!" });
//             }
//         }
//         return res.status(401).json({ error: "No user found" });
//     } catch (error) {
//         console.error('Error in /login:', error);  // This will log the error to the console
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Get current logged-in user (either mentor or student)
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        const { name, email, role } = req.session.user;

        if (role === 'mentor') {
            // Return mentor-specific response
            return res.json({ name, email, role: 'mentor' });
        } else if (role === 'student') {
            // Return student-specific response
            return res.json({ name, email, role: 'student' });
        } else {
            return res.status(400).json({ error: "Invalid role" });
        }
    } else {
        return res.status(401).json({ error: "No user logged in" });
    }
});

//Get Student by Mentor and Batch Year
app.get('/students', async (req, res) =>{
    const { mentorName, batchyear } = req.query; //Expect mentorName and batchyear a query parameters

    try {
        //Fetch students assigned to the specific mentor and batch year
        const students = await StudentModel.find({ mentor: mentorName, batchyear });

        if (students.length === 0){
            return res.status(404).json({ message: 'No student found for this mentor and batch year.' });
        }
        res.status(200).json(students);
    }catch (error) {
        res.status(500).json({ error: error.message });
    } 
})
