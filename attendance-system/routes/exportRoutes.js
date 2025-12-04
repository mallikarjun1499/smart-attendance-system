const express = require('express');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const Attendance = require('../models/Attendance');
const Session = require('../models/Session');

const router = express.Router();

const formatTimestamp = (value) => new Date(value).toLocaleString();
const formatStatus = () => 'Present';

const fetchAttendanceBySubject = async (subject) => {
  if (!subject) {
    return Attendance.find().sort({ createdAt: 1 });
  }

  const sessions = await Session.find({
    subject: { $regex: new RegExp(`^${subject}$`, 'i') },
  }).select('_id');

  if (!sessions.length) {
    return [];
  }

  const sessionIds = sessions.map((s) => s._id);
  return Attendance.find({ session: { $in: sessionIds } }).sort({ createdAt: 1 });
};

router.get('/csv', async (req, res, next) => {
  try {
    const { subject } = req.query;
    const records = await fetchAttendanceBySubject(subject);
    if (!records.length) {
      return res.status(404).send('No records found');
    }

    const header = 'Name,USN,Time,Status,Latitude,Longitude,DistanceMeters\n';
    const csv =
      header +
      records
        .map((entry) => {
          const { studentName, rollNo, createdAt, location, distanceMeters } = entry;
          const lat = location?.lat ?? '';
          const lng = location?.lng ?? '';
          return `${studentName},${rollNo},${formatTimestamp(createdAt)},${formatStatus()},${lat},${lng},${distanceMeters?.toFixed(
            2
          ) || ''}`;
        })
        .join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance.csv');
    return res.send(csv);
  } catch (err) {
    next(err);
  }
});

router.get('/excel', async (req, res, next) => {
  try {
    const { subject } = req.query;
    const records = await fetchAttendanceBySubject(subject);
    if (!records.length) {
      return res.status(404).send('No attendance found');
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Attendance');

    sheet.columns = [
      { header: 'Name', key: 'studentName', width: 25 },
      { header: 'USN', key: 'rollNo', width: 15 },
      { header: 'Time', key: 'time', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Latitude', key: 'lat', width: 15 },
      { header: 'Longitude', key: 'lng', width: 15 },
      { header: 'Distance (m)', key: 'distance', width: 15 },
    ];

    records.forEach((entry) => {
      sheet.addRow({
        studentName: entry.studentName,
        rollNo: entry.rollNo,
        time: formatTimestamp(entry.createdAt),
        status: formatStatus(),
        lat: entry.location?.lat ?? '',
        lng: entry.location?.lng ?? '',
        distance: entry.distanceMeters?.toFixed(2) || '',
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
});

router.get('/pdf', async (req, res, next) => {
  try {
    const { subject } = req.query;
    const records = await fetchAttendanceBySubject(subject);
    if (!records.length) {
      return res.status(404).send('No attendance available');
    }

    const pdf = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.pdf');
    pdf.pipe(res);

    pdf.fontSize(20).text('Attendance Report', { align: 'center' });
    pdf.moveDown();

    records.forEach((entry, index) => {
      pdf
        .fontSize(12)
        .text(
          `${index + 1}. ${entry.studentName} | ${entry.rollNo} | ${formatTimestamp(
            entry.createdAt
          )} | ${formatStatus()} | LAT: ${entry.location?.lat ?? 'N/A'} LNG: ${
            entry.location?.lng ?? 'N/A'
          } | Dist: ${entry.distanceMeters?.toFixed(2) || 'N/A'} m`
        );
    });

    pdf.end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


