import { Outlet } from "react-router-dom";
import Header from "/src/components/header/header";
import Footer from "/src/components/footer/footer";
import { UserContext } from "/src/context/user/userContext";
import { FullScreenLoader } from "/src/utils/helpersjsx";
import { useUserContext } from "/src/context/user/userContext";

export const UserLayout = () => {

  return (
    <div>
      <UserContext>
        <Layout/>
      </UserContext>
    </div>
  );
};

const Layout = () => {

  const { isLoggedIn } = useUserContext();
  
  if (isLoggedIn === null) {
    return(<Loading />);
  }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

const Loading = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-white">
      <FullScreenLoader visible={true} />
    </div>
  );
}

