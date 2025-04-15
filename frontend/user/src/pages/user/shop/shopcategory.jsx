import { useState, useEffect, use } from "react";
import AxiosUser from "../../../utils/axios_user";
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';

const urlCategory = "/customer/shop/getcategory";

const ShopCategory = () => {
    
    const [categories, setCategories] = useState([]);

      const { idcategory } = useParams();

    
    useEffect(() => {
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
    }, []);

  return (
    <>
        <ul className="mt-3 max-h-[100px] md:max-h-[300px] overflow-y-auto text-black">
              <li className={`text-gray-600 hover:bg-gray-300 pl-3 py-1 ${!idcategory && "bg-gray-300"} `}>
                <Link to={`/shop`} className="text-gray-600 block"> Tất cả </Link>
              </li>
                {categories.map((category,i) => (
                <li key={`category1${i}`} className={`text-gray-600 pl-3 hover:bg-gray-300 py-1 mt-1 ${category.id == idcategory ? "bg-gray-300" : ""} `}>
                    <Link to={`/shop/${category.category_name}/${category.id}`} className="text-gray-600 block" key={`shocategory${i}`} > {category.category_name} </Link>
                </li>
                    
                ))}
        </ul>
    </>
  );
}

export default ShopCategory;