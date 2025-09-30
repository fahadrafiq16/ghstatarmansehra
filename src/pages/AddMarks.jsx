import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const total_classes = ['6th', '7th', '8th', '9th', '10th'];

const AddMarks = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const selectedClass = watch("classname");


  // Fetch subjects when a class is selected
  useEffect(() => {
    if (selectedClass) {
      fetch(`https://ghstatarmansehrabackend.vercel.app/api/get-subjects?className=${selectedClass}`)
        .then((response) => response.json())
        .then((data) => setSubjects(data.subjects || []))
        .catch((error) => console.error("Error fetching subjects:", error));
    }
  }, [selectedClass]);

  // Fetch marks when a subject is selected
  useEffect(() => {
    if (selectedClass && selectedSubject) {
      fetch(`https://ghstatarmansehrabackend.vercel.app/api/get-marks?className=${selectedClass}&subjectName=${selectedSubject}`)
        .then((response) => response.json())
        .then((data) => setMarks(data.marks || []))
        .catch((error) => console.error("Error fetching marks:", error));
    }
  }, [selectedClass, selectedSubject]);

  const handleMarksChange = (studentId, field, value) => {
    setMarks((prevMarks) =>
      prevMarks.map((mark) =>
        mark.id === studentId ? { ...mark, [field]: value } : mark
      )
    );
  };

  const onSubmit = () => {
    const payload = {
      className: selectedClass,
      subjectName: selectedSubject,
      marks: marks.map(({ id, obtainedMarks }) => ({
        id,
        obtainedMarks: parseInt(obtainedMarks, 10) || 0,
      })),
    };

    fetch("https://ghstatarmansehrabackend.vercel.app/api/update-marks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Marks updated successfully!");
      })
      .catch((error) => {
        toast.error("Error updating marks. Please try again.");
      });
  };

  return (
    <div className="p-4">
      <form className="popup_form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="classname">Select Class</label>
          <select id="classname" {...register("classname", { required: "Class is required" })}>
            <option value="">-- Select a class --</option>
            {total_classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
          {errors.classname && <p style={{ color: "red" }}>{errors.classname.message}</p>}
        </div>

        {subjects.length > 0 && (
          <div className="mt-4">
            <label htmlFor="subject">Select Subject</label>
            <select
              id="subject"
              value={selectedSubject || ""}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">-- Select a subject --</option>
              {subjects.map((subject) => (
                <option key={subject.subjectName} value={subject.subjectName}>
                  {subject.subjectName}
                </option>
              ))}
            </select>
          </div>
        )}

        {marks.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Enter Marks: <span>{selectedSubject}</span></h3>
            {marks.map((mark) => (
              <div key={mark.id} className="student-subject-marks flex items-center gap-4 my-2 justify-between">

           
                  <h3 className="">{mark.rollNo}</h3>
               
                <div>
                  <h3 className="">{mark.studentName}</h3>
                </div>
                <div className="flex-1">
                  <h3 className="">{mark.fatherName}</h3>
                </div>
                
                  <input
                    type="number"
                    placeholder="Obtained Marks"
                    value={mark.obtainedMarks || ""}
                    onChange={(e) => handleMarksChange(mark.id, "obtainedMarks", e.target.value)}
                    className="border p-2"
                  />
               
              </div>
            ))}
          </div>
        )}

        {marks.length > 0 && (
          <div className="mt-4">
            <button type="submit" className="w-full bg-green-500 p-3 mt-4 text-white rounded">
              Submit Marks
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddMarks;
