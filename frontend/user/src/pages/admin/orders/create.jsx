import { OrderService } from "../../../services/api-orders";
import { AntNotification } from "../../../components/notification";
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { OrderStatusSelect } from "../../../components/admin/orders/order_status";
import { PaymentStatusSelect } from "../../../components/admin/orders/payment_status";
import { ShippingStatusSelect } from "../../../components/admin/orders/shipping_status";
import DeleteConfirmationModal from "../../../components/delete_confirm";

export const Create_Order = () => {
    const Navigate = useNavigate();
    const [order, setOrderId] = useState({
        shipping_status: "1",
        payment_status: "1",
        status: "1",
        shipping_fee: 0,
    });
    const [orderDetails, setOrderDetails] = useState([]);
    const [search_products, setSearch_Products] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [tempQuantities, setTempQuantities] = useState({});

    const handleChange_payment_status = (orderId, newStatus) => {
        setOrderId((order) =>
            order.id === orderId ? { ...order, payment_status: newStatus } : order
        );
    };

    const handleChange_status = (orderId, newStatus) => {
        setOrderId((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
    };

    const handleChange_shipping_status = (orderId, newStatus) => {
        setOrderId((order) =>
            order.id === orderId ? { ...order, shipping_status: newStatus } : order
        );
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    useEffect(() => {
        setOrderId((prev) => ({
            ...prev,
            total_amount: orderDetails.reduce((total, item) => total + item.price * (tempQuantities[item.product_variant_id] || item.quantity), 0),
            total_quantity: orderDetails.reduce((total, item) => total + (tempQuantities[item.product_variant_id] || item.quantity), 0),
        }));

    }, [orderDetails, tempQuantities]);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setLoading(true);
        const data = {
            search_product: searchQuery,
        }
        try {
            const res = await OrderService.searchProduct(data);
            setIsResultVisible(true);
            setSearch_Products(res);
        } catch (error) {
            console.error('Search failed', error);
            AntNotification.handleError(error);
            setSearch_Products([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputFocus = () => {
        if (searchQuery.trim().length > 0 && search_products.length > 0) {
            setIsResultVisible(true);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsResultVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleProductSelect = (variantId) => {
        if (orderDetails.some(order => order.productvariant.id === variantId)) {
            AntNotification.showNotification('Tồn tại', 'Sản phẩm đã có trong đơn hàng', 'error');
            return;
        }

        search_products.forEach(item => {
            item.variants.forEach(variant => {
                if (variant.id === variantId) {
                    setOrderDetails(prev => [
                        ...prev,
                        {
                            product_variant_id: variant.id,
                            product_id: item.id,
                            productvariant: {
                                id: variant.id,
                                product: {
                                    id: item.id,
                                    product_name: item.product_name,
                                    sku: variant.sku,
                                    size: variant.size,
                                },
                                size: variant.size,
                                price: variant.price,
                                quantity: tempQuantities[variant.id] || 0,
                            },
                            quantity: 1,
                            price: variant.price,
                        }
                    ]);
                }
            });
        });
    };

    const handleQuantityChange = (variantId, newQuantity) => {
        setTempQuantities(prev => ({
            ...prev,
            [variantId]: newQuantity
        }));
    };
    const handleOrderDataChange = (e) => {
        const { name, value } = e.target;
        setOrderId(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmitOrder = async () => {
        try {
            const orderData = {
                shipping_fee: order.shipping_fee,
                fullname: order.fullname,
                phone: order.phone,
                shipping_address: order.shipping_address,
                payment_method: order.payment_method,
                carrier: order.carrier,
                payment_status: order.payment_status,
                status: order.status,
                shipping_status: order.shipping_status,
                order_details: orderDetails,
            };

            console.log(orderData);
            const res = await OrderService.create(orderData);
            if (res) {
                AntNotification.showNotification('Thành công', 'Tạo đơn hàng thành công', 'success');
                Navigate('/admin/orders');
            }
        } catch (error) {
            console.error('Create order failed', error);
            AntNotification.handleError(error);
        }
    };

    const hanDleDelete = async (variantId) => {
        setTempQuantities(prev => ({
            ...prev,
            [variantId]: 0
        }));
        const updatedOrderDetails = orderDetails.filter(order => order.productvariant.id !== variantId);
        setOrderDetails(updatedOrderDetails);
        AntNotification.showNotification("Xóa sản phẩm thành công", "", "success");
    };
    return (
        <div className="pt-20 px-4 lg:ml-64">
            <nav className="rounded-md w-full">
                <ol className="list-reset flex">
                    <li>
                    <Link
                            to="/admin"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản Trị
                        </Link>
                    </li>
                    <li><span className="mx-2 text-neutral-500">/</span></li>
                    <li>
                        <Link to="/admin/orders" className="text-primary">Quản Lý Đơn Hàng</Link>
                    </li>
                    <li><span className="mx-2 text-neutral-500">/</span></li>
                    <li className="text-neutral-500">Thêm Đơn Hàng Mới</li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 mt-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">Thêm Đơn Hàng Mới</h5>
                </div>
                <div className="w-full h-auto">
                    <div className="w-full mt-5 grid lg:grid-cols-3 gap-6">
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên người đặt</label>
                            <input type="text"
                                onChange={handleOrderDataChange} name="fullname" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số điện thoại</label>
                            <input type="text"
                                onChange={handleOrderDataChange} name="phone" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Địa chỉ nhận hàng</label>
                            <input type="text"
                                onChange={handleOrderDataChange} name="shipping_address" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Phương thức thanh toán</label>
                            <input type="text"
                                onChange={handleOrderDataChange} name="payment_method" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Công ty giao hàng</label>
                            <input type="text"
                                onChange={handleOrderDataChange} name="carrier" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Phí vận chuyển</label>
                            <input type="text"
                                onChange={handleOrderDataChange} name="shipping_fee" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng thái thanh toán</label>
                            <PaymentStatusSelect order={order} onChange={handleChange_payment_status} />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng thái đơn hàng</label>
                            <OrderStatusSelect order={order} onChange={handleChange_status} />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng thái vận chuyển</label>
                            <ShippingStatusSelect order={order} onChange={handleChange_shipping_status} />
                        </div>
                    </div>

                    {/* Tìm kiếm sản phẩm */}
                    <div className="flex mt-6 justify-between items-center mb-4 w-full">
                        <h5 className="text-sm font-medium leading-tight text-primary">Chi tiết sản phẩm</h5>
                        <div className="w-1/3">
                            <div className="relative w-auto mx-auto ml-4" ref={searchRef}>
                                <form onSubmit={handleSearchSubmit} className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={handleInputFocus}
                                        placeholder="Thêm sản phẩm"
                                        className="flex-grow px-3 outline-none text-gray-700"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 min-w-24 h-10 flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <svg className="h-5 w-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : 'Search'}
                                    </button>
                                </form>
                                {isResultVisible && search_products.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden max-h-64 overflow-y-auto">
                                        <ul className="divide-y divide-gray-100">
                                            {search_products.map((product) => (
                                                product.variants.map((variant) => (
                                                    <li key={variant.id} className="flex items-center w-full justify-between gap-2 p-3 hover:bg-gray-50 cursor-pointer">
                                                        <div className="w-full flex flex-col gap-2">
                                                            <h3 className="text-gray-800 text-lg font-medium">{product.product_name}</h3>
                                                            <p className="text-gray-600 text-sm">Mã SP: {variant.sku} - Size: {variant.size}</p>
                                                        </div>
                                                        <button className="mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200" onClick={() => handleProductSelect(variant.id)}>Thêm</button>
                                                    </li>
                                                ))
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bảng chi tiết sản phẩm */}
                    <table className="w-full my-4 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">Tên sản phẩm</th>
                                <th scope="col" className="px-6 py-3">Số lượng</th>
                                <th scope="col" className="px-6 py-3">Size</th>
                                <th scope="col" className="px-6 py-3">Giá</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.length > 0 ? (
                                orderDetails.map((product, index) => (
                                    <tr key={index} className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200">
                                        <td className="px-6 py-2">{product.productvariant.product.product_name}</td>
                                        <td className="px-6 py-2">
                                            <input type="number" min="1" value={tempQuantities[product.product_variant_id] || product.quantity} onChange={(e) => handleQuantityChange(product.product_variant_id, parseInt(e.target.value))} className="w-20 border rounded px-2 py-1" />
                                        </td>
                                        <td className="px-6 py-2">{product.productvariant.size}</td>
                                        <td className="px-6 py-2">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                                        <td className="px-6 py-4">
                                            <DeleteConfirmationModal data={`Bạn có chắc chắn muốn xóa sản phẩm ${product.productvariant.product.product_name} không?`} onDelete={() => hanDleDelete(product.productvariant.id)} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200">
                                    <td colSpan="5" className="px-6 py-2 text-center">Không có sản phẩm nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Footer */}
                    <div className="w-full flex justify-between items-center mt-6">
                        <span className="flex gap-2">
                            <h4>Tổng giá: </h4>
                            <p className="text-lg">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount || 0)}</p>
                        </span>
                        <button onClick={handleSubmitOrder} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
