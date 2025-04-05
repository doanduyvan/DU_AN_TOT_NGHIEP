import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authcontext';
export const AdminSidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownStates, setDropdownStates] = useState({});
    const { permissions } = useAuth();

    const toggeSidebarMobile = () => {
        setSidebarOpen(!sidebarOpen);
    }
    const toggleArrowDown = (itemId) => {
        setDropdownStates((prevState) => ({
            ...prevState,
            [itemId]: !prevState[itemId],
        }
        ));
    }

    const Menu = [
        {
            id: "1",
            name: "Quản trị",
            link: "/admin",
            svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM15.8329 7.33748C16.0697 7.17128 16.3916 7.19926 16.5962 7.40381C16.8002 7.60784 16.8267 7.92955 16.6587 8.16418C14.479 11.2095 13.2796 12.8417 13.0607 13.0607C12.4749 13.6464 11.5251 13.6464 10.9393 13.0607C10.3536 12.4749 10.3536 11.5251 10.9393 10.9393C11.3126 10.5661 12.9438 9.36549 15.8329 7.33748ZM17.5 11C18.0523 11 18.5 11.4477 18.5 12C18.5 12.5523 18.0523 13 17.5 13C16.9477 13 16.5 12.5523 16.5 12C16.5 11.4477 16.9477 11 17.5 11ZM6.5 11C7.05228 11 7.5 11.4477 7.5 12C7.5 12.5523 7.05228 13 6.5 13C5.94772 13 5.5 12.5523 5.5 12C5.5 11.4477 5.94772 11 6.5 11ZM8.81802 7.40381C9.20854 7.79433 9.20854 8.4275 8.81802 8.81802C8.4275 9.20854 7.79433 9.20854 7.40381 8.81802C7.01328 8.4275 7.01328 7.79433 7.40381 7.40381C7.79433 7.01328 8.4275 7.01328 8.81802 7.40381ZM12 5.5C12.5523 5.5 13 5.94772 13 6.5C13 7.05228 12.5523 7.5 12 7.5C11.4477 7.5 11 7.05228 11 6.5C11 5.94772 11.4477 5.5 12 5.5Z"></path></svg>,
            sub_menu: null
        },
        {
            id: "2",
            name: "Danh mục",
            link: "/admin/categories",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="17" cy="7" r="3" /><circle cx="7" cy="17" r="3" /><path d="M14 14h6v5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5ZM4 4h6v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4Z" /></g></svg>,
            sub_menu: [
                {
                    id: "2.1",
                    name: "Thêm",
                    link: "/admin/categories/create"
                },
                {
                    id: "2.2",
                    name: "Danh sách",
                    link: "/admin/categories/list"
                },
            ]
        },
        {
            id: "3",
            name: "Sản phẩm",
            link: "/admin/products",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1ZM5 21a2 2 0 1 1 2-2a2 2 0 0 1-2 2Zm2-9H3V3h4Zm-1 7a1 1 0 1 1-1-1a1 1 0 0 1 1 1Zm8-17h-4a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Zm-2 19a2 2 0 1 1 2-2a2 2 0 0 1-2 2Zm2-9h-4V3h4Zm-1 7a1 1 0 1 1-1-1a1 1 0 0 1 1 1Zm8-17h-4a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Zm-2 19a2 2 0 1 1 2-2a2 2 0 0 1-2 2Zm2-9h-4V3h4Zm-1 7a1 1 0 1 1-1-1a1 1 0 0 1 1 1Z" /></svg>,
            sub_menu: [
                {
                    id: "3.1",
                    name: "Thêm",
                    link: "/admin/products/create"
                },
                {
                    id: "3.2",
                    name: "Danh sách",
                    link: "/admin/products"
                },
            ]
        },
        {
            id: "4",
            name: "Đơn hàng",
            link: "/admin/orders",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><circle cx="9.549" cy="19.049" r="1.701" /><circle cx="16.96" cy="19.049" r="1.701" /><path d="m5.606 5.555l2.01 6.364c.309.978.463 1.467.76 1.829c.26.32.599.567.982.72c.435.173.947.173 1.973.173h3.855c1.026 0 1.538 0 1.972-.173c.384-.153.722-.4.983-.72c.296-.362.45-.851.76-1.829l.409-1.296l.24-.766l.331-1.05a2.5 2.5 0 0 0-2.384-3.252zm0 0l-.011-.037a7 7 0 0 0-.14-.42a2.92 2.92 0 0 0-2.512-1.84C2.84 3.25 2.727 3.25 2.5 3.25" /></g></svg>,
            sub_menu: [
                {
                    id: "4.1",
                    name: "Thêm",
                    link: "/admin/orders/create"
                },
                {
                    id: "4.2",
                    name: "Danh sách",
                    link: "/admin/orders"
                },
            ]
        },
        {
            id: "5",
            name: "Danh mục tin tức",
            link: "/admin/category-news",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32"><path fill="currentColor" d="M14 25h14v2H14zm-6.83 1l-2.58 2.58L6 30l4-4l-4-4l-1.42 1.41L7.17 26zM14 15h14v2H14zm-6.83 1l-2.58 2.58L6 20l4-4l-4-4l-1.42 1.41L7.17 16zM14 5h14v2H14zM7.17 6L4.59 8.58L6 10l4-4l-4-4l-1.42 1.41L7.17 6z" /></svg>,
            sub_menu: [
                {
                    id: "5.1",
                    name: "Thêm",
                    link: "/admin/category-news/create",
                },
                {
                    id: "5.2",
                    name: "Danh sách",
                    link: "/admin/category-news",
                },
            ]
        },
        {
            id: "6",
            name: "Tin tức",
            link: "/admin/news",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M13.03 10c-.122 0-.255 0-.37.01c-.13.01-.3.036-.478.126a1.25 1.25 0 0 0-.546.547c-.09.176-.116.348-.127.478c-.01.114-.009.247-.009.369v1.19c0 .122 0 .255.01.37c.01.13.036.3.126.478c.12.235.311.426.547.546c.176.09.348.116.478.127c.114.01.247.009.369.009h1.94c.122 0 .255 0 .37-.01c.13-.01.3-.036.478-.126a1.25 1.25 0 0 0 .546-.546c.09-.177.116-.349.127-.479c.01-.114.009-.247.009-.369v-1.19c0-.122 0-.255-.01-.37a1.3 1.3 0 0 0-.126-.478a1.25 1.25 0 0 0-.546-.546a1.3 1.3 0 0 0-.479-.127A5 5 0 0 0 14.97 10zm-4.78.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5zm0 2.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5zm0 2.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5zm0 2.5a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5z" opacity=".5" /><path fill="currentColor" d="M17.83 2.25H6.17c-.535 0-.98 0-1.345.03c-.38.03-.736.098-1.073.27A2.75 2.75 0 0 0 2.55 3.752c-.172.337-.24.693-.27 1.073c-.03.365-.03.81-.03 1.345V21a.75.75 0 0 0 1.5 0V6.2c0-.572 0-.957.025-1.253c.023-.287.065-.424.111-.514a1.25 1.25 0 0 1 .547-.547c.09-.046.227-.088.514-.111c.296-.024.68-.025 1.253-.025h11.6c.572 0 .957 0 1.252.025c.288.023.425.065.515.111c.236.12.427.311.547.547c.046.09.088.227.111.514c.024.296.025.68.025 1.253V21a.75.75 0 0 0 1.5 0V6.17c0-.535 0-.98-.03-1.345c-.03-.38-.098-.736-.27-1.073a2.75 2.75 0 0 0-1.2-1.202c-.338-.172-.694-.24-1.074-.27c-.365-.03-.81-.03-1.345-.03" /><path fill="currentColor" d="M7.5 6.5a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2z" /></svg>,
            sub_menu: [
                {
                    id: "6.1",
                    name: "Thêm",
                    link: "/admin/news",
                },
                {
                    id: "6.2",
                    name: "Danh sách",
                    link: "/admin/news",
                },
            ]
        },
        {
            id: "7",
            name: "Bình luận tin tức",
            link: "/admin/comment-news",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M14 22.5L11.2 19H6C5.44772 19 5 18.5523 5 18V7.10256C5 6.55028 5.44772 6.10256 6 6.10256H22C22.5523 6.10256 23 6.55028 23 7.10256V18C23 18.5523 22.5523 19 22 19H16.8L14 22.5ZM15.8387 17H21V8.10256H7V17H11.2H12.1613L14 19.2984L15.8387 17ZM2 2H19V4H3V15H1V3C1 2.44772 1.44772 2 2 2Z"></path></svg>,
            sub_menu: [
                {
                    id: "7.1",
                    name: "Thêm",
                    link: "/admin/comment-news/create",
                },
                {
                    id: "7.2",
                    name: "Danh sách",
                    link: "/admin/comment-news",
                },
            ]
        },
        {
            id: "8",
            name: "Bình luận sản phẩm",
            link: "/admin/comment-products",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 13.5h8m-8-5h4M6.099 19q-1.949-.192-2.927-1.172C2 16.657 2 14.771 2 11v-.5c0-3.771 0-5.657 1.172-6.828S6.229 2.5 10 2.5h4c3.771 0 5.657 0 6.828 1.172S22 6.729 22 10.5v.5c0 3.771 0 5.657-1.172 6.828S17.771 19 14 19c-.56.012-1.007.055-1.445.155c-1.199.276-2.309.89-3.405 1.424c-1.563.762-2.344 1.143-2.834.786c-.938-.698-.021-2.863.184-3.865" color="currentColor" /></svg>,
            sub_menu: [
                {
                    id: "8.1",
                    name: "Thêm",
                    link: "/admin/comment-products/create",
                },
                {
                    id: "8.2",
                    name: "Danh sách",
                    link: "/admin/comment-products",
                },
            ]
        },
        {
            id: "9",
            name: "Người dùng",
            link: "/admin/accounts",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32"><path fill="currentColor" d="M16 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7zm10 28h-2v-5a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v5H6v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z" /></svg>,
            sub_menu: [
                {
                    id: "9.1",
                    name: "Thêm",
                    link: "/admin/accounts",
                },
                {
                    id: "9.2",
                    name: "Danh sách",
                    link: "/admin/accounts",
                },
            ]
        },
        {
            id: "10",
            name: "Vai trò",
            link: "/admin/roles",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32"><path fill="currentColor" d="M28.07 21L22 15l6.07-6l1.43 1.41L24.86 15l4.64 4.59L28.07 21zM22 30h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7zM12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7z" /></svg>,
            sub_menu: [
                {
                    id: "10.1",
                    name: "Thêm",
                    link: "/admin/roles/create",
                },
                {
                    id: "10.2",
                    name: "Danh sách",
                    link: "/admin/roles",
                },
            ]
        },
        {
            id: "11",
            name: "Quyền hạn",
            link: "/admin/permissions",
            svg: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4"><path strokeLinejoin="round" d="M20 10H6a2 2 0 0 0-2 2v26a2 2 0 0 0 2 2h36a2 2 0 0 0 2-2v-2.5" /><path d="M10 23h8m-8 8h24" /><circle cx="34" cy="16" r="6" strokeLinejoin="round" /><path strokeLinejoin="round" d="M44 28.419C42.047 24.602 38 22 34 22s-5.993 1.133-8.05 3" /></g></svg>,
            sub_menu: [
                {
                    id: "11.1",
                    name: "Thêm",
                    link: "/admin/permissions/create",
                },
                {
                    id: "11.2",
                    name: "Danh sách",
                    link: "/admin/permissions",
                },
            ]
        },
    ]
    return (
        <>
            <button
                onClick={toggeSidebarMobile}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 text-gray-600 hover:text-gray-900 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
            >
                <svg
                    id="toggleSidebarMobileHamburger"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                    ></path>
                </svg>
                <svg
                    id="toggleSidebarMobileClose"
                    className="w-6 h-6 hidden"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    ></path>
                </svg>
            </button>
            {
                sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-40"
                        onClick={toggeSidebarMobile}
                    ></div>
                )
            }
            <aside
                id="sidebar"
                className={`flex fixed z-50 h-full top-0 left-0 pt-16 lg:flex flex-col w-64 transition-width select-none duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="relative flex-1 flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
                    <div className="flex-1 h-screen flex flex-col pt-5 pb-20 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                        <div className="flex-1 px-3 bg-white divide-y space-y-1">
                            <ul className="space-y-2 pb-2">
                                <li>
                                    <form action="#" method="GET" className="lg:hidden">
                                        <label htmlFor="mobile-search" className="sr-only">Search</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg
                                                    className="w-5 h-5 text-gray-500"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                                    />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                name="email"
                                                id="mobile-search"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-600 block w-full pl-10 p-2.5"
                                                placeholder="Search"
                                            />
                                        </div>
                                    </form>
                                </li>
                                {
                                    Menu.map((item) => (
                                        <li key={item.id}>
                                            <div className='flex justify-around items-center'>
                                                <Link to={item.link} className="text-base text-gray-900 font-normal rounded-lg flex items-center py-2 px-1.5 hover:bg-gray-100 group w-80">
                                                    {item.svg}
                                                    <span className="ml-3">{item.name}</span>
                                                </Link>
                                                {item.sub_menu &&
                                                    <span
                                                        onClick={() => toggleArrowDown(item.id)}
                                                        className='ml-3 rounded-lg hover:bg-gray-100 cursor-pointer'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="currentColor"
                                                            style={{
                                                                transform: dropdownStates[item.id] ? "rotate(90deg)" : "rotate(0deg)",
                                                                transition: 'transform 0.2s ease-in-out',
                                                            }}
                                                        ><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path></svg></span>
                                                }
                                            </div>
                                            {
                                                item.sub_menu && dropdownStates[item.id] && (
                                                    <ul className="space-y-2 pb-2"
                                                        style={{ transition: 'transform 0.2s ease-in-out' }}>
                                                        {
                                                            item.sub_menu.map((subItem) => (
                                                                <li key={subItem.id}>
                                                                    <Link to={subItem.link} className="text-sm text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                                                                        <span className="ml-8">{subItem.name}</span>
                                                                    </Link>
                                                                </li>
                                                            ))
                                                        }
                                                    </ul>
                                                )
                                            }
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
