import React, { useEffect, useState } from "react";
import { Link,useParams } from "react-router-dom";
import AxiosUser from "../../../utils/axios_user";

const urlCategory = "/customer/news/categorynews";
const baseUrlImg = import.meta.env.VITE_URL_IMG;

function Sidebar() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(()=> {
    const fetchCategories = async () => {
      try {
        const response = await AxiosUser.get(urlCategory);
        const data = response.categories;

        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  },[])

  

    return (
      <>
        <aside className="md:col-span-12 bg-white p-4 rounded shadow h-fit">
          <BoxItem data={categories} />
          {/* <BoxY data={categories} /> */}
        </aside>
      </>
    );
}

export default Sidebar;

const BoxItem = ({data}) => {
  const { idcategorynews } = useParams();


  return (
    <>
      <h2 className="text-lg font-semibold mb-4 text-center">Danh mục tin</h2>
      <div className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto">
          {data.map((cat, index) => (
            <div key={`category${index}`} className="border p-2 w-40">
              <Link to={`/news/${cat.id}`} className={`flex flex-col justify-center items-center`}>
                <img className="w-full object-cover" src={baseUrlImg + cat.img} alt="" />
                <p className="mt-1">{cat.category_news_name}</p>
              </Link>
            </div>
          ))}
      </div>
    </>
  )

}

const BoxY = ({data}) => {
  const { idcategorynews } = useParams();

  return (
    <>
    <h2 className="text-lg font-semibold mb-4">Danh mục tin</h2>
    <ul className="space-y-1 text-sm text-gray-700 max-h-[150px] md:max-h-[680px] overflow-y-auto">
    <li className="cursor-pointer">
      <Link to={`/news`} className={`block hover:bg-gray-300 pl-2 py-1 ${!idcategorynews && "bg-gray-300"}`}>
        Tất cả
      </Link>
    </li>
    {data.map((cat, index) => (
      <li
        key={`ctgr1${index}`}
        className="cursor-pointer"
      >
        <Link to={`/news/${cat.id}`} className={`block hover:bg-gray-300 pl-2 py-1 ${idcategorynews == cat.id ? 'bg-gray-300' : ''}`}>{cat.category_news_name}</Link>
      </li>
    ))}
  </ul>
  </>
  )
}