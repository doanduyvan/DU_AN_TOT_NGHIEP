import { useState } from "react";
import { useUserContext } from "/src/context/user/userContext";
import { Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { NavLink, Link, Navigate } from "react-router-dom";
import { useAuth } from '../../contexts/authcontext';
import { AuthService } from '../../services/api-auth';

const Info = () => {
    const { currentUser } = useAuth();
    if (currentUser) return <LoggedIn />;

    return (
        <button className="ml-2 text-gray-700 hover:text-black border p-1 rounded-md">
            <NavLink to='/login'>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="size-8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                </svg>
            </NavLink>
        </button>
    );
};

export default Info;

const LoggedIn = () => {
    const [open, setOpen] = useState(false);
    const { currentUser } = useAuth();
    const handleLogout = async () => {
        try {
            await AuthService.logout();
            Navigate('/login');
        } catch (error) {
            console.log(error);
        }
    }
    const menuProps = {
        items: [
            {
                key: "profile",
                label: <Link to="/profile">{(currentUser) ? currentUser.fullname : '' }</Link>,
                icon: <UserOutlined />,
            },
            {
                key: "logout",
                label: <Link onClick={handleLogout} className="text-red-500">Log out</Link>,
                icon: <LogoutOutlined />,
            },
        ],
    };

    return (
        <Dropdown
            menu={menuProps} // Thay vì `overlay={menu}`
            trigger={["click"]}
            placement="bottomRight"
            arrow
            open={open}
            onOpenChange={setOpen}
        >
            <button className="ml-2 border p-1 rounded-md">
                <img src="/images/home/avatar.jpg" className="size-8 object-cover aspect-square" alt="Avatar" />
            </button>
        </Dropdown>
    );
};
