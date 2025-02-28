import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LayoutOutlet } from './layouts/layout_outlet'
import { Brand } from './pages/brand'
import './App.css'
import { Home } from './pages/home';

function App() {

  const Pages = [
    { path: 'brand', element: < Brand /> },
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
