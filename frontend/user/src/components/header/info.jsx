import { useState,useRef  } from "react";
import { useUserContext } from "/src/context/user/userContext";
import { Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/authcontext';
import { AuthService } from '../../services/api-auth';
import { notification, message } from "antd";
import { urlAvatar } from "/src/utils/helpers";

const baseUrlImg = import.meta.env.VITE_URL_IMG;

const Info = () => {
    const { isLoggedIn } = useUserContext();

    // const { currentUser } = useAuth();
    if (isLoggedIn) return <LoggedIn />;

    return (
        <button className="ml-2 text-gray-700 hover:text-black border p-1 rounded-md">
            <NavLink to='/login'>
                <DefaultAvatar />
            </NavLink>
        </button>
    );
};

export default Info;

const LoggedIn = () => {
    const { user,setUser,setIsLoggedIn } = useUserContext();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { currentUser, setCurrentUser, setPermissions } = useAuth();

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            setCurrentUser(null);
            setUser(null);
            setPermissions([]);
            setIsLoggedIn(false);
            navigate('/');
            message.success("Đăng xuất thành công");
        } catch (error) {
            console.log(error);
        }
    }
    const menuProps = {
        items: [
            {
                key: "profile",
                label: <Link to="/profile">{(user) ? user.fullname : '' }</Link>,
                icon: <UserOutlined />,
            },
            {
                key: "logout",
                label: <Link onClick={handleLogout} className="text-red-500">Log out</Link>,
                icon: <LogoutOutlined />,
            },
        ],
    };

    // const avatar = user.avatar ? baseUrlImg + user.avatar : null;
    const avatar = urlAvatar(user.avatar);

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
          {avatar ? (
            <img
              src={avatar}
              className="size-8 object-cover aspect-square"
              alt="Avatar"
            />
          ) : (
            <DefaultAvatar />
          )}
        </button>
      </Dropdown>
    );
};

const DefaultAvatar = () => {
    return (
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
    )
}