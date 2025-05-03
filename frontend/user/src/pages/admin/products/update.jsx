import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { AntNotification } from "../../../components/notification";
import { productService } from "../../../services/api-products";
import { Loading } from "../../../contexts/loading";
import { QuillEditor } from "../../../components/quilleditor";

export const Update_Product = () => {
    const urlSRC = import.meta.env.VITE_URL_IMG;
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState({});
    const [variants, setVariants] = useState([{ size: '', sku: '', price: '', promotional_price: '', stock_quantity: '' }]);
    const [avatar, setAvatar] = useState(null);
    const [previewImages, setPreviewImages] = useState([]);
    const [editorData, setEditorData] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [deletedVariant, setDeletedVariant] = useState([]);
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
                }
            } catch (error) {
                AntNotification.handleError(error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const res = await productService.getProductById(id);
                if (res) {
                    setProduct(res.product);
                    setAvatar(res.product.avatar);
                    setVariants(res.variant);
                    setEditorData(res.product.description);

                    // Nếu sản phẩm có hình ảnh, lưu vào state
                    if (res.product.images && Array.isArray(res.product.images)) {
                        setExistingImages(res.product.images);
                    }
                }
            } catch (error) {
                console.error(error.message)
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
    }, [id]);
    const handSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const productName = e.target.product_name.value;
        const categoryId = e.target.category_id.value;

        formData.append('product_name', productName);
        formData.append('category_id', categoryId);
        formData.append('description', editorData);

        const avatarFile = document.querySelector('input[name="avatar"]').files[0];
        // Chỉ yêu cầu avatar khi chưa có avatar cũ
        if (!avatarFile && !avatar) {
            AntNotification.showNotification("Cập nhật sản phẩm thất bại", "Vui lòng chọn ảnh đại diện sản phẩm", "warning");
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

        if (imageFiles.length === 0 && existingImages.length === 0) {
            AntNotification.showNotification("Cập nhật sản phẩm thất bại", "Vui lòng chọn ít nhất một hình ảnh sản phẩm", "warning");
            return;
        }
        // Thêm danh sách ID hình ảnh đã xóa
        if (deletedImageIds.length > 0) {
            deletedImageIds.forEach(id => {
                formData.append('deleted_images[]', id);
            });
        }

        if (deletedVariant.length > 0) {
            deletedVariant.forEach(id => {
                formData.append('deleted_variants[]', id);
            });
        }

        variants.forEach((variant, index) => {
            if (variant.id) {
                formData.append(`variants[${index}][id]`, variant.id);
            }
            formData.append(`variants[${index}][size]`, variant.size);
            formData.append(`variants[${index}][price]`, variant.price);

            if (!variant.promotional_price) {
                formData.append(`variants[${index}][promotional_price]`, null);
            }else{
                formData.append(`variants[${index}][promotional_price]`, variant.promotional_price);
            }
            formData.append(`variants[${index}][sku]`, variant.sku);
            formData.append(`variants[${index}][stock_quantity]`, variant.stock_quantity);
        });

        try {
            const res = await productService.update(id, formData);
            if (res?.status === 200) {
                AntNotification.showNotification("Cập nhật sản phẩm thành công", res.message, "success");
                navigate("/admin/products");
            } else {
                AntNotification.showNotification("Cập nhật sản phẩm thất bại", res.message, "error");
            }
        } catch (error) {
            AntNotification.handleError(error);
        }
    };

    // hàm xử thêm xóa biến thể
    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        const newVariants = [...variants];
        newVariants[index][name] = value;
        console.log(newVariants);
        setVariants(newVariants);
    };
    const addVariant = () => {
        setVariants([...variants, { size: '', price: '', promotional_price: '', sku: '', stock_quantity: '' }]);
    }
    const removeVariant = (index, id) => {
        setDeletedVariant([...deletedVariant, id]);
        if (variants.length <= 1) return;
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants);
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
                                            : urlSRC + avatar
                                        )}
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
                            value={product.category_id || ''}
                            onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
                            className="cursor-pointer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        >
                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id || ''}
                                >
                                    {category.category_name}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div className="mb-5 w-auto">
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô tả sản phẩm</label>
                        <QuillEditor
                            dataEditor={product.description}
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
                                            : urlSRC + image.img}
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
                    {/* biến thể (size) */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                            Biến thể (Size)
                        </label>

                        {variants.map((variant, index) => (
                            <div key={index} className="grid grid-cols-5 gap-4 mb-3 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                                    <input
                                        type="text"
                                        name="size"
                                        placeholder="Size sản phẩm"
                                        defaultValue={variant.size}
                                        onChange={(e) => handleVariantChange(index, e)}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã sản phẩm</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        placeholder="Mã sản phẩm"
                                        defaultValue={variant.sku}
                                        onChange={(e) => handleVariantChange(index, e)}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc</label>
                                    <input
                                        type="number"
                                        name="price"

                                        placeholder="Giá gốc"
                                        defaultValue={variant.price}
                                        onChange={(e) => handleVariantChange(index, e)}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá KM</label>
                                    <input
                                        type="number"
                                        name="promotional_price"
                                        placeholder="Giá khuyến mãi"
                                        defaultValue={variant.promotional_price}
                                        onChange={(e) => handleVariantChange(index, e)}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                                    <input
                                        type="number"
                                        name="stock_quantity"
                                        placeholder="Số lượng"
                                        defaultValue={variant.stock_quantity}
                                        onChange={(e) => handleVariantChange(index, e)}
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    />
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(index, variant.id)}
                                        className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center"
                                        disabled={variants.length <= 1}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addVariant}
                            className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2 text-center mt-2"
                        >
                            Thêm biến thể
                        </button>
                    </div>

                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Cập nhật</button>
                </form>
            </div>
            <Loading isLoading={loading} />
        </div>
    );
};