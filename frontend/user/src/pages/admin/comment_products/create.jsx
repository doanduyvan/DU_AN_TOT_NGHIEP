import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { AntNotification } from "../../../components/notification";
import { commentProductsService } from "../../../services/api-comment-products";

export const Create_CommentProduct = () => {
    const [editorData, setEditorData] = useState('');
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [isUserResultVisible, setIsUserResultVisible] = useState(false);
    const searchRef = useRef(null);
    const userSearchRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [search_products, setSearch_Products] = useState([]);
    const [search_users, setSearch_Users] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedProductName, setSelectedProductName] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedUserName, setSelectedUserName] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const productsRes = await commentProductsService.getAllProducts();
                if (productsRes) {
                    setProducts(Array.isArray(productsRes) ? productsRes : []);
                } else {
                    AntNotification.showNotification("Lỗi", "Không thể lấy danh sách sản phẩm", "error");
                }

                // Fetch users
                const usersRes = await commentProductsService.getAllUsers();
                if (usersRes) {

                    setUsers(Array.isArray(usersRes) ? usersRes : []);
                } else {
                    AntNotification.showNotification("Lỗi", "Không thể lấy danh sách người dùng", "error");
                }
            } catch (error) {
                AntNotification.handleError(error);
            }
        };
        fetchData();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProductId) {
            AntNotification.showNotification("Lỗi", "Vui lòng chọn sản phẩm", "error");
            return;
        }

        if (!selectedUserId) {
            AntNotification.showNotification("Lỗi", "Vui lòng chọn người dùng", "error");
            return;
        }

        const formData = new FormData();
        formData.append('content', editorData);
        formData.append('product_id', selectedProductId);
        formData.append('user_id', selectedUserId);
        formData.append('rating', e.target.rating.value);

        try {
            const res = await commentProductsService.create(formData);
            if (res?.status === 200) {
                AntNotification.showNotification("Thêm bình luận thành công", res?.message, "success");
                navigate("/admin/comment-products");
            } else {
                AntNotification.showNotification("Thêm bình luận thất bại", res?.message, "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };

    // Product search handling
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
            const res = await commentProductsService.searchProduct(data);
            setSearch_Products(res);
            setIsResultVisible(true);
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

    const handleProductSelect = (productId, productName) => {
        setSelectedProductId(productId);
        setSelectedProductName(productName);
        setSearchQuery('');
        setIsResultVisible(false);
    };

    // User search handling
    const handleUserSearchChange = (e) => {
        setUserSearchQuery(e.target.value);
    };

    const handleUserSearchSubmit = async (e) => {
        e.preventDefault();
        if (!userSearchQuery.trim()) return;
        setUserLoading(true);
        const data = {
            search_user: userSearchQuery,
        }
        try {
            const res = await commentProductsService.searchUsers(data);
            setSearch_Users(res);
            setIsUserResultVisible(true);
        } catch (error) {
            console.error('User search failed', error);
            AntNotification.handleError(error);
            setSearch_Users([]);
        } finally {
            setUserLoading(false);
        }
    };

    const handleUserInputFocus = () => {
        if (userSearchQuery.trim().length > 0 && search_users.length > 0) {
            setIsUserResultVisible(true);
        }
    };

    const handleUserSelect = (userId, userName) => {
        setSelectedUserId(userId);
        setSelectedUserName(userName);
        setUserSearchQuery('');
        setIsUserResultVisible(false);
    };

    // Handle clicks outside search results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsResultVisible(false);
            }
            if (userSearchRef.current && !userSearchRef.current.contains(event.target)) {
                setIsUserResultVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
                    <li>
                        <Link
                            to="/admin/comment-products"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản Lý Bình Luận Sản Phẩm
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Thêm Bình Luận
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 mt-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Thêm Bình Luận
                    </h5>
                </div>
                <form className="max-w-5xl" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Tìm kiếm sản phẩm */}
                        <div className="flex flex-col w-full">
                            <h5 className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                                Tìm kiếm sản phẩm:
                            </h5>
                            <div className="relative w-full" ref={searchRef}>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={handleInputFocus}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Tìm kiếm sản phẩm"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearchSubmit}
                                        disabled={loading}
                                        className="text-white rounded-r-lg border-gray-300 bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 font-medium text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 min-w-24 flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <svg className="h-5 w-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : 'Tìm'}
                                    </button>
                                </div>

                                {isResultVisible && search_products.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden transform transition-all duration-200 origin-top max-h-80 overflow-y-auto">
                                        <ul className="divide-y divide-gray-100">
                                            {search_products.map((product) => (
                                                <li
                                                    key={product.id}
                                                    className="flex items-center w-full justify-between gap-2 p-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                                >
                                                    <div className="w-full flex flex-col gap-2">
                                                        <h3 className="text-gray-800 text-lg font-medium truncate" style={{ width: 300 }}>{product.product_name}</h3>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                                                        onClick={() => handleProductSelect(product.id, product.product_name)}
                                                    >
                                                        Chọn
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            {selectedProductId && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium">Sản phẩm đã chọn: <span className="text-blue-700">{selectedProductName}</span></p>
                                </div>
                            )}
                            <div className="mt-4">
                                <label htmlFor="product_select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Hoặc chọn từ danh sách: </label>
                                <select
                                    id="product_select"
                                    value={selectedProductId}
                                    onChange={(e) => {
                                        const id = e.target.value;
                                        const name = products.find(p => p.id.toString() === id)?.product_name || '';
                                        setSelectedProductId(id);
                                        setSelectedProductName(name);
                                    }}
                                    className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                >
                                    <option value="">Chọn sản phẩm</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>{product.product_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Tìm kiếm người dùng */}
                        <div className="flex flex-col w-full">
                            <h5 className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                                Tìm kiếm người dùng:
                            </h5>
                            <div className="relative w-full" ref={userSearchRef}>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={userSearchQuery}
                                        onChange={handleUserSearchChange}
                                        onFocus={handleUserInputFocus}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Tìm kiếm bằng email"
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleUserSearchSubmit}
                                        disabled={userLoading}
                                        className="text-white rounded-r-lg border-gray-300 bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 font-medium text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 min-w-24 flex items-center justify-center"
                                    >
                                        {userLoading ? (
                                            <svg className="h-5 w-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : 'Tìm'}
                                    </button>
                                </div>

                                {isUserResultVisible && search_users.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden transform transition-all duration-200 origin-top max-h-80 overflow-y-auto">
                                        <ul className="divide-y divide-gray-100">
                                            {search_users.map((user) => (
                                                <li
                                                    key={user.id}
                                                    className="flex items-center w-full justify-between gap-2 p-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                                >
                                                    <div className="w-full flex flex-col gap-2">
                                                        <h3 className="text-gray-800 text-lg font-medium truncate" style={{ width: 300 }}>{user.fullname}</h3>
                                                        <p className="text-gray-600 text-sm">{user.email}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                                                        onClick={() => handleUserSelect(user.id, user.fullname)}
                                                    >
                                                        Chọn
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            {selectedUserId && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium">Người dùng đã chọn: <span className="text-blue-700">{selectedUserName}</span></p>
                                </div>
                            )}
                            <div className="mt-4">
                                <label htmlFor="user_select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Hoặc chọn từ danh sách:</label>
                                <select
                                    id="user_select"
                                    value={selectedUserId}
                                    onChange={(e) => {
                                        const id = e.target.value;
                                        const name = users.find(u => u.id.toString() === id)?.fullname || '';
                                        setSelectedUserId(id);
                                        setSelectedUserName(name);
                                    }}
                                    className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                >
                                    <option value="">Chọn người dùng</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>{user.fullname}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Đánh giá ⭐:</label>
                        <div className="rating">
                            <input type="radio" id="star5" name="rating" value="5" />
                            <label title="Excellent!" htmlFor="star5">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                    <path
                                        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                    ></path>
                                </svg>
                            </label>
                            <input value="4" name="rating" id="star4" type="radio" />
                            <label title="Great!" htmlFor="star4">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                    <path
                                        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                    ></path>
                                </svg>
                            </label>
                            <input value="3" name="rating" id="star3" type="radio" />
                            <label title="Good" htmlFor="star3">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                    <path
                                        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                    ></path>
                                </svg>
                            </label>
                            <input value="2" name="rating" id="star2" type="radio" />
                            <label title="Okay" htmlFor="star2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                    <path
                                        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                    ></path>
                                </svg>
                            </label>
                            <input value="1" name="rating" id="star1" type="radio" />
                            <label title="Bad" htmlFor="star1">
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                                    <path
                                        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                    ></path>
                                </svg>
                            </label>
                        </div>

                    </div>

                    <div className="mb-5">
                        <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nội dung:</label>
                        <textarea
                            name="content"
                            id="content"
                            rows="4"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            onChange={(e) => setEditorData(e.target.value)}
                            value={editorData}
                        ></textarea>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Lưu bình luận
                        </button>
                        <Link
                            to="/admin/comment-products"
                            className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Hủy
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};