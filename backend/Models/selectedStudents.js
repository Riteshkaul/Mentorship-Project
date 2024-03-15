const mongoose = require("mongoose");

const selectedStudentsSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student", // Reference to the Student model
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  ideation: {
    type: Number,
    default: 0, // Default value for ideation marks
  },
  execution: {
    type: Number,
    default: 0, // Default value for execution marks
  },
  vivaPitch: {
    type: Number,
    default: 0, // Default value for vivaPitch marks
  },
});

const SelectedStudent = mongoose.model(
  "SelectedStudent",
  selectedStudentsSchema
);

module.exports = SelectedStudent;
