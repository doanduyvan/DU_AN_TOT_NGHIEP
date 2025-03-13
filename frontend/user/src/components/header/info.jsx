import { useState } from "react";
import { useUserContext } from "/src/context/user/userContext";
import { Dropdown, Menu } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const Info = () => {
  const { user } = useUserContext();
  console.log("render info");

  if (user % 2) return LoggedIn();

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

  const menu = (
    <Menu className="w-40 shadow-lg rounded-lg">
      <Menu.Item key="profile" icon={<UserOutlined />} className="p-2">
        <a href="/profile">Profile</a>
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        className="p-2 text-red-500"
      >
        <a href="/logout">Log out</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      placement="bottomRight"
      arrow
      open={open}
      onOpenChange={setOpen}
    >
      <button className="ml-2 border p-1 rounded-md">
        <img
          src="/images/home/avatar.jpg"
          className="size-8 object-cover aspect-square"
          alt=""
        />
      </button>
    </Dropdown>
  );
};
