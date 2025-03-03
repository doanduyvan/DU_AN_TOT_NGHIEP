import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LayoutOutlet } from './layouts/layout_outlet'
import { Brand } from './pages/brand'
import './App.css'
import { Home } from './pages/home';
import { About } from './components/aboutPage/about';
import { ProductDetail } from './pages/product_detail';
import { TestAdmin } from './pages/testadmin';

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
      element: <LayoutOutlet />,
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
