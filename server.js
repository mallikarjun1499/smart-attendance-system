require('dotenv').config();

const path = require('path');

const express = require('express');

const cors = require('cors');



const connectDB = require('./config/db');

const sessionRoutes = require('./routes/sessionRoutes');

const attendanceRoutes = require('./routes/attendanceRoutes');

const exportRoutes = require('./routes/exportRoutes');



const app = express();



// Middleware

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));



// Serve static UI

app.use(express.static(path.join(__dirname, 'public')));



// API routes

app.use('/api/teacher', sessionRoutes);

app.use('/api/student', attendanceRoutes);

app.use('/api/export', exportRoutes);



// Friendly routes for UI

app.get('/', (_req, res) => {

  res.sendFile(path.join(__dirname, 'public', 'teacher.html'));

});



app.get('/attend', (_req, res) => {

  res.sendFile(path.join(__dirname, 'public', 'attend.html'));

});



// Error handler

app.use((err, _req, res, _next) => {

  console.error(err);

  const status = err.statusCode || 500;

  res.status(status).json({ message: err.message || 'Internal Server Error' });

});



// PORT: use environment port (Render provides it), fall back to 3000 for local dev

const PORT = process.env.PORT || 3000;



// Connect DB, then start server

connectDB()

  .then(() => {

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  })

  .catch((err) => {

    console.error('Failed to connect to DB:', err);

    process.exit(1);

  });

