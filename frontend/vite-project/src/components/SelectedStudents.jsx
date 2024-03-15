import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SelectedStudents = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [marksData, setMarksData] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchSelectedStudents();
  }, []);

  const fetchSelectedStudents = async () => {
    try {
      const response = await axios.get("http://localhost:6001/select-students");
      setSelectedStudents(response.data);
      console.log(response.data);
      setMarksData(
        response.data.map((student) => ({
          studentId: student._id,
          name: student.studentName,
          ideation: student.ideation,
          execution: student.execution,
          vivaPitch: student.vivaPitch,
        }))
      );
    } catch (error) {
      console.error("Error fetching selected students:", error);
      alert("Failed to fetch selected students. Please try again.");
    }
  };

  const handleInputChange = (studentId, parameter, value) => {
    const updatedMarks = marksData.map((mark) => {
      if (mark.studentId === studentId) {
        return { ...mark, [parameter]: value };
      }
      return mark;
    });
    setMarksData(updatedMarks);
  };

  const handleEditMarks = (studentId) => {
    setEditingStudent(studentId);
  };

  const handleSaveMarks = async (studentId) => {
    try {
      setEditingStudent(null);
      alert("Marks saved successfully.");
    } catch (error) {
      console.error("Error saving marks:", error);
      alert("Failed to save marks. Please try again.");
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      await axios.delete(`http://localhost:6001/delete-student/${studentId}`);
      // Update the list of selected students after deletion
      fetchSelectedStudents();
      alert("Student deleted successfully.");
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      // Send a POST request to save marks
      await axios.post("http://localhost:6001/save-marks", { marksData });
      setSubmitted(true);
      setIsEdit(false);
      navigate("/view");
      // alert("Marks submitted successfully.");
    } catch (error) {
      console.error("Error submitting marks:", error);
      alert("Failed to submit marks. Please try again.");
    }
  };

  return (
    <div>
      <h2>Selected Students</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Ideation</th>
            <th>Execution</th>
            <th>Viva/Pitch</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedStudents && selectedStudents.length > 0 ? (
            selectedStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.studentName}</td>
                <td>
                  {submitted || editingStudent !== student._id ? (
                    marksData.find((mark) => mark.studentId === student._id)
                      .ideation
                  ) : (
                    <input
                      type="number"
                      value={
                        marksData.find((mark) => mark.studentId === student._id)
                          .ideation
                          ? marksData.find(
                              (mark) => mark.studentId === student._id
                            ).ideation
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          student._id,
                          "ideation",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  )}
                </td>
                <td>
                  {submitted || editingStudent !== student._id ? (
                    marksData.find((mark) => mark.studentId === student._id)
                      .execution
                  ) : (
                    <input
                      type="number"
                      value={
                        marksData.find((mark) => mark.studentId === student._id)
                          .execution
                          ? marksData.find(
                              (mark) => mark.studentId === student._id
                            ).execution
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          student._id,
                          "execution",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  )}
                </td>
                <td>
                  {submitted || editingStudent !== student._id ? (
                    marksData.find((mark) => mark.studentId === student._id)
                      .vivaPitch
                  ) : (
                    <input
                      type="number"
                      value={
                        marksData.find((mark) => mark.studentId === student._id)
                          .vivaPitch
                          ? marksData.find(
                              (mark) => mark.studentId === student._id
                            ).vivaPitch
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          student._id,
                          "vivaPitch",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  )}
                </td>
                <td>
                  {submitted || editingStudent !== student._id ? (
                    isEdit ? (
                      <button onClick={() => handleEditMarks(student._id)}>
                        Edit
                      </button>
                    ) : (
                      ""
                    )
                  ) : (
                    <>
                      <button onClick={() => handleSaveMarks(student._id)}>
                        Save
                      </button>
                      <button onClick={() => handleRemoveStudent(student._id)}>
                        Remove
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No students selected</td>
            </tr>
          )}
        </tbody>
      </table>
      {!submitted && (
        <button type="button" onClick={handleSubmit}>
          Submit Marks
        </button>
      )}
    </div>
  );
};

export default SelectedStudents;
