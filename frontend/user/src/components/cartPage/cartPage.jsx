import { useState } from "react";
import { Button, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useUserContext } from "../../context/user/userContext";
import { Link } from "react-router-dom";
import { formatCurrency, toSlug } from "../../utils/helpers";
import { FullScreenLoader } from "../../utils/helpersjsx";
import { useNavigate } from "react-router-dom";


const baseUrlImg = import.meta.env.VITE_URL_IMG;

const CartPage = () => {
  const navigate = useNavigate();
  const {cartItems, addToCart, removeFromCart, decreaseQty, loadingCartContext, onToCheckout} = useUserContext();

  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState([]);

  const handleQuantityChange = async (product_id, variant_id, delta) => {
    if (loadingItems.includes(variant_id)) return;
  
    const currentItem = cartItems.find(item => item.variant_id === variant_id);
    if (!currentItem) return;
  
    if (delta === -1 && currentItem.qty <= 1) return; // Không cho giảm dưới 1
  
    setLoadingItems(prev => [...prev, variant_id]);
    setLoading(true);
    if (delta === 1) {
      await addToCart(product_id, variant_id);
    } else if (delta === -1) {
      await decreaseQty(variant_id);
    }
    setLoading(false);
    setLoadingItems(prev => prev.filter(id => id !== variant_id));
  };
  

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);



  return (
    <>
      <div className="pt-[90px] pb-8 px-2">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-1">Giỏ hàng</h2>
          <p className="text-gray-500 mb-4">{cartItems.length} sản phẩm</p>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-400">Giỏ hàng trống.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.variant_id}
                  className="relative grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-3 border rounded-lg p-3 items-stretch"
                >
                <Link to={`/product/${item.product_id}/${toSlug(item.product_name)}`}>
                  <img
                    src={`${baseUrlImg}${item.image}`}
                    alt={item.product_name}
                    className="w-20 h-20 rounded object-cover border mx-auto sm:mx-0"
                  />
                </Link>
                  <div className="flex flex-col gap-1 w-full">
                    <Link 
                    to={`/product/${item.product_id}/${toSlug(item.product_name)}`}
                    title={item.product_name} 
                    className="font-medium text-sm sm:text-base md:line-clamp-2">
                      {item.product_name}
                    </Link>
                    <div className="flex gap-1 items-center">
                    <p className="text-xs text-gray-500">Size: {item.size}</p>
                    <div className="w-[1px] h-full bg-black"></div>
                    <p className="text-xs text-gray-500">Kho: {item.stock} </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-semibold text-sm">
                        {formatCurrency(item.price)}
                      </span>
                      {item.price_delete && (
                        <span className="text-sm line-through text-gray-400">
                          {formatCurrency(item.price_delete)}
                        </span>
                      )}
                    </div>
                    {item?.error && (
                    <p className="text-red-600 text-xs text-center">sản phẩm không đủ số lượng</p>
                    )}
                  </div>

                  <div className="flex gap-2 justify-center items-end">
                    <Button
                      size="small"
                      onClick={() => handleQuantityChange(item.product_id, item.variant_id, -1)}
                      disabled={item.qty <= 1}
                      loading={loadingItems.includes(item.variant_id)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.qty}</span>
                    <Button
                      size="small"
                      onClick={() => handleQuantityChange(item.product_id, item.variant_id, 1)}
                      disabled={item.qty >= item.stock}
                      loading={loadingItems.includes(item.variant_id)}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    icon={<CloseOutlined />}
                    type="text"
                    danger
                    onClick={() => removeFromCart(item.variant_id)}
                    className="absolute top-1 right-1"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            {/* <Button type="link" to='/'>&larr; Tiếp tục mua hàng</Button> */}
            <Link to="/shop" className="text-sm text-blue-400 hover:text-blue-500 whitespace-nowrap">&larr; Tiếp tục mua hàng</Link>
            <Button
              type="primary"
              className="bg-yellow-500 hover:!bg-yellow-600"
              disabled={cartItems.length === 0}
              loading={loading}
              onClick={onToCheckout}
            >
              Thanh toán ({formatCurrency(total)})
            </Button>
          </div>
        </div>
      </div>

      <FullScreenLoader visible={loadingCartContext} tip="Đang tải giỏ hàng..." />
    </>
  );
};

export default CartPage;
