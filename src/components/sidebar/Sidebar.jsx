import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/images/Untitled.png'

const Sidebar = () => {
    return (
        <aside className="sidebar max-h-[100vh] sticky top-0 bg-gray-800 text-white">
            <img src={Logo} alt="Logo" />
            <div className="mt-12 p-2 sidebar-navigation">
               
                <li><Link to="/">Add Students</Link></li>
                <li><Link to="/subjects">Add Subjects</Link></li>
                <li><Link to="/student-marks">Add Marks</Link></li>
                <li><Link to="/view-marks">View Marks</Link></li>
            </div>
            <div></div>
        </aside>
    )
}

export default Sidebar
