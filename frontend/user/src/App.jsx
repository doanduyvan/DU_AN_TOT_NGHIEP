import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserLayout } from './layouts/user/userlayout'
import { AdminLayout } from './layouts/admin/adminlayout'
import { Brand } from './pages/user/brand'
import './App.css'
import { Home } from './pages/user/home';
import { About } from './components/aboutPage/about';
import { ProductDetail } from './pages/user/product_detail';
import { Categories } from './pages/admin/categories/index';
import { Create_category } from './pages/admin/categories/create';
import { Update_Category } from './pages/admin/categories/update';
import { Home_Admin } from './pages/admin/home';

function App() {


  const Pages = [
    { path: 'brand', element: < Brand /> },
    { path: 'about', element: < About /> },
    { path: 'products/1', element: < ProductDetail /> }
  ];

  
  const PagesAdmin = [
    { path: 'categories', element: < Categories /> },
    { path: 'categories/create', element: < Create_category /> },
    { path: 'categories/update/:id', element: < Update_Category /> },
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
      element: <AdminLayout />,
      children: [
        {
          index: true, element:
            <Home_Admin />
        },
        ...PagesAdmin,]
    },

  ]);

    return <RouterProvider router={router} />;
}

export default App
