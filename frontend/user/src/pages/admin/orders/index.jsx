import { useState, useEffect, useRef } from "react";
import { OrderService } from "../../../services/api-orders";
import { notification } from "antd";
import { Link } from "react-router-dom";

export const Orders = () => {
    const [orders, setCategories] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);


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
            notification.warning({
                message: "Không có danh mục nào được chọn",
                duration: 3,
            });
            return;
        }
        try {
            const res = await destroy(selectedOrders);
            console.log(selectedOrders);
            if (res?.status === 200) {
                setCategories((prevCategories) => {
                    return prevCategories.filter(
                        (category) => !selectedOrders.includes(category.id)
                    );
                });
                notification.success({
                    message: "Xóa thành công",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi trong quá trình gọi api",
                description: error.message || "Vui lòng thử lại sau",
                duration: 5,
            });
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await OrderService.getAllOrder();
                if (res) {
                    setCategories(Array.isArray(res) ? res : []);
                    console.log(res);
                } else {
                    notification.error({
                        message: "Có lỗi xảy ra",
                        description: res?.message || "Vui lòng thử lại sau",
                        duration: 5,
                    });
                }
            } catch (error) {
                notification.error({
                    message: "Lỗi trong quá trình gọi api",
                    description: error.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        };
        fetchData();
    }, []);
    return (
        <div className="pt-20 px-4 lg:ml-64">
            <nav className="rounded-md w-full">
                <ol className="list-reset flex">
                    <li>
                        <a
                            href="#"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Home
                        </a>
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
                            <button
                                onClick={() => {
                                    const confirmed = window.confirm(
                                        `Bạn có chắc chắn muốn xóa ${selectedOrders.length} Danh Mục này không?`
                                    );
                                    if (confirmed) {
                                        hanDleDelete();
                                    }
                                }}
                                type="button"
                                className="block rounded px-6 pb-2 mr-4 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-red-600 w-auto"
                            >
                                Delete
                            </button> : null
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
                                Trạng thái thanh toán
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng thái đơn hàng
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
                                    <div className="ps-3">
                                        <div className="text-base font-semibold">
                                            {order.fullname}
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    <div className="text-base font-semibold">
                                        {order.payment_status === 0 ? "Chưa thanh toán" :
                                                order.payment_status === 1 ? "Đã thanh toán" :
                                                    "Trạng thái không xác định"
                                        }
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-base font-semibold">
                                        {order.status === 1 ? "Chờ xác nhận" :
                                            order.status === 0 ? "Đã hủy" :
                                                order.status === 2 ? "Đã xác nhận" :
                                                    order.status === 3 ? "Đã đóng gói" :
                                                    order.status === 4 ? "Đã giao cho đơn vị vận chuyển" :
                                                    order.status === 5 ? "Đã hoàn thành" :
                                                        "Trạng thái không xác định"
                                        }
                                    </div>
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
