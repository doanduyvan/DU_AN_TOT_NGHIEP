import React, {useEffect} from "react";
import Email from "./email";
import MessengerButton from "./MessengerButton";
import ScrollToTopButton from "./ScrollToTopButton";
import { Link } from "react-router-dom";

const arrMenu = [
  {
      name: 'Trang Chủ',
      link: '/',
  },
  {
      name: 'Cửa Hàng',
      link: '/shop'
  },
  {
      name: 'Tin Tức',
      link: '/news'
  },
  {
      name: 'Giới Thiệu',
      link: '/about'
  },
  {
      name: 'Liên Hệ',
      link: '/contact'
  }
]

const Footer = () => {
  return (
    <>
    <footer className="bg-white border-t border-black">
      <div className="swapper mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
          {/* Left Column */}
          <div className="p-4 md:p-6 border-b lg:col-span-3 lg:border-b-0 border-black bg-white flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
              MesSkin
            </h2>
            <p className="mb-3 md:mb-4 text-sm">
              Đăng ký nhận bản tin của chúng tôi để nhận thông tin mới nhất về sản phẩm và ưu đãi.
            </p>
            <Email />
          </div>

          {/* Middle Column */}
          <div className="p-4 md:p-6 border-b lg:col-span-2 lg:border-b-0 md:border-l lg:border-r border-black">
            <ul className="space-y-2 md:space-y-3">
                   {arrMenu.map((item,i)=> (
                    <li key={`menu1_${i}`}>
                        <Link
                        to={item.link}
                        className="hover:underline text-sm md:text-base"
                        >
                        {item.name}
                        </Link>
                      </li>
                    ))}
    
            </ul>
          </div>

          {/* Right Column */}
          <div className="p-4 md:p-6 border-b lg:col-span-2 md:border-b-0 border-black">
            {/* Social Media Links */}
            <div className="">
              <ul className="space-y-2 md:space-y-3">
                <li className="flex items-center">
                  <span className="w-5 md:w-6 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-4 h-4 md:w-5 md:h-5"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                        ry="5"
                      ></rect>
                      <circle cx="12" cy="12" r="3"></circle>
                      <circle cx="17.5" cy="6.5" r="1.5"></circle>
                    </svg>
                  </span>
                  <a href="#" className="hover:underline text-sm md:text-base">
                    Instagram
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-5 md:w-6 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-4 h-4 md:w-5 md:h-5"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </span>
                  <a href="#" className="hover:underline text-sm md:text-base">
                    Facebook
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="w-5 md:w-6 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="w-4 h-4 md:w-5 md:h-5"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </span>
                  <a href="#" className="hover:underline text-sm md:text-base">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* FanpageFB */}
          <div className="p-4 md:p-6 md:border-l border-black lg:col-span-5">
            <div className="max-w-md w-fit mx-auto">
              <FanpageFB />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-p-2 border-t border-black">
        <div className="swapper">
          <div className="py-5 px-3">
            <p className="">©2025 MesSkin</p>
          </div>
        </div>
      </div>
    </footer>
    <MessengerButton />
    <ScrollToTopButton />

    </>
  );
};

export default Footer;


const FanpageFB = () => {
  useEffect(() => {
    // Nạp SDK Facebook nếu chưa có
    if (!window.FB) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v19.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onload = () => window.FB && window.FB.XFBML.parse();
      document.body.appendChild(script);
    } else {
      // Nếu đã có FB SDK, gọi lại để render plugin
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <div className="fb-page w-fit"
      data-href="https://www.facebook.com/profile.php?id=61575793263076"
      data-tabs=""
      data-width=""
      data-height=""
      data-small-header="false"
      data-adapt-container-width="true"
      data-hide-cover="false"
      data-show-facepile="true">
    </div>
  );
};