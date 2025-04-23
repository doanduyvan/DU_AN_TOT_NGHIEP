import { Button, Input } from "antd";
import { FacebookOutlined, TwitterOutlined, GoogleOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { AuthService } from "../../services/api-auth";
import { useState, useEffect } from "react";
import { useHref, useNavigate } from "react-router-dom";
import { notification as Notification, message } from "antd";
import { FullScreenLoader } from "/src/utils/helpersjsx";


const RegisterForm = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const formData = new FormData(e.target);
    const rawForm = new FormData(e.target);
    const formData = new FormData();

    for (const [key, value] of rawForm.entries()) {
      formData.append(key, typeof value === "string" ? value.trim() : value);
    }

    try {
      setLoading(true);
      const response = await AuthService.register(formData);

      const message2 = response?.data?.message || "Đăng ký thành công, vui lòng kích hoạt tài khoản qua email";
      Notification.success({
      message: "Đăng ký thành công",
      description: message2,
      });
      navigate("/login");
    } catch (error) {
      setError(error.response.data.errors);
      setTimeout(()=> { setError('') },3000)
      const message2 = error?.response?.data?.message;
      if(message2) {
        Notification.error({
          message: message2
        });
      }
    }finally {
      setLoading(false);
    }

  };
  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-96 text-center mt-[100px] mb-6">
        <h2 className="text-2xl font-bold">Mes Skin</h2>
        <p className="mt-2 text-gray-600">Adventure starts here 🚀</p>
        <p className="text-sm text-gray-500">Make your app management easy and fun!</p>

        <form className="mt-6 text-left form" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">Họ Tên</label>
          <Input className="mt-1 text-lg" name="fullname" placeholder="Nhập Họ Tên đầy đủ" />
          {error && <p className="error text-red-500">{error.fullname}</p>}

          <label className="block text-sm font-medium text-gray-700 mt-4">Email</label>
          <Input className="mt-1 text-lg" name="email" placeholder="Example@gmail.com" />
          {error && <p className="error text-red-500">{error.email}</p>}
    
          <label className="block text-sm font-medium text-gray-700 mt-4">Mật khẩu</label>
          <Input.Password className="mt-1 text-lg" name="password" placeholder="Nhập mật khẩu" />
          {error && <p className="error text-red-500">{error?.password}</p>}

          <label className="block text-sm font-medium text-gray-700 mt-4">Nhập lại mật khẩu</label>
          <Input.Password className="mt-1 text-lg" name="password_confirmation" placeholder="Nhập lại mật khẩu" />
          {error && <p className="error text-red-500">{error?.password}</p>}

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
    <FullScreenLoader visible={loading} tip='vui lòng đợi trong giây lát...' />
    </>
  );
};

export default RegisterForm;
