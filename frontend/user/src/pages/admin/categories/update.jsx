import { update, getById } from "../../../services/api-categories";
import { AntNotification } from "../../../components/notification";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loading } from "../../../contexts/loading";
import { useState, useEffect, use } from 'react';
export const Update_Category = () => {
    const urlImg = import.meta.env.VITE_URL_IMG;
    const [loading, setLoading] = useState(false);
    const Navigate = useNavigate();
    const { id } = useParams();
    const [Img, setImg] = useState(null);
    const [category, setCategoryId] = useState({});
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                setLoading(true);
                const res = await getById(id);
                setCategoryId(res.category);
                setImg(res.category.img);
            } catch (error) {
                AntNotification.handleError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategory();
    }, [id]);

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const res = await update(id, formData);
            if (res?.status === 200) {
                AntNotification.showNotification("Cập nhật thành công", res?.message || "Cập nhật danh mục thành công", "success"
                );
                Navigate('/admin/categories');
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
                            to="dashboard/categories"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản Lý Danh Mục
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Cập nhật Danh Mục
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 mt-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Cập nhật Danh Mục
                    </h5>
                </div>
                <form onSubmit={handSubmit} className="max-w-sm mt-5" method="post">
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Danh Mục</label>
                        <input type="name" name="category_name" id="name" defaultValue={category.category_name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Hình ảnh</label>
                        <input type="file" onChange={handleImgChange} name="img" className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                        {Img && (
                            <div className="mt-3">
                                <img
                                    src={Img.startsWith('data:image/')
                                        ? Img
                                        : `${urlImg + '/' + Img}`
                                    }
                                    alt="Xem trước ảnh"
                                    className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
            <Loading isLoading={loading} />
        </div>
    );
}