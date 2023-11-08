import { Home, Notifications, Profile, Tables } from "@/pages/dashboard";
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  HomeIcon,
  TableCellsIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import Categorythree from "./Categorythree";
import Categorytwo from "./Categorytwo";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },

      {
        icon: <TableCellsIcon {...icon} />,
        name: "KategoriyaOne",
        path: "/notifactions",
        element: <Notifications />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "KategoriyaTwo",
        path: "/kategoriyatwo",
        element: <Categorytwo />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "KategoriyaThree",
        path: "/kategoriyathree",
        element: <Categorythree />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Product qo'shish",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "Log out",
        path: "/auth/sign-in",
      },
    ],
  },

];

export default routes;
