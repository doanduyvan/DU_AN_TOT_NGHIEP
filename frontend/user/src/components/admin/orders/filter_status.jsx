export const FilterOrderStatusSelect = ({onChange }) => {
  const OrderStatus = [
    { id: '', name: "[ Trạng thái đơn hàng ]" },
    { id: 1, name: "Đơn hàng mới" },
    { id: 2, name: "Đã xác nhận" },
    // { id: 3, name: "Đang xử lý" },
    { id: 4, name: "Đang đóng gói" },
    { id: 5, name: "Đã giao cho vận chuyển" },
    { id: 6, name: "Hoàn thành" },
    { id: 7, name: "Đã hủy" },
    // { id: 8, name: "Đang chờ thanh toán" },
    // { id: 9, name: "Không thành công" },
    // { id: 10, name: "Trả lại" },
  ];

  const handleStatusChange = (newStatus) => {
    onChange(newStatus);
  };

  return (
    <select
      name="status"
      onChange={(e) => handleStatusChange(e.target.value)}
      className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
    >
      {OrderStatus.map((status) => (
        <option key={status.id} value={status.id}>
          {status.name}
        </option>
      ))}
    </select>
  );
};
