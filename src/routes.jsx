import { createBrowserRouter } from "react-router-dom";
import Auth from './pages/auth/Auth'
import Home from './pages/home/Home'
import Transfer from './pages/transfer/Transfer'

export const router = createBrowserRouter([
  {
    index:true,
    path: "/auth",
    element: <Auth />,
  },
  {
    path:"/home",
    element:<Home/>
  },
  {
    path:"/tansfer",
    element:<Home/>
  }
]);
