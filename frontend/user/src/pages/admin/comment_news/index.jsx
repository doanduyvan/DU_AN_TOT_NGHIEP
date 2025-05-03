import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from 'date-fns';
import { fi, vi } from 'date-fns/locale';
import { commentNewsService } from "../../../services/api-comment-news";
import { AntNotification } from "../../../components/notification";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../components/delete_confirm";
import { Loading } from "../../../contexts/loading";
import { Pagination } from "antd";

export const Comment_News = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedComments, setSelectedCommnets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sortorder, setSortOrder] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [inputValue, setInputValue] = useState('');


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
            const res = await commentNewsService.destroy(selectedComments);
            console.log(selectedComments);
            if (res?.status === 200) {
                fetchData();
                setSelectedCommnets([]);
                AntNotification.showNotification("Xóa bình luận thành công", res?.message, "success");
            } else {
                AntNotification.showNotification("Xóa bình luận thất bại", res?.message, "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await commentNewsService.getComments(
                {
                    page: currentPage,
                    per_page: pageSize,
                    sortorder: sortorder,
                    keyword: keyword,
                }
            );
            if (res) {
                setComments(res.data);
                setTotalItems(res.total || 0);
            } else {
                AntNotification.showNotification("Lỗi", "Không thể lấy danh sách bình luận", "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, sortorder, keyword]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (inputValue !== "") {
                setCurrentPage(1);
                setKeyword(inputValue);
            } else {
                setKeyword("");
            }
        }, 400);
        return () => clearTimeout(debounceTimer);
    }, [inputValue]);

    const handlePageChange = async (page, size) => {
        console.log(page, size);
        setCurrentPage(page);
        setPageSize(size);
    }
    const handleFilterChange = async (e) => {
        const value = e.target.value;
        const sortOrder = value === "asc" ? "asc" : "desc";
        setSortOrder(sortOrder);
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
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Quản Lý Bình Luận Tin Tức
                    </li>
                </ol>
            </nav>
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg bg-white">
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Quản Lý Bình Luận Tin Tức
                    </h5>
                </div>
                <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-2 px-4 bg-white">
                    <div>
                        <select
                            className="cursor-pointer items-center text-black bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 font-medium rounded-lg text-sm px-3 py-1.5 "
                            onChange={handleFilterChange}
                        >
                            <option value="desc">
                                Mới nhất
                            </option>
                            <option value="asc">
                                Cũ Nhất
                            </option>
                        </select>
                    </div>
                    <div className="py-1 flex flex-wrap-reverse">
                        {(selectedComments.length > 0) ?
                            <DeleteConfirmationModal
                                data={`Bạn có chắc chắn muốn xóa ${selectedComments.length} bình luận này không?`}
                                onDelete={hanDleDelete}
                            /> : null
                        }
                        <label htmlFor="table-search" className="sr-only">
                            Tìm kiếm
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
                                id="table-search-voucher"
                                className="block pt-2 ps-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-950 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Tìm kiếm người dùng hoặc tin tức"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                                Tin tức
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Thời gian
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            comments.length === 0 ? (
                                <tr className="">
                                    <td colSpan={5} className="text-center py-4 text-gray-500">
                                        Không có bình luận nào
                                    </td>
                                </tr>
                            ) : comments.map((item) => (
                                <tr
                                    key={item.id}
                                    className="bg-white border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                                >
                                    <td className="w-4 p-4 ">
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
                                    <td
                                        scope="row"
                                        className="max-w-5xl flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-slate-950"
                                    >
                                        <div className="truncate">
                                            <div className="text-base font-semibold truncate">
                                                {item.user.fullname}
                                            </div>
                                            <Link to={`/news/${item.news.id}/${item.news.title}`} className="font-normal text-gray-500 truncate">
                                                {item.content}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-base font-semibold truncate">
                                            {item.news.title}
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
                                </tr>
                            ))}
                    </tbody>
                </table>
                <div className="flex justify-end p-4">
                    <Pagination className=""
                        current={currentPage}
                        defaultCurrent={1}
                        total={totalItems}
                        onShowSizeChange={handlePageChange}
                        onChange={handlePageChange} />
                </div>
            </div>
            <Loading isLoading={loading} />
        </div>
    );
};
