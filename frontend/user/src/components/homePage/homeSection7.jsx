import React, {useState, useEffect} from "react";
import AxiosUser from "../../utils/axios_user";
import { Link } from "react-router-dom";
import { toSlug,formatTime } from "../../utils/helpers";

const urlGet3News = "/customer/home/get3news";
const baseUrlImg = import.meta.env.VITE_URL_IMG;

const HomeSection7 = () => {

 const [news, setNews] = useState([]);

 useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await AxiosUser.get(urlGet3News);
        const data = response.news;
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
  
    fetchNews();
 },[])

 if(news.length === 0) return null;

  return (
    <div className="bg-[#FAF3EB] py-12 text-center">
      <h2 className="text-3xl font-bold text-gray-900">
      Đọc những bài viết mới nhất của chúng tôi
      </h2>
      <p className="text-gray-700 mt-2 mb-6">
      Khám phá những hoạt động mới tại MesSkin Các bài viết được chia sẻ bởi đội ngũ và khách mời của chúng tôi.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
        {news.map((item, i) => (
          <Item key={`homenews${i}`} data={item} />
        ))}
      </div>
      <div className="mt-6">
        <Link to="/news" className="text-gray-900 font-semibold hover:underline">
          Xem tất cả tin tức →
        </Link>
      </div>
    </div>
  );
};

export default HomeSection7;

const Item = ({data}) => {

  const linkChange = `/news/${data.id}/${toSlug(data.title)}`;

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-md">
      <Link to={linkChange}>
        <img src={baseUrlImg + data.avatar} className="w-full h-56 object-cover" />
      </Link>
      <div className="p-4">
        <Link
          title={data.title}
          to={linkChange}
          className="block text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-500"
        >
          {data.title}
        </Link>
        <Link
          to={linkChange}
          className={`block mt-4 px-4 py-2 text-center font-semibold bg-black hover:bg-yellow-500 text-white`}
        >
          Đọc thêm
        </Link>
      </div>
    </div>
  );
};
