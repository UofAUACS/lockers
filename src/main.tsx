import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/home/Home';
import Rent from './pages/rent/rent';
import MyLockers from './pages/mylockers/myLockers';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/rent-locker",
    element: <Rent/>,
  },
  {
    path: "/my-lockers",
    element: <MyLockers/>,
  },
  {
    path: "/",
    element: <Home/>,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
