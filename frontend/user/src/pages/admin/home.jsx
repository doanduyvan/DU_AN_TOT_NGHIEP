
import Revenue from "../../components/chart/revenue";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { UsersService } from "../../services/api-users";
import { OrderService } from "../../services/api-orders";
import { productService } from "../../services/api-products";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';


export const Home_Admin = () => {
    const urlImg = import.meta.env.VITE_URL_IMG;
    const [loading, setLoading] = useState(true);
    const [userCount, setUserCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponseLimit = await UsersService.getUserLimit();
                const orderResponse = await OrderService.getOrderLimit();
                const orderResponseCount = await OrderService.getOrderCount();
                const productResponseCount = await productService.getProductCount();
                const userResponseCount = await UsersService.getUserCount();
                setOrders(orderResponse || []);
                setUsers(userResponseLimit || []);
                setOrderCount(orderResponseCount?.count || 0);
                setProductCount(productResponseCount?.count || 0);
                setUserCount(userResponseCount || 0);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);
    console.log(userCount, orderCount, productCount, users, orders);
    return (
        <div className="pt-20 px-4 lg:ml-64">
            <div className="mt-2 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                            {productCount}
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                            Số lượng sản phẩm
                        </h3>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                            {orderCount}
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                            Số lương đơn hàng
                        </h3>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                            {userCount}
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                            Số lượng người dùng
                        </h3>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 2xl:grid-cols-2 xl:gap-4 my-4">
                <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold leading-none text-gray-900">Người dùng mới nhất</h3>
                        <Link
                            to="/admin/accounts"
                            className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg inline-flex items-center p-2"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="flow-root">
                        <ul role="list" className="divide-y divide-gray-200">
                            {loading ? (
                                <div className="animate-pulse space-x-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="h-4 bg-gray-300 w-32 mb-2"></div>
                                            <div className="h-4 bg-gray-300 w-24"></div>
                                            <div className="h-4 bg-gray-300 w-24"></div>
                                        </div>
                                        <div className="h-6 bg-gray-300 w-16"></div>
                                    </div>
                                </div>
                            ) : (
                                users.length > 0 ? users.map((user) => (
                                    <li key={user.id} className="py-2 sm:py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <img className=" w-14 h-14 rounded-full object-cover" src={urlImg + user.avatar} alt={user.fullname} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user.fullname}</p>
                                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                                <div className="text-sm mt-2 text-gray-500">
                                                    <span className="font-medium">Thời gian: </span>
                                                    {formatDistanceToNow(new Date(user.created_at), {
                                                        addSuffix: true,
                                                        locale: vi
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )) :
                                    <li className="py-4 sm:py-6 px-4 text-center text-gray-500">
                                        Không có người dùng nào
                                    </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold leading-none text-gray-900">Đơn hàng mới nhất</h3>
                        <Link
                            to="/admin/orders"
                            className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg inline-flex items-center p-2"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="flow-root">
                        <ul role="list" className="divide-y divide-gray-200">
                            {loading ? (
                                <div className="animate-pulse space-x-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-300 h-8 w-8 rounded-full"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="h-4 bg-gray-300 w-32 mb-2"></div>
                                            <div className="h-4 bg-gray-300 w-24"></div>
                                            <div className="h-4 bg-gray-300 w-24"></div>
                                        </div>
                                        <div className="h-6 bg-gray-300 w-16"></div>
                                    </div>
                                </div>
                            ) : (
                                orders.length > 0 ? orders.map((order) => (
                                    <li key={order.id} className="py-3 sm:py-4">
                                        <div className="flex items-center justify-between space-x-4">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{order.fullname}</p>
                                                <p className="text-sm text-gray-500 truncate">{order.shipping_address}</p>
                                            </div>
                                            <div className="inline-flex items-center text-lg font-semibold text-gray-900">
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }).format(order.total_amount)}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-500">
                                            <span className="font-medium">Thời gian: </span>
                                            {formatDistanceToNow(new Date(order.created_at), {
                                                addSuffix: true,
                                                locale: vi
                                            })}
                                        </div>
                                    </li>
                                )) :
                                    <li className="py-4 sm:py-6 px-4 text-center text-gray-500">
                                        Không có đơn hàng nào
                                    </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold leading-none text-gray-900">
                            Thống kê doanh thu
                        </h3>
                    </div>
                    <div className="bg-white">
                        <Revenue />
                    </div>
                </div>
            </div>
        </div>

    )
}