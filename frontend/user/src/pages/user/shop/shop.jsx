import React from "react";
import ShopCategory from "./shopcategory";
import AxiosUser from "../../../utils/axios_user";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { formatCurrency,toSlug } from "../../../utils/helpers";
import { FullScreenLoader } from "../../../utils/helpersjsx";
import { notification,Empty,Pagination } from 'antd';
const baseUrlImg = import.meta.env.VITE_URL_IMG;
const urlProducts = "/customer/shop/getproducts";

const menuSort = [
  { sortBy: "sold_qty", name: "Bán chạy" },
  { sortBy: "new", name: "Mới nhất" },
  { sortBy: "min_price", name: "Giá thấp đến cao" },
  { sortBy: "max_price", name: "Giá cao đến thấp" }
]

const Shop = () => {
  
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const { idcategory,categoryname } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('search'); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(9);
  const [sortBy, setSortBy] = useState("sold_qty");
  const [isLoading, setLoading] = useState(false);

  const [filterPrice, setFilterPrice] = useState({price_min: null, price_max: null});
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async (params = {}) => {
      try {
        setLoading(true);
        const response = await AxiosUser.get(urlProducts,{params: params});
        const data = response.data;
        setTotalItems(response.total);
        setProducts(data);

        // chechk
        const sql = response.sql;
        const stringSort = response.sortname;
      } catch (error) {
        console.error("Error fetching products:", error);
      }finally{
        setLoading(false);
      }
    };

    const params = {};
    if(idcategory){
      if(isNaN(idcategory)){
        navigate("/shop");
        return;
      }
      params.category_id = idcategory;
    }else if(keyword){
      params.keyword = keyword
    }

    if(filterPrice.price_min){
      params.price_min = filterPrice.price_min;
    }

    if(filterPrice.price_max){
      params.price_max = filterPrice.price_max;
    }

    params.sort_by = sortBy;
    params.page = currentPage;
    params.limit = limit;
  
    fetchProducts(params);

  }, [idcategory,currentPage,limit,navigate,keyword,sortBy,filterPrice]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setLimit(pageSize);
  };

  const handleFilterPrice = () => {

    if(!minPrice && !maxPrice){
      return;
    }

    if (minPrice && isNaN(Number(minPrice))) {
      notification.warning({
        message: 'Cảnh báo',
        description: 'Giá thấp nhất không hợp lệ',
        placement: 'topRight',
      });
      return;
    }
  
    if (maxPrice && isNaN(Number(maxPrice))) {
      notification.warning({
        message: 'Cảnh báo',
        description: 'Giá cao nhất không hợp lệ',
        placement: 'topRight',
      });
      return;
    }

    const min = parseInt(minPrice);
    const max = parseInt(maxPrice);
  
    if (!isNaN(min) && !isNaN(max) && max < min) {
      notification.warning({
        message: 'Cảnh báo',
        description: 'Giá cao nhất không được nhỏ hơn giá thấp nhất',
        placement: 'topRight',
      });
      return;
    }
    setFilterPrice({
      price_min: !isNaN(min) ? min : null,
      price_max: !isNaN(max) ? max : null,
    });
  };

  const handleResetFilter = () => {
    setFilterPrice({ price_min: null, price_max: null });
    setMinPrice('');
    setMaxPrice('');
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [idcategory, keyword, sortBy, limit, filterPrice]);



  return (
    <>
      <div className="pt-[70px]"></div>
      <div className="swapper mx-auto py-6 px-2 shop">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          {/* Sidebar */}
          <input type="checkbox" id="sub-menu-shop-input" hidden />
          <aside className="md:col-span-3 bg-white p-4 rounded-lg shadow sub-menu-shop-aside max-h-[55px] md:max-h-full overflow-hidden">
            <div className="flex items-center mb-1 gap-2">
              <label htmlFor="sub-menu-shop-input">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
                  />
                </svg>
              </label>
              <h2 className="font-semibold text-lg">Danh Mục</h2>
            </div>
            <ShopCategory />
            <h2 className="font-semibold text-lg mt-6 mb-2">KHOẢNG GIÁ</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Từ"
                className="border p-2 w-1/2 rounded outline-none"
                value={minPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setMinPrice(value);
                  }
                }}
              />
              <input
                type="text"
                placeholder="Đến"
                value={maxPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setMaxPrice(value);
                  }
                }}
                className="border p-2 w-1/2 rounded outline-none"
              />
            </div>

            <div className="flex items-center gap-2 mt-3">
              <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded flex-1"
                onClick={handleFilterPrice}
              >
                Áp dụng
              </button>
              {(filterPrice.price_min !== null ||
                filterPrice.price_max !== null) && (
                <button
                  className="border rounded-sm p-2 hover:text-red-600"
                  onClick={handleResetFilter}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-9 bg-white p-4 rounded-lg shadow">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <h2 className="text-xl font-semibold">
                {categoryname || keyword || "Tất Cả"}
              </h2>
              <div className="flex flex-wrap mt-2 md:mt-0 text-xs md:text-base gap-2">
                {menuSort.map((item, i) => (
                  <button
                    className={`border px-3 py-1 rounded ${
                      sortBy === item.sortBy ? "bg-green-500 text-white" : ""
                    }`}
                    key={i}
                    onClick={() => {
                      setSortBy(item.sortBy);
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map((product, i) => (
                <Item key={`shopitem${i}`} item={product} sortBy={sortBy} />
              ))}
            </div>

            {products.length <= 0 && (
              <div className="flex justify-center items-center h-[300px]">
                <Empty description="Không có sản phẩm nào được tìm thấy" />
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="mt-4 flex justify-center items-center">
                <Pagination
                  current={currentPage}
                  total={totalItems}
                  pageSize={limit}
                  onChange={handlePageChange}
                  showSizeChanger={true}
                  pageSizeOptions={["3", "6", "9", "12", "15"]}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      <FullScreenLoader visible={isLoading} tip="Đang tải sản phẩm..." />
    </>
  );
};

export default Shop;



const Item = ({item,sortBy}) => {

  const rating = item.rating_avg || 0; 
  const ratingStars = Math.round(rating); 

  const variants = item.variants;
  const totalSold = variants.reduce((total, item) => total + item.sold_quantity, 0);

  const [variantsSorted, setVariantsSorted] = useState([]);

const [currentVariant, setCurrentVariant] = useState(variants[0]);

useEffect(() => {
  if (variants.length > 0) {
    const sortedVariants = [...variants].sort((a, b) => {
      const priceA = a.promotional_price ?? a.price;
      const priceB = b.promotional_price ?? b.price;
      if (sortBy === "max_price") {
        return priceB - priceA;
      } else if(sortBy === "min_price") {
        return priceA - priceB;
      }
      return 0; 
    });
    setVariantsSorted(sortedVariants); 
    setCurrentVariant(sortedVariants[0]); 
  }else{
    setVariantsSorted(variants); 
    setCurrentVariant(variants[0]); 
  }
}, [variants,sortBy]);

const price = currentVariant.promotional_price || currentVariant.price; 
const price_delete = currentVariant.promotional_price ? currentVariant.price : null; 

  const slug = toSlug(item.product_name);
  const changeLink = `/product/${item.id}/${slug}`;

    return (
      <div className="p-0">
        <div className="max-w-full bg-stone-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <Link to={changeLink} className="flex justify-center">
            <img
              src={`${baseUrlImg}${item.avatar}`}
              alt="Soy pH-Balanced Hydrating Face Wash Jumbo"
              className="w-full aspect-square object-cover"
            />
          </Link>
          <div className="p-3">

            <div className="flex justify-between items-center">
            <p className="text-[#ff6600] text-base font-medium"> { formatCurrency(price)} </p>
            {price_delete && (
              <p className="text-gray-400 text-base font-medium line-through">
                { formatCurrency(price_delete) }
              </p>
            )}
            </div>

            <Link to={changeLink} className="text-gray-800 text-sm md:text-base font-serif font-medium block">
              {item.product_name}
            </Link>

            <div className="flex items-center mb-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 fill-current ${
                      i < ratingStars ? "text-yellow-500" : "text-gray-300"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 text-sm ml-2">({totalSold})</span>
            </div>

            <div className="text-xs md:text-sm grid grid-cols-2 md:grid-cols-3 gap-2">
              {variantsSorted.map((variant, i) => (
                <button
                  className={`block p-1 border hover:bg-gray-300 ${
                    currentVariant.id === variant.id ? "bg-gray-300" : ""
                  }`}
                  key={`shopitemvariant${i}`}
                  onClick={() => setCurrentVariant(variant)}
                >
                  {variant.size}
                </button>
              ))}
            </div>

            <button className="mt-3 flex bg-black text-white hover:bg-yellow-500 w-full justify-center py-2">
              <span className="font-normal md:font-medium inline-block text-sm md:text-base">
                Thêm Giỏ hàng
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };
  