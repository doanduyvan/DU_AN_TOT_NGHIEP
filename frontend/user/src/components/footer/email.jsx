import { useState } from "react";
import { message, Button } from "antd";
const Email = () => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      message.error("Email không hợp lệ!");
      return;
    }

    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdUEJnjMmfBDUqR_9dZtwCmJhA4378taZsFj6TfDM4ejPLguA/formResponse";
    const formData = new FormData();
    formData.append("entry.534190811", email); // thay bằng entry đúng

    try {
      setLoading(true);
      await fetch(formUrl, {
        method: "POST",
        mode: "no-cors", // Bắt buộc với Google Form
        body: formData,
      });
      message.success("Đăng kí thành công!");
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Gửi thất bại!");
    }finally{
      setEmail(""); 
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-xs">
      <input
        type="email"
        placeholder="Email"
        className="py-2 px-3 border border-gray-300 border-r-0 w-full text-sm outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {/* <button className="bg-black text-white px-3 md:px-4 py-2 text-sm whitespace-nowrap hover:bg-gray-800" onClick={handleSubmit}>
        Đăng ký
      </button> */}

      <Button
        className="!bg-black !text-white !px-3 md:!px-4 !py-2 text-sm whitespace-nowrap hover:!bg-gray-800 rounded-none h-full"
        onClick={handleSubmit}
        type="text"
        loading={loading}
      >
        Đăng ký
      </Button>
    </div>
  );
};

export default Email;
