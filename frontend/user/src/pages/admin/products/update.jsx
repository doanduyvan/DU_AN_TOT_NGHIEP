import { update, callCategories } from "../../../services/api-categories";
import { message, notification as Notification } from "antd";
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
export const Update_Product = () => {
    const Navigate = useNavigate();
    const { id } = useParams();

    const [category, setCategoryId] = useState({});
    useEffect(() => {
        const fetchCategory = async () => {
            const res = await callCategories(id);
            setCategoryId(res.category);
        }
        fetchCategory();
    }, [id]);
    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const res = await update(id, formData);
            if (res?.status === 200) {
                Notification.success({
                    message: "Cập nhật thành công",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
                Navigate('/admin/categories');
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
                            href="/dashboard"
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
                            href="dashboard/categories"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản Lý Danh Mục
                        </a>
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
                        <input type="name" name="category_name" id="name" defaultValue={category.category_name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Hình ảnh</label>
                        <input type="file" id="img" name="img" className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </div>
    );
}