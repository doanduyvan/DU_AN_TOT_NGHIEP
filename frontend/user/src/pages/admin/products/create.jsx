import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { notification as Notification } from "antd";
import { productService } from "../../../services/api-products";
import { Ckeditor5Component } from "../../../components/ckeditor";
import { useAuth } from "../../../contexts/authcontext";

export const Create_Product = () => {
    const [avatar, setAvatar] = useState(null);
    const [previewImages, setPreviewImages] = useState([]);
    const [editorData, setEditorData] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [categories, setCategories] = useState([]);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleEditorChange = (data) => {
        setEditorData(data);
    };
    
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageChanges = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length > 0) {
            // Tạo preview URL cho các file mới
            const newPreviewURLs = newFiles.map(file => URL.createObjectURL(file));

            // Cập nhật state cho preview và files
            setPreviewImages([...previewImages, ...newPreviewURLs]);
            setImageFiles([...imageFiles, ...newFiles]);

            // Reset input file để có thể chọn lại file đã chọn trước đó
            e.target.value = null;
        }
    };

    const handleRemoveImage = (index) => {
        // Xóa hình ảnh khỏi state previewImages và imageFiles
        const updatedPreviewImages = previewImages.filter((_, i) => i !== index);
        const updatedImageFiles = imageFiles.filter((_, i) => i !== index);

        setPreviewImages(updatedPreviewImages);
        setImageFiles(updatedImageFiles);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await productService.categories();
                if (res) {
                    setCategories(Array.isArray(res) ? res : []);
                    console.log(res);
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
    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('description', editorData);

        const avatarFile = document.querySelector('input[name="avatar"]').files[0];

        if (!avatarFile || imageFiles.length === 0) {
            alert('Vui lòng chọn ảnh đại diện và ít nhất một hình ảnh sản phẩm.');
            return;
        }

        formData.append('avatar', avatarFile);

        // Thêm tất cả các file hình ảnh vào FormData
        imageFiles.forEach((file, index) => {
            formData.append(`images[]`, file);
        });

        formData.forEach((value, key) => {
            console.log(key, value);
        });

        try {
            const res = await productService.create(formData);
            if (res?.status === 200) {
                Notification.success({
                    message: "Thêm thành công",
                    description: res?.message || "Thêm sản phẩm thành công",
                    duration: 5,
                });
                navigate("/admin/products");
            } else {
                Notification.error({
                    message: "Có lỗi xảy ra",
                    description: res?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors;
                let errorMessage = "";
                for (let field in errors) {
                    errorMessage = `${errors[field].join(', ')}\n`;
                    Notification.error({
                        message: "Lỗi trong quá trình gọi API",
                        description: errorMessage || "Vui lòng thử lại sau",
                        duration: 5,
                    });
                }
            } else {
                Notification.error({
                    message: "Lỗi trong quá trình gọi API",
                    description: error.response?.data?.message || "Vui lòng thử lại sau",
                    duration: 5,
                });
            }
        }
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
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li>
                        <Link
                            to="/admin/products"
                            className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                        >
                            Quản Lý Sản Phẩm
                        </Link>
                    </li>
                    <li>
                        <span className="mx-2 text-neutral-500 dark:text-neutral-400">
                            /
                        </span>
                    </li>
                    <li className="text-neutral-500 dark:text-neutral-400">
                        Thêm Sản Phẩm
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 mt-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Thêm Sản Phẩm
                    </h5>
                </div>
                <form className="max-w-5xl mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên sản phẩm</label>
                        <input type="name" name="product_name" id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="img" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Ảnh đại diện sản phẩm
                        </label>
                        <input
                            type="file"
                            id="img"
                            name="avatar"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        />
                        {avatar && (
                            <div className="mt-3">
                                <img
                                    src={avatar}
                                    alt="Xem trước ảnh"
                                    className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Danh mục</label>
                        <select name="category_id" id="" className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.category_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-5 w-auto">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô tả sản phẩm</label>
                        <Ckeditor5Component
                            onChange={handleEditorChange}
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="images" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Hình ảnh sản phẩm</label>
                        <input
                            type="file"
                            id="images"
                            name="images[]"
                            className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            multiple
                            accept="image/*"
                            onChange={handleImageChanges}
                            ref={fileInputRef}
                        />
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">Đã chọn {imageFiles.length} hình ảnh</p>
                        </div>
                        <div id="image-preview" className="mt-4 flex flex-wrap gap-4">
                            {previewImages.map((src, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={src}
                                        alt={`preview-${index}`}
                                        className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Size</label>
                        <select name="size" className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Giá</label>
                        <input type="number" id="img" name="price" className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Giảm giá</label>
                        <input type="number" id="img" name="promotional_price" className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số lượng tồn kho</label>
                        <input type="number" id="img" name="stock_quantity" className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                    </div>

                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </div>
    );
};