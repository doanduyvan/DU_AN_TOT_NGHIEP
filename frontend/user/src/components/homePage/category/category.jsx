import CategoryCard from "./categoryCard";

const CategorySection = () => {
  return (
    <div className="py-5 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Shop By Category
      </h2>
      <div className="flex gap-5 flex-wrap justify-center">
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
      </div>
    </div>
  );
};

export default CategorySection;
