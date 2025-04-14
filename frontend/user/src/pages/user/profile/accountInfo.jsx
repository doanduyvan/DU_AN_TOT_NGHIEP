import React, { useState, useEffect } from "react";
import { Tabs, Input, Checkbox, Button } from "antd";
import { AuthService } from "../../../services/api-auth";
import AxiosUser from "../../../utils/axios_user";
import { useUserContext } from "../../../context/user/userContext";
import { message } from "antd";

const urlUpdateAvatarPost = "customer/profile/update-avatar";
const urlUpdateInfoPost = "customer/profile/update-info";
const baseUrlImg = import.meta.env.VITE_URL_IMG;

const AccountInfo = () => {

  const { user, setUser, isLoggedIn } = useUserContext();
  const [fullname, setFullname] = useState(user.fullname || "");
  const [phone, setPhone] = useState(user.phone || "");

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB
  
    if (!allowedTypes.includes(file.type)) {
      return message.error("Chỉ cho phép ảnh JPG, PNG, WEBP.");
    }
  
    if (file.size > maxSize) {
      return message.error("Ảnh phải nhỏ hơn 2MB.");
    }

  
    const formData = new FormData();
    formData.append("avatar", file);
  
    try {
      const res = await AxiosUser.post(urlUpdateAvatarPost, formData, {
        useToken: true,
        typeFormData: true,
      });
  
      message.success("Cập nhật ảnh thành công!");
      setUser(prev => ({ ...prev, avatar: res.avatar }));
    } catch (err) {
      message.error("Lỗi khi cập nhật ảnh.");
    }
  };

  const handleUpdateInfo = async () => {
    // Validate
    if (!fullname.trim()) {
      return message.error("Vui lòng nhập họ và tên.");
    }
  
    const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      return message.error("Số điện thoại không hợp lệ.");
    }
  
    try {
      const res = await AxiosUser.post(urlUpdateInfoPost, {
        fullname,
        phone,
      }, {
        useToken: true,
      });
  
      message.success("Cập nhật thông tin thành công!");
      setUser(prev => ({ ...prev, fullname, phone }));
    } catch (err) {
      const message = err.response?.message || "Lỗi khi cập nhật thông tin.";
      message.error(message);
    }
  };




  return (
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">Thông tin tài khoản</h2>
      <input type="file" id="info-avatar" hidden onChange={handleAvatarChange} />
      <div htmlFor="info-avatar" className="flex items-center justify-center mb-4">
      <label htmlFor="info-avatar" className="flex flex-col items-center justify-center cursor-pointer">
      {user.avatar ? (
        <img
          src={baseUrlImg + user.avatar}
          alt="Avatar"
          className="w-20 h-20 rounded-full mb-2 object-cover"
        />
      ) : (
        <div className="w-20 h-20 bg-gray-300 rounded-full mb-2"></div>
      )}
        <p className="text-sm text-gray-500">Tải ảnh của bạn</p>
      </label>
      </div>
      <label htmlFor="" className="font-medium">Email</label>
      <Input className="mb-2" placeholder={user.email} disabled />
      <label htmlFor="" className="block font-medium mt-1">Họ và Tên</label>
      <Input className="mb-2" placeholder="" value={fullname} onChange={e => setFullname(e.target.value)} />
      <label htmlFor="" className="block font-medium mt-1">Số điện thoại</label>
      <Input className="mb-2" placeholder="" value={phone ?? ''} onChange={e => setPhone(e.target.value)} />
      <Button type="primary" className="w-full bg-green-600" onClick={handleUpdateInfo}>Cập nhật</Button>
    </div>
  );
};

export default AccountInfo;
