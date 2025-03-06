import { Outlet } from "react-router-dom";
import Header from "/src/components/header/header";
import Footer from "/src/components/footer/footer";

export const UserLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}