import {formatCurrency, toSlug} from "/src/utils/helpers.js";
import { Link } from "react-router-dom";
const baseUrlImg = import.meta.env.VITE_URL_IMG;

const ProductCard = ({product}) => {

  const variant = product.cheapest_variant; 
  const rating = product.rating_avg || 0; 
  const ratingStars = Math.round(rating); 
  const price = variant.promotional_price || variant.price; 
  const price_delete = variant.promotional_price ? variant.price : null; 

  const slug = toSlug(product.product_name);
  const changeLink = `/product/${product.id}/${slug}`;


  return (
    <div className="p-3">
      <div className="max-w-full bg-stone-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <Link to={changeLink} className="flex justify-center">
          <img
            src={`${baseUrlImg}${product.avatar}`}
            alt="Soy pH-Balanced Hydrating Face Wash Jumbo"
            className="w-full aspect-square object-cover"
          />
        </Link>
        <div className="p-3">

          <div className="flex justify-between items-center">
            <p className="text-[#ff6600] text-base font-medium"> {formatCurrency(price)} </p>
            {price_delete && (
              <p className="text-gray-400 text-base font-medium line-through">
                {formatCurrency(price_delete)}
              </p>
            )}
          </div>

          <Link to={changeLink} className="text-gray-800 text-xl font-serif font-medium mb-2">
            {product.product_name}
          </Link>

          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 fill-current ${
                    i < ratingStars ? "text-yellow-500" : "text-gray-300"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 text-sm ml-2">({product.total_sold})</span>
          </div>

          {/* <button className="flex bg-black text-white hover:bg-yellow-500 w-full justify-between">
            <div className="py-3 px-4">
              <span className="font-medium">ADD TO CART</span>
            </div>
            <div className="py-3 px-4">
              <span className="font-bold">$9.99</span>
            </div>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;