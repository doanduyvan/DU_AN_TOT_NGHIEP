import { Outlet } from "react-router-dom";
import Header from "../components/header/header";

export const LayoutOutletUser = () => {
    return (
        <div>
            <Header />
            <Outlet />
            
        </div>
    );
}