import { Outlet } from "react-router-dom";
import Header from "/src/components/header/header";
import Footer from "/src/components/footer/footer";
import { UserContext } from "/src/context/user/userContext";

export const UserLayout = () => {
  return (
    <div>
      <UserContext>
        <Header />
        <Outlet />
        <Footer />
      </UserContext>
    </div>
  );
};
