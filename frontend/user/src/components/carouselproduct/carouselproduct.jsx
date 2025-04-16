import React, { useState, useEffect, useRef } from "react";
import { Carousel, Grid,Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {formatCurrency, toSlug} from "/src/utils/helpers.js";
import { Link } from "react-router-dom";
import { FullScreenLoader, FlyToCart } from "/src/utils/helpersjsx";
import { useUserContext } from "/src/context/user/userContext";

const baseUrlImg = import.meta.env.VITE_URL_IMG;
const { useBreakpoint } = Grid;

const CarouselProducts = ({products,nameSection}) => {

  const flyRef = useRef();
  const [flyImage, setFlyImage] = useState('');
  const [flyStartRef, setFlyStartRef] = useState(null);

  const screens = useBreakpoint();
  const [slidesToShow, setSlidesToShow] = useState(4);

  // Update slides to show based on screen size
  useEffect(() => {
    if (screens.xxl) setSlidesToShow(4);
    else if (screens.xl) setSlidesToShow(4);
    else if (screens.lg) setSlidesToShow(3);
    else if (screens.md) setSlidesToShow(2);
    else if (screens.sm) setSlidesToShow(2);
    else setSlidesToShow(1);
  }, [screens]);

  // Sample product data

  const carouselRef = useRef();

  // Custom next/prev functions
  const handleNext = () => {
    carouselRef.current.next();
  };

  const handlePrev = () => {
    carouselRef.current.prev();
  };

  // Responsive styles with media queries
  const styles = {
    carousel: {
      maxWidth: "100%",
      margin: "0 auto",
      position: "relative",
      padding: "0 20px",
    },
    navButton: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: screens.xs ? "28px" : "36px",
      height: screens.xs ? "28px" : "36px",
      background: "#fff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      zIndex: 2,
      cursor: "pointer",
    },
    leftButton: {
      left: "15px",
    },
    rightButton: {
      right: "15px",
    },
    divider: {
      height: "0px",
      background: "#e8e8e8",
      width: "100%",
      marginTop: "32px",
    },
  };

  return (
    <>
      <div className="py-5 text-center">
        <h1 className="text-3xl md:text-3xl font-bold text-gray-900">
          {nameSection}
        </h1>
      </div>

      <div style={styles.carousel}>
        {/* Navigation buttons */}
        <div
          style={{ ...styles.navButton, ...styles.leftButton }}
          onClick={handlePrev}
        >
          <LeftOutlined />
        </div>

        <div
          style={{ ...styles.navButton, ...styles.rightButton }}
          onClick={handleNext}
        >
          <RightOutlined />
        </div>

        {/* Carousel */}
        <Carousel
          ref={carouselRef}
          dots={false}
          slidesToShow={slidesToShow}
          slidesToScroll={1}
          infinite={true}
        >
          {products.map((product, index) => (
            <Item
              key={`newProducts_${index}`}
              item={product}
              flyRef={flyRef}
              setFlyImage={setFlyImage}
              setFlyStartRef={setFlyStartRef}
            />
          ))}
        </Carousel>
        {/* Divider */}
        <div style={styles.divider}></div>
      </div>
      <FlyToCart
        ref={flyRef}
        imageSrc={`${baseUrlImg}${flyImage}`}
        startRef={flyStartRef}
        endId="cart-icon"
      />
    </>
  );
};

export default CarouselProducts;




const Item = ({item,flyRef, setFlyImage, setFlyStartRef}) => {

  const buttonRef = useRef();
  const { addToCart } = useUserContext();
  const [loadingItem, setLoadingItem] = useState(false);

  const rating = item.rating_avg || 0; 
  const ratingStars = Math.round(rating); 

  const variants = item.variants;
  const totalSold = variants.reduce((total, item) => total + item.sold_quantity, 0);


const [currentVariant, setCurrentVariant] = useState(variants[0]);

useEffect(() => {
    setCurrentVariant(variants[0]); 
}, [variants]);

const price = currentVariant.promotional_price || currentVariant.price; 
const price_delete = currentVariant.promotional_price ? currentVariant.price : null; 
const slug = toSlug(item.product_name);
const changeLink = `/product/${item.id}/${slug}`;

const handleAddToCart = async () => {
  if (loadingItem) return; 
  setFlyImage(item.avatar);
  setFlyStartRef(buttonRef);
  setLoadingItem(true);
  const check = await addToCart(item.id, currentVariant.id);
  setLoadingItem(false);
  if (!check) return;
  requestAnimationFrame(() => {
    flyRef.current?.fly();
  });
}

    return (
      <>
      <div className="p-2">
        <div className="max-w-full bg-stone-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <Link to={changeLink} className="flex justify-center">
            <img
              src={`${baseUrlImg}${item.avatar}`}
              alt="Soy pH-Balanced Hydrating Face Wash Jumbo"
              className="w-full aspect-square object-cover"
            />
          </Link>
          <div className="p-3">

            <div className="flex justify-between items-center">
            <p className="text-[#ff6600] text-base font-medium"> { formatCurrency(price)} </p>
            {price_delete && (
              <p className="text-gray-400 text-base font-medium line-through">
                { formatCurrency(price_delete) }
              </p>
            )}
            </div>

            <Link to={changeLink} className="text-gray-800 text-sm md:text-base font-serif font-medium block">
              {item.product_name}
            </Link>

            <div className="flex items-center mb-1">
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
              <span className="text-gray-600 text-sm ml-2">({totalSold})</span>
            </div>

            <div className="text-xs md:text-sm grid grid-cols-2 md:grid-cols-3 gap-2">
              {variants.map((variant, i) => (
                <button
                  className={`block p-1 border hover:bg-gray-300 ${
                    currentVariant.id === variant.id ? "bg-gray-300" : ""
                  }`}
                  key={`shopitemvariant${i}`}
                  onClick={() => setCurrentVariant(variant)}
                >
                  {variant.size}
                </button>
              ))}
            </div>

            <Button
            className="mt-3 flex bg-black !text-white hover:!bg-yellow-500 w-full justify-center py-2"
            type="text"
            ref={buttonRef}
            loading={loadingItem}
            onClick={handleAddToCart}
            >
            <span className="font-normal md:font-medium inline-block text-sm md:text-base">
                Thêm Giỏ hàng
              </span>
            </Button>
          </div>
        </div>
      </div>


      </>
    );
  };
