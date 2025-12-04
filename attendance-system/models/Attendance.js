const { Schema, model } = require('mongoose');

const locationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const attendanceSchema = new Schema(
  {
    session: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
    studentName: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, trim: true },
    location: { type: locationSchema, required: true },
    distanceMeters: { type: Number, required: true },
    deviceFingerprint: { type: String, required: true }, // IP + User-Agent hash
    clientIP: { type: String, required: true },
    userAgent: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent duplicate rollNo in same session
attendanceSchema.index({ session: 1, rollNo: 1 }, { unique: true });
// Prevent same device from submitting multiple times in same session
attendanceSchema.index({ session: 1, deviceFingerprint: 1 }, { unique: true });

module.exports = model('Attendance', attendanceSchema);





