import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { callPermissions, destroy } from "../../../services/api-permissions";
import { notification as Notification } from "antd";import DeleteConfirmationModal from "../../../components/delete_confirm";
;

export const Permissions = () => {
    const [permissions, setPermission] = useState([]);
    const [selectedPermiss, setselectedPermiss] = useState([]);
    const [filter, setFilter] = useState(""); // lưu trạng thái lọc

    const filterdPermiss = filter
        ? permissions.filter((permiss) => permiss.status === filter)
        : permissions;
    const checkPermission = (e, id) => {
        setselectedPermiss((prevSelect) => {
            if (e.target.checked) {
                return [...prevSelect, id];
            } else {
                return prevSelect.filter((item) => item !== id);
            }
        })
    }
    const hanDleDelete = async (event) => {
        event.preventDefault();
        if (selectedPermiss.length === 0) {
            Notification.warning({
                message: "Không có quyền nào được chọn",
                duration: 3,
            });
            return;
        }
        try {
            const res = await destroy(selectedPermiss);
            if (res?.status === 200) {
                setPermission((prevPermission) => {
                    return prevPermission.filter(
                        (permiss) => !selectedPermiss.includes(permiss.id)
                    );
                });
                Notification.success({
                    message: "Xóa thành công",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
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
                description: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
                duration: 5,
            });
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await callPermissions();
                if (res) {
                    setPermission(res.permissions);
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
    console.log("select", permissions);
    return (
        <div className="pt-20 px-4 lg:ml-64">
            <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                <div className="main-content">
                    <nav className="rounded-md w-full">
                        <ol className="list-reset flex">
                            <li>
                                <Link
                                    to="#"
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
                                Quản Lý Quyền Hạn
                            </li>
                        </ol>
                    </nav>
                    <div className="flex justify-between items-center my-4">
                        <h5 className="text-xl font-medium leading-tight text-primary">
                            Quản Lý Quyền Hạn
                        </h5>
                        <Link
                            to="/admin/permissions/create"
                            className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto"
                        >
                            Thêm Quyền Hạn
                        </Link>
                    </div>

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-2 px-4 bg-white">
                            <div>
                                <select
                                    className="cursor-pointer items-center text-black bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 font-medium rounded-lg text-sm px-3 py-1.5 "
                                // value={filter}
                                // onChange={handleFilterChange}
                                >
                                    <option value="">
                                        Lọc Trạng Thái
                                    </option>
                                    <option value="draft">
                                        Bản Nháp
                                    </option>
                                    <option value="pending">
                                        Chờ duyệt
                                    </option>
                                    <option value="approved">
                                        Đã xuất bản
                                    </option>
                                    <option value="rejected">
                                        Loại Bỏ
                                    </option>
                                </select>
                            </div>
                            <div className="py-1 flex flex-wrap-reverse">
                                {(selectedPermiss.length > 0) ?
                                    <DeleteConfirmationModal
                                        data={`Bạn có chắc chắn muốn xóa ${selectedPermiss.length} quyền hạn này không?`}
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
                                                checked={(selectedPermiss?.length ?? 0) === (filterdPermiss?.length ?? 0)}
                                                onChange={() => {
                                                    if ((selectedPermiss?.length ?? 0) === (filterdPermiss?.length ?? 0)) {
                                                        setselectedPermiss([]); // Bỏ chọn tất cả
                                                    } else {
                                                        setselectedPermiss(
                                                            filterdPermiss.map((permiss) => permiss.id)
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
                                        Update Time
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(filterdPermiss ?? []).map((permiss) => (
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
                                        <td className="px-6 py-4 text-gray-700 tracking-wide">{new Date(permiss.updated_at).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/admin/permissions/update/${permiss.id}`}
                                                type="button"
                                                data-modal-target="editUserModal"
                                                data-modal-show="editUserModal"
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
