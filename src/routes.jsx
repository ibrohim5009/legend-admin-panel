import {
  HomeIcon,
  UserCircleIcon,
  InformationCircleIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  CubeIcon,
  FolderPlusIcon,
  NewspaperIcon,
  ClipboardDocumentIcon,
  RssIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import KategoriyaTwo from "./pages/kategories/KategoriyaTwo";
import KategoriyaThree from "./pages/kategories/KategoriyaThree";
import Kategoriya from "./pages/kategories/Kategoriya";
import PrivacyPolice from "./pages/privacyandpolicy/PrivacyPolice";
import History from "./pages/history/History";
import News from "./pages/news/News";
import MainpageNews from "./pages/mainpagenews/MainpageNews";
import Discount from "./pages/discount/Discount";
import SocialNetwork from "./pages/socialNetwork/SocialNetwork";

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
        icon: <FolderPlusIcon {...icon} />,
        name: "Product qo'shish",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "KategoriyaOne",
        path: "/kategoriaya",
        element: <Kategoriya />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "KategoriyaTwo",
        path: "/kategoriyatwo",
        element: <KategoriyaTwo />,
      },
      {
        icon: <CubeIcon {...icon} />,
        name: "KategoriyaThree",
        path: "/kategoriyathree",
        element: <KategoriyaThree />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "PrivacyPolicy",
        path: "/privacypolicy",
        element: <PrivacyPolice />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "History",
        path: "/history",
        element: <History />,
      },
      {
        icon: <NewspaperIcon {...icon} />,
        name: "News",
        path: "/news",
        element: <News />,
      },
      {
        icon: <NewspaperIcon {...icon} />,
        name: "MainpageNews",
        path: "/mainpagenews",
        element: <MainpageNews />,
      },
      {
        icon: <ClipboardDocumentIcon {...icon} />,
        name: "Discount",
        path: "/discount",
        element: <Discount />,
      },
      {
        icon: <RssIcon {...icon} />,
        name: "SocialNetwork",
        path: "/socialnetwork",
        element: <SocialNetwork />,
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
