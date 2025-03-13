import React, { useState, useEffect } from 'react';
import { AuthService } from '../../services/api-auth';
import { useAuth } from '../../contexts/authcontext';

const Info = () => {
    const [showInfo, setShowInfo] = useState(false); 
    const { currentUser } = useAuth();

    // Hàm để handle logout
    const handleLogout = () => {
        setShowInfo(false);  
        AuthService.logout()
    };

    return (
        <div className="relative">
            <button
                className="ml-2 text-gray-700 hover:text-black border p-1 rounded-md"
                onClick={() => setShowInfo(!showInfo)} // Toggle việc hiển thị thông tin khi click
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            </button>

            {showInfo && currentUser && (  // Hiển thị thông tin khi người dùng đã đăng nhập
                <div className="absolute -right-5 top-10 mt-4 bg-white border border-gray-200 p-2 rounded-md shadow-md w-48">
                    <p className="text-gray-700">Name: {currentUser.name || 'John Doe'}</p>
                    <button
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-700 mt-2 w-full text-left"
                    >
                        Logout
                    </button>
                </div>
            )}

            {showInfo && !currentUser && (
                <div className="absolute -right-5 top-10 mt-4 bg-white border border-gray-200 p-2 rounded-md shadow-md w-48">
                    <p className="text-gray-700">Vui lòng đăng nhập</p>
                    <button
                        onClick={() => {
                            setShowInfo(false);
                            window.location.href = '/login';
                        }}
                        className="text-blue-500 hover:text-blue-700 mt-2 w-full text-left"
                    >
                        Login
                    </button>
                </div>
            )}
        </div>
    );
};

export default Info;
