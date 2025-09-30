import React, { useState, useContext, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { FaTrash } from "react-icons/fa";
import axios from 'axios';

const total_classes = ['6th', '7th', '8th', '9th', '10th'];

const AddSubjects = () => {

  const [subjects, setSubjects] = useState([{ id: 1, subjectName: "", teacherName: "", totalMarks: "", marks: [] }]);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const selectedClass = watch("classname");

  useEffect(() => {
    if (selectedClass) {
      // Fetch existing subjects for the selected class
      fetch(`http://localhost:5000/api/get-subjects?className=${selectedClass}`)
        .then(response => response.json())
        .then(data => {
          setSubjects(data.subjects || []);
        })
        .catch(error => {
          console.error("Error fetching subjects:", error);
        });
    }
  }, [selectedClass]);



  const handleAddItem = () => {
    setSubjects([...subjects, { id: Date.now(), subjectName: "", teacherName: "", totalMarks: "", marks: [] }]);
  };

  const handleRemoveItem = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));

    const selectedClass = document.getElementById('selectField').value;


    axios.delete('http://localhost:5000/api/delete-subject', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        className: selectedClass,
        subjectId: id,
      }
    })
      .then(response => {
        console.log('Subject deleted successfullyy', response.data);
        toast.success('Subject deleted successfullyy');
      })
      .catch(error => {
        console.log('Error deleting subject', error);
        toast.error('Error deleting subjects');
      })


  }
  const handleInputChange = (id, field, value) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.id === id
          ? { ...subject, [field]: value } // Update only the targeted field
          : subject // Keep others unchanged
      )
    );
  };



  const onSubmit = (data) => {
    const payload = {
      className: data.classname,
      subjects: subjects.map(({ id, subjectName, teacherName, totalMarks, marks }) => ({
        id,
        subjectName,
        teacherName,
        totalMarks: parseInt(totalMarks, 10),
        marks,
      })),
    };

    console.log('Payload to be sent:', payload);

    // Make the API request to add the subjects
    fetch("http://localhost:5000/api/add-subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Response from server:", data);
        toast.success('Subject added successfully')
        // Refresh the subjects list
        if (selectedClass) {
          fetch(`http://localhost:5000/api/get-subjects?className=${selectedClass}`)
            .then(res => res.json())
            .then(updatedData => setSubjects(updatedData.subjects || []));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error('Error adding subject')
      });
  };



  return (
    <div className={``}>
      <form onSubmit={handleSubmit(onSubmit)} className="popup_form">
        <div>
          <label htmlFor="selectField">Choose a class</label>
          <select id="selectField" {...register("classname", { required: "Class is required" })}>
            <option value="">-- Select a class--</option>
            {total_classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
          {errors.classname && <p style={{ color: "red" }}>{errors.classname.message}</p>}
        </div>

        <h2 className="text-[20px] mt-4 font-bold">Subjects List</h2>
       
       {
         selectedClass && (
          subjects.map((subject) => (
            <div key={subject.id} className="add-new-item gap-4 my-[30px] flex">
              <input
                placeholder="Subject Name"
                value={subject.subjectName}
                onChange={(e) => handleInputChange(subject.id, "subjectName", e.target.value)}
                className="border p-2"
              />
  
              <input
                placeholder="Teacher Name"
                value={subject.teacherName}
                onChange={(e) => handleInputChange(subject.id, "teacherName", e.target.value)}
                className="border p-2"
              />
  
              <input
                placeholder="Total Marks"
                value={subject.totalMarks}
                onChange={(e) => handleInputChange(subject.id, "totalMarks", e.target.value)}
                className="border p-2"
              />
  
              <button
                type="button"
                onClick={() => handleRemoveItem(subject.id)}
                className="text-red-500 ml-2"
              >
                <FaTrash size={20} />
              </button>
            </div>
          ))
         )
       }

        <div>
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-blue-500 w-[100%] text-white p-[10px] rounded-md"
          >
            Add New Subject
          </button>
        </div>
        <input type="submit" value="Submit" className="bg-green-500 p-2 mt-2 text-white rounded" />

      </form>
    </div>
  );
};

export default AddSubjects;
