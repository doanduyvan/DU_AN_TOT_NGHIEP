import { useEffect, useState } from "react";
import { Result, Button, Spin } from "antd";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FullScreenLoader } from "/src/utils/helpersjsx";


const VerifyEmail = () => {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");

    if (!token) {
      setStatus("error");
      setMessage("Thiếu token xác nhận. Vui lòng kiểm tra lại email.");
      return;
    }

    setStatus("loading");
    setMessage("");

    axios
      .get(`http://localhost:8000/api/verify-email?token=${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message || "Xác nhận email thành công.");
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Token không hợp lệ hoặc đã được sử dụng.";
        setStatus("error");
        setMessage(msg);
      });
  }, [location.search]);

  const handleRedirect = () => {
    navigate("/login");
  };

  const handleBackToRegister = () => {
    navigate("/register");
  };

  if (status === "loading") {
    return (
      <FullScreenLoader visible={true} tip='Đang xác minh Email...' />
    );
  }

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Result
        status={status}
        title={
          status === "success"
            ? "Xác nhận email thành công!"
            : "Không thể xác nhận email"
        }
        subTitle={message}
        extra={
          status === "success" ? (
            <Button type="primary" onClick={handleRedirect}>
              Đến trang đăng nhập
            </Button>
          ) : (
            <Button onClick={handleBackToRegister} type="primary">
              Quay lại đăng ký
            </Button>
          )
        }
      />
    </div>
  );
};

export default VerifyEmail;
