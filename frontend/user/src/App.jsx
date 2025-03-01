import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LayoutOutlet } from './layouts/layout_outlet'
import { Brand } from './pages/brand'
import './App.css'
import { Home } from './pages/home';
import { About } from './components/aboutPage/about';

function App() {

  const Pages = [
    { path: 'brand', element: < Brand /> },
    { path: 'about', element: < About /> },
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
    }
  ]);

    return <RouterProvider router={router} />;
}

export default App
