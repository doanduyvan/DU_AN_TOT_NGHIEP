import Banners from "./banners";
import CategorySection from "./category/category";
import HomeSection7 from "./homeSection7";
import HomeSection8 from "./homeSection8";
import ProductCarousel from "./productCarousel";
import axios from "axios";
import { useEffect, useState } from "react";
import  CarouselProducts from "/src/components/carouselproduct/carouselproduct";
import AxiosUser from "../../utils/axios_user";
import { Link } from "react-router-dom";

// const baseUrl = import.meta.env.VITE_API_URL;
const urlGetNewProducts = `customer/home/getnewproducts`;
const urlGetBestSellers = `customer/home/getbestsellingproducts`;


const Home = () => {

  const [newProducts, setNewProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  // lấy sản phẩm mới nhất
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AxiosUser.get(urlGetNewProducts);
        const data = response.newProducts;
        if(!data) return;
        setNewProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

    // lấy sản phẩm bán chạy nhất
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await AxiosUser.get(urlGetBestSellers);
          const data = response.bestSellingProducts;
          if(!data) return;
          setBestSellers(data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      fetchProducts();
    }, []);

  return (
    <>
      {/* component 1 */}
      <div className="swapper">
        <div className="flex flex-col md:flex-row w-full">
          {/* Left Content Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <h1 className="md:mt-10 lg:mt-0 text-2xl md:text-3xl lg:text-4xl font-sans font-bold text-stone-900 mb-3 pt-[80px] md:pt-0">
              Vẻ đẹp thuần khiết
              <br className="hidden md:block" />
              Dễ dàng hơn bao giờ hết
            </h1>

            <p className="text-sm md:text-base text-stone-700 mb-6 max-w-md">
              Khám phá ưu đãi tốt nhất tại nền tảng mỹ phẩm sạch hàng đầu.
            </p>

            <div>
              <Link to="/shop">
                <button className="bg-stone-900 text-white px-6 py-2 uppercase text-xs md:text-sm font-medium hover:bg-stone-800 transition-colors duration-300">
                  MUA NGAY
                </button>
              </Link>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="w-full md:w-1/2 h-56 md:h-auto overflow-hidden bg-stone-200">
            <img
              src="/images/home/img1.png"
              alt="Hand holding a beauty product with wooden cap"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* component 2 */}
      <div className="swapper mt-5">
        <Banners />
      </div>

      {/* 10 Sản phẩm mới */}
      <div className="swapper mt-5">
        <CarouselProducts
          products={newProducts}
          nameSection={"Sản phẩm mới nhất"}
        />
      </div>

      {/* 10 Sản phẩm bán chạy */}
      <div className="swapper mt-5">
        <CarouselProducts
          products={bestSellers}
          nameSection={"Sản phẩm bán chạy nhất"}
        />
      </div>

      {/* component 3 */}
      {/* <div className="swapper mt-5">
        <ProductCarousel products={newProducts} />
      </div> */}

      {/* component 4 */}

      <div className="swapper mt-5">
        <CategorySection />
      </div>

      {/* section 5 */}

      <div className="bg-p-2">
        <div className="swapper mt-5">
          <div className="py-12 px-6 md:px-20 flex flex-col md:flex-row items-center justify-center">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sản phẩm bạn yêu thích. <br /> Ưu đãi bạn mong đợi.
              </h2>
              <p className="text-gray-700 mb-6">
                Chúng tôi luôn mang đến mức giá tốt nhất cho các sản phẩm làm
                đẹp yêu thích của bạn. Khám phá các lựa chọn mỹ phẩm sạch phù
                hợp với mọi nhu cầu và ngân sách.
              </p>
              <Link to="/shop">
                <button className="bg-black text-white px-6 py-3 font-semibold rounded hover:bg-gray-800">
                  MUA NGAY
                </button>
              </Link>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
              <img
                src="/images/home/t1.png"
                alt="Beauty Deals"
                className="w-full aspect-square object-cover max-w-md rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* section 6 */}

      <div className="mt-10 bg-[#F5F0EB]">
        <div className="swapper">
          <div className="flex flex-col md:flex-row items-center justify-center p-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Mua sắm nhiều – Ưu đãi lớn
              </h2>
              <p className="text-gray-700 mb-6">
                Mở tài khoản ngay hôm nay để trải nghiệm mua sắm nhanh chóng và
                tiện lợi hơn.
              </p>
              <button className="bg-black text-white px-6 py-3 font-semibold rounded hover:bg-gray-800">
                Tham gia ngay
              </button>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
              <img
                src="/images/home/t2.png"
                alt="Ultimate Rewards"
                className="w-full max-w-md object-cover aspect-[4/3] shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
      {/* section 7 */}
      <div>
        <HomeSection7 />
      </div>

      {/* section 8 */}
      <div className="bg-p-2">
        <HomeSection8 />
      </div>
    </>
  );
};

export default Home;
