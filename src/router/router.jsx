import { createBrowserRouter } from "react-router-dom";
import Userlayout from "../components/layout/Userlayout";
import Portal from "../pages/portal/Portal";
import Ourworld from "../pages/ourworld/Ourworld";
import Portfolio from "../pages/portfolio/Portfolio";
import Openline from "../pages/openline/Openline";
import Services from "../pages/services/Services";
import NotFound from "../pages/err/NotFound"; 

let user_routes = [
  {
    path: '/',
    element: <Userlayout />,
    errorElement: <NotFound />, 
    children: [
      { index: true, element: <Portal /> },
      { path: 'ourworld', element: <Ourworld /> },
      { path: 'services', element: <Services /> },
      { path: 'portfolio', element: <Portfolio /> },
      { path: 'openline', element: <Openline /> },

      { path: '*', element: <NotFound /> },
    ],
  },
];

const router = createBrowserRouter([...user_routes]);

export default router;