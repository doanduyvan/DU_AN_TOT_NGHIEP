import { Dropdown, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Cart = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(false);
    navigate("/cart");
  };

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Lavazza Coffee Blends", price: 329.0, img: "/images/home/img1.png" },
    { id: 2, name: "Coffee Beans Espresso", price: 39.99, img: "/images/home/img1.png" },
    { id: 3, name: "Qualità Oro Mountain", price: 47.0, img: "/images/home/img1.png" },
  ]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  const menu = (
    <div className="w-96 bg-white shadow-lg rounded-lg p-4 max-w-xs min-w-[250px] sm:w-96">
      <div className="flex justify-between items-center border-b pb-2">
        <p className="font-semibold">You have {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
        <button className="text-blue-500 text-sm" onClick={handleOpen}>
          See All
        </button>
      </div>

      <div className="mt-2 space-y-3 max-h-72 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <img src={item.img} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t pt-3">
        <p className="flex justify-between font-bold text-lg">
          <span>Total Price:</span> <span>${subtotal.toFixed(2)}</span>
        </p>
      </div>

      <Button type="primary" className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500">
        Check Out All
      </Button>
    </div>
  );

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      arrow
      open={open}
      onOpenChange={setOpen}
      dropdownRender={() => menu}
    >
      <button className="relative border rounded-md p-2">
        <span className="absolute top-[-5px] right-[-5px] bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {cartItems.length}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </button>
    </Dropdown>
  );
};

export default Cart;