import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/view.css";

const ViewStudent = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);

  useEffect(() => {
    fetchAllStudents();
    fetchAssignedStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get("http://localhost:6001/students");
      setAllStudents(response.data);
    } catch (error) {
      console.error("Error fetching all students:", error);
    }
  };

  const fetchAssignedStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:6001/assigned-students"
      );
      setAssignedStudents(response.data);
    } catch (error) {
      console.error("Error fetching assigned students:", error);
    }
  };

  // Filter out students who are not assigned
  const notAssignedStudents = allStudents.filter(
    (student) =>
      !assignedStudents.some((assigned) => assigned._id === student._id)
  );

  return (
    <div className="student-list-container">
      <div className="student-list">
        <h2>All Students</h2>
        <ul>
          {Array.isArray(allStudents) ? (
            allStudents.map((student) => (
              <li key={student._id}>{student.name}</li>
            ))
          ) : (
            <li className="no-students">No students found</li>
          )}
        </ul>
      </div>

      <div className="student-list">
        <h2>Assigned Students</h2>
        <ul>
          {Array.isArray(assignedStudents) ? (
            assignedStudents.map((student) => (
              <li key={student._id}>{student.name}</li>
            ))
          ) : (
            <li className="no-students">No assigned students found</li>
          )}
        </ul>
      </div>

      <div className="student-list">
        <h2>Not Assigned Students</h2>
        <ul>
          {Array.isArray(notAssignedStudents) &&
          notAssignedStudents.length > 0 ? (
            notAssignedStudents.map((student) => (
              <li key={student._id}>{student.name}</li>
            ))
          ) : (
            <li className="no-students">All students are assigned</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ViewStudent;
