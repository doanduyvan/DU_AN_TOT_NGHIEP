import React, { useEffect, useState } from "react";
import { Link,useParams } from "react-router-dom";
import AxiosUser from "../../../utils/axios_user";

const urlCategory = "/customer/news/categorynews";

function Sidebar() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { idcategorynews } = useParams();

  useEffect(()=> {
    const fetchCategories = async () => {
      try {
        const response = await AxiosUser.get(urlCategory);
        const data = response.categories;

        setCategories(data);
        console.log(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  },[])

  

    return (
      <>
        <aside className="md:col-span-3 bg-white p-4 rounded shadow h-fit">
          <h2 className="text-lg font-semibold mb-4">Danh mục tin</h2>
          <ul className="space-y-1 text-sm text-gray-700 max-h-[150px] md:max-h-[680px] overflow-y-auto">
            <li className="cursor-pointer">
              <Link to={`/news`} className={`block hover:bg-gray-300 pl-2 py-1 ${!idcategorynews && "bg-gray-300"}`}>
                Tất cả
              </Link>
            </li>
            {categories.map((cat, index) => (
              <li
                key={`ctgr1${index}`}
                className="cursor-pointer"
              >
                <Link to={`/news/${cat.id}`} className={`block hover:bg-gray-300 pl-2 py-1 ${idcategorynews == cat.id ? 'bg-gray-300' : ''}`}>{cat.category_news_name}</Link>
              </li>
            ))}
          </ul>
        </aside>
      </>
    );
}

export default Sidebar;