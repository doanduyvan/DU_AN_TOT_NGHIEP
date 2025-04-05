import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { AntNotification } from "../../../components/notification";
import { commentNewsService } from "../../../services/api-comment-news";

export const Create_CommentNews = () => {
    const [editorData, setEditorData] = useState('');
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [isUserResultVisible, setIsUserResultVisible] = useState(false);
    const searchRef = useRef(null);
    const userSearchRef = useRef(null);
    const [news, setNews] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [search_news, setSearch_News] = useState([]);
    const [search_users, setSearch_Users] = useState([]);
    const [selectedNewsId, setSelectedNewsId] = useState('');
    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedUserName, setSelectedUserName] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch news
                const newsRes = await commentNewsService.getAllNews();
                if (newsRes) {
                    setNews(Array.isArray(newsRes) ? newsRes : []);
                } else {
                    AntNotification.showNotification("Lỗi", "Không thể lấy danh sách tin tức", "error");
                }

                // Fetch users
                const usersRes = await commentNewsService.getAllUsers();
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
        if (!selectedNewsId) {
            AntNotification.showNotification("Lỗi", "Vui lòng chọn tin tức", "error");
            return;
        }

        if (!selectedUserId) {
            AntNotification.showNotification("Lỗi", "Vui lòng chọn người dùng", "error");
            return;
        }

        const formData = new FormData();
        formData.append('content', editorData);
        formData.append('news_id', selectedNewsId);
        formData.append('user_id', selectedUserId);

        try {
            const res = await commentNewsService.create(formData);
            if (res?.status === 200) {
                AntNotification.showNotification("Thêm bình luận thành công", res?.message, "success");
                navigate("/admin/comment-news");
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
            search_news: searchQuery,
        }
        try {
            const res = await commentNewsService.searchNews(data);
            setSearch_News(res);
            setIsResultVisible(true);
        } catch (error) {
            console.error('Search failed', error);
            AntNotification.handleError(error);
            setSearch_News([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputFocus = () => {
        if (searchQuery.trim().length > 0 && search_news.length > 0) {
            setIsResultVisible(true);
        }
    };

    const handleProductSelect = (productId, title) => {
        setSelectedNewsId(productId);
        setSelectedTitle(title);
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
            const res = await commentNewsService.searchUsers(data);
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
                            to="/admin/comment-news"
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
                        Thêm Bình Luận Tin Tức
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 mt-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Thêm Bình Luận Tin Tức
                    </h5>
                </div>
                <form className="max-w-5xl" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Tìm kiếm sản phẩm */}
                        <div className="flex flex-col w-full">
                            <h5 className="block text-sm font-medium text-gray-900 dark:text-black mb-2">
                                Tìm kiếm tin tức:
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

                                {isResultVisible && search_news.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden transform transition-all duration-200 origin-top max-h-80 overflow-y-auto">
                                        <ul className="divide-y divide-gray-100">
                                            {search_news.map((product) => (
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
                            {selectedNewsId && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium">Tin đã chọn: <span className="text-blue-700">{selectedTitle}</span></p>
                                </div>
                            )}
                            <div className="mt-4">
                                <label htmlFor="product_select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Hoặc chọn từ danh sách: </label>
                                <select
                                    id="product_select"
                                    value={selectedNewsId}
                                    onChange={(e) => {
                                        const id = e.target.value;
                                        const titte = news.find(n => n.id.toString() === id)?.title || '';
                                        setSelectedNewsId(id);
                                        setSelectedTitle(titte);
                                    }}
                                    className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                                >
                                    <option value="">Chọn tin</option>
                                    {news.map((item) => (
                                        <option key={item.id} value={item.id}>{item.title}</option>
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
                            to="/admin/comment-news"
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