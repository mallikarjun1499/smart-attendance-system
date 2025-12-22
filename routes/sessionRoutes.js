const express = require('express');
const crypto = require('crypto');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

const Session = require('../models/Session');
const Attendance = require('../models/Attendance');

const router = express.Router();
const LINK_TTL_MINUTES = 10;

const buildAttendLink = (req, code) => {
  const baseUrl =
    process.env.APP_BASE_URL || `${req.protocol}://${req.get('host')}`;
  // Use /attend (route), not attend.html, so this works on Render + local
  return `${baseUrl}/attend?code=${code}`;
};

const ensureSessionActive = (session) => {
  if (!session) {
    const err = new Error('Session not found');
    err.statusCode = 404;
    throw err;
  }

  if (session.expiresAt.getTime() < Date.now()) {
    const err = new Error('Session expired');
    err.statusCode = 410;
    throw err;
  }
};

router.post('/session', async (req, res, next) => {
  try {
    const { teacherName, subject, lat, lng } = req.body;
    if (!teacherName || !subject || typeof lat !== 'number' || typeof lng !== 'number') {
      return res.status(400).json({ message: 'teacherName, subject, lat and lng are required' });
    }

    const code = crypto.randomBytes(3).toString('hex').toUpperCase();
    const link = buildAttendLink(req, code);
    const expiresAt = new Date(Date.now() + LINK_TTL_MINUTES * 60 * 1000);

    const session = await Session.create({
      teacherName,
      subject,
      location: { lat, lng },
      code,
      link,
      expiresAt,
    });

    res.status(201).json({
      sessionId: session._id,
      code: session.code,
      link: session.link,
      expiresAt: session.expiresAt,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = 'Collision detected. Please retry.';
    }
    next(err);
  }
});

router.get('/session/:code', async (req, res, next) => {
  try {
    const session = await Session.findOne({ code: req.params.code.toUpperCase() });
    ensureSessionActive(session);

    res.json({
      teacherName: session.teacherName,
      subject: session.subject,
      expiresAt: session.expiresAt,
      location: session.location,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/session/:code/attendance', async (req, res, next) => {
  try {
    const session = await Session.findOne({ code: req.params.code.toUpperCase() });
    ensureSessionActive(session);

    const attendees = await Attendance.find({ session: session._id })
      .select('-__v')
      .sort({ createdAt: 1 });

    res.json(attendees);
  } catch (err) {
    next(err);
  }
});

router.get('/session/:code/export/csv', async (req, res, next) => {
  try {
    const session = await Session.findOne({ code: req.params.code.toUpperCase() });
    ensureSessionActive(session);

    const attendees = await Attendance.find({ session: session._id });
    const rows = attendees.map((entry) => ({
      Name: entry.studentName,
      RollNo: entry.rollNo,
      DistanceMeters: entry.distanceMeters.toFixed(2),
      RecordedAt: entry.createdAt.toISOString(),
    }));

    const csv = new Parser().parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment(`attendance-${session.code}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

router.get('/session/:code/export/excel', async (req, res, next) => {
  try {
    const session = await Session.findOne({ code: req.params.code.toUpperCase() });
    ensureSessionActive(session);

    const attendees = await Attendance.find({ session: session._id });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    worksheet.columns = [
      { header: 'Name', key: 'studentName', width: 25 },
      { header: 'Roll No', key: 'rollNo', width: 15 },
      { header: 'Distance (m)', key: 'distanceMeters', width: 15 },
      { header: 'Recorded At', key: 'recordedAt', width: 25 },
    ];

    attendees.forEach((entry) =>
      worksheet.addRow({
        studentName: entry.studentName,
        rollNo: entry.rollNo,
        distanceMeters: entry.distanceMeters.toFixed(2),
        recordedAt: entry.createdAt.toISOString(),
      })
    );

    res.header(
      'Content-Disposition',
      `attachment; filename="attendance-${session.code}.xlsx"`
    );
    res.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
});

router.get('/session/:code/export/pdf', async (req, res, next) => {
  try {
    const session = await Session.findOne({ code: req.params.code.toUpperCase() });
    ensureSessionActive(session);

    const attendees = await Attendance.find({ session: session._id });

    res.header('Content-Type', 'application/pdf');
    res.header('Content-Disposition', `attachment; filename="attendance-${session.code}.pdf"`);

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    doc.fontSize(18).text('Smart Attendance Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Teacher: ${session.teacherName}`);
    doc.text(`Subject: ${session.subject}`);
    doc.text(`Session Code: ${session.code}`);
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    doc.moveDown();

    attendees.forEach((entry, idx) => {
      doc.text(
        `${idx + 1}. ${entry.studentName} (${entry.rollNo}) - ${entry.distanceMeters.toFixed(
          2
        )} m - ${entry.createdAt.toLocaleString()}`
      );
    });

    doc.end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


