import React, { useState, useEffect } from "react";
import { OrderService } from "../../../services/api-orders";
import { Pagination } from "antd";

const ProductSelector = ({ onSelectProduct, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await OrderService.getAllProducts({
          page: currentPage,
          per_page: pageSize,
          filter_category: filterCategory,
          keyword,
        });
        if (res) {
          setProducts(res.data || []);
          setTotalItems(res.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, pageSize, keyword, filterCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await OrderService.categories();
        if (res) {
          setCategories(Array.isArray(res) ? res : []);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleVariantChange = (productId, variantId) => {
    const product = products.find((p) => p.id === productId);
    const selectedVariant = product?.variants.find((variant) => variant.id === parseInt(variantId));

    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: selectedVariant,
    }));
  };

  const handleFilterCategoryChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setFilterCategory(value);
  };


  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-h-[80%] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-medium">Chọn sản phẩm</h5>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Đóng
          </button>
        </div>
        <div className="p-4">
          <div className="py-2 flex gap-2">
            <select
              className="cursor-pointer text-black bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 font-medium rounded-md text-sm px-3 overflow-y-auto p-2"
              onChange={handleFilterCategoryChange}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={keyword}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Tên sản phẩm</th>
                  <th className="px-4 py-2">Danh mục</th>
                  <th className="px-4 py-2">Size</th>
                  <th className="px-4 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-4 py-2">{product.product_name}</td>
                    <td className="px-4 py-2">
                      {categories.find((cat) => cat.id === product.category_id)?.category_name || "Không có danh mục"}
                    </td>
                    <td className="px-4 py-2">
                      <select
                        name="variant_id"
                        value={selectedVariants[product.id]?.id || ""}
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        onChange={(e) => handleVariantChange(product.id, e.target.value)}
                      >
                        <option value="" className="p-2">
                          Chọn size
                        </option>
                        {product.variants.map((variant) => (
                          <option key={variant.id} value={variant.id} className="p-2">
                            {variant.size}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          const selectedVariant = selectedVariants[product.id];
                          if (!selectedVariant) {
                            alert("Vui lòng chọn size trước khi thêm!");
                            return;
                          }
                          onSelectProduct({ product, variant: selectedVariant });
                        }}
                        className="text-blue-500 hover:underline"
                      >
                        Thêm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-4 flex justify-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductSelector;
