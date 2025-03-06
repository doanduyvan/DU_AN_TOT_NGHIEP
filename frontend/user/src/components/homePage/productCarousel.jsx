import React, { useState, useEffect } from "react";
import { Carousel, Grid } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ProductCard from "./productCard";

// Ant Design breakpoints
const { useBreakpoint } = Grid;

const ProductCarousel = () => {
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

  const carouselRef = React.useRef();

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
      height: "1px",
      background: "#e8e8e8",
      width: "100%",
      marginTop: "32px",
    },
  };

  return (
    <>
      <div className="py-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Shop Our New Beauty Products
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Explore the latest clean beauty essentials.
        </p>
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
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </Carousel>

        {/* Divider */}
        <div style={styles.divider}></div>
      </div>
    </>
  );
};

export default ProductCarousel;
