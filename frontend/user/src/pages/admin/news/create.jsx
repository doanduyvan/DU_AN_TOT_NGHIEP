import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { notification as Notification } from "antd";
import { newsService } from "../../../services/api-news";
import { Ckeditor5Component } from "../../../components/ckeditor";
import { useAuth } from "../../../contexts/authcontext";

export const Create_News = () => {
    const [avatar, setAvatar] = useState(null);
    const [editorData, setEditorData] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const handleEditorChange = (data) => {
        setEditorData(data);
    };
    
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await newsService.categoryNews();
                if (res) {
                    setCategories(Array.isArray(res) ? res : []);
                    console.log(res);
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
        fetchData();
    }, []);
    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('content', editorData);
        const avatarFile = document.querySelector('input[name="avatar"]').files[0];
        if (!avatarFile) {
            alert('Vui lòng chọn hình ảnh');
            return;
        }
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        try {
            const res = await newsService.create(formData);
            if (res?.status === 200) {
                Notification.success({
                    message: "Thêm thành công",
                    description: res?.message || "Thêm sản phẩm thành công",
                    duration: 5,
                });
                navigate("/admin/news");
            } else {
                Notification.error({
                    message: "Có lỗi xảy ra",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
                let errorMessage = "";
                for (let field in errors) {
                    errorMessage = `${errors[field].join(', ')}\n`;
                    Notification.error({
                        message: "Lỗi trong quá trình gọi API",
                        description: errorMessage || "Vui lòng thử lại sau",
                        duration: 5,
                    });
                }
            } else {
                Notification.error({
                    message: "Lỗi trong quá trình gọi API",
                    description: error.response?.data?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
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
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li>
                        <Link
                            to="/admin/news"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản Lý Bài Viết
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Thêm Bài Viết
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 mt-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Thêm Sản Phẩm
                    </h5>
                </div>
                <form className="max-w-5xl mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tiêu đề</label>
                        <input type="name" name="title" id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="img" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Hình ảnh
                        </label>
                        <input
                            type="file"
                            id="img"
                            name="avatar"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        />
                        {avatar && (
                            <div className="mt-3">
                                <img
                                    src={avatar}
                                    alt="Xem trước ảnh"
                                    className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Danh mục bài viết</label>
                        <select name="category_news_id" id="" className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                        <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.category_news_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-5 w-auto">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nội dung bài viết</label>
                        <Ckeditor5Component
                            onChange={handleEditorChange}
                        />
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </div>
    );
};