export const OrderDetail = ({ orderDetail, closeModal }) => {
    if (!orderDetail) return null;

    const urlSRC = import.meta.env.VITE_URL_IMG;
    const productList = orderDetail.order_details.map((item) => item);

    const phone = orderDetail.phone || "Chưa có thông tin";
    const shippingAddress = orderDetail.shipping_address || "Chưa có thông tin";

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-10">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full transform transition-all duration-300 scale-95 hover:scale-100">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Chi tiết đơn hàng</h2>
                    <span
                        className="text-4xl cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={closeModal}>×
                    </span>
                </div>

                <div className="space-y-4 text-base">
                    <div className="flex gap-1">
                        <span className="font-medium text-gray-600">Mã đơn hàng:</span>
                        <span className="text-gray-800">{orderDetail.id}</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="font-medium text-gray-600">Số điện thoại:</span>
                        <span className="text-gray-800">{phone}</span>
                    </div>
                    <div className="flex gap-1">
                        <span className="font-medium text-gray-600">Địa chỉ giao hàng:</span>
                        <span className="text-gray-800">{shippingAddress}</span>
                    </div>
                </div>

                <div className="space-y-4 mt-4 max-h-96 overflow-y-auto">
                    {productList.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b py-4 mr-2">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={urlSRC + item.productvariant.product.avatar}
                                    alt={item.productvariant.product.product_name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="text-left">
                                    <p className="text-xl font-medium text-gray-800">{item.productvariant.product.product_name}</p>
                                    <p className="text-sm text-gray-600">Size: {item.productvariant.size}</p>
                                    <p className="text-sm text-gray-600">SKU: {item.productvariant.sku}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-lg font-semibold text-gray-800">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(item.price)}
                                </p>
                                <p className="text-sm text-gray-600">x {item.quantity}</p>
                                <p className="font-medium text-gray-800">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(item.price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center pt-4 mt-4 border-t">
                    <span className="font-semibold text-gray-700">Tổng tiền:</span>
                    <span className="text-xl text-gray-800">
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        }).format(
                            productList.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};
