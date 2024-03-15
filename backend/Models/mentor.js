// mentors.js
const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  assigned_students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  submitted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Mentor", mentorSchema);
