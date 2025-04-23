import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { BannerService } from "../../../services/api-banners";
import { AntNotification } from "../../../components/notification";

export const Update_Banner = () => {
    const urlSRC = import.meta.env.VITE_URL_IMG;
    const { bannerId } = useParams();
    const navigate = useNavigate();
    const [img, setImg] = useState(null);
    const [banner, setBaner] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await BannerService.getBannerById(bannerId);
                if (res) {
                    setBaner(res);
                }
                console.log(res);
            } catch (error) {
                console.error('Có lỗi xảy ra:', error);
            }
        };
    
        fetchData();
    }, []);
    
    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImg(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImg(null);
        }
    }

    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.forEach((value, key) => {
            console.log(key, value);
        }
        );
        const imgFile = document.querySelector('input[name="img"]').files[0];

        if (!imgFile && !banner.img) {
            AntNotification.showNotification('Thất bại', 'Vui lòng chọn hình ảnh', 'warning');
            return;
        }
        if(!formData.get('link')) {
            AntNotification.showNotification('Thất bại', 'Vui lòng nhập link', 'warning');
            return;
        }
        try {
            const res = await BannerService.update(bannerId, formData);
            if (res?.status === 200) {
                AntNotification.showNotification('Thành công', 'Cập nhật banner thành công', 'success');
                navigate("/admin/banners");
            } else {
                AntNotification.showNotification('Thất bại', 'Cập nhật banner thất bại', 'error');
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    }
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
                    <li>
                        <Link
                            to="/admin/vouchers"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản lý banner
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Cập nhật banner
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 mt-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Cập nhật banner
                    </h5>
                </div>
                <form className="max-w-sm mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="link" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Link</label>
                        <input type="text"
                            name="link"
                            defaultValue={banner?.link}
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Nhập link"
                            className=" shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="img" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Hình ảnh</label>
                        <input type="file"
                            name="img"
                            style={{ borderRadius: '4px', padding: '11px' }}
                            placeholder="Hình ảnh"
                            className=" cursor-pointer shadow-sm border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                            accept="image/*"
                            onChange={handleImgChange}
                        />
                        {img ? (
                            <div className="mt-3">
                                <img
                                    src={img}
                                    alt="Xem trước ảnh"
                                    className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                                />
                            </div>
                        ) : (
                            <div className="mt-3">
                                <img
                                    src={urlSRC + banner?.img}
                                    alt="Xem trước ảnh"
                                    className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                        
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </div>
    );
}