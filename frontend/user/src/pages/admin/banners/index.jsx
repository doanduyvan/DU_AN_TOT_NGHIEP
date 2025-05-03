
import { useState, useEffect, useRef } from "react";
import { BannerService } from "../../../services/api-banners";
import { AntNotification } from "../../../components/notification";
import { ImageModal } from "../../../components/admin/imgmodal";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../components/delete_confirm";
import { Loading } from "../../../contexts/loading";
import { Pagination } from 'antd';


export const Banners = () => {
    const [loading, setLoading] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const [banners, setBanners] = useState([]);
    const [selectedBanners, setSelectedBanners] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sortorder, setSortOrder] = useState(null);

    const openModal = (src) => {
        setImageSrc(src);
    };

    const closeModal = () => {
        setImageSrc(null);
    };

    const checkCategory = (e, id) => {
        setSelectedBanners((prevselectedBanners) => {
            if (e.target.checked) {
                return [...prevselectedBanners, id];
            } else {
                return prevselectedBanners.filter((item) => item !== id);
            }
        });
    };
    const hanDleDelete = async () => {
        if (selectedBanners.length === 0) {
            AntNotification.showNotification(
                "Không có danh mục nào được chọn",
                "Vui lòng chọn ít nhất một danh mục để xóa",
                "error"
            );
            return;
        }
        try {
            const res = await BannerService.destroy(selectedBanners);
            console.log(selectedBanners);
            if (res?.status === 200) {
                setSelectedBanners([]);
                fetchData();
                AntNotification.showNotification(
                    "Xóa banner thành công",
                    res?.message || "Xóa banner thành công",
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
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await BannerService.getBanners({
                page: currentPage,
                per_page: pageSize,
                sortorder: sortorder,
            });
            if (res) {
                setBanners(Array.isArray(res.data) ? res.data : []);
                setTotalItems(res.total || 0);
            } else {
                AntNotification.showNotification(
                    "Có lỗi xảy ra",
                    res?.message || "Vui lòng thử lại sau",
                    "error"
                );
            }
        } catch (error) {
            AntNotification.handleError(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, sortorder]);


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
                        Quản Lý Banner
                    </li>
                </ol>
            </nav>
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg bg-white">
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Quản Lý Banner
                    </h5>
                    <Link
                        to="/admin/banners/create"
                        className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto"
                    >
                        Thêm Banner
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
                        {(selectedBanners.length > 0) ?
                            <DeleteConfirmationModal
                                data={`Bạn có chắc chắn muốn xóa ${selectedBanners.length} banner này không?`}
                                onDelete={hanDleDelete}
                            /> : null
                        }
                    </div>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-300">
                        <tr>
                            <th scope="col" className="p-4">
                                <div className="flex items-center">
                                    <input
                                        checked={selectedBanners.length === banners.length}
                                        onChange={() => {
                                            if (selectedBanners.length === banners.length) {
                                                setSelectedBanners([]); // bo chon tat ca
                                            } else {
                                                setSelectedBanners(
                                                    banners.map((category) => category.id)
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
                                Link
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Hình ảnh
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {banners.length === 0 ? (
                            <tr className="">
                                <td colSpan={4} className="text-center py-4 text-gray-500">
                                    Không có banner nào
                                </td>
                            </tr>
                        ) : banners.map((banner) => (
                            <tr
                                key={banner.id}
                                className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            onChange={(e) => checkCategory(e, banner.id)}
                                            checked={selectedBanners.includes(banner.id)}
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
                                    <a href={banner.link} target="_blank" className="ps-3">
                                        <div className="text-base text-blue-500 font-semibold">
                                            {banner.link}
                                        </div>
                                    </a>
                                </th>
                                <td className="px-6 py-4">
                                    <a
                                        className="underline cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            openModal(banner.img);
                                        }}
                                    >
                                        Hình ảnh
                                    </a>
                                    <ImageModal imageSrc={imageSrc} closeModal={closeModal} />
                                </td>

                                <td className="px-6 py-4">
                                    <Link
                                        to={`/admin/banners/update/${banner.id}`}
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
