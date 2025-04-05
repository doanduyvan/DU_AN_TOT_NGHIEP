
const baseUrlImg = import.meta.env.VITE_URL_IMG;


const CategoryCard = ({item}) => {

  return (
    <>
      <div className="flex flex-col items-center cursor-pointer">
        <img
          src={`${baseUrlImg}${item.img}`}
          className="w-[100px] lg:w-[150px] object-cover aspect-square shadow-md border border-black"
        />
        <p className="mt-2 text-base lg:text-lg font-medium text-gray-800"> {item.category_name} </p>
      </div>
    </>
  );
};

export default CategoryCard;
