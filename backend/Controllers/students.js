const Mentor = require("../Models/mentor.js");
const Student = require("../Models/student.js");

const addStudents = async (req, res) => {
  try {
    const { name, mentorId } = req.body;

    // Check if mentor exists and has capacity
    const mentor = await Mentor.findById(mentorId).populate("students");
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }
    if (mentor.students.length >= 4) {
      return res
        .status(400)
        .json({ error: "Mentor cannot accommodate more students" });
    }

    // Check if the student is already assigned to another mentor
    const existingStudent = await Student.findOne({ name });
    if (existingStudent && existingStudent.mentor !== mentorId) {
      return res
        .status(400)
        .json({ error: "Student already assigned to another mentor" });
    }

    const student = new Student({ name, mentor: mentorId });
    await student.save();

    // Update mentor's students list
    mentor.students.push(student._id);
    await mentor.save();

    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addStudents,
};
