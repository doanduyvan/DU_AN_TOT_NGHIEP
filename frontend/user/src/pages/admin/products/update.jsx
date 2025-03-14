import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { notification as Notification } from "antd";
import { productService } from "../../../services/api-products";
import { Ckeditor5Component } from "../../../components/ckeditor";

export const Update_Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [variant, setVariant] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [previewImages, setPreviewImages] = useState([]);
    const [editorData, setEditorData] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [deletedImageIds, setDeletedImageIds] = useState([]);
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

    const handleRemoveExistingImage = (imageId, index) => {
        // Thêm ID hình ảnh vào danh sách xóa
        setDeletedImageIds([...deletedImageIds, imageId]);

        // Xóa hình ảnh khỏi state existingImages
        const updatedExistingImages = existingImages.filter((_, i) => i !== index);
        setExistingImages(updatedExistingImages);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await productService.categories();
                if (res) {
                    setCategories(Array.isArray(res) ? res : []);
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
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const res = await productService.getProductById(id);
                if (res) {
                    setProduct(res.product);
                    setAvatar(res.product.avatar);
                    setVariant(res.variant);
                    setEditorData(res.product.description);

                    // Nếu sản phẩm có hình ảnh, lưu vào state
                    if (res.product.images && Array.isArray(res.product.images)) {
                        setExistingImages(res.product.images);
                    }
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
        fetchProductData();
    }, [id]);

    const handSubmit = async (e) => {
            e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('description', editorData);

        const avatarFile = document.querySelector('input[name="avatar"]').files[0];
        // Chỉ yêu cầu avatar khi chưa có avatar cũ
        if (!avatarFile && !avatar) {
            alert('Hình đại diện không được để trống.');
            return;
        }

        // Nếu có file avatar mới, thêm vào formData
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        // Thêm tất cả các file hình ảnh mới vào FormData
        imageFiles.forEach((file) => {
            formData.append(`images[]`, file);
        });
        
        if(imageFiles.length === 0 && existingImages.length === 0) {
            alert('Hình ảnh sản phẩm không được để trống.');
            return;
        }
        // Thêm danh sách ID hình ảnh đã xóa
        if (deletedImageIds.length > 0) {
            deletedImageIds.forEach(id => {
                formData.append('deleted_images[]', id);
            });
        }

        try {
            const res = await productService.update(id, formData);
            if (res?.status === 200) {
                Notification.success({
                    message: "Cập nhật thành công",
                    description: res?.message || "Cập nhật sản phẩm thành công",
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
                            Trang Chủ
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
                        Cập Nhật Sản Phẩm
                    </li>
                </ol>
            </nav>
            <div className="bg-white shadow rounded-lg mb-4 mt-4 p-4 sm:p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-xl font-medium leading-tight text-primary">
                        Cập Nhật Sản Phẩm
                    </h5>
                </div>
                <form className="max-w-5xl mt-5" onSubmit={handSubmit}>
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên sản phẩm</label>
                        <input
                            type="text"
                            defaultValue={product.product_name}
                            name="product_name"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        />
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
                                    src={avatar && (avatar.startsWith('http://') || avatar.startsWith('https://'))
                                        ? avatar
                                        : (avatar.startsWith('data:image/jpeg;base64,')
                                            ? avatar
                                            : `http://localhost:8000/storage/${avatar}`)
                                    }
                                    alt="Xem trước ảnh"
                                    className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-5">
                        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Danh mục</label>
                        <select
                            name="category_id"
                            defaultValue={product.category_id}
                            className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        >
                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-5 w-auto">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô tả sản phẩm</label>
                        <Ckeditor5Component
                            dataEditor={editorData}
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
                            <p className="text-sm text-gray-600">
                                Đã chọn {imageFiles.length} hình ảnh mới, {existingImages.length} hình ảnh hiện có
                            </p>
                        </div>
                        <div id="image-preview" className="mt-4 flex flex-wrap gap-4">
                            {/* Hiển thị hình ảnh hiện có */}
                            {existingImages.map((image, index) => (
                                <div key={`existing-${index}`} className="relative">
                                    <img
                                        src={image.img && (image.img.startsWith('http://') || image.img.startsWith('https://'))
                                            ? image.img
                                            : `http://localhost:8000/storage/${image.img}`}
                                        alt={`existing-${index}`}
                                        className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(image.id, index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}

                            {/* Hiển thị hình ảnh mới */}
                            {previewImages.map((src, index) => (
                                <div key={`new-${index}`} className="relative">
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
                        <select
                            name="size"
                            defaultValue={product.size}
                            className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        >
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Giá</label>
                        <input
                            type="number"
                            name="price"
                            defaultValue={variant.price}
                            className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Giảm giá</label>
                        <input
                            type="number"
                            name="promotional_price"
                            defaultValue={variant.promotional_price}
                            className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số lượng tồn kho</label>
                        <input
                            type="number"
                            name="stock_quantity"
                            defaultValue={variant.stock_quantity}
                            className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        />
                    </div>

                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cập nhật</button>
                </form>
            </div>
        </div>
    );
};