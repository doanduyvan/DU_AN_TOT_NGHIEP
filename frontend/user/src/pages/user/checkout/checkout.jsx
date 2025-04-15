import { Input, Select, Radio, Divider, Button } from "antd";
import React,{useState,useEffect} from "react";
import  AddAddress  from "/src/components/address/addaddress";

const { Option } = Select;

const Checkout = () => {

    const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="pt-[100px]"></div>
      <div className="max-w-6xl mx-auto py-10 px-4 bg-white shadow rounded-md">
        <h2 className="text-2xl font-semibold mb-6">Thanh toán</h2>

        <div>
          <Button type="primary" onClick={() => setShowModal(true)}>
            Thêm địa chỉ
          </Button>
          <AddAddress
            open={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>

        {/* Thông tin giao hàng */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin giao hàng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Họ và tên" defaultValue="Nguyễn Văn A" />
            <Input placeholder="Số điện thoại" defaultValue="0901234567" />
            <Input placeholder="Email" defaultValue="email@example.com" />
            <Select defaultValue="Hồ Chí Minh" className="w-full">
              <Option value="Hồ Chí Minh">Hồ Chí Minh</Option>
              <Option value="Hà Nội">Hà Nội</Option>
            </Select>
            <Input
              placeholder="Địa chỉ cụ thể"
              className="md:col-span-2"
              defaultValue="123 đường ABC, phường XYZ"
            />
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán</h3>
          <Radio.Group defaultValue="cod">
            <div className="flex flex-col gap-2">
              <Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio>
              <Radio value="momo">Ví MoMo (QR Code)</Radio>
              <Radio value="vnpay">VNPay (QR Code)</Radio>
              <Radio value="card">Thẻ ngân hàng</Radio>
            </div>
          </Radio.Group>
        </div>

        {/* Chi tiết đơn hàng */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Đơn hàng</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Sản phẩm A (x2)</span>
              <span>400.000₫</span>
            </div>
            <div className="flex justify-between">
              <span>Sản phẩm B (x1)</span>
              <span>250.000₫</span>
            </div>
            <Divider className="my-3" />
            <div className="flex justify-between font-semibold">
              <span>Tổng tiền</span>
              <span>650.000₫</span>
            </div>
          </div>
        </div>

        <Button type="primary" size="large" className="w-full">
          Đặt hàng
        </Button>
      </div>
    </>
  );
};

export default Checkout;
