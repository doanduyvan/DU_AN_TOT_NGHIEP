import { useState, useEffect } from "react";
import { Button, Form, Input, message, notification } from "antd";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import AxiosUser from "../../utils/axios_user";
import { FullScreenLoader } from "../../utils/helpersjsx";

const urlCheckToken = "check-reset-token";
const urlResetPassword = "reset-password";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true); // kiểm tra token trước khi hiển thị form
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      setChecking(false);
      return;
    }
    const checkToken = async () => {
      try {
        const response = await AxiosUser.get(urlCheckToken, {
          params: { token },
        });
        console.log(response);
      } catch (error) {
        const message2 =
          error.response?.data?.message ||
          "Token không hợp lệ hoặc đã hết hạn.";
        notification.error({
          message: "Lỗi",
          description: message2,
        });
        navigate("/");
      } finally {
        setChecking(false);
      }
    };
    checkToken();
  }, [token, navigate]);

  const onFinish = async  (values) => {

    const dataReq = {
        token,
        password: values.password,
        password_confirmation: values.password_confirmation,
    }

    try {
        setLoading(true);
        const response = await AxiosUser.post(urlResetPassword, dataReq);
        notification.success({
            message: "Thành công",
            description: response?.data?.message || "Đặt lại mật khẩu thành công.",
        });
        navigate("/login");
    }
    catch (error) {
        const errors = error.response?.data?.errors;
        let message2 = error?.response?.data?.message ||  "Lỗi khi đặt lại mật khẩu.";
        if(error?.status === 422) {
            if (errors && typeof errors === "object") {
            const firstKey = Object.keys(errors)[0];
            if (Array.isArray(errors[firstKey])) {
            message2 = errors[firstKey][0];
            }
            }
        }

        notification.error({
            message: "Lỗi",
            description: message2,
        });
        console.log(error);
    } finally {
        setLoading(false);
    }
  };

  if (checking) {
    return (<FullScreenLoader visible={true} tip='Đang kiểm tra token...' />);
  }

  return (
    <>
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="bg-white shadow-md p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Đặt lại mật khẩu</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="password_confirmation"
            label="Xác nhận mật khẩu"
            rules={[{ required: true, message: "Vui lòng xác nhận lại mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Xác nhận
          </Button>
        </Form>
      </div>
    </div>
    <FullScreenLoader visible={loading} tip="Đang tải..." />
    </>
  );
};

export default ResetPassword;
