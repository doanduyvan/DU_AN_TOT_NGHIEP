import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { VoucherService } from "../../../services/api-vouchers";
import { AntNotification } from "../../../components/notification";
import DeleteConfirmationModal from "../../../components/delete_confirm";
import { Pagination, Select } from 'antd';

export const Vouchers = () => {
    const [voucher, setVoucher] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sortorder, setSortOrder] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [inputValue, setInputValue] = useState('');
    const { Option } = Select;

    const checkVoucher = (e, id) => {
        setSelectedVoucher((prevselectedVoucher) => {
            if (e.target.checked) {
                return [...prevselectedVoucher, id];
            } else {
                return prevselectedVoucher.filter((item) => item !== id);
            }
        });
    };
    const VoucherStatus = [
        { id: 0, name: "Hết hạn" },
        { id: 1, name: "Đang hoat động" },
        { id: 2, name: "Hêt số lượt sử dụng" },
        { id: 3, name: "Tạm dừng hoạt động" },
    ]
    const hanDleDelete = async () => {
        if (selectedVoucher.length === 0) {
            AntNotification.showNotification(
                "Chưa có Voucher nào được chọn",
                "Vui lòng chọn ít nhất một voucher",
                "warning"
            );
            return;
        }
        try {
            const res = await VoucherService.destroy(selectedVoucher);
            if (res?.status === 200) {
                setVoucher((prevvoucher) => {
                    return prevvoucher.filter(
                        (user) => !selectedVoucher.includes(user.id)
                    );
                });
                setSelectedVoucher([]);
                AntNotification.showNotification(
                    "Xóa thành công",
                    res?.message,
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
    console.log(selectedVoucher);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await VoucherService.getVouchers({
                    page: currentPage,
                    per_page: pageSize,
                    sortorder: sortorder,
                    keyword: keyword,
                });
                if (res) {
                    setVoucher(Array.isArray(res.data) ? res.data : []);
                    setTotalItems(res.total || 0);
                    console.log(res);
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
        fetchData();
    }, [currentPage, pageSize, sortorder, keyword]);

    const handleStatusChange = async (id, status) => {
        try {
            const res = await VoucherService.updateStatus({ id, status });
            if (res?.status === 200) {
                setVoucher((prevvoucher) => {
                    return prevvoucher.map((item) => {
                        if (item.id === id) {
                            return { ...item, status };
                        }
                        return item;
                    });
                });
                AntNotification.showNotification(
                    "Cập nhật thành công",
                    res?.message,
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
    }

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
                        Quản Lý Mã Giảm Giá
                    </li>
                </ol>
            </nav>
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg bg-white">
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Quản Lý Mã Giảm Giá
                    </h5>
                    <Link to="/admin/vouchers/create"
                        className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto">
                        Thêm Mã giảm giá
                    </Link>
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
                        {(selectedVoucher.length > 0) ?
                            <DeleteConfirmationModal
                                data={`Bạn có chắc chắn muốn xóa ${selectedVoucher.length} Voucher này không?`}
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
                                placeholder="Tìm kiếm tiêu đề hoặc mã giảm giá"
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
                                        checked={selectedVoucher.length === voucher.length}
                                        onChange={() => {
                                            if (selectedVoucher.length === voucher.length) {
                                                setSelectedVoucher([]);
                                            } else {
                                                setSelectedVoucher(
                                                    voucher.map((user) => user.id)
                                                ); // chon tat ca
                                            }
                                        }}
                                        id="checkbox-all-search"
                                        type="checkbox"
                                        className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="checkbox-all-search" className="sr-only">
                                        checkbox
                                    </label>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tiêu đề
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Mã giảm giá
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Thời gian sử dụng
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Số lượng
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Số lượng đã sử dụng
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Người thêm
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {voucher.map((item) => (
                            <tr
                                key={item.id}
                                className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            onChange={(e) => checkVoucher(e, item.id)}
                                            checked={selectedVoucher.includes(item.id)}
                                            type="checkbox"
                                            className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
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
                                    <div className="text-base font-semibold">
                                        {item.title}
                                    </div>
                                </th>
                                <td className="px-6 py-4 text-gray-700">{item.code}</td>
                                <td className="px-6 py-4">
                                    <Select
                                        value={item?.status}
                                        className="w-full h-10"
                                        onChange={(value) => handleStatusChange(item.id, value)}
                                    >
                                        {VoucherStatus.map((status) => (
                                            <Option key={status.id} value={status.id}>
                                                {status.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </td>
                                <td className="px-6 py-4 text-gray-700">
                                    {new Date(item.expiry_date).toLocaleString('vi-VN')}
                                </td>

                                <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
                                <td className="px-6 py-4 text-gray-700">{item.quantity_used}</td>
                                <td className="px-6 py-4 text-gray-700">{item.user_name}</td>

                                <td className="px-6 py-4 gap-4 flex">
                                    <Link
                                        to={`/admin/vouchers/update/${item.id}`}
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
    );
};
