const express = require("express");
const router = express.Router();
const Mentor = require("../Models/mentor.js");
const Student = require("../Models/student.js");
const { addStudents } = require("../Controllers/students.js");

// const studentRoutes = require("./index.js");
router.post("/", addStudents);

module.exports = router;
