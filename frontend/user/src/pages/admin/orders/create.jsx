import { OrderService } from "../../../services/api-orders";
import { locationService } from "../../../services/api-location";
import { AntNotification } from "../../../components/notification";
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { OrderStatusSelect } from "../../../components/admin/orders/order_status";
import { PaymentStatusSelect } from "../../../components/admin/orders/payment_status";
import { ShippingStatusSelect } from "../../../components/admin/orders/shipping_status";
import DeleteConfirmationModal from "../../../components/delete_confirm";
import ProductSelector from "../../../components/admin/orders/product_selector";
import { Pagination } from 'antd';
import Select from 'react-select';
export const Create_Order = () => {
    const [isProductSelectorVisible, setIsProductSelectorVisible] = useState(false);
    const Navigate = useNavigate();
    const [isClearable, setIsClearable] = useState(true);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const [order, setOrderId] = useState({
        shipping_status: "1",
        payment_status: "1",
        status: "1",
        shipping_fee: "",
        fullname: "",
        phone: "",
        shipping_address: "",
        payment_method: "",
        addresses: "",
        carrier: "",
        user_id: null,
    });
    const [orderDetails, setOrderDetails] = useState([]);

    // States cho tìm kiếm sản phẩm
    const [search_products, setSearch_Products] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [tempQuantities, setTempQuantities] = useState({});

    // States cho tìm kiếm người dùng
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [searchUsers, setSearchUsers] = useState([]);
    const [usercheck, setUsercheck] = useState([]);
    const [isUserResultVisible, setIsUserResultVisible] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const userSearchRef = useRef(null);

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
    // tìm kiếm người dùng theo số điện thoại
    const handleUserSearchChange = (e) => {
        const value = e.target.value;
        setUserSearchQuery(value);
        setOrderId(prev => ({
            ...prev,
            phone: value
        }));

        if (value.length >= 3) {
            searchUsersByPhone(value);
        } else {
            setSearchUsers([]);
            setIsUserResultVisible(false);
        }

        if (!isUserResultVisible) {
            setSearchUsers([]);
            setUsercheck([]);
            setSelectedProvince(null);
            setSelectedDistrict(null);
            setSelectedWard(null);
            setDistricts([]);
            setWards([]);
            setOrderId(prev => ({
                ...prev,
                user_id: null,
                addresses: "",
            }));
        }
    };
    // Gọi API tìm kiếm người dùng theo số điện thoại
    const searchUsersByPhone = async (phone) => {
        if (!phone.trim()) return;
        setUserLoading(true);
        try {
            const res = await OrderService.searchByPhone({ phone });
            setSearchUsers(res);
            setIsUserResultVisible(true);
        } catch (error) {
            console.error('User search failed', error);
            setSearchUsers([]);
        } finally {
            setUserLoading(false);
        }
    };

    // Chọn người dùng từ kết quả tìm kiếm
    const handleUserSelect = async (user) => {
        setOrderId(prev => ({
            ...prev,
            user_id: user.id,
            fullname: user.fullname,
            phone: user.phone,
            addresses: user.shipping_addresses[0]?.addresses || '',
        }));
        setUsercheck(user);
        // Tìm tỉnh/thành phố từ danh sách provinces
        const matchedProvince = provinces.find(
            (province) => province.full_name === user.shipping_addresses[0]?.provinces
        );

        const selectedProvince = matchedProvince
            ? {
                code: matchedProvince.code,
                value: matchedProvince.full_name,
                label: matchedProvince.full_name,
            }
            : null;

        setSelectedProvince(selectedProvince);

        if (selectedProvince) {
            const districtsData = await locationService.getDistricts(selectedProvince.code);
            const matchedDistrict = districtsData.find(
                (district) => district.full_name === user.shipping_addresses[0]?.districts
            );

            const selectedDistrict = matchedDistrict
                ? {
                    code: matchedDistrict.code,
                    value: matchedDistrict.full_name,
                    label: matchedDistrict.full_name,
                }
                : null;

            setSelectedDistrict(selectedDistrict);

            if (selectedDistrict) {
                const wardsData = await locationService.getWards(selectedDistrict.code);

                const matchedWard = wardsData.find(
                    (ward) => ward.full_name === user.shipping_addresses[0]?.wards
                );

                const selectedWard = matchedWard
                    ? {
                        code: matchedWard.code,
                        value: matchedWard.full_name,
                        label: matchedWard.full_name,
                    }
                    : null;

                setSelectedWard(selectedWard);
            } else {
                setWards([]);
            }
        } else {
            setDistricts([]);
            setWards([]);
        }

        setIsUserResultVisible(false);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userSearchRef.current && !userSearchRef.current.contains(event.target)) {
                setIsUserResultVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setOrderId((prev) => ({
            ...prev,
            total_amount: orderDetails.reduce((total, item) => total + item.price * (tempQuantities[item.product_variant_id] || item.quantity), 0),
            total_quantity: orderDetails.reduce((total, item) => total + (tempQuantities[item.product_variant_id] || item.quantity), 0),
        }));
    }, [orderDetails, tempQuantities]);

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

    // Lấy danh sách tỉnh thành phố
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await locationService.getProvinces();
                setProvinces(res);
            } catch (error) {
                console.error('Failed to fetch provinces', error);
                AntNotification.handleError(error);
            }
        }
        fetchProvinces();
    }, []);
    // Lấy danh sách quận huyện theo tỉnh thành phố
    const fetchDistricts = async (codeName) => {
        try {
            const res = await locationService.getDistricts(codeName);
            setDistricts(res);
        } catch (error) {
            console.error('Failed to fetch provinces', error);
            AntNotification.handleError(error);
        }
    }
    // Lấy danh sách phường xã theo quận huyện
    const fetchWards = async (codeName) => {
        try {
            const res = await locationService.getWards(codeName);
            setWards(res);
        } catch (error) {
            console.error('Failed to fetch provinces', error);
            AntNotification.handleError(error);
        }
    }
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
    // console.log(order.user_id);
    const handleSubmitOrder = async () => {
        let userId = order.user_id;
        try {
            if (orderDetails.length === 0) {
                AntNotification.showNotification('Lỗi', 'Vui lòng thêm ít nhất 1 sản phẩm vào đơn hàng', 'error');
                return;
            }
            if (!order.addresses || !selectedWard || !selectedDistrict || !selectedProvince) {
                AntNotification.showNotification('Lỗi', 'Vui lòng nhập địa chỉ giao hàng đầy đủ', 'error');
                return;
            }
            if (!userId) {
                try {
                    const userData = {
                        fullname: order.fullname,
                        phone: order.phone,
                        addresses: order.addresses,
                        wards: selectedWard.label,
                        districts: selectedDistrict.label,
                        provinces: selectedProvince.label,
                    };
                    const newUser = await OrderService.createUser(userData);
                    console.log(newUser);
                    if (newUser?.status === 201) {
                        AntNotification.showNotification('Thành công', 'Lưu tài khoản thành công', 'success');
                        userId = newUser.id;
                        setOrderId(prev => ({
                            ...prev,
                            user_id: userId
                        }));
                    } else {
                        AntNotification.showNotification('Lỗi', 'Không thể tạo người dùng mới', 'error');
                        return;
                    }
                } catch (error) {
                    console.error('Lỗi khi kiểm tra/tạo người dùng:', error);
                    AntNotification.handleError(error);
                    return;
                }
            }

            const fullAddress = `${order.addresses}, ${selectedWard.label}, ${selectedDistrict.label}, ${selectedProvince.label}`;
            const orderData = {
                shipping_fee: order.shipping_fee,
                fullname: order.fullname,
                phone: order.phone,
                shipping_address: fullAddress,
                payment_method: order.payment_method,
                carrier: order.carrier,
                payment_status: order.payment_status,
                status: order.status,
                shipping_status: order.shipping_status,
                order_details: orderDetails.map(item => ({
                    ...item,
                    quantity: tempQuantities[item.product_variant_id] || item.quantity
                })),
                user_id: order.user_id,
            };

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
    // Lấy danh sách sản phẩm

    const handleAddProduct = ({ product, variant }) => {
        console.log(product, variant);
        const variantId = variant.id;
        if (orderDetails.some(order => order.productvariant.id === variantId)) {
            AntNotification.showNotification('Tồn tại', 'Sản phẩm đã có trong đơn hàng', 'error');
            return;
        }
        product.variants.forEach(variant => {
            if (variant.id === variantId) {
                setOrderDetails(prev => [
                    ...prev,
                    {
                        product_variant_id: variant.id,
                        product_id: product.id,
                        productvariant: {
                            id: variant.id,
                            product: {
                                id: product.id,
                                product_name: product.product_name,
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
        // setIsProductSelectorVisible(false);
    };
    return (
        <div className="pt-20 px-4 lg:ml-64">
            <nav className="rounded-md w-full pb-4">
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

            <div className="bg-white shadow rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h5 className="text-xl font-semibold text-gray-800">Thêm Đơn Hàng Mới</h5>
                </div>
                <div className="mb-8">
                    <h6 className="text-md font-medium text-gray-700 mb-4">Thông tin khách hàng</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Tên người đặt */}
                        <div>
                            <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-700">Tên người đặt</label>
                            <input
                                type="text"
                                value={order.fullname}
                                onChange={handleOrderDataChange}
                                name="fullname"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div className="relative" ref={userSearchRef}>
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input
                                type="text"
                                value={order.phone}
                                onChange={handleUserSearchChange}
                                name="phone"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {isUserResultVisible && searchUsers.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden max-h-64 overflow-y-auto">
                                    <ul className="divide-y divide-gray-100">
                                        {searchUsers.map((user) => (
                                            <li
                                                key={user.id}
                                                className="flex items-center w-full justify-between gap-2 p-3 hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleUserSelect(user)}
                                            >
                                                <div className="flex flex-col gap-1 w-full">
                                                    <h3 className="text-gray-800 text-sm font-medium">{user.fullname}</h3>
                                                    <p className="text-gray-600 text-xs">SĐT: {user.phone}</p>
                                                    {user.shipping_addresses[0] && (
                                                        <p className="text-gray-600 text-xs truncate">
                                                            Địa chỉ: {user.shipping_addresses[0].addresses}, {user.shipping_addresses[0].wards}, {user.shipping_addresses[0].districts}, {user.shipping_addresses[0].provinces}
                                                        </p>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {usercheck && usercheck.fullname && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium">Người dùng đã chọn: <span className="text-blue-700">{usercheck.fullname}</span></p>
                                </div>
                            )}

                            {userLoading && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 text-center">
                                    <svg className="h-5 w-5 text-blue-500 animate-spin mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className="text-sm mt-2">Đang tìm kiếm...</p>
                                </div>
                            )}
                        </div>

                        {/* Phương thức thanh toán */}
                        <div>
                            <label htmlFor="payment_method" className="block mb-2 text-sm font-medium text-gray-700">Phương thức thanh toán</label>
                            <select
                                value={order.payment_method}
                                onChange={handleOrderDataChange}
                                name="payment_method"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            >
                                <option value="">-- Chọn phương thức --</option>
                                <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                                <option value="Banking">Chuyển khoản ngân hàng</option>
                                <option value="Momo">Ví điện tử MoMo</option>
                                <option value="ZaloPay">ZaloPay</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-8">
                    <h6 className="text-md font-medium text-gray-700 mb-4">Địa chỉ giao hàng</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Tỉnh / Thành phố */}
                        <div>
                            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">Tỉnh / Thành phố</label>
                            <Select
                                value={selectedProvince}
                                options={provinces.map(province => ({
                                    code: province.code,
                                    value: province.full_name,
                                    label: province.full_name
                                }))}
                                isClearable={true}
                                placeholder="Chọn Tỉnh/Thành phố"
                                onChange={(selectedOption) => {
                                    setSelectedProvince(selectedOption);
                                    if (selectedOption) {
                                        fetchDistricts(selectedOption.code);
                                        setSelectedDistrict([]);
                                    } else {
                                        setDistricts([]);
                                    }
                                }}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '45px'
                                    })
                                }}
                            />
                        </div>
                        {/* Quận/Huyện */}
                        <div>
                            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">Quận / Huyện</label>
                            <Select
                                value={selectedDistrict}
                                options={districts.map(district => ({
                                    code: district.code,
                                    value: district.full_name,
                                    label: district.full_name
                                }))}
                                isClearable={true}
                                placeholder="Chọn Quận / Huyện"
                                onChange={(selectedOption) => {
                                    setSelectedDistrict(selectedOption);
                                    setOrderId(prev => ({
                                        ...prev,
                                        shipping_addresses: selectedOption?.value || ''
                                    }));

                                    if (selectedOption) {
                                        fetchWards(selectedOption.code);
                                        setSelectedWard([]);
                                    } else {
                                        setWards([]);
                                    }
                                }}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '45px'
                                    })
                                }}
                            />
                        </div>
                        {/* Phường/Xã */}
                        <div>
                            <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-2">Phường / Xã</label>
                            <Select
                                value={selectedWard}
                                options={wards.map(ward => ({
                                    code: ward.code,
                                    value: ward.full_name,
                                    label: ward.full_name
                                }))}
                                isClearable={true}
                                placeholder="Chọn Quận / Huyện"
                                onChange={(selectedOption) => {
                                    setSelectedWard(selectedOption);
                                    setOrderId(prev => ({
                                        ...prev,
                                        shipping_addresses: selectedOption?.value || ''
                                    }));
                                }}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '45px'
                                    })
                                }}
                            />
                        </div>
                        {/* Địa chỉ nhà */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ nhà / số nhà</label>
                            <input type="text"
                                value={order.addresses}
                                name="addresses"
                                onChange={handleOrderDataChange}
                                style={{ borderRadius: '4px', padding: '11px' }}
                                placeholder="Nhập địa chỉ nhà"
                                className="shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            />
                        </div>

                    </div>
                </div>

                {/* Shipping and Order Status */}
                <div className="mb-8">
                    <h6 className="text-md font-medium text-gray-700 mb-4">Thông tin vận chuyển và trạng thái</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Công ty giao hàng */}
                        <div>
                            <label htmlFor="carrier" className="block mb-2 text-sm font-medium text-gray-700">Công ty giao hàng</label>
                            <select
                                value={order.carrier}
                                onChange={handleOrderDataChange}
                                name="carrier"
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            >
                                <option value="">-- Chọn đơn vị vận chuyển --</option>
                                <option value="GHTK">Giao hàng tiết kiệm</option>
                                <option value="GHN">Giao hàng nhanh</option>
                                <option value="Viettel">Viettel Post</option>
                                <option value="JT">J&T Express</option>
                                <option value="Grab">Grab Express</option>
                            </select>
                        </div>

                        {/* Phí vận chuyển */}
                        <div>
                            <label htmlFor="shipping_fee" className="block mb-2 text-sm font-medium text-gray-700">Phí vận chuyển</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="text-gray-500">₫</span>
                                </div>
                                <input
                                    type="number"
                                    value={order.shipping_fee}
                                    onChange={handleOrderDataChange}
                                    name="shipping_fee"
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 p-2.5"
                                    required
                                />
                            </div>
                        </div>

                        {/* Trạng thái */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Trạng thái thanh toán */}
                            <div>
                                <label htmlFor="payment_status" className="block mb-2 text-sm font-medium text-gray-700">TT thanh toán</label>
                                <PaymentStatusSelect order={order} onChange={handleChange_payment_status} />
                            </div>

                            {/* Trạng thái đơn hàng */}
                            <div>
                                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">TT đơn hàng</label>
                                <OrderStatusSelect order={order} onChange={handleChange_status} />
                            </div>

                            {/* Trạng thái vận chuyển */}
                            <div>
                                <label htmlFor="shipping_status" className="block mb-2 text-sm font-medium text-gray-700">TT vận chuyển</label>
                                <ShippingStatusSelect order={order} onChange={handleChange_shipping_status} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="mb-6">
                    <div className="mb-4">
                        <h6 className="text-md font-medium text-gray-700">Chi tiết sản phẩm</h6>
                        <div className="flex justify-between items-center my-4">
                            <button
                                onClick={() => setIsProductSelectorVisible(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Thêm sản phẩm
                            </button>
                            {isProductSelectorVisible && (
                                <ProductSelector
                                    onSelectProduct={handleAddProduct}
                                    onClose={() => setIsProductSelectorVisible(false)}
                                />
                            )}

                            <div className="w-full md:w-1/2 lg:w-1/4">
                                <div className="relative" ref={searchRef}>
                                    <form onSubmit={handleSearchSubmit} className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            onFocus={handleInputFocus}
                                            placeholder="Tìm kiếm mã sản phẩm..."
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
                                                        <li key={variant.id} className="flex items-center justify-between gap-2 p-3 hover:bg-gray-50 cursor-pointer">
                                                            <div className="flex flex-col gap-1 w-full">
                                                                <h3 className="text-gray-800 text-sm font-medium">{product.product_name}</h3>
                                                                <div className="flex items-center text-gray-600 text-xs">
                                                                    <span className="inline-block bg-gray-100 px-2 py-1 rounded mr-2">Mã: {variant.sku}</span>
                                                                    <span className="inline-block bg-gray-100 px-2 py-1 rounded">Size: {variant.size}</span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded transition-colors"
                                                                onClick={() => handleProductSelect(variant.id)}
                                                            >
                                                                Thêm
                                                            </button>
                                                        </li>
                                                    ))
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Tên sản phẩm</th>
                                    <th scope="col" className="px-6 py-3">Số lượng</th>
                                    <th scope="col" className="px-6 py-3">Size</th>
                                    <th scope="col" className="px-6 py-3">Giá</th>
                                    <th scope="col" className="px-6 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.length > 0 ? (
                                    orderDetails.map((product, index) => (
                                        <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{product.productvariant.product.product_name}</td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={tempQuantities[product.product_variant_id] || product.quantity}
                                                    onChange={(e) => handleQuantityChange(product.product_variant_id, parseInt(e.target.value))}
                                                    className="w-20 border border-gray-300 rounded px-3 py-2 text-center focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">{product.productvariant.size}</td>
                                            <td className="px-6 py-4 font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <DeleteConfirmationModal data={`Bạn có chắc chắn muốn xóa sản phẩm ${product.productvariant.product.product_name} không?`} onDelete={() => hanDleDelete(product.productvariant.id)} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Chưa có sản phẩm nào trong đơn hàng</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Order Summary and Submit */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-8 pt-6 border-t border-gray-200">
                    <div className="mb-4 md:mb-0">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-gray-600">Tổng số lượng:</span>
                                <span className="font-medium">{order.total_quantity || 0} sản phẩm</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Tổng giá:</span>
                                <span className="text-lg font-semibold text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount || 0)}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmitOrder}
                        className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 transition-all"
                    >
                        Xác nhận tạo đơn hàng
                    </button>
                </div>
            </div>
        </div>
    );

};