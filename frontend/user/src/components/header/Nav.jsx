import Cart from "./cart";
import Info from "./info";
import Menu from "./menu";
import Search from "./search";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
    const location = useLocation();
    const [isOpen,setIsOpen] = useState(false);
    useEffect(() => {
      // Ẩn menu khi vào trang "/login"
      // if (location.pathname === "/login") {
      //   setIsOpen(false);
      // } else {
      //   setIsOpen(true);
      // }
      setIsOpen(false);
  }, [location.pathname]);

    return (
      <nav className="flex items-center lg:justify-between bg-white shadow-md px-4 py-2 bg-p-3 header-nav">
        <button className="lg:hidden pr-3" onClick={()=> setIsOpen(isOpen=> !isOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>

        <Menu isOpen={isOpen} setIsOpen={setIsOpen}/>

        <div className="flex-1 lg:flex-none logo-primary">
          <a href="" className="font-bold text-2xl text-gray-900">Mes Skin</a>
        </div>

        <div className="flex items-stretch gap-3">

            <Search />

            <Cart />

            <Info />
        </div>
      </nav>
    );
  };

  export default Navbar;