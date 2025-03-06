
const HomeSection7 = () => {
  return (
    <div className="bg-[#FAF3EB] py-12 text-center">
      <h2 className="text-3xl font-bold text-gray-900">
        Read Our Latest Articles
      </h2>
      <p className="text-gray-700 mt-2 mb-6">
        See what weve been up to at Labelle! Blog posts are written by our team
        and guests.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
        <Item />
        <Item />
        <Item />

      </div>

      <div className="mt-6">
        <a href="#" className="text-gray-900 font-semibold hover:underline">
          View All Articles →
        </a>
      </div>
    </div>
  );
};

export default HomeSection7;

const Item = () => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-md">
      <img
        src="/public/images/home/t3.png"
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Better Global Buying Experience with Duties
        </h3>
        <a
          href=""
          className={`block mt-4 px-4 py-2 text-center font-semibold bg-black hover:bg-yellow-500 text-white`}
        >
          Read More
        </a>
      </div>
    </div>
  );
};
