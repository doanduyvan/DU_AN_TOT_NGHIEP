import { OrderService } from "../../../services/api-orders";
import { message, notification as Notification } from "antd";
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
export const Update_Order = () => {
    const Navigate = useNavigate();
    const { id } = useParams();
    const [order, setOrderId] = useState({});
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchOrder = async () => {
            const res = await OrderService.getOrderById(id);
            setOrderId(res);
            const productList = res.order_details.map((item) => item.productvariant);
            setProducts(productList);
        }
        fetchOrder();
    }, [id]);

    const handleChange_payment_status = (event) => {
        const updatedOrder = { ...order, payment_status: parseInt(event.target.value) };
        setOrderId(updatedOrder);
    };
    const handleChange_status = (event) => {
        const updatedOrder = { ...order, status: parseInt(event.target.value) };
        setOrderId(updatedOrder);
    };

    console.log(`Order: `, order);
    // console.log(products);

    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.forEach(function (value, key) {
            console.log(key, value);
        });
        try {
            const res = await OrderService.update(id, formData);
            if (res?.status === 200) {
                Notification.success({
                    message: "Cập nhật thành công",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
                Navigate('/admin/orders');
            } else {
                Notification.error({
                    message: "Có lỗi xảy ra",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        } catch (error) {
            Notification.error({
                message: "Lỗi trong quá trình gọi api",
                description: error.message || "Vui lòng thử lại sau",
                duration: 5,
            });
        }
    };
    return (
        <div className="pt-20 px-4 lg:ml-64">
            <nav className="rounded-md w-full">
                <ol className="list-reset flex">
                    <li>
                        <a
                            href="/admin"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li>
                        <a
                            href="admin/orders"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản Lý Đơn Hàng
                        </a>
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
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-sm font-medium leading-tight text-primary">
                        Chi tiết sản phẩm
                    </h5>
                </div>
                <table className="w-full my-4 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tên sản phẩm</th>
                            <th scope="col" className="px-6 py-3">Size</th>
                            <th scope="col" className="px-6 py-3">Giá</th>
                            <th scope="col" className="px-6 py-3">Giá khuyến mãi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (products.length > 0) ? (
                                products.map((product, index) => (
                                    <tr key={index}
                                        className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200">
                                        <td className="px-6 py-2">
                                            <p className="text-base text-gray-900">{product.product.product_name}</p>
                                        </td>
                                        <td className="px-6 py-2">
                                            <p className="text-base text-gray-900">{product.size}</p>
                                        </td>
                                        <td className="px-6 py-2">
                                            <p className="text-base text-gray-900">{new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(product.price)}</p>
                                        </td>
                                        <td className="px-6 py-2">
                                            <p className="text-base text-gray-900">{product.promotional_price}</p>
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
                <form onSubmit={handSubmit} className="w-full h-auto">
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
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng thái thanh toán</label>
                            <select
                                name="payment_status"
                                value={order.payment_status}
                                onChange={handleChange_payment_status}
                                className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            >
                                <option value="0" className="cursor-pointer text-red-600">
                                    Chưa thanh toán
                                </option>
                                <option
                                    value="1"
                                    className="cursor-pointer text-green-600"
                                >
                                    Đã thanh toán
                                </option>
                            </select>
                        </div>
                        <div className="">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mã đơn hàng</label>
                            <input type="text" disabled defaultValue={order.tracking_number} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
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
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng thái đơn hàng</label>
                            <select
                                name="status"
                                value={order.status}
                                onChange={handleChange_status}
                                className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            >
                                <option value="1" className="cursor-pointer text-red-600">
                                    Chờ xác nhận
                                </option>
                                <option
                                    value="2"
                                    className="cursor-pointer text-green-600"
                                >
                                    Đã xác nhận
                                </option>
                                <option
                                    value="3"
                                    className="cursor-pointer text-green-600"
                                >
                                    Đã đóng gói
                                </option>
                                <option
                                    value="4"
                                    className="cursor-pointer text-green-600"
                                >
                                    Đã giao cho đơn vị vận chuyển
                                </option>
                                <option
                                    value="5"
                                    className="cursor-pointer text-green-600"
                                >
                                    Đã hoàn thành
                                </option>
                                <option
                                    value="0"
                                    className="cursor-pointer text-blue-600"
                                >
                                    Đã hủy
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full flex justify-between items-center mt-6">
                        <span className="flex gap-2">
                            <h4>Tổng giá: </h4>
                            <p className="text-lg">{new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(order.total_amount)}</p>
                        </span>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}