
import React from 'react';
import { Input, Button } from 'antd';

const ChangePassword = () => {
    return (
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Thay đổi mật khẩu</h2>
        <Input.Password className="mb-2" placeholder="Mật khẩu hiện tại" />
        <Input.Password className="mb-2" placeholder="Mật khẩu mới" />
        <Input.Password className="mb-4" placeholder="Nhập lại mật khẩu mới" />
        <Button type="primary" className="w-full bg-green-600">Đổi mật khẩu</Button>
      </div>
    );
  };

export default ChangePassword;