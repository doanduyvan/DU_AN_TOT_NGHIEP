import React from "react";
import { Pagination } from "antd";

const Shop = () => {
  return (
    <>
      <div className="pt-[70px]"></div>
      <div className="swapper mx-auto py-6 px-2 shop">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          {/* Sidebar */}
          <input type="checkbox" id="sub-menu-shop-input" hidden />
          <aside className="md:col-span-3 bg-white p-4 rounded-lg shadow sub-menu-shop-aside max-h-[60px] md:max-h-full overflow-hidden">
            <div className="flex items-center mb-4 gap-2">
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
            <ul className="space-y-2 max-h-[100px] md:max-h-[500px] overflow-y-auto">
              <li className="text-gray-600">Tất Cả</li>
              <li className="text-gray-600">Làm Sạch Da</li>
              <li className="text-gray-600">Đặc Trị</li>
              <li className="text-gray-600">Dưỡng Ẩm</li>
              <li className="text-gray-600">Chống Nắng Da Mặt</li>
              <li className="text-gray-600">Chăm Sóc Tóc</li>
              <li className="text-gray-600">Chống Nắng Da Mặt</li>
              <li className="text-gray-600">Chống Nắng Da Mặt</li>
              <li className="text-gray-600">Chống Nắng Da Mặt</li>
              <li className="text-gray-600">Chống Nắng Da Mặt</li>
              <li className="text-gray-600">Chống Nắng Da Mặt</li>
            </ul>
            <h2 className="font-semibold text-lg mt-6 mb-2">KHOẢNG GIÁ</h2>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Từ"
                className="border p-2 w-1/2 rounded"
              />
              <input
                type="text"
                placeholder="Đến"
                className="border p-2 w-1/2 rounded"
              />
            </div>
            <button className="mt-3 w-full bg-orange-500 text-white py-2 rounded">
              Áp dụng
            </button>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-9 bg-white p-4 rounded-lg shadow">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
              <h2 className="text-xl font-semibold">Chống Nắng Da Mặt</h2>
              <div className="flex flex-wrap mt-2 md:mt-0 text-xs md:text-base gap-2">
                <button className="border px-3 py-1 rounded bg-green-500 text-white">
                  Bán chạy
                </button>
                <button className="border px-3 py-1 rounded">Mới nhất</button>
                <button className="border px-3 py-1 rounded">
                  Giá thấp đến cao
                </button>
                <button className="border px-3 py-1 rounded">
                  Giá cao đến thấp
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
              <Item />
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center items-center">
              <Pagination defaultCurrent={1} total={80} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Shop;



const Item = () => {
    return (
      <div className='p-0'>
      <div className="max-w-full bg-stone-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="flex justify-center">
          <img 
            src="/images/home/p1.png" 
            alt="Soy pH-Balanced Hydrating Face Wash Jumbo" 
            className="w-full aspect-square object-cover"
          />
        </div>
        <div className="p-3">
          <h2 className="text-gray-800 text-sm md:text-base font-serif font-medium mb-2 block">Soy pH-Balanced Hydrating Face Wash Jumbo</h2>
          
          <div className="flex items-center mb-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current text-yellow-500" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 text-sm ml-2">(4399)</span>
          </div>
              
        <div className="mb-2">
            <span className="font-bold text-orange-700">$9.99</span>
        </div>

          <button className="flex bg-black text-white hover:bg-yellow-500 w-full justify-center py-2">
              <span className="font-normal md:font-medium inline-block text-sm md:text-base">Thêm Giỏ hàng</span>
          </button>
  
        </div>
      </div>
      </div>
    );
  };
  