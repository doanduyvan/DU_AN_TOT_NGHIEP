import React, { useState } from "react";
import { Tabs, Card } from "antd";

const { TabPane } = Tabs;

const MyOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      status: "success",
      items: [
        { name: "[100g] Muối Nhuyễn Tôm Trung Nghĩa", quantity: 2, price: "16.000" },
        { name: "Bánh Tráng Rìa Phơi Sương Trung Nghĩa", quantity: 1, price: "35.000" },
      ],
      total: "58.500",
    },
  ]);

  const filterOrders = (status) => {
    return orders.filter(order => status === "all" ? true : order.status === status);
  };

  return (
    <div className="bg-gray-100 p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">Đơn hàng của tôi</h2>
      <Tabs defaultActiveKey="all">
        {['all', 'processing', 'shipping', 'success', 'canceled'].map(status => (
          <TabPane 
            tab={status === 'all' ? 'Tất cả đơn hàng' : status === 'processing' ? 'Đang xử lý' : status === 'shipping' ? 'Vận chuyển' : status === 'success' ? 'Hoàn thành' : 'Đã hủy'} 
            key={status}
          >
            {filterOrders(status).map((order) => (
              <div key={order.id} className="bg-white p-4 rounded shadow w-full flex flex-col mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between border-b pb-2 mb-2">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p>Số lượng: {item.quantity}</p>
                    </div>
                    <p className="text-red-500">{item.price}đ</p>
                  </div>
                ))}
                <div className="flex justify-end items-center mt-2">
                  <p className="text-lg font-semibold">Thành tiền: <span className="text-red-500">{order.total}đ</span></p>
                </div>
              </div>
            ))}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default MyOrders;