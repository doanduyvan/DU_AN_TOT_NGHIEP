import React, { useState } from "react";
import { Input, Button, List, Card, Select } from "antd";

const { Option } = Select;

const AddressBook = () => {
  const [addresses, setAddresses] = useState([
    { id: 1, name: "Duy Văn Đoàn", phone: "0123456789", address: "123 Đường ABC, Quận 1, TP.HCM" },
    { id: 2, name: "Nguyễn Văn A", phone: "0987654321", address: "456 Đường XYZ, Quận 2, TP.HCM" },
  ]);
  
  const [newAddress, setNewAddress] = useState({ name: "", phone: "", province: "", district: "", ward: "", address: "" });
  const [showForm, setShowForm] = useState(false);

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.phone && newAddress.province && newAddress.district && newAddress.ward && newAddress.address) {
      setAddresses([...addresses, { id: addresses.length + 1, ...newAddress }]);
      setNewAddress({ name: "", phone: "", province: "", district: "", ward: "", address: "" });
      setShowForm(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">Sổ địa chỉ nhận hàng</h2>
      
      {/* Nút mở form thêm địa chỉ */}
      <Button type="primary" className="mb-4" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Đóng" : "Thêm địa chỉ mới"}
      </Button>
      
      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-md font-semibold mb-2">Thêm địa chỉ mới</h3>
          <Input className="mb-2" placeholder="Họ và tên" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
          <Input className="mb-2" placeholder="Số điện thoại" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
          <Select className="mb-2 w-full" placeholder="Tỉnh/Thành phố" value={newAddress.province} onChange={(value) => setNewAddress({ ...newAddress, province: value })}>
            <Option value="TP.HCM">TP.HCM</Option>
            <Option value="Hà Nội">Hà Nội</Option>
          </Select>
          <Select className="mb-2 w-full" placeholder="Quận/Huyện" value={newAddress.district} onChange={(value) => setNewAddress({ ...newAddress, district: value })}>
            <Option value="Quận 1">Quận 1</Option>
            <Option value="Quận 2">Quận 2</Option>
          </Select>
          <Select className="mb-2 w-full" placeholder="Phường/Xã" value={newAddress.ward} onChange={(value) => setNewAddress({ ...newAddress, ward: value })}>
            <Option value="Phường 1">Phường 1</Option>
            <Option value="Phường 2">Phường 2</Option>
          </Select>
          <Input className="mb-2" placeholder="Địa chỉ cụ thể" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
          <Button type="primary" className="w-full bg-green-600" onClick={handleAddAddress}>Thêm địa chỉ</Button>
        </div>
      )}
      
      {/* Danh sách địa chỉ đã có */}
      <List
        className="bg-white p-4 rounded shadow"
        header={<h3 className="text-md font-semibold">Danh sách địa chỉ</h3>}
        dataSource={addresses}
        renderItem={(item) => (
          <List.Item>
            <Card className="w-full">
              <p className="font-semibold">{item.name}</p>
              <p>{item.phone}</p>
              <p>{item.address}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default AddressBook;