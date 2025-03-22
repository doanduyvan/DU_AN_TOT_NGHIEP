import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserLayout } from './layouts/user/userlayout'
import { AdminLayout } from './layouts/admin/adminlayout'
import { Brand } from './pages/user/brand'
import './App.css';
import { AuthProvider } from './contexts/authcontext';

import ProtectedRoute from './components/protectedroute';

import { About } from './components/aboutPage/about';
import { ProductDetail } from './pages/user/product_detail';
import Home from './components/homePage/home';

import { Roles } from './pages/admin/roles/index';
import { Create_Role } from './pages/admin/roles/create';
import { Update_Role } from './pages/admin/roles/update';

import { Permissions } from './pages/admin/permissions/index';
import { Create_Permission } from './pages/admin/permissions/create';
import { Update_Permiss } from './pages/admin/permissions/update';

import { Categories } from './pages/admin/categories/index';
import { Create_category } from './pages/admin/categories/create';
import { Update_Category } from './pages/admin/categories/update';

import { Products } from './pages/admin/products/index';
import { Create_Product } from './pages/admin/products/create';
import { Update_Product } from './pages/admin/products/update';
import { Home_Admin } from './pages/admin/home';
import LoginForm from './components/auth/login';
import RegisterForm from './components/auth/register';
import CartPage from "./components/cartPage/cartPage";
import { Users } from "./pages/admin/users";
import Shop from "./pages/user/shop/shop";
import Profile from "./pages/user/profile/profile";
import News from "./pages/user/news/news";
import NewsDetail from "./pages/user/news/newsDetail";
import ContactPage from "./pages/user/contact/contact";



function App() {
  const Pages = [
    { path: 'login', element: <LoginForm />,},
    { path: 'register', element: <RegisterForm />,},
    { path: 'brand', element: < Brand /> },
    { path: 'about', element: < About /> },
    { path: 'products/1', element: < ProductDetail /> },
    { path: 'cart', element: <CartPage /> },
    {path: 'shop', element: <Shop />},
    { path: 'profile', element: <Profile />},
    { path: 'news', element: <News />},
    { path: 'news/:id', element: <NewsDetail />}, 
    { path: 'contact', element: <ContactPage />}
  ];


  const PagesAdmin = [
    { path: 'roles', element: < Roles /> },
    { path: 'roles/create', element: < Create_Role /> },
    { path: 'roles/update/:roleId', element: < Update_Role /> },

    { path: 'permissions', element: < Permissions /> },
    { path: 'permissions/create', element: < Create_Permission /> },
    { path: 'permissions/update/:id', element: < Update_Permiss /> },

    { path: 'users/', element: < Users /> },

    { path: 'categories', element: < Categories /> },
    { path: 'categories/create', element: < Create_category /> },
    { path: 'categories/update/:id', element: < Update_Category /> },

    { path: 'products', element: < Products /> },
    { path: 'products/create', element: < Create_Product /> },
    { path: 'products/update/:id', element: < Update_Product /> },
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
      element: <ProtectedRoute role={'Users'} permission={[]}><AdminLayout /></ProtectedRoute>,
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
