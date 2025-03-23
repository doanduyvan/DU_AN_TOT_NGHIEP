import React from "react";
import { Pagination } from "antd";
import Sidebar from "./sidebar";

const News = () => {
  const newsList = [
    {
      id: 1,
      title: "Top 5 sản phẩm dưỡng da hot nhất 2025",
      image: "https://placehold.co/600x400.png",
      date: "22/03/2025",
    },
    {
      id: 2,
      title: "Cách chọn kem chống nắng phù hợp với từng loại da",
      image: "https://placehold.co/600x400.png",
      date: "20/03/2025",
    },
    {
      id: 3,
      title: "5 bước chăm sóc da cơ bản cho người mới bắt đầu",
      image: "https://placehold.co/600x400.png",
      date: "18/03/2025",
    },
  ];


  return (
    <>
    <div className="pt-[70px]"></div>
    <div className="swapper mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-12 gap-2">
      {/* Sidebar */}
        <Sidebar />

      {/* News content */}
      <main className="md:col-span-9 bg-white p-4 rounded shadow h-fit">
        <h1 className="text-2xl font-bold mb-6">Tất cả</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {newsList.map((news) => (
            <div key={news.id} className="bg-white rounded shadow hover:shadow-md transition overflow-hidden">
              <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">{news.date}</p>
                <h2 className="text-base font-semibold mb-2">{news.title}</h2>
                <button className="text-blue-500 hover:underline text-sm">Xem thêm</button>
              </div>
            </div>
          ))}
        </div>
                    {/* Pagination */}
            <div className="mt-6 flex justify-center items-center">
              <Pagination defaultCurrent={1} total={80} />
            </div>
      </main>
    </div>
    </>
  );
};

export default News;