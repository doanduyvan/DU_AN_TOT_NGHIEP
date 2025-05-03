import CategoryCard from "./categoryCard";
import AxiosUser from "../../../utils/axios_user";
import { useEffect, useState } from "react";

const baseUrlImg = import.meta.env.VITE_URL_IMG;
const urlGetCategories = "/customer/home/getcategory";

const CategorySection = () => {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await AxiosUser.get(urlGetCategories);
        const data = response.categories;
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="py-5 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Danh mục sản phẩm
      </h2>
      <div className="flex gap-5 flex-wrap justify-center">
        {categories.map((item,i) => (
          <CategoryCard key={`category_${i}`} item={item} /> // Pass the item prop to CategoryCard
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
