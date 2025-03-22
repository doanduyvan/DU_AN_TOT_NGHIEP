import React, { useState } from "react";
import { Tabs, Input, Checkbox, Button } from "antd";

const { TabPane } = Tabs;

const AccountInfo = () => {
  return (
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">Thông tin tài khoản</h2>
      <input type="file" id="info-avatar" hidden />
      <div htmlFor="info-avatar" className="flex items-center justify-center mb-4">
      <label htmlFor="info-avatar" className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-gray-300 rounded-full mb-2"></div>
        <p className="text-sm text-gray-500">Tải ảnh của bạn</p>
      </label>
      </div>
      <Input className="mb-2" placeholder="duyvanlee2001@gmail.com" disabled />
      <Input className="mb-2" placeholder="Duy Văn Đoàn" />

      <Button type="primary" className="w-full bg-green-600">Cập nhật</Button>
    </div>
  );
};

export default AccountInfo;
