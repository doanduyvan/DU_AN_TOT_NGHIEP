import { Button, Input } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useUserContext } from "/src/context/user/userContext";
import { AuthService } from "../../services/api-auth";
import { useState, useEffect } from "react";
import { useHref, useNavigate, NavLink } from "react-router-dom";
import { notification as Notification, message } from "antd";

const LoginForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData.forEach((value, key) => console.log(key, value)));
    try {
      const response = await AuthService.login(formData);
      if (response.status === 200) {
        localStorage.setItem("token", response.token);
        message.success("Đăng nhập thành công");
        window.location.href = '/';
      }
    } catch (error) {
      setError(error.response.data.errors);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-96 text-center">
        <h2 className="text-2xl font-bold">Mes Skin</h2>
        <p className="mt-2 text-gray-600">Welcome to WeConnect! 👋</p>
        <p className="text-sm text-gray-500">Please sign in to your account and start the adventure</p>

        <form className="mt-6 text-left form" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          {error && <p className="error text-red-500">{error.email}</p>}
          <Input className="mt-1 text-lg" name="email" placeholder="Example@gmail.com" />

          <div className="flex justify-between items-center mt-4">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label> <br />
            {error && <p className="error text-red-500">{error.password}</p>}
            <a href="#" className="text-sm text-blue-500">Forgot Password?</a>
          </div>
          <Input.Password className="mt-1 text-lg" name="password"/>

          <button type="submit" className="w-full p-2 rounded-lg mt-6 bg-yellow-400 hover:bg-yellow-500">
            Đăng nhập
          </button>
        </form>

        <p className="mt-4 text-sm">
          Bạn chưa có tài khoản? <NavLink to='/register' className="text-blue-500">Đăng ký</NavLink>
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

export default LoginForm;
