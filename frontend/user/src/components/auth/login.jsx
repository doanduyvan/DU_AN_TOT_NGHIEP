import { Button, Input,Modal, Form, notification} from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { AuthService } from "../../services/api-auth";
import { useState, useEffect } from "react";
import { useHref, useNavigate, NavLink } from "react-router-dom";
import { notification as Notification, message } from "antd";
import { useAuth } from "../../contexts/authcontext";
import { FullScreenLoader } from "../../utils/helpersjsx";
import { useUserContext } from "../../context/user/userContext";
import AxiosUser from "../../utils/axios_user";
import LoginGoogle from "./logingoogle/logingoogle";

const urlForgotPassword = "forgot-password";
const urlSendVerifyEmail = "resend-verify-email";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser,setIsLoggedIn } = useUserContext();
  const { setCurrentUser, setPermissions } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openforgotpasss, setOpenforgotpasss] = useState(false);
  const [openNoVerify, setOpenNoVerify] = useState(false);
  const [emailVerify, setEmailVerify] = useState("emailtest@gmail.com");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawForm = new FormData(e.target);
    const formData = new FormData();

    for (const [key, value] of rawForm.entries()) {
      formData.append(key, typeof value === "string" ? value.trim() : value);
    }

    try {
      setLoading(true);
      const response = await AuthService.login(formData);
      if (response.status === 200) {
        // localStorage.setItem("token", response.token);
        // message.success("Đăng nhập thành công");
        // const user = response.user;
        // const permissions = response.permissions || [];
        // setCurrentUser(user);
        // setUser(user);
        // setIsLoggedIn(true);
        // setPermissions(permissions);
        Thenlogingoogle(response);
      } else if (response.status === 401) {
        console.log("401");
        Notification.warning({
          message: "Có lỗi xảy ra",
          description: response?.message || "Vui lòng thử lại sau",
          duration: 5,
        });
      }
    } catch (error) {
      if(error?.response?.data?.is_verify === 0) {
        const email = error?.response?.data?.email;
        setEmailVerify(email);
        setOpenNoVerify(true);
        return;
      }

      setError(error?.response?.data?.errors);
      setTimeout(() => {
        setError("");
      }, 2000);

    Notification.error({
    message: "Có lỗi xảy ra",
    description: error?.response?.data?.message || "Vui lòng thử lại sau",
    duration: 5,
    });
    }finally{
      setLoading(false);
    }
  };

  const Thenlogingoogle = (response) => {
    localStorage.setItem("token", response.token);
    message.success("Đăng nhập thành công");
    const user = response.user;
    const permissions = response.permissions || [];
    setCurrentUser(user);
    setUser(user);
    setIsLoggedIn(true);
    setPermissions(permissions);
  }

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-96 text-center">
        <h2 className="text-2xl font-bold">MesSkin</h2>
        <p className="mt-2 text-gray-600">Chào mừng đến với MesSkin 👋</p>
        <p className="text-sm text-gray-500">Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng của bạn</p>

        <form className="mt-6 text-left form" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input className="mt-1 text-lg" name="email" placeholder="Example@gmail.com" />
          {error && <p className="error text-red-500">{error.email}</p>}

          <div className="flex justify-between items-center mt-4">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label> <br />
            <button type="button" className="text-sm text-blue-500" onClick={()=> setOpenforgotpasss(true)}>Quên mật khẩu?</button>
          </div>
          <Input.Password className="mt-1 text-lg" name="password" />
            {error && <p className="error text-red-500">{error.password}</p>}

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
          {/* <Button shape="circle" icon={<GoogleOutlined />} /> */}
          <LoginGoogle onSuccess={Thenlogingoogle} />
        </div>
      </div>
    </div>
    <FullScreenLoader visible={loading} tip="Đang tải..." />
    <ForgotPasswordModal open={openforgotpasss} onClose={setOpenforgotpasss} />
    <NoVerifyModal open={openNoVerify} onClose={setOpenNoVerify} email={emailVerify}  />
    </>
  );
};

export default LoginForm;


const ForgotPasswordModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    const values = await form.validateFields();
    try {
      setLoading(true);
      const response = await AxiosUser.post(urlForgotPassword, values);
      message.success("Đã gửi yêu cầu quên mật khẩu thành công");
      form.resetFields();
      onClose(false);
    } catch (error) {
      const emailError = error?.response?.data?.errors?.email;
      const message2 = Array.isArray(emailError) ? emailError[0] : "Lỗi khi gửi yêu cầu quên mật khẩu.";
      notification.error({
        message: "Lỗi",
        description: message2,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Quên mật khẩu"
      open={open}
      onCancel={()=> onClose(false)}
      maskClosable={true}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Gửi"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" name="forgot_password_form">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="example@gmail.com" />
        </Form.Item>
      </Form>
    </Modal>
  );
};


const NoVerifyModal = ({ open, onClose, email }) => {

  if(!email){
    onClose(false);
  }

  const [loading, setLoading] = useState(false);
  const handleOk = async () => {
    try {
      setLoading(true);
      const response = await AxiosUser.post(urlSendVerifyEmail, {email});
      const message2 = response?.message || "Đã gửi yêu cầu xác thực thành công";
      notification.success({
        message: "Thành công",
        description: message2,
      });
      onClose(false);
    } catch (error) {
      const message2 = error?.response?.data?.message || "Lỗi khi gửi yêu cầu xác thực.";
      notification.error({
        message: "Lỗi",
        description: message2,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tài khoản chưa được xác thực"
      content="Vui lòng kiểm tra email để xác thực tài khoản của bạn. Nếu không thấy email, hãy kiểm tra thư mục spam hoặc yêu cầu gửi lại email xác thực."
      open={open}
      onCancel={()=> onClose(false)}
      maskClosable={true}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Gửi lại"
      cancelText="Hủy"
    >
      <p className="text-sm text-gray-500">Email: {email}</p>
    </Modal>
  );
};