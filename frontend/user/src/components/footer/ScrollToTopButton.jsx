import React, { useEffect, useState } from "react";
import { UpOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

const ScrollToTopButton = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

 // mỗi lần chuyển trang thì scroll về đầu trang
  useEffect(() => {
    scrollToTop();
  }, [location.pathname]);

  return visible ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-[80px] right-[18px] z-[5] bg-white/50 border text-white p-3 rounded-full shadow-lg hover:bg-white transition size-12"
      title="Lên đầu trang"
    >
      <UpOutlined style={{ fontSize: 20, color: "black" }} />
    </button>
  ) : null;
};

export default ScrollToTopButton;
