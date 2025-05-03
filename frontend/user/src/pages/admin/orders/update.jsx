import { OrderService } from "../../../services/api-orders";
import { AntNotification } from "../../../components/notification";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Loading } from "../../../contexts/loading";
import { OrderStatusSelect } from "../../../components/admin/orders/order_status";
import { PaymentStatusSelect } from "../../../components/admin/orders/payment_status";
import { ShippingStatusSelect } from "../../../components/admin/orders/shipping_status";
import DeleteConfirmationModal from "../../../components/delete_confirm";
export const Update_Order = () => {
    const Navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrderId] = useState({});
    const [orderDetails, setOrderDetails] = useState([]);
    const [search_products, setSearch_Products] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [tempQuantities, setTempQuantities] = useState({});

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const res = await OrderService.getOrderById(id);
                    setOrderId(res);
                    const productList = res.order_details.map((item) => item);
                    setOrderDetails(productList);
            } catch (error) {
                AntNotification.handleError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrder();
    }, [id]);
    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            const res = await OrderService.updateOrderStatus(orderId, newStatus);
            if (res) {
                setOrderId((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                );
                AntNotification.showNotification("Cập nhật trạng thái thành công!", res?.message, "success");
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", res?.message || "Vui lòng thử lại sau", "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };
    const handlePaymentStatusChange = async (orderId, newStatus) => {
        try {
            const res = await OrderService.updatePaymentStatus(orderId, newStatus);
            if (res) {
                setOrderId((order) =>
                    order.id === orderId ? { ...order, payment_status: newStatus } : order
                );
                AntNotification.showNotification("Cập nhật trạng thái thành công!", res?.message, "success");
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", res?.message || "Vui lòng thử lại sau", "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };
    const handleShippingStatusChange = async (orderId, newStatus) => {
        try {
            const res = await OrderService.updateShippingStatus(orderId, newStatus);
            if (res) {
                setOrderId((order) =>
                    order.id === orderId ? { ...order, shipping_status: newStatus } : order
                );
                AntNotification.showNotification("Cập nhật trạng thái thành công!", res?.message, "success");
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", res?.message || "Vui lòng thử lại sau", "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

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

    // Xử lý click bên ngoài để đóng kết quả tìm kiếm
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

    const handleProductSelect = async (varianId) => {

        const selectedVariant = varianId;

        const data = {
            order_id: order.id,
            quantity: 1,
            product_variant_id: selectedVariant,
        }
        try {
            const res = await OrderService.updateOrderDetail(data);

            if (res?.status === 200) {
                setOrderId(res.order);
                const productList = res.order.order_details.map((item) => item);
                setOrderDetails(productList);
                AntNotification.showNotification("Thêm sản phẩm thành công", res?.message, "success");
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", res?.message || "Vui lòng thử lại sau", "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
        setIsResultVisible(false);
    };
    const hanDleDelete = async (variantId) => {
        try {
            const data = {
                order_id: order.id,
            }
            const res = await OrderService.deleteOrderDetail(variantId, data);
            if (res?.status === 200) {
                setOrderId(res.order);
                setOrderDetails(prevOrderDetails => {
                    const updatedOrderDetails = prevOrderDetails.filter(order => order.product_variant_id !== variantId);
                    return updatedOrderDetails;
                });
                AntNotification.showNotification("Xóa sản phẩm thành công", res?.message, "success");
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", res?.message || "Vui lòng thử lại sau", "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };

    const handleQuantityChange = (variantId, newQuantity) => {
        setTempQuantities(prev => ({
            ...prev,
            [variantId]: newQuantity
        }));
    };

    const handleSubmitQuantities = async () => {
        try {
            const updateData = orderDetails.map(detail => {
                const quantity = tempQuantities[detail.product_variant_id];
                if (quantity <= 0 || Number.isNaN(quantity)) {
                    AntNotification.showNotification("Có lỗi xảy ra", `Số lượng không hợp lệ cho sản phẩm ${detail.product_variant_id}`, "error");
                    throw new Error(`Số lượng không hợp lệ cho sản phẩm ${detail.product_variant_id}`);
                }
                return {
                    product_variant_id: detail.product_variant_id,
                    quantity: quantity || detail.quantity // Dùng số lượng mới nếu có, nếu không thì giữ lại số lượng cũ
                };
            });
            const data = {
                order_id: order.id,
                items: updateData,
            };
            const res = await OrderService.uodateOrderQuantities(data);
            setOrderId(res.order);
            if (res?.status === 200) {
                AntNotification.showNotification("Cập nhật số lượng thành công", res?.message, "success");
            } else {
                AntNotification.showNotification("Có lỗi xảy ra", res?.message || "Vui lòng thử lại sau", "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
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
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li>
                        <Link
                            to="admin/orders"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản Lý Đơn Hàng
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Cập nhật Đơn Hàng
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 mt-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Cập nhật Đơn Hàng
                    </h5>
                </div>
                <div className="w-full h-auto">
                    <div className="w-full mt-5 grid lg:grid-cols-3 gap-6">
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên người đặt</label>
                            <input type="text" disabled defaultValue={order.fullname} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số điện thoại</label>
                            <input type="text" disabled defaultValue={order.phone} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Địa chỉ nhận hàng</label>
                            <input type="text" disabled defaultValue={order.shipping_address} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Phương thức thanh toán</label>
                            <input type="text" disabled defaultValue={order.payment_method} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Công ty giao hàng</label>
                            <input type="text" disabled defaultValue={order.carrier} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Phí vận chuyển</label>
                            <input type="text" disabled value={new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(order.shipping_fee)} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ngày đặt</label>
                            <input type="name" id="name" disabled value={new Date(order.created_at).toLocaleString('vi-VN', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false
                            })} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng thái thanh toán</label>
                            <PaymentStatusSelect order={order} onChange={handlePaymentStatusChange} />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng thái đơn hàng</label>
                            <OrderStatusSelect order={order} onChange={handleOrderStatusChange} />
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng thái vận chuyển</label>
                            <ShippingStatusSelect order={order} onChange={handleShippingStatusChange} />
                        </div>
                    </div>
                    <div className="flex mt-6 justify-between items-center mb-4 w-full">
                        <h5 className="text-sm font-medium leading-tight text-primary">
                            Chi tiết sản phẩm
                        </h5>
                        <div className="w-1/3">
                            <div className="relative w-auto mx-auto ml-4" ref={searchRef}>
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
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
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden transform transition-all duration-200 origin-top max-h-64 overflow-y-auto">
                                        <ul className="divide-y divide-gray-100">
                                            {search_products.map((product) => (
                                                product.variants.map((variant) => (
                                                    <li
                                                        key={variant.id}
                                                        className="flex items-center w-full justify-between gap-2 p-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer "
                                                    >
                                                        <div className="w-full flex flex-col gap-2">
                                                            <h3 className="text-gray-800 text-lg font-medium truncate" style={{ width: 400 }}>{product.product_name}</h3>
                                                            <p className="text-gray-600 text-sm mt-1">Mã SP: {variant.sku} - Size: {variant.size}</p>
                                                        </div>
                                                        <button
                                                            className="mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                                                            onClick={(e) => {
                                                                handleProductSelect(variant.id);
                                                            }}
                                                        >
                                                            Thêm
                                                        </button>
                                                    </li>
                                                ))
                                            ))}
                                        </ul>
                                        <div className="bg-gray-50 p-2 text-center border-t border-gray-100">
                                            <button
                                                type="button"
                                                className="text-blue-600 text-sm hover:underline"
                                                onClick={() => console.log('Xem tất cả kết quả')}
                                            >
                                                Xem tất cả kết quả
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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
                            {
                                (orderDetails.length > 0) ? (
                                    orderDetails.map((product, index) => (

                                        <tr key={index}
                                            className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200">
                                            <td className="px-6 py-2">
                                                <p className="text-base text-gray-900">{product.productvariant.product.product_name}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={
                                                        tempQuantities[product.product_variant_id] !== undefined
                                                            ? tempQuantities[product.product_variant_id]
                                                            : product.quantity
                                                    }
                                                    onChange={(e) => {
                                                        const newQuantity = parseInt(e.target.value);
                                                        handleQuantityChange(product.product_variant_id, newQuantity);
                                                    }}
                                                    className="w-20 border rounded px-2 py-1"
                                                />
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="text-base text-gray-900">{product.productvariant.size}</p>
                                            </td>
                                            <td className="px-6 py-2">
                                                <p className="text-base text-gray-900">{new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(product.price)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <DeleteConfirmationModal
                                                    data={`Bạn có chắc chắn muốn xóa sản phẩm ${product.productvariant.product.product_name} không?`}
                                                    onDelete={() => hanDleDelete(product.productvariant.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200">
                                        <td colSpan="4" className="px-6 py-2 text-center">Không có sản phẩm nào</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>

                    <div className="w-full flex justify-between items-center mt-6">
                        <span className="flex gap-2">
                            <h4>Tổng giá: </h4>
                            <p className="text-lg">{new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(order.total_amount)}</p>
                        </span>
                        <button
                            onClick={handleSubmitQuantities}
                            type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </div>
                </div>
            </div>
            <Loading isLoading={loading} />
        </div>
    );
}