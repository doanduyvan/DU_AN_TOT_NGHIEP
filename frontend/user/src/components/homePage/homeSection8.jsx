const images = [
  "/images/home/cp1.png",
  "/images/home/cp2.png",
  "/images/home/cp3.png",
  "/images/home/cp4.png",
  "/images/home/cp5.png",
  "/images/home/cp6.png",
];

const HomeSection8 = () => {
  return (
    <div className="swapper">
      <div className="py-12 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/3 text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-900">
            Meet Our Community
          </h2>
          <p className="text-gray-700 mt-2 mb-4">
            Join the laBelle and share your voice with us.
          </p>
          <button className="bg-black text-white px-6 py-3 font-semibold rounded hover:bg-yellow-500">
            Follow On Instagram
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 md:w-2/3">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="Community Post"
              className="w-full object-cover rounded-lg shadow-md aspect-square"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSection8;
