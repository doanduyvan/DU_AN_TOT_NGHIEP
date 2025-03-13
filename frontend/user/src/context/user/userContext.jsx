import { createContext, useState, useContext } from "react";

// Tạo Context chung
const AppContext = createContext();
export const UserContext = ({ children }) => {
  // Quản lý trạng thái đăng nhập
  const [user, setUser] = useState(1);

  // Quản lý trạng thái giỏ hàng (ví dụ khác)
  const [cart, setCart] = useState([]);

  // Hàm đăng nhập
  const login = (userData) => {
    setUser(userData);
    // localStorage.setItem("user", JSON.stringify(userData)); 
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Hàm thêm vào giỏ hàng (ví dụ khác)
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const useExport = { user, login, logout, cart, addToCart, setUser }

  return (
    <AppContext.Provider value={useExport}>
      {children}
    </AppContext.Provider>
  );
};

// Hook để truy cập context
export const useUserContext = () => useContext(AppContext);
