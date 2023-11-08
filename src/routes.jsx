import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import KategoriyaTwo from "./pages/kategories/KategoriyaTwo";
import KategoriyaThree from "./pages/kategories/KategoriyaThree";
import Kategoriya from "./pages/kategories/Kategoriya";
import PrivacyPolice from "./pages/privacyandpolicy/PrivacyPolice";
import History from "./pages/history/History";
import News from "./pages/news/News";

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
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Product qo'shish",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "KategoriyaOne",
        path: "/kategoriaya",
        element: <Kategoriya />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "KategoriyaTwo",
        path: "/kategoriyatwo",
        element: <KategoriyaTwo />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "KategoriyaThree",
        path: "/kategoriyathree",
        element: <KategoriyaThree/>,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "PrivacyPolicy",
        path: "/privacypolicy",
        element: <PrivacyPolice />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "History",
        path: "/history",
        element: <History />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "News",
        path: "/news",
        element: <News />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];

export default routes;
