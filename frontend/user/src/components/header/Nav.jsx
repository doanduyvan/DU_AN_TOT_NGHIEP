import Cart from "./cart";
import Info from "./info";
import Menu from "./menu";
import Search from "./search";

const Navbar = () => {
    return (
      <nav className="flex items-center justify-between bg-white shadow-md px-4 bg-p-3">

        <Menu/>

        <div className="">
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