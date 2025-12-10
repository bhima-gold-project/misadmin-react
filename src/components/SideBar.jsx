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
        {
          title: "Products",
          children: [
            { title: "Report IN", path: "/products/reportIn" },
            { title: "Report SG", path: "/products/reportSg" },
          ],
        },
        {
          title: "Coins & Bars",
          children: [
            { title: "Report IN", path: "/coinsandbars/reportIn" },
            { title: "Report SG", path: "/coinsandbars/reportSg" },
          ],
        },
        {
          title: "Stones",
          children: [
            { title: "Report IN", path: "/stones/reportIn" },
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
    // {
    //   title: "Product Attrs Update",
    //   path: "/productAttrsUpdate",
    // },
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
      const response = await axios.post(`${BASE_URL}/api/users/mis-logout`, {}, { withCredentials: true });
      if (response?.data?.success) {
        localStorage.removeItem('mistoken')
        toast.success(response?.data?.message);
        window.location.href = "/login?clear=1";
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <aside className="h-full w-full bg-[#8a5a20] text-white shadow-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-5 ">
        <div className="lg:text-2xl text-lg font-bold">BG ADMIN</div>
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
