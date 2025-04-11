import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { PermissionsService } from "../../../services/api-permissions";
import { AntNotification } from "../../../components/notification";
import DeleteConfirmationModal from "../../../components/delete_confirm";
import RestoreConfirmationModal from "../../../components/restore_confirm";
import { Pagination } from 'antd';

export const PermissionsTrash = () => {
    const [permissions, setPermission] = useState([]);
    const [selectedPermiss, setselectedPermiss] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sortorder, setSortOrder] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [inputValue, setInputValue] = useState('');

    const checkPermission = (e, id) => {
        setselectedPermiss((prevSelect) => {
            if (e.target.checked) {
                return [...prevSelect, id];
            } else {
                return prevSelect.filter((item) => item !== id);
            }
        })
    }
    const handleRestore = async () => {
        if (selectedPermiss.length === 0) {
            AntNotification.showNotification(
                "Không có quyền nào được chọn",
                "Vui lòng chọn ít nhất một quyền để khôi phục",
                "error"
            );
            return;
        }
        try {
            const res = await PermissionsService.restore(selectedPermiss);
            console.log(selectedPermiss);
            if (res?.status === 200) {
                setPermission((prevPermiss) => {
                    return prevPermiss.filter(
                        (permiss) => !selectedPermiss.includes(permiss.id)
                    );
                });
                setselectedPermiss([]);
                AntNotification.showNotification(
                    "Khôi phục quền hạn thành công",
                    res?.message || "khôi phục thành công",
                    "success"
                );
            } else {
                AntNotification.showNotification(
                    "Có lỗi xảy ra",
                    res?.message || "Vui lòng thử lại sau",
                    "error"
                );
            }
        } catch (error) {
            console.log(error);
            AntNotification.handleError(error);
        }
    };

    const handleDelete = async (id) => {
        console.log(id);
        try {
            const res = await PermissionsService.forceDelete(id);
            if (res?.status === 200) {
                setPermission((prevPermiss) => {
                    return prevPermiss.filter(
                        (permiss) => permiss.id !== id
                    );
                });
                setselectedPermiss([]);
                AntNotification.showNotification(
                    "Xóa quyền hạn vĩnh viễn thành công",
                    res?.message || "Xóa thành công",
                    "success"
                );
            } else {
                AntNotification.showNotification(
                    "Có lỗi xảy ra",
                    res?.message || "Vui lòng thử lại sau",
                    "error"
                );
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await PermissionsService.permissionTrash({
                    page: currentPage,
                    per_page: pageSize,
                    sortorder: sortorder,
                    keyword: keyword,
                });
                if (res) {
                    setPermission(res.data);
                    setTotalItems(res.total || 0);
                    console.log(res);
                } else {
                    AntNotification.showNotification("Lỗi", "Không thể lấy danh sách quyền hạn", "error");
                }
            } catch (error) {
                AntNotification.handleError(error);
            }
        };
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
        console.log(page);
        setCurrentPage(page);
        setPageSize(size);
    }
    const handleFilterChange = async (e) => {
        const value = e.target.value;
        const sortOrder = value === "asc" ? "asc" : "desc";
        setSortOrder(sortOrder);
    };
    console.log(selectedPermiss);
    return (
        <div className="pt-20 px-4 lg:ml-64">
            <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                <div className="main-content">
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
                                    to="/admin/permissions"
                                    className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                                >
                                    Quản lý quyền hạn
                                </Link>
                            </li>
                            <li>
                                <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                                    /
                                </span>
                            </li>
                            <li className="text-neutral-500 dark:text-neutral-400">
                                Danh sách quyền hạn đã xóa
                            </li>
                        </ol>
                    </nav>
                    <div className="flex justify-between items-center my-4">
                        <h5 className="text-xl font-medium leading-tight text-primary">
                            Danh sách quyền hạn đã xóa
                        </h5>
                    </div>

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                                <RestoreConfirmationModal
                                    data={`Bạn có chắc chắn muốn khôi phục ${selectedPermiss.length} quyền hạn này không?`}
                                    onDelete={handleRestore}
                                />
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
                                        id="table-search-users"
                                        className="block pt-2 ps-10 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-slate-950 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Tìm kiếm..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
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
                                                checked={selectedPermiss.length === permissions.length}
                                                onChange={() => {
                                                    if (selectedPermiss.length === permissions.length) {
                                                        setselectedPermiss([]); // Bỏ chọn tất cả
                                                    } else {
                                                        setselectedPermiss(
                                                            permissions.map((permiss) => permiss.id)
                                                        ); // Chọn tất cả
                                                    }
                                                }}
                                                id="checkbox-all-search"
                                                type="checkbox"
                                                className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />

                                            <label htmlFor="checkbox-all-search" className="sr-only">
                                                checkbox
                                            </label>
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Id
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Guard Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Delete Time
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.map((permiss) => (
                                    <tr
                                        key={permiss.id}
                                        className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                                    >
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    id="checkbox-table-search-1"
                                                    onChange={(e) => checkPermission(e, permiss.id)}
                                                    checked={selectedPermiss.includes(permiss.id)}
                                                    type="checkbox"
                                                    className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label
                                                    htmlFor="checkbox-table-search-1"
                                                    className="sr-only"
                                                >
                                                    Checkbox
                                                </label>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{permiss.id}</td>
                                        <th
                                            scope="row"
                                            className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-slate-950"
                                        >
                                            <div className="">
                                                <div className="text-base font-semibold lineclap w-60 text-limit">
                                                    {permiss.name}
                                                </div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4 text-gray-700">{permiss.guard_name}</td>
                                        <td className="px-6 py-4 text-gray-700 tracking-wide">{new Date(permiss.deleted_at).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-6 py-4">
                                            <DeleteConfirmationModal
                                                data={`Bạn có chắc chắn muốn xóa vĩnh viễn quyền ${permiss.name} không?`}
                                                id={permiss.id}
                                                onDelete={() => handleDelete(permiss.id)}
                                            />
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
                </div>
            </div>
        </div>
    );
};
