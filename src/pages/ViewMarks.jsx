import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const total_classes = ['6th', '7th', '8th', '9th', '10th'];

const ViewMarks = () => {


    const [totalMarks, setTotalMarks] = useState(0);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const [studentsData, setStudentsData] = useState(null);

    const selectedClass = watch("classname");

    useEffect(() => {
        if (selectedClass) {
            fetchClassData();
        }
    }, [selectedClass]);

    const fetchClassData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/class-data?className=${selectedClass}`);
            setStudentsData(response.data);
            console.log(studentsData);
        } catch (error) {
            console.error("Error fetching class data:", error);
            setStudentsData(null);
        }
    };

    const sendStudentDataForPDF = async (student) => {
        try {
            console.log(student);
            const response = await axios.post('http://localhost:5000/generate-pdf', {student}, {
                responseType: 'blob',
            });
            // Download the PDF
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'hello-world.pdf';
            link.click();
            URL.revokeObjectURL(url);
        }
        catch (error) {
            console.error("Error generating PDF:", error);
        }
    }

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <div className="p-4">

            <form className="popup_form w-1000" onSubmit={handleSubmit(onSubmit)}>
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
                {studentsData && (
                    <div>
                        <h2 className="py-4 font-bold">Showing Marks Sheet for Class: {studentsData.className}</h2>
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Roll No</th>
                                    <th>Student Name</th>
                                    <th>Father Name</th>
                                    {studentsData.students[0]?.marks.map((subject, index) => (
                                        <th key={index}>{subject.subjectName}</th>
                                    ))}
                                    <th>Total</th>
                                    <th>Print DMC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentsData.students.map((student, index) => {
                                    const totalMarks = student.marks.reduce((sum, mark) => sum + mark.obtainedMarks, 0); // Calculate total marks here
                                    return (
                                        <tr key={index}>
                                            <td>{student.rollNo}</td>
                                            <td>{student.studentName}</td>
                                            <td>{student.fatherName}</td>
                                            {student.marks.map((mark, markIndex) => (
                                                <td key={markIndex}>{mark.obtainedMarks}</td>
                                            ))}
                                            <td>{totalMarks}</td>
                                            <td>
                                                <button onClick={() => sendStudentDataForPDF(student)} className="bg-[#9277FF] text-white p-2 rounded-sm text-[14px]">Print DMC</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </form>
        </div>
    );
}

export default ViewMarks;
