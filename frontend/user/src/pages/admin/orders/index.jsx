import { useState, useEffect, useRef } from "react";
import { OrderService } from "../../../services/api-orders";
import { AntNotification } from "../../../components/notification";
import { Link } from "react-router-dom";
import { OrderStatusSelect } from "../../../components/admin/orders/order_status";
import { PaymentStatusSelect } from "../../../components/admin/orders/payment_status";
import { ShippingStatusSelect } from "../../../components/admin/orders/shipping_status";
import DeleteConfirmationModal from "../../../components/delete_confirm";
import { OrderDetail } from "../../../components/admin/order_detail";

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [orderDetail, setOrderDetail] = useState(null);

    const openModal = async (id) => {
        const res = await OrderService.getOrderById(id);
        setOrderDetail(res);
    };
    const closeModal = () => {
        setOrderDetail(null);
    };


    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            const res = await OrderService.updateOrderStatus(orderId, newStatus);
            if (res) {
                setOrders((orders) =>
                    orders.map((order) =>
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
                AntNotification.showNotification(
                    "Cập nhật trạng thái thành công!",
                    res?.message || "Vui lòng thử lại sau",
                    "success"
                );
            } else {
                AntNotification.showNotification(
                    "Có lỗi xảy ra",
                    res?.message || "Vui lòng thử lại sau",
                    "error"
                );
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };

    const handlePaymentStatusChange = async (orderId, newStatus) => {
        try {
            const res = await OrderService.updatePaymentStatus(orderId, newStatus);
            if (res) {
                setOrders((orders) =>
                    orders.map((order) =>
                        order.id === orderId ? { ...order, payment_status: newStatus } : order
                    )
                );
                AntNotification.showNotification(
                    "Cập nhật trạng thái thành công!",
                    res?.message,
                    "success"
                );
            } else {
                AntNotification.showNotification(
                    "Có lỗi xảy ra",
                    res?.message || "Vui lòng thử lại sau",
                    "error"
                );
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };
    const handleShippingStatusChange = async (orderId, newStatus) => {
        try {
            const res = await OrderService.updateShippingStatus(orderId, newStatus);
            if (res) {
                setOrders((orders) =>
                    orders.map((order) =>
                        order.id === orderId ? { ...order, shipping_status: newStatus } : order
                    )
                );
                AntNotification.showNotification(
                    "Cập nhật trạng thái thành công!",
                    res?.message,
                    "success"
                );
            } else {
                AntNotification.showNotification(
                    "Có lỗi xảy ra",
                    res?.message,
                    "error"
                );
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };

    const checkOrder = (e, id) => {
        setSelectedOrders((prevselectedOrders) => {
            if (e.target.checked) {
                return [...prevselectedOrders, id];
            } else {
                return prevselectedOrders.filter((item) => item !== id);
            }
        });
    };
    const hanDleDelete = async () => {
        if (selectedOrders.length === 0) {
            AntNotification.showNotification(
                "Chưa có đơn hàng nào được chọn",
                "Vui lòng chọn ít nhất một đơn hàng để xóa",
                "warning"
            );
            return;
        }
        try {
            const res = await OrderService.destroy(selectedOrders);
            if (res?.status === 200) {
                setOrders((prevOrders) => {
                    return prevOrders.filter(
                        (order) => !selectedOrders.includes(order.id)
                    );
                });
                AntNotification.showNotification(
                    "Xóa đơn hàng thành công",
                    res?.message,
                    "success"
                );
            } else {
                AntNotification.showNotification(
                    "Có lỗi xảy ra",
                    res?.message || "Vui lòng thử lại sau",
                    "error"
                );
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await OrderService.getAllOrder();
                if (res) {
                    setOrders(Array.isArray(res) ? res : []);
                } else {
                    AntNotification.showNotification(
                        "Lỗi",
                        "Không thể lấy danh sách đơn hàng",
                        "error"
                    );
                }
            } catch (error) {
                AntNotification.handleError(error);
            }
        };
        fetchData();
    }, []);
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
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Quản Lý đơn hàng
                    </li>
                </ol>
            </nav>
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg bg-white">
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Quản Lý Đơn Hàng
                    </h5>
                    <Link to="/admin/orders/create"
                        className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto">
                        Thêm đơn hàng
                    </Link>
                </div>
                <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-2 px-4 bg-white">
                    <div>
                        <button
                            id="dropdownActionButton"
                            data-dropdown-toggle="dropdownAction"
                            className="inline-flex items-center text-gray-500 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                            type="button"
                        >
                            <span className="sr-only">Action button</span>
                            Action
                            <svg
                                className="w-2.5 h-2.5 ms-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m1 1 4 4 4-4"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="py-1 flex flex-wrap-reverse">
                        {(selectedOrders.length > 0) ?
                            <DeleteConfirmationModal
                                data={`Bạn có chắc chắn muốn xóa ${selectedOrders.length} đơn hàng này không?`}
                                onDelete={hanDleDelete}
                            /> : null
                        }
                        <label htmlFor="table-search" className="sr-only">
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="table-search-users"
                                className="block pt-2 ps-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-950 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search for users"
                            />
                        </div>
                    </div>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-300">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input
                                        checked={selectedOrders.length === orders.length}
                                        onChange={() => {
                                            if (selectedOrders.length === orders.length) {
                                                setSelectedOrders([]); // bo chon tat ca
                                            } else {
                                                setSelectedOrders(
                                                    orders.map((category) => category.id)
                                                ); // chon tat ca
                                            }
                                        }}
                                        id="checkbox-all-search"
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="checkbox-all-search" className="sr-only">
                                        checkbox
                                    </label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tên
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Chi tiết đơn hàng
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng thái thanh toán
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng thái đơn hàng
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng thái vận chuyển
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ngày đặt
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tổng tiền
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            onChange={(e) => checkOrder(e, order.id)}
                                            checked={selectedOrders.includes(order.id)}
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label
                                            htmlFor="checkbox-table-search-1"
                                            className="sr-only"
                                        >
                                            checkbox
                                        </label>
                                    </div>
                                </td>
                                <th
                                    scope="row"
                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-slate-950"
                                >
                                    <div className="px-6 py-4">
                                        <div className="text-base font-semibold">
                                            {order.fullname}
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    <button 
                                        className="underline cursor-pointer"
                                        onClick={(e) => {
                                            openModal(order.id);
                                        }}
                                    >
                                        Xem chi tiết
                                    </button>
                                    <OrderDetail orderDetail={orderDetail} closeModal={closeModal} />
                                </td>
                                <td className="px-6 py-4">
                                    <PaymentStatusSelect order={order} onChange={handlePaymentStatusChange} />
                                </td>
                                <td className="px-6 py-4">
                                    <OrderStatusSelect order={order} onChange={handleOrderStatusChange} />
                                </td>
                                <td className="px-6 py-4">
                                    <ShippingStatusSelect order={order} onChange={handleShippingStatusChange} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-base font-semibold">
                                        {new Date(order.created_at).toLocaleString('vi-VN')}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-base font-semibold">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(order.total_amount)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        to={`/admin/orders/update/${order.id}`}
                                        type="button"
                                        data-modal-target="editUserModal"
                                        data-modal-show="editUserModal"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
