import React, { useEffect, useState } from "react";
import { UpOutlined } from "@ant-design/icons";

const ScrollToTopButton = () => {
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

  return visible ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-[140px] right-[26px] z-[5] bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition size-12"
      title="Lên đầu trang"
    >
      <UpOutlined style={{ fontSize: 20 }} />
    </button>
  ) : null;
};

export default ScrollToTopButton;
