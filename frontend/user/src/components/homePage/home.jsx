import Banners from "./banners";
import CategorySection from "./category/category";
import HomeSection7 from "./homeSection7";
import HomeSection8 from "./homeSection8";
import ProductCarousel from "./productCarousel";

const Home = () => {
  return (
    <>
      {/* component 1 */}
      <div className="swapper">
        <div className="flex flex-col md:flex-row w-full">
          {/* Left Content Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-stone-900 mb-3 pt-[80px] md:pt-0">
              Clean Beauty <br className="hidden md:block" />
              Made Easy
            </h1>

            <p className="text-sm md:text-base text-stone-700 mb-6 max-w-md">
              Discover the best deals on the largest platform for clean beauty.
            </p>

            <div>
              <button className="bg-stone-900 text-white px-6 py-2 uppercase text-xs md:text-sm font-medium hover:bg-stone-800 transition-colors duration-300">
                Shop Now
              </button>
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

      {/* component 3 */}
      <div className="swapper mt-5">
        <ProductCarousel />
      </div>

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
                Beauty You Want.
                <br /> Deals You Love.
              </h2>
              <p className="text-gray-700 mb-6">
                We’ll always bring you the best prices for your beauty
                favorites. Explore our site to discover clean beauty
                alternatives for all your needs and budgets.
              </p>
              <button className="bg-black text-white px-6 py-3 font-semibold rounded hover:bg-gray-800">
                SHOP NOW
              </button>
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
                You Spend, You Earn
              </h2>
              <p className="text-gray-700 mb-6">
                Ultimate Rewards. Sign in or join now to earn points with every
                purchase.
              </p>
              <button className="bg-black text-white px-6 py-3 font-semibold rounded hover:bg-gray-800">
                Join Now
              </button>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0 flex justify-center">
              <img
                src="public/images/home/t2.png"
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
