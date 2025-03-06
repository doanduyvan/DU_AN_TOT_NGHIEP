
const ProductCard = () => {
  return (
    <div className='p-3'>
    <div className="max-w-full bg-stone-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="flex justify-center">
        <img 
          src="/public/images/home/p1.png" 
          alt="Soy pH-Balanced Hydrating Face Wash Jumbo" 
          className="w-full aspect-square object-cover"
        />
      </div>
      <div className="p-3">
        <h2 className="text-gray-800 text-xl font-serif font-medium mb-2">Soy pH-Balanced Hydrating Face Wash Jumbo</h2>
        
        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current text-yellow-500" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-600 text-sm ml-2">(4399)</span>
        </div>
        
        <button className="flex bg-black text-white hover:bg-yellow-500 w-full justify-between">
          <div className="py-3 px-4">
            <span className="font-medium">ADD TO CART</span>
          </div>
          <div className="py-3 px-4">
            <span className="font-bold">$9.99</span>
          </div>
        </button>

      </div>
    </div>
    </div>
  );
};

export default ProductCard;