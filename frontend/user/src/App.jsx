import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserLayout } from './layouts/user/userlayout'
import { AdminLayout } from './layouts/admin/adminlayout'
import { Brand } from './pages/user/brand'
import './App.css';
import { AuthProvider } from './contexts/authcontext';

import CheckRoute from './contexts/checkroute';
import ProtectedRoute from './contexts/protectedrouter';

import { About } from './components/aboutPage/about';
import { ProductDetail } from './pages/user/productdetail/product_detail';
import Home from './components/homePage/home';

import { Roles } from './pages/admin/roles/index';
import { Create_Role } from './pages/admin/roles/create';
import { Update_Role } from './pages/admin/roles/update';
import { RolesTrash } from './pages/admin/roles/trash';

import { Permissions } from './pages/admin/permissions/index';
import { Create_Permission } from './pages/admin/permissions/create';
import { Update_Permission } from './pages/admin/permissions/update';
import { PermissionsTrash } from './pages/admin/permissions/trash';

import { Categories } from './pages/admin/categories/index';
import { Create_category } from './pages/admin/categories/create';
import { Update_Category } from './pages/admin/categories/update';
import { CategoryTransh } from './pages/admin/categories/trash';

import { Products } from './pages/admin/products/index';
import { Create_Product } from './pages/admin/products/create';
import { Update_Product } from './pages/admin/products/update';

import { Home_Admin } from './pages/admin/home';

import LoginForm from './components/auth/login';
import RegisterForm from './components/auth/register';
import CartPage from "./components/cartPage/cartPage";

import { Users } from "./pages/admin/accounts";
import { Set_User_Role } from "./pages/admin/accounts/rolelevel";
import { UpdateAccount } from "./pages/admin/accounts/update";
import { UsersTrash } from "./pages/admin/accounts/trash";

import { Orders } from "./pages/admin/orders";
import { Update_Order } from "./pages/admin/orders/update";
import { Create_Order } from "./pages/admin/orders/create";

import Shop from "./pages/user/shop/shop";
import Profile from "./pages/user/profile/profile";
import News from "./pages/user/news/news";
import NewsDetail from "./pages/user/news/newsDetail";
import ContactPage from "./pages/user/contact/contact";

import { CategoryNews } from "./pages/admin/category_news";
import { Create_category_news } from "./pages/admin/category_news/create";
import { Update_Category_News } from "./pages/admin/category_news/update";

import { NewsAdmin } from "./pages/admin/news";
import { Create_News } from "./pages/admin/news/create";
import { Update_News } from "./pages/admin/news/update";

import { Comment_Products } from "./pages/admin/comment_products";
import { Create_CommentProduct } from "./pages/admin/comment_products/create";
import { Update_CommentProduct } from "./pages/admin/comment_products/update";

import { Comment_News } from "./pages/admin/comment_news";
import { Create_CommentNews } from "./pages/admin/comment_news/create";
import { Update_CommentNews } from "./pages/admin/comment_news/update";

import { Vouchers } from "./pages/admin/vouchers";
import { Create_Voucher } from "./pages/admin/vouchers/create";
import { Update_Voucher } from "./pages/admin/vouchers/update";

import { Banners } from "./pages/admin/banners";
import { Create_Banner } from "./pages/admin/banners/create";

import Checkout from "./pages/user/checkout/checkout";

import ProductStatsChart from "./components/chart/product";
import ProductStatusChart from "./components/chart/status";
import ProductPerformanceChart from "./components/chart/productper";
import MyChart from "./components/chart/test1";
import OrdersChart from "./components/chart/test2";
import Revenue from "./components/chart/revenue";
import VouchersChart from "./components/chart/voucher";


function App() {
  const Pages = [
    { path: 'login', element: <ProtectedRoute><LoginForm /></ProtectedRoute> },
    { path: 'register', element: <ProtectedRoute><RegisterForm /></ProtectedRoute> },
    { path: 'brand', element: < Brand /> },
    { path: 'about', element: < About /> },
    { path: 'product/:id/:productname', element: < ProductDetail /> },
    { path: 'cart', element: <CartPage /> },
    { path: 'shop/:categoryname/:idcategory', element: <Shop /> },
    { path: 'shop', element: <Shop /> },
    { path: 'profile', element: <Profile /> },
    { path: 'news/:idcategorynews', element: <News /> },
    { path: 'news', element: <News /> },
    { path: 'news/:id/:categoryname', element: <NewsDetail /> },
    { path: 'contact', element: <ContactPage /> },
    { path: 'checkout',element: <Checkout />}
  ];


  const PagesAdmin = [
    { path: 'roles', element: < Roles /> },
    { path: 'roles/create', element: < Create_Role /> },
    { path: 'roles/update/:roleId', element: < Update_Role /> },
    { path: 'roles/trash', element: < RolesTrash /> },

    { path: 'permissions', element: < Permissions /> },
    { path: 'permissions/create', element: < Create_Permission /> },
    { path: 'permissions/update/:id', element: < Update_Permission /> },
    { path: 'permissions/trash', element: < PermissionsTrash /> },

    { path: 'accounts/', element: < Users /> },
    { path: 'accounts/rolelevel/:userId', element: < Set_User_Role /> },
    { path: 'accounts/update/:userId', element: < UpdateAccount /> },
    { path: 'accounts/trash', element: < UsersTrash /> },

    { path: 'categories', element: < Categories /> },
    { path: 'categories/create', element: < Create_category /> },
    { path: 'categories/update/:id', element: < Update_Category /> },
    { path: 'categories/trash', element: < CategoryTransh /> },

    { path: 'products', element: < Products /> },
    { path: 'products/create', element: < Create_Product /> },
    { path: 'products/update/:id', element: < Update_Product /> },

    { path: 'orders', element: < Orders /> },
    { path: 'orders/update/:id', element: < Update_Order /> },
    { path: 'orders/create', element: < Create_Order /> },

    { path: 'category-news', element: < CategoryNews /> },
    { path: 'category-news/create', element: < Create_category_news /> },
    { path: 'category-news/update/:id', element: < Update_Category_News /> },

    { path: 'news', element: < NewsAdmin /> },
    { path: 'news/create', element: < Create_News /> },
    { path: 'news/update/:id', element: < Update_News /> },

    { path: 'comment-products', element: < Comment_Products /> },
    { path: 'comment-products/create', element: < Create_CommentProduct /> },
    { path: 'comment-products/update/:id', element: < Update_CommentProduct /> },

    { path: 'comment-news', element: < Comment_News /> },
    { path: 'comment-news/create', element: < Create_CommentNews /> },
    { path: 'comment-news/update/:id', element: < Update_CommentNews /> },

    { path: 'chart', element: < ProductStatsChart /> },
    { path: 'status', element: < ProductStatusChart /> },
    { path: 'statisticals/productper', element: < ProductPerformanceChart /> },
    { path: 'statisticals/revenue', element: < Revenue/> },

    { path: 'vouchers', element: < Vouchers/> },
    { path: 'vouchers/create', element: < Create_Voucher/> },
    { path: 'vouchers/update/:voucherId', element: < Update_Voucher/> },

    {path: 'banners', element: <Banners />},
    {path: 'banners/create', element: <Create_Banner />},

    { path: 'test1', element: < MyChart /> },
    { path: 'test2', element: < OrdersChart /> },
    { path: 'voucher', element: < VouchersChart /> },
  ];

  const router = createBrowserRouter([
    {
      path: '/',
      element: <UserLayout />,
      children: [
        {
          index: true, element:
            <Home />
        },
        ...Pages,
      ]
    },
    {
      path: '/admin/',
      element: <CheckRoute role={'Users'}><AdminLayout /></CheckRoute>,
      children: [
        {
          index: true, element:
            <Home_Admin />
        },
        ...PagesAdmin,]
    },
  ],
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      },
    }

  );

  return (
    < AuthProvider >
      <RouterProvider router={router}
        future={{
          v7_startTransition: true,
        }}
      />
    </AuthProvider>
  )
}

export default App
