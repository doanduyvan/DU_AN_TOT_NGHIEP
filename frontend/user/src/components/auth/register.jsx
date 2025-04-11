import { Button, Input } from "antd";
import { FacebookOutlined, TwitterOutlined, GoogleOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { AuthService } from "../../services/api-auth";
import { useState, useEffect } from "react";
import { useHref, useNavigate } from "react-router-dom";
import { notification as Notification, message } from "antd";

const RegisterForm = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await AuthService.register(formData);
      if (response.status === 200) {
        localStorage.setItem("token", response.token);
        message.success("Đăng ký, đăng nhập thành công");
        window.location.href = "/";
      }else if (response.status === 500) {
        Notification.error({
          message: "Đăng ký không thành công",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data.errors);
    }

  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-96 text-center mt-[100px] mb-6">
        <h2 className="text-2xl font-bold">Mes Skin</h2>
        <p className="mt-2 text-gray-600">Adventure starts here 🚀</p>
        <p className="text-sm text-gray-500">Make your app management easy and fun!</p>

        <form className="mt-6 text-left form" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">Họ Tên</label>
          {error && <p className="error text-red-500">{error.fullname}</p>}
          <Input className="mt-1 text-lg" name="fullname" placeholder="Nhập Họ Tên đầy đủ" />

          <label className="block text-sm font-medium text-gray-700 mt-4">Email</label>
          {error && <p className="error text-red-500">{error.email}</p>}
          <Input className="mt-1 text-lg" name="email" placeholder="Example@gmail.com" />
    
          <label className="block text-sm font-medium text-gray-700 mt-4">Mật khẩu</label>
          {error && <p className="error text-red-500">{error.password}</p>}
          <Input.Password className="mt-1 text-lg" name="password" placeholder="Nhập mật khẩu" />

          <label className="block text-sm font-medium text-gray-700 mt-4">Nhập lại mật khẩu</label>
          {error && <p className="error text-red-500">{error.password}</p>}
          <Input.Password className="mt-1 text-lg" name="password_confirmation" placeholder="Nhập lại mật khẩu" />

          <button type="submit" className="w-full p-2 rounded-lg mt-6 bg-yellow-400 hover:bg-yellow-500">
            Đăng ký
          </button>
        </form>

        <p className="mt-4 text-sm">
          Bạn đã có tài khoản? <NavLink to='/login' className="text-blue-500">Đăng nhập</NavLink>
        </p>

        <div className="my-4 flex items-center justify-center">
          <span className="h-px w-full bg-gray-300"></span>
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <span className="h-px w-full bg-gray-300"></span>
        </div>

        <div className="flex justify-center space-x-4">
          <Button shape="circle" icon={<GoogleOutlined />} />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
