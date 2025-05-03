import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useRef, useEffect, use } from "react";
import { AntNotification } from "../../../components/notification";
import { newsService } from "../../../services/api-news";
import { Loading } from "../../../contexts/loading";
import { QuillEditor } from "../../../components/quilleditor";

export const Update_News = () => {
    const urlImg = import.meta.env.VITE_URL_IMG;
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [news, setNews] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [editorData, setEditorData] = useState('');
    const [categories, setCategories] = useState([]);

    const fileInputRef = useRef(null);
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
        const fetchCategories = async () => {
            try {
                const res = await newsService.categoryNews();
                if (res) {
                    setCategories(Array.isArray(res) ? res : []);
                }
            } catch (error) {
                AntNotification.handleError(error);
            }
        };
        fetchCategories();
    }, []);


    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                setLoading(true);
                const res = await newsService.getNewsById(id);
                if (res) {
                    setNews(res.news);
                    setAvatar(res.news.avatar);
                    setEditorData(res.news.content);
                }
            } catch (error) {
                AntNotification.handleError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewsData();
    }, [id]);

    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('content', editorData);

        const avatarFile = document.querySelector('input[name="avatar"]').files[0];
        if (!avatarFile && !avatar) {
            AntNotification.showNotification("Cập nhật thất bại", "Vui lòng chọn ảnh đại diện", "error");
            return;
        }

        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            const res = await newsService.update(id, formData);
            if (res?.status === 200) {
                AntNotification.showNotification("Cập nhật thành công", res?.message, "success");
                navigate("/admin/news");
            } else {
                AntNotification.showNotification("Cập nhật thất bại", res?.message, "error");
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
                            to="/admin/news"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản Lý Tin Tức
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Cập Nhật Tin Tức
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 mt-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Cập Nhật Tin Tức
                    </h5>
                </div>
                <form className="max-w-5xl mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên sản phẩm</label>
                        <input
                            type="text"
                            defaultValue={news.title}
                            name="title"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="img" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Hình ảnh tin
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
                                    src={avatar.startsWith('data:image/jpeg;base64,')
                                        ? avatar
                                        : `${urlImg + '/' + avatar}`
                                    }
                                    alt="Xem trước ảnh"
                                    className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Danh mục tin tức</label>
                        <select
                            name="category_news_id"
                            value={news.category_news_id}
                            onChange={(e) => setNews({ ...news, category_news_id: e.target.value })}
                            className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        >
                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.category_news_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-5 w-auto">
                        <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nội dung</label>
                        <QuillEditor
                            dataEditor={news.content}
                            onChange={handleEditorChange}
                        />
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cập nhật</button>
                </form>
            </div>
            <Loading isLoading={loading} />
        </div>
    );
};