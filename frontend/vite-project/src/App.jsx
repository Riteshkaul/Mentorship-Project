// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Routes component

import StudentSelection from "./components/StudentSelection";
import SelectedStudents from "./components/SelectedStudents";
import ViewStudent from "./components/ViewStudent";

const App = () => {
  return (
    <Router>
      <Routes>
        {" "}
        {/* Wrap your routes in <Routes> */}
        <Route exact path="/" element={<StudentSelection />} />
        <Route path="/selected" element={<SelectedStudents />} />
        <Route path="/view" element={<ViewStudent />} />
      </Routes>
    </Router>
  );
};

export default App;
