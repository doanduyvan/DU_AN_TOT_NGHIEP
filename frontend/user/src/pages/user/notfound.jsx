// src/pages/NotFound.tsx
import { Link } from "react-router-dom";
import { FrownOutlined } from "@ant-design/icons";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-white text-center p-4">
      <FrownOutlined className="text-blue-500 text-7xl mb-4" />
      <h1 className="text-4xl font-bold text-gray-800">404 - Không tìm thấy trang</h1>
      <p className="text-lg text-gray-600 mt-2 mb-6">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-xl shadow transition"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
