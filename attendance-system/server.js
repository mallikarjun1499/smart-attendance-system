require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const sessionRoutes = require('./routes/sessionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/teacher', sessionRoutes);
app.use('/api/student', attendanceRoutes);
app.use('/api/export', exportRoutes);

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'teacher.html'));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


