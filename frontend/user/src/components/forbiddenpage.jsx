import React from "react";
import { Link } from "react-router-dom";

const ForbiddenPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
                <h1 className="text-6xl font-extrabold text-gray-800 mb-4">403</h1>
                <p className="text-xl text-gray-600 mb-6">Bạn không có quyền truy cập vào trang này.</p>
                <p className="text-gray-500 mb-8">Lỗi này xảy ra do bạn không có quyền truy cập vào tài nguyên yêu cầu.</p>
                <div className="flex justify-center">
                    <Link
                        to="/admin"
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForbiddenPage;
