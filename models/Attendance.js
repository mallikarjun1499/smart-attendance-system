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
    deviceFingerprint: { type: String }, // Optional: for logging only, not used for duplicate detection
    clientIP: { type: String }, // Optional: for logging only
    userAgent: { type: String }, // Optional: for logging only
  },
  { timestamps: true }
);

// Primary unique constraint: Prevent duplicate rollNo in same session
// This is the main duplicate prevention mechanism - based on student identity, not device
attendanceSchema.index({ session: 1, rollNo: 1 }, { unique: true });

module.exports = model('Attendance', attendanceSchema);





