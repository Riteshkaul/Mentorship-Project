import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentSelection = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:6001/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleSelectStudent = (studentId) => {
    const isStudentSelected = selectedStudents.includes(studentId);
    if (isStudentSelected) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      if (selectedStudents.length < 4) {
        setSelectedStudents([...selectedStudents, studentId]);
      } else {
        alert("You can select up to 4 students.");
      }
    }
  };

  const handleNext = async () => {
    console.log(selectedStudents);
    if (selectedStudents.length < 3 || selectedStudents.length > 4) {
      alert("You must select between 3 and 4 students.");
      return;
    }

    try {
      // Fetch the details of selected students
      const selectedStudentDetails = students.filter((student) =>
        selectedStudents.includes(student._id)
      );

      // Send selected students with IDs and names to the backend
      const response = await axios.post(
        "http://localhost:6001/select-students",
        {
          students: selectedStudentDetails.map(({ _id }) => ({
            studentId: _id,
          })),
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        navigate("/selected", {
          state: { selectedStudents: selectedStudents },
        });
      } else {
        throw new Error("Failed to save selected students.");
      }
    } catch (error) {
      console.error("Error saving selected students:", error);
      alert("Failed to save selected students. Please try again.");
    }
  };

  return (
    <div>
      <h2>List of Available Students</h2>
      <ul>
        {Array.isArray(students) && students.length > 0 ? (
          students.map((student) => (
            <li key={student._id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student._id)}
                  onChange={() => handleSelectStudent(student._id)}
                />
                {student.name}
              </label>
            </li>
          ))
        ) : (
          <li>No students available</li>
        )}
      </ul>
      <button onClick={handleNext}>Next</button>
    </div>
  );
};
export default StudentSelection;
