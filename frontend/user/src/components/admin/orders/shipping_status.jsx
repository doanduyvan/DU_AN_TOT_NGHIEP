export const ShippingStatusSelect = ({ order, onChange, disabled = false }) => {
    const ShippingStatus = [
        { id: 1, name: "Đang chờ lấy hàng" },
        { id: 2, name: "Đang vận chuyển" },
        { id: 3, name: "Đang đến" },
        { id: 4, name: "Đã giao" },
        { id: 5, name: "Không thể giao" },
        { id: 6, name: "Trả lại" },
        { id: 7, name: "Tạm hoãn" },
        { id: 8, name: "Đã xử lý" },
    ];

    const selectedStatus = order.shipping_status !== undefined ? order.shipping_status : 1;

    const handleStatusChange = (newStatus) => {
        onChange(order.id, newStatus);
    };

    return (
        <select
            name="shipping_status"
            disabled={disabled}
            value={selectedStatus} 
            onChange={(e) => handleStatusChange(e.target.value)}
            className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
        >
            {ShippingStatus.map((status) => (
                <option key={status.id} value={status.id}>
                    {status.name}
                </option>
            ))}
        </select>
    );
};
