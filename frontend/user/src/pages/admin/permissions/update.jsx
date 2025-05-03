
import { AntNotification } from '../../../components/notification';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PermissionsService } from "../../../services/api-permissions";
import { Loading } from '../../../contexts/loading';

export const Update_Permission = () => {
    const Navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { id } = useParams('');
    const [permission, setPermission] = useState({});
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await PermissionsService.showPermission(id);
                if (res.status === 200) {
                    setPermission(res.permission);
                } else {
                    AntNotification.showNotification("Lỗi", "Không thể lấy danh sách quyền hạn", "error");
                }
            } catch (error) {
                AntNotification.handleError(error);
                Navigate('/admin/permissions');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const res = await PermissionsService.update(formData, id);
            if (res?.status === 200) {
                AntNotification.showNotification("Cập nhật quyền hạn thành công", res?.message, "success");
                Navigate('/admin/permissions');
            } else {
                AntNotification.showNotification("Cập nhật quyền hạn thất bại", res?.message, "error");
            }
        } catch (error) {
            if (error?.response?.status === 422) {
                AntNotification.showNotification("Cập nhật quyền hạn thất bại", error?.response?.data?.message, "error");
            } else {
                AntNotification.handleError(error);
            }
        }
    };
    return (

        <div className="pt-20 px-4 lg:ml-64">
            <nav className="rounded-md w-full my-2">
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
                            to="/admin/peemissions"
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
                        Cập nhật quyền hạn
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center my-2">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Cập nhật quyền hạn
                    </h5>
                </div>
                <form className="mt-5" onSubmit={handSubmit}>
                    <div className="mb-5 lg:w-1/4">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên quyền hạn</label>
                        <input type="name" name="name" defaultValue={permission.name} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                    </div>
                    <div className="mb-5 lg:w-1/4">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Guard Name</label>
                        <select name="guard_name" id="" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                            {(permission.guard_name === 'web') ? (
                                <>
                                    <option value="web">web</option>
                                    <option value="api">api</option>
                                </>
                            ) : (
                                <>
                                    <option value="api">api</option>
                                    <option value="web">web</option>
                                </>
                            )}
                        </select>
                    </div>
                    <button type="submit" className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
            <Loading isLoading={loading} />
        </div>
    );
}