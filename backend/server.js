const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 6001;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require("cors");
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster.hk5nb2e.mongodb.net/${process.env.DB_NAME}`,
    { useNewUrlParser: true, useUnifiedTopology: true } // Remove useCreateIndex option
  )
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((error) =>
    console.error("Error connecting to MongoDB", error.message)
  );

// route
const studentroute = require("./routes/studentRoute.js");
const mentor = require("./Models/mentor.js");

const selectedStudents = require("./Models/selectedStudents.js");
const studentModel = require("./Models/student.js");

app.use("/", studentroute);

app.get("/students", async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await studentModel.find();
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/select-students", async (req, res) => {
  try {
    const { students } = req.body;
    if (
      !Array.isArray(students) ||
      students.length < 3 ||
      students.length > 4
    ) {
      return res.status(400).json({
        error:
          "Invalid number of selected students. You must select between 3 and 4 students.",
      });
    }

    const selectedStudentsData = [];
    for (const studentObj of students) {
      const studentId = studentObj.studentId;
      const student = await studentModel.findById(studentId);
      if (!student) {
        return res
          .status(404)
          .json({ error: `Student with ID ${studentId} not found.` });
      }
      selectedStudentsData.push({ studentId, studentName: student.name });
    }

    const savedSelectedStudents = await selectedStudents.insertMany(
      selectedStudentsData
    );

    res.status(200).json({
      message: "Selected students saved successfully.",
      selectedStudents: savedSelectedStudents,
    });
  } catch (error) {
    console.error("Error selecting students:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});
app.get("/select-students", async (req, res) => {
  try {
    const selectedStudentsData = await selectedStudents.find();
    res.status(200).json(selectedStudentsData);
  } catch (error) {
    console.error("Error fetching selected students:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
});
app.get("/assigned-students", async (req, res) => {
  try {
    const selectedStudent = await selectedStudents.find();
    const assignedStudentIds = selectedStudent.map(
      (student) => student.studentId
    );
    const assignedStudents = await studentModel.find({
      _id: { $in: assignedStudentIds },
    });
    res.status(200).json(assignedStudents);
  } catch (error) {
    console.error("Error fetching assigned students:", error);
    res.status(500).json({
      message: "Failed to fetch assigned students. Please try again.",
    });
  }
});

//for save marks
app.post("/save-marks", async (req, res) => {
  try {
    const result = req.body;

    result.marksData.map(async (e) => {
      const response = await selectedStudents.updateMany(
        { _id: e.studentId },
        {
          ideation: e.ideation,
          execution: e.execution,
          vivaPitch: e.vivaPitch,
        }
      );
    });

    res
      .status(200)
      .json({ success: true, message: "Marks saved successfully." });
  } catch (error) {
    console.error("Error saving marks:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to save marks. Please try again.",
    });
  }
});

app.delete("/delete-student/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find the student by ID and delete it
    await selectedStudents.findByIdAndDelete(studentId);

    res
      .status(200)
      .json({ success: true, message: "Student deleted successfully." });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete student. Please try again.",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
