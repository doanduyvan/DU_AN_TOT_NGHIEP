import React, { useState } from "react";
import { Tabs } from "antd";
import AccountInfo from "./accountInfo";
import ChangePassword from "./changePassword";
import AddressBook from "./addressBook";
import MyOrders from "./myOders";

const { TabPane } = Tabs;

const Profile = () => {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <>
    <div className="pt-[70px]"></div>
    <div className="swapper mx-auto py-6 px-2">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="md:col-span-3 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <h3 className="mt-2 font-semibold">Chào Đoàn</h3>
            <p className="text-gray-500 text-sm">Chỉnh sửa tài khoản</p>
          </div>
          <ul className="space-y-2 cursor-pointer">
            <li className={activeTab === "1" ? "text-orange-500 font-semibold" : "text-gray-600"} onClick={() => setActiveTab("1")}>Quản lý tài khoản</li>
            <li className={activeTab === "4" ? "text-orange-500 font-semibold" : "text-gray-600"} onClick={() => setActiveTab("4")}>Đơn hàng của tôi</li>
            <li className={activeTab === "2" ? "text-orange-500 font-semibold" : "text-gray-600"} onClick={() => setActiveTab("2")}>Số địa chỉ nhận hàng</li>
            <li className={activeTab === "3" ? "text-orange-500 font-semibold" : "text-gray-600"} onClick={() => setActiveTab("3")}>Thay đổi mật khẩu</li>

          </ul>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-9 bg-white p-4 rounded-lg shadow">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Quản lý tài khoản" key="1">
                <AccountInfo />
            </TabPane>
            <TabPane tab="Đơn hàng của tôi" key="4">
                <MyOrders />
            </TabPane>
            <TabPane tab="Số địa chỉ nhận hàng" key="2">
              <AddressBook />
            </TabPane>
            <TabPane tab="Thay đổi mật khẩu" key="3">
              <ChangePassword />
            </TabPane>
          </Tabs>
        </main>
      </div>
    </div>
    </>
  );
};

export default Profile;
