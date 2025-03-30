import { useState, useEffect, useRef } from "react";
import { productService } from "../../../services/api-products";
import { AntNotification } from "../../../components/notification";
import { ImageModal } from "../../../components/admin/imgmodal";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/authcontext";
import DeleteConfirmationModal from "../../../components/delete_confirm";

export const Products = () => {

    const [imageSrc, setImageSrc] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setselectedProducts] = useState([]);
    const { permissions } = useAuth();

    const openModal = (src) => {
        setImageSrc(src);
    };

    const closeModal = () => {
        setImageSrc(null);
    };
    const checkProduct = (e, id) => {
        setselectedProducts((prevselectedProducts) => {
            if (e.target.checked) {
                return [...prevselectedProducts, id];
            } else {
                return prevselectedProducts.filter((item) => item !== id);
            }
        });
    };
    const hanDleDelete = async () => {
        if (selectedProducts.length === 0) {
            AntNotification.showNotification("Lỗi", "Không có sản phẩm nào được chọn", "error");
            return;
        }
        try {
            const res = await productService.destroy(selectedProducts);
            console.log(selectedProducts);
            if (res?.status === 200) {
                setProducts((prevProducts) => {
                    return prevProducts.filter(
                        (product) => !selectedProducts.includes(product.id)
                    );
                });
                setselectedProducts([]);
                AntNotification.showNotification("Xóa sản phẩm thành công", res?.message, "success");
            } else {
                AntNotification.showNotification("Xóa sản phẩm thất bại", res?.message, "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await productService.getAllProducts();
                if (res) {
                    setProducts(Array.isArray(res) ? res : []);
                    console.log(res);
                } else {
                    AntNotification.showNotification("Lỗi", "Không thể lấy danh sách sản phẩm", "error");
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
                        <a
                            href="#"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Home
                        </a>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Quản Lý Sản Phẩm
                    </li>
                </ol>
            </nav>
            <div className="relative overflow-x-auto shadow-md my-4 sm:rounded-lg bg-white">
                <div className="flex justify-between items-center p-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Quản Lý Sản Phẩm
                    </h5>
                    {
                        permissions.includes("create-product") &&
                        <Link
                            to="/admin/products/create"
                            className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-indigo-600 w-auto"
                        >
                            Thêm Sản Phẩm
                        </Link>
                    }
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
                        {(selectedProducts.length > 0) ?
                            <DeleteConfirmationModal
                                data={`Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm này không?`}
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
                                        checked={selectedProducts.length === products.length}
                                        onChange={() => {
                                            if (selectedProducts.length === products.length) {
                                                setselectedProducts([]); // bo chon tat ca
                                            } else {
                                                setselectedProducts(
                                                    products.map((product) => product.id)
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
                                Tên
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
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200"
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id="checkbox-table-search-1"
                                            onChange={(e) => checkProduct(e, product.id)}
                                            checked={selectedProducts.includes(product.id)}
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
                                    <div className="ps-3">
                                        <div className="text-base font-semibold">
                                            {product.product_name}
                                        </div>
                                    </div>
                                </th>
                                <td className="px-6 py-4">
                                    <a
                                        className="underline cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            openModal(product.avatar);
                                        }}
                                    >
                                        Hình ảnh
                                    </a>
                                    <ImageModal imageSrc={imageSrc} closeModal={closeModal} />
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        to={`/admin/products/update/${product.id}`}
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
