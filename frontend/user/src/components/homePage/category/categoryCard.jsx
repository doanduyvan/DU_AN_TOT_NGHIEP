const CategoryCard = () => {
  return (
    <>
      <div className="flex flex-col items-center cursor-pointer">
        <img
          src="/public/images/home/c1.png"
          className="w-[100px] lg:w-[150px] object-cover aspect-square shadow-md border border-black"
        />
        <p className="mt-2 text-base lg:text-lg font-medium text-gray-800"> Make Up </p>
      </div>
    </>
  );
};

export default CategoryCard;
