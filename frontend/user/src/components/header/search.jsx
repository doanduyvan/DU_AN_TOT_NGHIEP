import { Link } from "react-router-dom";
import { useNavigate, useLocation  } from "react-router-dom";
import { useState, useEffect, useRef  } from "react";
import { Input,Spin, Empty  } from "antd";
import AxiosUser from "/src/utils/axios_user";
import { toSlug } from "/src/utils/helpers";


const baseUrlImg = import.meta.env.VITE_URL_IMG;
const urlsearchSuggest = "customer/shop/searchsuggest";

const products = [
    {
      id: 1,
      avatar: "uploads/products/CrUYAi7ihGaAzJvEn052f87xDBsvW58pgKIvoOnF.jpg",
      product_name: "sản phẩm 1",
      variants: [
        { id: 1, product_id: 1, price: "500000.00", promotional_price: "100000.00" },
        { id: 2, product_id: 1, price: "700000.00", promotional_price: "50000.00" },
        { id: 3, product_id: 1, price: "555555555.00", promotional_price: null }
      ]
    },
    {
      id: 2,
      avatar: "hinh1.jpg",
      product_name: "Sản phẩm 1",
      variants: [
        { id: 4, product_id: 2, price: "202998.16", promotional_price: null },
        { id: 5, product_id: 2, price: "239406.86", promotional_price: "178985.74" },
        { id: 6, product_id: 2, price: "243213.11", promotional_price: null }
      ]
    }
  ];


const Search = () => {

  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [keyWord, setKeyWord] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const getLowestPriceVariant = (variants) => {
    if (!variants || variants.length === 0) return null;
    if (variants.length === 1) return variants[0];

    return variants.reduce((min, current) => {
      const minPrice = min.promotional_price ? parseFloat(min.promotional_price) : parseFloat(min.price);
      const currentPrice = current.promotional_price ? parseFloat(current.promotional_price) : parseFloat(current.price);
      return currentPrice < minPrice ? current : min;
    });
  }


  const onSearch = () => {
    const trimmed = keyWord.trim();
    if (trimmed) {
      const urlSearch = `/shop?search=${encodeURIComponent(trimmed)}`;
      navigate(urlSearch);
    }
  };

  const fetchSearchResults = async (keyword) => {
    setLoading(true);
    try {
      const response = await AxiosUser.get(urlsearchSuggest, { params: { keyword } });
      const data = response?.products || [];
      const newData = data.map((product) => {
        const lowestPriceVariant = getLowestPriceVariant(product.variants);
        return {
          ...product,
          variants: lowestPriceVariant
        };
      }
      );
      setSearchResults(newData);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleInputOnChange = (e) => {
    const value = e.target.value;
    setKeyWord(value);
    // trim() và debounce để không gọi api liên tục
    // Clear timeout trước đó nếu có
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const trimmedValue = value.trim();
    if (trimmedValue === "") {
      setShowPopup(false);
      setSearchResults([]);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      fetchSearchResults(trimmedValue);
      setShowPopup(true);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
  
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setShowPopup(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    setShowPopup(false);
  },[location]);

    return (
      // thẻ này sẽ là relative để cho các thẻ con có thể sử dụng absolute
      <div
        ref={containerRef}
        className="flex items-center gap-2 border-b-[2px] relative"
      >
        <Input
          placeholder="Search..."
          value={keyWord}
          onChange={handleInputOnChange}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className=" p-2 border border-gray-300 !rounded-md !border-none !outline-none w-full focus:!border-none !shadow-none focus:!shadow-none"
          allowClear={true}
          onFocus={() => {
            if (keyWord.trim()) setShowPopup(true);
          }}
        ></Input>
        <button onClick={onSearch}>
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </button>
        <SearchSuggest
          searchResults={searchResults}
          showPopup={showPopup}
          loading={loading}
        />
      </div>
    );
}

export default Search;

const SearchSuggest = ({ searchResults, showPopup , loading }) => {

  if(!showPopup) return null;

  if (loading) return (
    <div className="fixed sm:absolute top-[60px] sm:top-full right-1/2 translate-x-1/2 sm:translate-x-0 sm:-right-1/2 w-[calc(100%-50px)] sm:w-[500px] md:w-[600px] bg-white shadow-lg border mt-2 rounded-md z-50 h-[200px] flex items-center justify-center">
      {/* dùng loading của ant để phủ khung này  */}
      <Spin
      size="large"
      tip="Đang tìm kiếm..."
    >
        <div className="w-[120px] h-full flex items-center justify-center" /> 
    </Spin>
    </div>
  );

  if (!searchResults || searchResults.length === 0) return (
    <div className="fixed sm:absolute top-[60px] sm:top-full right-1/2 translate-x-1/2 sm:translate-x-0 sm:-right-1/2 w-[calc(100%-50px)] sm:w-[500px] md:w-[600px] bg-white shadow-lg border mt-2 rounded-md z-50 h-[200px] flex items-center justify-center">
      <Empty description="Không có sản phẩm nào" image={Empty.PRESENTED_IMAGE_SIMPLE} className="w-full h-full flex flex-col items-center justify-center" />
    </div>
  );

  return (
    <div className="fixed sm:absolute top-[60px] sm:top-full right-1/2 translate-x-1/2 sm:translate-x-0 sm:-right-1/2 w-[calc(100%-50px)] sm:w-[500px] md:w-[600px] bg-white shadow-lg border mt-2 rounded-md z-50 max-h-[300px] overflow-y-auto">
      {searchResults.map((product) => (
        <Link
          to={`/product/${product.id}/${toSlug(product.product_name)}`}
          key={product.id}
          className="flex items-center gap-3 p-3 hover:bg-gray-100 transition"
        >
          <img
            src={`${baseUrlImg}/${product.avatar}`}
            alt={product.product_name}
            className="w-12 h-12 object-cover rounded"
          />
          <div className="flex flex-col">
            <span className="font-medium text-sm">{product.product_name}</span>
            <span className="text-[13px] text-gray-500">
              {product.variants.promotional_price
                ? (
                    <>
                      <span className="text-red-500 font-semibold">
                        {parseInt(product.variants.promotional_price).toLocaleString()}₫
                      </span>{" "}
                      <span className="line-through ml-1 text-gray-400">
                        {parseInt(product.variants.price).toLocaleString()}₫
                      </span>
                    </>
                  )
                : (
                    <span className="text-gray-600">
                      {parseInt(product.variants.price).toLocaleString()}₫
                    </span>
                  )}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};