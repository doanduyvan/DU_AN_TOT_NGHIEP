import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { commentsService } from "../../../services/api-comments";
import { AntNotification } from "../../../components/notification";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../components/delete_confirm";

export const Comment_Products = () => {

    const [comments, setComments] = useState([]);
    const [selectedComments, setSelectedCommnets] = useState([]);

    const checkComments = (e, id) => {
        setSelectedCommnets((prevselectedComment) => {
            if (e.target.checked) {
                return [...prevselectedComment, id];
            } else {
                return prevselectedComment.filter((item) => item !== id);
            }
        });
    };
    const hanDleDelete = async () => {
        if (selectedComments.length === 0) {
            AntNotification.showNotification("Chưa có bình luận nào được chọn", "Vui lòng chọn ít nhất một bình luận để xóa", "error");
            return;
        }
        try {
            const res = await commentsService.destroy(selectedComments);
            console.log(selectedComments);
            if (res?.status === 200) {
                setComments((prevNews) => {
                    return prevNews.filter(
                        (comments) => !selectedComments.includes(comments.id)
                    );
                });
                setSelectedCommnets([]);
                AntNotification.showNotification("Xóa bình luận thành công", res?.message, "success");
            } else {
                AntNotification.showNotification("Xóa bình luận thất bại", res?.message, "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await commentsService.getComments();
                if (res) {
                    setComments(res.data);
                    console.log(res.data);
                } else {
                    AntNotification.showNotification("Lỗi", "Không thể lấy danh sách bình luận", "error");
                }
            } catch (error) {
                AntNotification.handleError(error);
            }
        };
        fetchData();
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
                            Home
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Quản Lý Bình Luận Sản Phẩm
                    </li>
                </ol>
            </nav>
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg bg-white">
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Quản Lý Bình Luận Sản Phẩm
                    </h5>
                    <Link
                        to="/admin/comment-products/create"
                        className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto"
                    >
                        Thêm Bình Luận
                    </Link>
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
                        {(selectedComments.length > 0) ?
                            <DeleteConfirmationModal
                                data={`Bạn có chắc chắn muốn xóa ${selectedComments.length} bình luận này không?`}
                                onDelete={hanDleDelete}
                            /> : null
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
                                        checked={selectedComments.length === comments.length}
                                        onChange={() => {
                                            if (selectedComments.length === comments.length) {
                                                setSelectedCommnets([]); // bo chon tat ca
                                            } else {
                                                setSelectedCommnets(
                                                    comments.map((item) => item.id)
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
                                Thông tin bình luận
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Sản phẩm
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Đánh giá
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Thời gian
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.map((item) => (
                            <tr
                                key={item.id}
                                className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            onChange={(e) => checkComments(e, item.id)}
                                            checked={selectedComments.includes(item.id)}
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
                                    <div className="">
                                        <div className="text-base font-semibold">
                                            {item.user.fullname}
                                        </div>
                                        <div className="font-normal text-gray-500">
                                            {item.content}
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    <div className="text-base font-semibold truncate">
                                        {item.product.product_name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-base font-semibold">
                                        {formatDistanceToNow(new Date(item.created_at), {
                                            addSuffix: true,
                                            locale: vi
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        to={`/admin/comment-product/update/${item.id}`}
                                        type="button"
                                        data-modal-target="editUserModal"
                                        data-modal-show="editUserModal"
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
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
