import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LayoutOutletUser } from './layouts/layout_outlet'
import { Brand } from './pages/brand'
import './App.css'
import { About } from './components/aboutPage/about';
import { ProductDetail } from './pages/product_detail';
import { TestAdmin } from './pages/testadmin';
import Home from './components/homePage/home';

function App() {


  const Pages = [
    { path: 'brand', element: < Brand /> },
    { path: 'about', element: < About /> },
    { path: 'products/1', element: < ProductDetail /> }
  ];

  
  const PagesAdmin = [
    { path: 'testadmin', element: < TestAdmin /> },
  ];

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LayoutOutletUser />,
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
      children: [
        {
          index: true, element:
            <Home />
        },
        ...PagesAdmin,]
    },

  ]);

    return <RouterProvider router={router} />;
}

export default App
