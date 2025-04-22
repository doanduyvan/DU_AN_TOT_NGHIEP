export const FilterPaymentStatusSelect = ({ onChange }) => {
    const PaymentStatus = [
        { id: '', name: "[ Trạng thái thanh toán ]" },
        { id: 1, name: "Chưa thanh toán" },
        { id: 2, name: "Đã thanh toán" },
        { id: 3, name: "Thanh toán khi nhận hàng" },
    ]
    const handleStatusChange = (newStatus) => {
      onChange( newStatus);
    };
  
    return (
      <select
        name="payment_status"
        onChange={(e) => handleStatusChange(e.target.value)}
        className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
      >
        {PaymentStatus.map((status) => (
          <option key={status.id} value={status.id}>
            {status.name}
          </option>
        ))}
      </select>
    );
  };
  