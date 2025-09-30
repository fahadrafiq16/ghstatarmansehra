// Layout.jsx
import React from 'react';
import Sidebar from './components/sidebar/Sidebar'

const Layout = ({ children }) => {
    return (
        <div className="layout flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="content bg-gray-100 flex-1 p-6  relative">
                {children}
            </main>
        </div>
    );
};

export default Layout;