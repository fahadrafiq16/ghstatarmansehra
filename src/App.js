import './App.css';
import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddSubjects from './pages/AddSubjects';
import Home from './pages/Home';
import { MyContext } from './MyContext'
import AddMarks from './pages/AddMarks';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import ViewMarks from './pages/ViewMarks';

function App() {

  const [globalState, setGlobalState] = useState(false);

  return (

    <MyContext.Provider value={{ globalState, setGlobalState }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subjects" element={<AddSubjects />} />
            <Route path="/student-marks" element={<AddMarks />} />
            <Route path="/view-marks" element={<ViewMarks />} />
          </Routes>
        </Layout>
        {/* Add the ToastContainer here */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </MyContext.Provider>
  );
}

export default App;
