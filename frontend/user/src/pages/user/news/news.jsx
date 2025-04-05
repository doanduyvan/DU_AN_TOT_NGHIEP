import React, { useState, useEffect} from "react";
import { Pagination, Empty } from "antd";
import Sidebar from "./sidebar";
import { useParams, useNavigate } from "react-router-dom";
import AxiosUser from "../../../utils/axios_user";
import { FullScreenLoader } from "../../../utils/helpersjsx";


const urlGetNews = "/customer/news/getnews";
const baseUrlImg = import.meta.env.VITE_URL_IMG;


const News = () => {

  const navigate = useNavigate();
  // lấy idcategorynews từ url
  const { idcategorynews } = useParams();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  // phân trang 
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // Số lượng tin tức trên mỗi trang
  const [totalItems, setTotalItems] = useState(0); // Tổng số tin tức

  const [categoryName, setCategoryName] = useState("Tất cả");

  useEffect(()=> {
    const fetchNews = async (params) => {
      try {
        setLoading(true);
        const response = await AxiosUser.get(urlGetNews, {params: params});
        setNews(response.data);
        setTotalItems(response.total); 
        setCategoryName(response.category_name);
      } catch (error) {
        console.error("Error fetching news:", error);
      }finally{
        setLoading(false);
      }
    };

    const params = {};
    params.page = currentPage;
    params.per_page = pageSize;
    if(idcategorynews){
      if(isNaN(idcategorynews)){
        navigate("/news");
        return;
      }
      params.category_news_id = idcategorynews;
    }
    fetchNews(params);
  },[idcategorynews, currentPage, pageSize, navigate])

  useEffect(()=>{
    setCurrentPage(1);
  },[idcategorynews,pageSize])

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  }

  return (
    <>
      <div className="pt-[70px]"></div>
      <div className="swapper mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-12 gap-2">
        {/* Sidebar */}
        <Sidebar />

        {/* News content */}
        <main className="md:col-span-9 bg-white p-4 rounded shadow h-fit">
          <h1 className="text-2xl font-bold mb-6"> {categoryName} </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((news, i) => (
              <div
                key={`news1${i}`}
                className="bg-white rounded shadow hover:shadow-md transition overflow-hidden"
              >
                <img
                  src={baseUrlImg + news.avatar}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    {news.created_at}
                  </p>
                  <h2 className="text-base font-semibold mb-2">{news.title}</h2>
                  <button className="text-blue-500 hover:underline text-sm">
                    Xem thêm
                  </button>
                </div>
              </div>
            ))}
          </div>

          {news.length <= 0 && (
            <div className="flex justify-center items-center">
              <Empty description="Không có tin tức nào" />
            </div>
          )}

          {/* Pagination */}
          {news.length > 0 && (
            <div className="mt-6 flex justify-center items-center">
              <Pagination
                current={currentPage}
                total={totalItems}
                pageSize={pageSize}
                showSizeChanger={true}
                pageSizeOptions={["3", "6", "9", "12", "15"]}
                onChange={handlePageChange}
              />
            </div>
          )}
        </main>
      </div>
      <FullScreenLoader visible={loading} tip="Đang tải tin tức..." />
    </>
  );
};

export default News;