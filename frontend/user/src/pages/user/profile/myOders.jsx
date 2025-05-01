import React, { useState, useEffect } from "react";
import { Tabs, Card, Tag, Divider, Pagination, Select, Button, message, Modal } from "antd";
import AxiosUser from "/src/utils/axios_user";
import { FullScreenLoader } from "/src/utils/helpersjsx";
import { Link } from "react-router-dom";
import { toSlug } from "/src/utils/helpers";


const { Option } = Select;
const baseUrlImg = import.meta.env.VITE_URL_IMG;
const urlgetOrder = "customer/profile/getorders";
const urlCancelOrder = "customer/profile/cancel-order";
const urlpaymentagain = "customer/profile/payment-again";

const OrderStatus = [
  { key: 1, label: "Đơn hàng mới" },
  { key: 2, label: "Đã xác nhận" },
  { key: 3, label: "Đang xử lý" },
  { key: 4, label: "Đang đóng gói" },
  { key: 5, label: "Đã giao cho vận chuyển" },
  { key: 6, label: "Hoàn thành" },
  { key: 7, label: "Đã hủy" },
  { key: 8, label: "Đang chờ thanh toán" },
  { key: 9, label: "Không thành công" },
  { key: 10, label: "Trả lại" },
];

const ShippingStatus = {
  1: "Đang chờ lấy hàng",
  2: "Đang vận chuyển",
  3: "Đang đến",
  4: "Đã giao",
  5: "Không thể giao",
  6: "Trả lại",
  7: "Tạm hoãn",
  8: "Đã xử lý",
};

const PaymentStatus = {
  1: "Chưa thanh toán",
  2: "Đã thanh toán",
  3: "Thanh toán khi nhận hàng",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (status, page = 1, perPageSize = perPage) => {
    try {
      setLoading(true);
      const res = await AxiosUser.get(urlgetOrder, {
        params: { status, page, per_page: perPageSize },
        useToken: true,
      });

      const { current_page, data, total } = res.orders || {};
      setOrders(data || []);
      setCurrentPage(current_page || 1);
      setTotalOrders(total || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentStatus, currentPage, perPage);
  }, [currentStatus, currentPage, perPage]);

  const handleCancelOrder = async (orderId) => {
    Modal.confirm({
      centered: true,
      maskClosable: true,
      title: "Xác nhận huỷ đơn hàng",
      content: "Bạn có chắc muốn huỷ đơn hàng này không?",
      okText: "Đồng ý",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          const check = await AxiosUser.post(`${urlCancelOrder}/${orderId}`, {}, { useToken: true });
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: 7 } : o))
        );
        message.success("Huỷ đơn hàng thành công");
        } catch (err) {
          const message2 = err.response?.data?.message || "Lỗi không xác định";
          message.error(message2);
          console.error("Error cancelling order:", err);
        }
      },
    });
  };

  const handlePaymentAgain = async (orderId) => {
    Modal.confirm({
      centered: true,
      maskClosable: true,
      title: "Thanh toán",
      content: "Bạn có chắc muốn thanh toán đơn hàng này không?",
      okText: "Đồng ý",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          const check = await AxiosUser.post(`${urlpaymentagain}/${orderId}`, {}, { useToken: true });
          const link = check?.payment_url ;
          if (link) {
            window.location.href = link;
          }else{
            message.error("Lỗi không xác định, không có link thanh toán");
          }
        } catch (err) {
          const message2 = err.response?.data?.message || "Lỗi không xác định";
          message.error(message2);
          console.error("Error cancelling order:", err);
        }
      },
    });
  }

  const renderOrderCard = (order) => (
    <Card
      key={order.id}
      title={`Mã đơn: ${order.id}`}
      className="mb-4 shadow-md rounded-xl"
      extra={<Tag color="blue">PTTT: {order.payment_method}</Tag>}
    >
      {order.order_details.map((item, index) => {
        const product = item.productvariant?.product || {};
        return (
          <div key={index} className="flex items-start gap-4 mb-3">
            <Link to={`/product/${product.id}/${toSlug(product.product_name)}`}>
              <img
                src={baseUrlImg + product.avatar}
                alt=""
                className="w-20 h-20 rounded border object-cover"
              />
            </Link>

            <div className="flex-1">
            <Link to={`/product/${product.id}/${toSlug(product.product_name)}`}>
              <p className="font-medium text-base">{product.product_name}</p>
            </Link>
              <p className="text-sm text-gray-500">
                Size: {item.productvariant?.size}
              </p>
              <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
              <p className="text-sm text-red-500 font-semibold">
                Giá: {parseInt(item.price).toLocaleString()}đ
              </p>
            </div>
          </div>
        );
      })}
      <Divider className="my-2" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
          <p className="text-sm">
            Trạng thái thanh toán:{" "}
            <Tag
              color={
                order.payment_status === 2
                  ? "green"
                  : order.payment_status === 1
                  ? "red"
                  : "blue"
              }
            >
              {PaymentStatus[order.payment_status]}
            </Tag>
          </p>
          <p className="text-sm">
            Trạng thái giao hàng:{" "}
            <Tag>{ShippingStatus[order.shipping_status] || "Chưa rõ"}</Tag>
          </p>
        </div>
        <div className="text-right font-semibold text-lg">
          Thành tiền:{" "}
          <span className="text-red-600">
            {parseInt(order.total_amount).toLocaleString()}đ
          </span>
        </div>
      </div>
      <div className="p-3 border rounded mt-2">
        <p className="text-xs text-gray-500"><span className="font-medium">Địa chỉ giao hàng:</span> {order.shipping_address}</p>
        <p className="text-xs text-gray-500"><span className="font-medium">Người đặt:</span> {order.fullname}</p>
        <p className="text-xs text-gray-500"><span className="font-medium">Số điện thoại:</span> {order.phone}</p>
        <p className="text-xs text-gray-500"><span className="font-medium">Ghi chú:</span> {order.note || "Không có"} </p>
        <p className="text-xs text-gray-500">
          <span className="font-medium">Thời gian đặt hàng:</span> {new Date(order.created_at).toLocaleString()}
        </p>
      </div>
      <div className="text-right mt-3 space-x-2">
        {order.payment_status === 1 && order.status === 1 && (
          <Button type="primary" onClick={()=> handlePaymentAgain(order.id)}>Thanh toán ngay</Button>
        )}
        {[1, 2, 3, 4].includes(order.status) && (
          <Button danger onClick={() => handleCancelOrder(order.id)}>
            Huỷ đơn hàng
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <>
    <div className="bg-gray-50 p-4 rounded">
      <h2 className="text-xl font-bold mb-4">Đơn hàng của tôi</h2>

      <div className="flex justify-end mb-4">
        <span className="mr-2 self-center text-sm">Số đơn/trang:</span>
        <Select
          value={perPage}
          onChange={(value) => {
            setPerPage(value);
            setCurrentPage(1);
          }}
          style={{ width: 80 }}
          size="small"
        >
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
          <Option value={20}>20</Option>
        </Select>
      </div>

      <Tabs
        activeKey={currentStatus.toString()}
        onChange={(key) => {
          setCurrentStatus(Number(key));
          setCurrentPage(1);
        }}
        type="card"
        items={OrderStatus.map(({ key, label }) => ({
          key: key.toString(),
          label,
          children: orders.length > 0 ? (
            <>
              {orders.map(renderOrderCard)}
              <div className="mt-4 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={perPage}
                  total={totalOrders}
                  onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setPerPage(pageSize);
                  }}
                />
              </div>
            </>
          ) : (
            <p className="text-gray-500">Không có đơn hàng nào.</p>
          ),
        }))}
      />
    </div>
        <FullScreenLoader visible={loading} tip='Đang tải đơn hàng...' />
    </>
  );
};

export default MyOrders;