const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true }, // Unique student identifier
  name: { type: String, required: true },
});

module.exports = mongoose.model("Student", studentSchema);
