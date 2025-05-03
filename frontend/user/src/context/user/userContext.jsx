import { createContext, useState, useContext, useEffect } from "react";
import AxiosUser from "../../utils/axios_user";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

const urlGetCart = "customer/cart/getcart";
const urlCheckQtyVariant = "customer/cart/checkqtyproductvariant/";
const maxQtyInCart = 20;

export const UserContext = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const [cart, setCart] = useState([]); // Chỉ chứa id & qty
  const [cartItems, setCartItems] = useState([]); // Chi tiết từ server
  const [forceReloadCart, setForceReloadCart] = useState(false); // Để reload lại cart khi cần thiết
  const [loadingCartContext, setLoadingCartContext] = useState(false); // Để hiển thị loading khi cần thiết

  // Kiểm tra đăng nhập
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await AxiosUser.get("/me", { useToken: true });
        setUser(res.user);
        setIsLoggedIn(true);
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      }
    };
    
    const token = localStorage.getItem("token");
    if(token){
      checkLoggedIn();
    }else{
      setIsLoggedIn(false);
    }

  }, []);

  // Load cart từ localStorage khi khởi động
  useEffect(() => {
    async function firstLoadCart() {
      const cartData = localStorage.getItem("cart");
      if (cartData) {
        try {
          const parsedCart = JSON.parse(cartData);
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            setCart(parsedCart);
            await getCartItems(parsedCart);
          } else {
            localStorage.removeItem("cart");
          }
        } catch {
          localStorage.removeItem("cart");
        }
      }
    }
    firstLoadCart();
  }, [forceReloadCart]);

  // Lưu lại local mỗi lần cart thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Gọi server để lấy thông tin chi tiết giỏ hàng
  const getCartItems = async (cartLocal = cart) => {
    try {
      if (!Array.isArray(cartLocal) || cartLocal.length === 0) {
        return null;
      }
      setLoadingCartContext(true);
      const res = await AxiosUser.post(urlGetCart, { cart: cartLocal });
      if (Array.isArray(res.data)) {
        const variantIdsInServer = res.data.map(item => item.variant_id);
        const cleanedCart = cartLocal.filter(item =>
          variantIdsInServer.includes(item.variant_id)
        );

        if (cleanedCart.length !== cartLocal.length) {
          message.warning("Một số sản phẩm đã bị xóa khỏi giỏ hàng.");
          setCart(cleanedCart);
          localStorage.setItem("cart", JSON.stringify(cleanedCart));
        }

        setCartItems(res.data);
        return res.data;
      }
      message.error("Lỗi khi lấy chi tiết giỏ hàng.");
      return null;
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết giỏ hàng:", err);
      return null;
    }finally{
      setLoadingCartContext(false);
    }
  };

  // Kiểm tra tồn kho biến thể
  const checkQtyVariant = async (variant_id) => {
    try {
      const res = await AxiosUser.get(urlCheckQtyVariant + variant_id);
      return res.qty ?? null;
    } catch {
      return null;
    }
  };

  // Thêm vào giỏ hàng
  const addToCart = async (product_id, variant_id, qty = 1) => {
    const availableQty = await checkQtyVariant(variant_id);
    if (availableQty === null) {
      message.error("Lỗi khi kiểm tra số lượng sản phẩm.");
      return false;
    }
  
    const totalQtyInCartLocal = cart.reduce((sum, item) => sum + (item.variant_id === variant_id ? item.qty : 0) , 0);

    if (availableQty <= totalQtyInCartLocal) {
      message.error(`Chỉ còn ${availableQty} sản phẩm trong kho.`);
      return false;
    }
  
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalQty + qty > maxQtyInCart) {
      message.error(`Chỉ được tối đa ${maxQtyInCart} sản phẩm.`);
      return false;
    }
  
    const updated = [...cart];
    const index = updated.findIndex(i => i.variant_id === variant_id);
  
    if (index !== -1) {
      updated[index].qty += qty;
    } else {
      updated.push({ product_id, variant_id, qty });
    }
  
    setCart(updated); // cập nhật cart
    const success = await getCartItems(updated); // truyền dữ liệu mới vào
    return !!success;
  };

  // giảm số lượng sản phẩm trong giỏ hàng
  const decreaseQty = async (variant_id) => {
    const updated = [...cart];
    const index = updated.findIndex(item => item.variant_id === variant_id);
  
    if (index !== -1) {
      if (updated[index].qty > 1) {
        updated[index].qty -= 1;
      } else {
        // Nếu qty = 1 => xóa khỏi giỏ
        message.info("Sản phẩm đã bị xóa khỏi giỏ hàng.");
        return removeFromCart(variant_id);
      }
  
      setCart(updated);
     await getCartItems(updated); // cập nhật chi tiết
    }
  };
  
  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (variant_id) => {
    const updatedCart = cart.filter(item => item.variant_id !== variant_id);
    const updatedItems = cartItems.filter(item => item.variant_id !== variant_id);
    setCart(updatedCart);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    message.success("Đã xóa sản phẩm khỏi giỏ hàng.");
  };

  const onToCheckout = () => {

    if (!isLoggedIn) {
      message.error("Vui lòng đăng nhập để thanh toán.");
      return;
    }

    if (cartItems.length === 0) {
      message.error("Giỏ hàng trống.");
      return;
    }

    const checkCart = cartItems.some(item => item.stock < item.qty);
    if (checkCart) {
      message.error("Có sản phẩm không đủ số lượng trong giỏ hàng.");
      return;
    }
    navigate("/checkout");
  }


  const useExport = {
    user,
    isLoggedIn,
    setUser,
    setIsLoggedIn,
    cart,
    cartItems,
    setCart,
    setCartItems,
    addToCart,
    getCartItems,
    removeFromCart,
    decreaseQty,
    setForceReloadCart,
    loadingCartContext,
    onToCheckout
  };

  return <AppContext.Provider value={useExport}>{children}</AppContext.Provider>;
};

export const useUserContext = () => useContext(AppContext);
