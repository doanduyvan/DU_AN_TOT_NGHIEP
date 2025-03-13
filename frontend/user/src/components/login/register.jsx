import { Button, Input } from "antd";
import { FacebookOutlined, TwitterOutlined, GoogleOutlined } from "@ant-design/icons";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const RegisterForm = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-96 text-center mt-[100px] mb-6">
        <h2 className="text-2xl font-bold">Mes Skin</h2>
        <p className="mt-2 text-gray-600">Adventure starts here 🚀</p>
        <p className="text-sm text-gray-500">Make your app management easy and fun!</p>

        <div className="mt-6 text-left">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <Input className="mt-1 text-lg" name="username" value={form.username} onChange={handleChange} placeholder="Example" />

          <label className="block text-sm font-medium text-gray-700 mt-4">Email</label>
          <Input className="mt-1 text-lg" name="email" value={form.email} onChange={handleChange} placeholder="Example@gmail.com" />

          <label className="block text-sm font-medium text-gray-700 mt-4">Password</label>
          <Input.Password className="mt-1 text-lg" name="password" value={form.password} onChange={handleChange} />

          <label className="block text-sm font-medium text-gray-700 mt-4">Confirm Password</label>
          <Input.Password className="mt-1 text-lg" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />

          <Button type="primary" className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500">
            Sign up
          </Button>
        </div>

        <p className="mt-4 text-sm">
          Already have an account? <NavLink to='/login' className="text-blue-500">Sign in instead</NavLink>
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
