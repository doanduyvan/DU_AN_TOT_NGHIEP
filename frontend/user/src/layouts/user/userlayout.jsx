import { Outlet } from "react-router-dom";
import Header from "../../components/header/header";

export const UserLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
            
        </div>
    );
}