import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import CommentBox from "./commentsBox";
import { useParams, useNavigate, Link } from "react-router-dom";
import AxiosUser from "../../../utils/axios_user";
import { FullScreenLoader } from "../../../utils/helpersjsx";
import { notification, Empty } from "antd";
import { toSlug } from "../../../utils/helpers";

const urlGetNews = "/customer/newsdetail/getnewsbyid/";
const urlGetNewsRelated = "/customer/newsdetail/getnewsrelated/";
const baseUrlImg = import.meta.env.VITE_URL_IMG;

const NewsDetail = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [newsRelated, setNewsRelated] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      navigate("/news");
    }

    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        const response = await AxiosUser.get(urlGetNews + id);
        const data = response.data;
        setNews(data);
      } catch (error) {
        console.error("Error fetching news detail:", error);
        if(error.status === 404){
          notification.error({
            message: "Lỗi",
            description: "Không tìm thấy bài viết này.",
          });
        }
      }finally{
        setLoading(false);
      }
    }
    fetchNewsDetail();
  }, [id, navigate]);

// lấy bài viết liên quan 

useEffect(()=> {
  const fetchNewsRelated = async () => {
    try {
      const response = await AxiosUser.get(urlGetNewsRelated + id);
      const data = response.related;
      setNewsRelated(data);
    } catch (error) {
      console.error("Error fetching news related:", error);
    }
  };
  fetchNewsRelated();
},[id])


  return (
    <>
      <div className="pt-[70px]"></div>
      <div className="swapper mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Main Content */}
       {news === null ? (
        <div className="w-full h-64 md:col-span-9 flex justify-center items-center">
          <Empty description="Không tìm thấy bài viết này." />
        </div>
       ) : (
        <>
        <div className="md:col-span-9">
        <div className="bg-white p-6 shadow rounded">
          <img
            src={ baseUrlImg + news?.avatar }
            alt="news"
            className="w-full rounded mb-4 object-cover aspect-video"
          />
          <h1 className="text-2xl font-bold mb-2"> {news?.title || "..."} </h1>
          <p className="text-sm text-gray-500 mb-4">
            {" "}
            {news?.created_at || "..."}{" "}
          </p>
          <div className="text-gray-700 leading-relaxed mb-6">
            <div>
              <div dangerouslySetInnerHTML={{ __html: news?.content }}></div>
            </div>
          </div>
        </div>
          {/* Comment Section */}
          <div className="mt-5 border-t-2">
            <CommentBox news_id={id} />
          </div>
        </div>
        <NewsRelated data={newsRelated} />
        </>
      ) }
      </div>
      <FullScreenLoader visible={loading} tip="Đang tải tin tức..." />
    </>
  );
};

export default NewsDetail;


const NewsRelated = ({ data }) => {
  return (
    <div className="md:col-span-3 bg-white p-4 rounded shadow h-fit">
      <h5 className="text-lg font-semibold mb-4">Bài viết liên quan</h5>
      <div className="flex flex-col gap-4 *:border-t *:pt-2">
        {data?.length > 0 ? (
          data.map((item, i) => (
            <Link
              key={`related-${i}`}
              to={`/news/${item.id}/${toSlug(item.title)}`}
              className="flex gap-3 group"
            >
              <img
                src={baseUrlImg + item.avatar}
                className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                alt={item.title}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 group-hover:text-blue-500 line-clamp-2">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">{item.created_at}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">Không có bài viết liên quan</p>
        )}
      </div>
    </div>
  );
};