const { Schema, model } = require('mongoose');

const locationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const sessionSchema = new Schema(
  {
    teacherName: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    location: { type: locationSchema, required: true },
    code: { type: String, required: true, unique: true },
    link: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model('Session', sessionSchema);





