import { Dropdown, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import {  useNavigate, Link,useLocation  } from "react-router-dom";
import { useUserContext } from "../../context/user/userContext";
import { message } from "antd";
import { formatCurrency, toSlug } from "../../utils/helpers";

const baseUrlImg = import.meta.env.VITE_URL_IMG;

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {cart,cartItems,onToCheckout} = useUserContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleOpen = () => {
    setOpen(false);
    navigate("/cart");
  };


  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const menu = (
    <div className="w-96 bg-white shadow-lg rounded-lg p-4 max-w-xs min-w-[250px] sm:w-96">
      <div className="flex justify-between items-center border-b pb-2">
        <p className="font-semibold">Bạn có {cartItems.length} sản phẩm</p>
        <button className="text-blue-500 text-sm" onClick={handleOpen}>
          Xem giỏ hàng
        </button>
      </div>

      <div className="mt-2 space-y-3 max-h-72 overflow-y-auto">
        {cartItems.map((item,i) => (
          <div key={`cart1${i}`} className="flex items-center space-x-3">
            <Link to={`product/${item.product_id}/${toSlug(item.product_name)}`} className="block size-16">
            <img src={baseUrlImg + item.image} className="w-16 h-16 rounded-lg object-cover" />
            </Link>
            <div className="flex-1">
              <Link to={`product/${item.product_id}/${toSlug(item.product_name)}`} className="font-medium line-clamp-2" title={item.product_name}>{item.product_name}</Link>
              <div className="flex gap-1 items-center">
              <p className="text-gray-500 text-sm">Dung tích: {item.size}</p>
              <div className="w-[1px] h-3 bg-gray-500"></div>
              <p className="text-gray-500 text-sm">Số lượng: {item.qty}</p>
              </div>
              <div className="flex items-center gap-1">
              <p className="text-red-600 font-semibold text-sm">{formatCurrency(item.price)}</p>
              {item.price_delete && (
                <p className="text-sm line-through text-gray-400">
                  {formatCurrency(item.price_delete)}
                </p>
              )}
              </div>
            </div>
          </div>
        ))}

      </div>

      <div className="mt-4 border-t pt-3">
        <p className="flex justify-between font-bold text-lg">
          <span>Tổng tiền:</span> <span>{formatCurrency(subtotal)}</span>
        </p>
      </div>

      <Button type="primary" className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500" onClick={onToCheckout}>
        Thanh toán
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
      dropdownRender={() => (cart.length === 0 ? <EmptyCart /> : menu)}
    >
      <button className="relative border rounded-md p-2" id="cart-icon">
        <span className="absolute top-[-5px] right-[-5px] bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {cart.length}
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


const EmptyCart = () => {
  return (
    <>
      <div className="bg-gray-100 p-4 rounded">
        Giỏ hàng Trống
      </div>
    </>
  )
}