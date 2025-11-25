"use client";

import { useState } from "react";
import Link from "next/link";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BASE_URL } from "../../constant";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiOutlineLogout } from "react-icons/ai";
import { toast } from "react-toastify";

export default function Sidebar() {
  const [openMenus, setOpenMenus] = useState({});
  const router = useRouter();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LuLayoutDashboard size={24} />,
      path: "/",
    },
    {
      title: "Product Import",
      children: [
        { title: "Import Products", path: "/productImport" },
        { title: "Report IN", path: "/productImport/reportIn" },
        { title: "Report SG", path: "/productImport/reportSg" },
        {
          title: "Coins & Bars",
          children: [
            { title: "Import Report IN", path: "/coinsandbars/reportIn" },
            { title: "Import Report SG", path: "/coinsandbars/reportSg" },
          ],
        },
      ],
    },
    {
      title: "Order Reports",
      children: [
        { title: "Shipment Status Report", path: "/orders/shipmentStatusReport" },
      ],
    },
    {
      title: "BMC Reports",
      children: [
        { title: "Bmc Summary", path: "/bmc" },
      ],
    },
  ];

  // ⬇️ Recursive menu rendering
  const renderMenu = (items) => {
    return (
      <ul>
        {items.map((item) => (
          <li key={item.title}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-800"
                >
                  <span>{item.title}</span>
                  {openMenus[item.title] ? (
                    <MdOutlineKeyboardArrowDown size={22} />
                  ) : (
                    <MdOutlineKeyboardArrowRight size={22} />
                  )}
                </button>

                {openMenus[item.title] && (
                  <ul className="ml-4 border-l text-sm border-gray-700 pl-3">
                    {renderMenu(item.children)}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={item.path}
                className="block px-3 py-2 rounded-md hover:bg-gray-800"
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.title}
                </div>

              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const LogOut = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/mis-logout`,{},{ withCredentials: true });
      if (response?.data?.success) {
        localStorage.removeItem('token')
        toast.success(response?.data?.message);
        router.push("/login");
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <aside className="h-full w-full bg-[#8a5a20] text-white shadow-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-5 ">
        <div className="lg:text-2xl text-lg font-bold">MIS ADMIN</div>
      </div>

      {/* Menu items */}
      <div className="flex-1">
        {renderMenu(menuItems)}
      </div>

      {/* Logout button at bottom */}
      <div
        className="px-3 py-2 rounded-md hover:bg-gray-800 cursor-pointer mt-auto flex items-center gap-2"
        onClick={LogOut}
      >
        <AiOutlineLogout size={25} />
        <span>Logout</span>
      </div>
    </aside>
    
  );
}
