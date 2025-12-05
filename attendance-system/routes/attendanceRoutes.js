const express = require('express');
const crypto = require('crypto');
const Session = require('../models/Session');
const Attendance = require('../models/Attendance');

const router = express.Router();
// Allow 120 meters radius (classroom + corridor)
const MAX_DISTANCE_METERS = 3000;

// Get client IP address (handles proxies/load balancers)
const getClientIP = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    'unknown'
  );
};

// Create device fingerprint from IP + User-Agent
const createDeviceFingerprint = (ip, userAgent) => {
  const combined = `${ip}|${userAgent}`;
  return crypto.createHash('sha256').update(combined).digest('hex').substring(0, 32);
};

const toRadians = (value) => (value * Math.PI) / 180;

const haversineDistance = (pointA, pointB) => {
  const R = 6371000; // meters
  const dLat = toRadians(pointB.lat - pointA.lat);
  const dLng = toRadians(pointB.lng - pointA.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(pointA.lat)) *
      Math.cos(toRadians(pointB.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

router.post('/attendance', async (req, res, next) => {
  try {
    const { code, studentName, rollNo, lat, lng } = req.body;
    if (!code || !studentName || !rollNo || typeof lat !== 'number' || typeof lng !== 'number') {
      return res
        .status(400)
        .json({ message: 'code, studentName, rollNo, lat and lng are required' });
    }

    const session = await Session.findOne({ code: code.toUpperCase() });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    if (session.expiresAt.getTime() < Date.now()) {
      return res.status(410).json({ message: 'Session expired' });
    }

    // Check if this roll number already exists in this session (student-based check)
    const existingRollNo = await Attendance.findOne({
      session: session._id,
      rollNo: rollNo.trim().toUpperCase(),
    });

    if (existingRollNo) {
      return res.status(409).json({
        message: 'This roll number has already been used for attendance in this session. Each student can only mark attendance once per session.',
        alreadySubmitted: {
          rollNo: existingRollNo.rollNo,
          studentName: existingRollNo.studentName,
          submittedAt: existingRollNo.createdAt,
        },
      });
    }

    // Get device information for logging only (not for duplicate detection)
    const clientIP = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'unknown';
    const deviceFingerprint = createDeviceFingerprint(clientIP, userAgent);

    const studentLocation = { lat, lng };
    const distance = haversineDistance(studentLocation, session.location);

    // Allow 120 meters radius (classroom + corridor)
    if (distance > MAX_DISTANCE_METERS) {
      return res.status(403).json({
        message: 'You are too far from classroom location.',
        distance,
      });
    }

    const attendance = await Attendance.create({
      session: session._id,
      studentName: studentName.trim(),
      rollNo: rollNo.trim().toUpperCase(),
      location: studentLocation,
      distanceMeters: distance,
      deviceFingerprint,
      clientIP,
      userAgent,
    });

    res.status(201).json({
      message: 'Attendance marked successfully',
      data: {
        studentName: attendance.studentName,
        rollNo: attendance.rollNo,
        distanceMeters: attendance.distanceMeters,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      // Handle unique constraint violations (session + rollNo)
      if (err.message.includes('rollNo') || err.message.includes('session')) {
        err.statusCode = 409;
        err.message = 'This roll number has already been used for attendance in this session. Each student can only mark attendance once per session.';
      } else {
        err.statusCode = 409;
        err.message = 'Duplicate submission detected.';
      }
    }
    next(err);
  }
});

module.exports = router;





