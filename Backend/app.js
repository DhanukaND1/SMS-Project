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

  const User = mongoose.model('User', new mongoose.Schema({
    sid: String,
    sname: String,
    mail: String,
    year: Number,
    dept: String,
    mentor: String,
    user: String,
    rePass: String
  }));

  app.post('/api/signup', async (req, res) => {
    const { sid, sname, mail, year, dept, mentor, user, rePass } = req.body;

    try {
      const existingUser = await User.findOne({ user });
        if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already exists.' });
    }
      const hashedPassword = await bcrypt.hash(rePass, 10);

      const newUser = new User({ sid, sname, mail, year, dept, mentor, user, rePass:hashedPassword });
      await newUser.save();
      res.json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error registering user.' });
    }
  });

  const PORT = 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));