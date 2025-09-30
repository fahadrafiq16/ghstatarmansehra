import React, { useState, useContext, useEffect } from 'react';
import { MyContext } from '../../MyContext';
import { useForm } from 'react-hook-form';
import { FaTrash } from "react-icons/fa";
import total_data from '../../utils/data';

const AddStudents = () => {
    const { globalState, setGlobalState } = useContext(MyContext);
    const [items, setItems] = useState([{ id: 1, rollNo: "", studentName: "", fatherName: "" }]);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const selectedClass = watch("classname");

    // Fetch students from the backend whenever the class changes

    useEffect(() => {
        if (selectedClass) {
            fetch(`http://localhost:5000/api/get-class-students?className=${selectedClass}`)
                .then(response => response.json())
                .then(data => {
                    console.log('data', data.students);
                    setItems(data.students || []);
                })
                .catch(error => {
                    console.error("Error fetching students:", error);
                })
        }
    }, [selectedClass])

    const handleAddItem = () => {
        setItems([...items, { id: Date.now(), rollNo: "", studentName: "", fatherName: "" }]);
    };

    const handleRemoveItem = (id) => {
        setItems(items.filter((item) => item.id !== id));

        // Send DELETE request to the backend to remove student
        const selectedClass = document.getElementById('selectField').value;
        fetch('http://localhost:5000/api/delete-student', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                className: selectedClass,
                studentId: id,
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Student deleted successfully:', data);
            })
            .catch((error) => {
                console.error('Error deleting student:', error);
            });
    };

    const handleInputChange = (id, field, value) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const onSubmit = (data) => {
        console.log('Form data:', data);

        const selectedClass = data.classname;

        // Fetch existing students from backend
        fetch(`http://localhost:5000/api/get-class-students?className=${selectedClass}`)
            .then(response => response.json())
            .then(existingData => {
                // Create a map of existing students by their IDs
                const existingStudentMap = existingData.students.reduce((acc, student) => {
                    acc[student.id] = student;
                    return acc;
                }, {});

                // Prepare the students to send
                const studentsToUpdate = items.map(item => {
                    if (existingStudentMap[item.id]) {
                        // If the student already exists, update the details
                        return {
                            id: item.id,
                            rollNo: item.rollNo || existingStudentMap[item.id].rollNo,  // Update roll number if changed
                            studentName: item.studentName || existingStudentMap[item.id].studentName,  // Update name if changed
                            fatherName: item.fatherName || existingStudentMap[item.id].fatherName  // Update father name if changed
                        };
                    } else {
                        // If the student is new, add it
                        return {
                            id: item.id,
                            rollNo: item.rollNo,
                            studentName: item.studentName,
                            fatherName: item.fatherName
                        };
                    }
                });

                // Prepare payload
                const payload = {
                    className: selectedClass,
                    students: studentsToUpdate
                };

                // Send to backend
                fetch('http://localhost:5000/api/update-class', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Class updated successfully:', data);
                    })
                    .catch((error) => {
                        console.error('Error updating class:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching existing students:', error);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="popup_form">
                <div>
                    <label htmlFor="selectField">Choose a class</label>
                    <select id="selectField" {...register("classname", { required: "Class is required" })}>
                        <option value="">-- Select a class--</option>
                        {total_data.classes.map((cls) => (
                            <option key={cls.className} value={cls.className}>
                                {cls.className}
                            </option>
                        ))}
                    </select>
                    {errors.classname && <p style={{ color: "red" }}>{errors.classname.message}</p>}
                </div>

                <h2 className="text-[20px] mt-4 font-bold">Student List</h2>
                {items.map((item) => (
                    <div key={item.id} className="add-new-item gap-4 my-[30px] flex">
                        <input
                            placeholder="Roll No"
                            type="number"
                            value={item.rollNo}
                            onChange={(e) => handleInputChange(item.id, "rollNo", e.target.value)}
                            className="border p-2"
                        />
                        <input
                            placeholder="Student Name"
                            value={item.studentName}
                            onChange={(e) => handleInputChange(item.id, "studentName", e.target.value)}
                            className="border p-2"
                        />
                        <input
                            placeholder="Father Name"
                            value={item.fatherName}
                            onChange={(e) => handleInputChange(item.id, "fatherName", e.target.value)}
                            className="border p-2"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 ml-2"
                        >
                            <FaTrash size={20} />
                        </button>
                    </div>
                ))}

                <div>
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="bg-blue-500 w-[100%] text-white p-[10px] rounded-md"
                    >
                        Add New Student
                    </button>
                </div>
                <input type="submit" value="Submit" className="bg-green-500 p-2 mt-2 text-white rounded" />
                
            </form>
        </div>
    );
};

export default AddStudents;
