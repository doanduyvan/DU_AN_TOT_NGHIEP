import { Outlet } from "react-router-dom";
import Header from "../components/header/header";

export const LayoutOutlet = () => {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
}