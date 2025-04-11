import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AntNotification } from "../../../components/notification";
import { PermissionsService } from "../../../services/api-permissions";
export const Create_Permission = () => {
    const navigate = useNavigate();
    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const res = await PermissionsService.create(formData);
            if (res?.status === 200) {
                AntNotification.showNotification("Thêm quyền hạn thành công", res?.message, "success");
                navigate("/admin/permissions");
            } else {
                AntNotification.showNotification("Thêm quyền hạn thất bại", res?.message, "error");
            }
        } catch (error) {
            if (error?.response?.status === 422) {
                AntNotification.showNotification("Thêm quyền hạn thất bại", error?.response?.data?.message, "error");
            } else {
                AntNotification.handleError(error);
            }
        }
        
    }

    return (
        <div className="pt-20 px-4 lg:ml-64">
            <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
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
                                to="/admin/persmissions"
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
                            Thêm quyền hạn
                        </li>
                    </ol>
                </nav>
                <div className="flex justify-between items-center my-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Thêm quyền hạn
                    </h5>
                </div>
                <form className="mt-5" onSubmit={handSubmit}>
                    <div className="mb-5 lg:w-1/4">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên quyền</label>
                        <input type="name" name="name" id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"/>
                    </div>
                    <div className="mb-5 lg:w-1/4">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Guard Name</label>
                        <select name="guard_name" id="" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                            <option value="api">api</option>
                            <option value="web">web</option>
                        </select>
                    </div>
                    <button type="submit" className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </div>
    );
}