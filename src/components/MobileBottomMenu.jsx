import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BASE_URL } from "../../constant";
import axios from "axios";
import { toast } from "react-toastify";

function MobileBottomMenu() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openSub, setOpenSub] = useState({});
  const router = useRouter();

  const toggleSub = (key) => {
    setOpenSub((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // All menu items
  const menuItems = [
    { title: "Dashboard", path: "/" },
    {
      title: "Product Import",
      children: [
        { title: "Import Products", path: "/productImport" },
        { title: "Report IN", path: "/products/reportIn" },
        { title: "Report SG", path: "/products/reportSg" },
      ],
    },
    {
      title: "Coins & Bars",
      children: [
        { title: "Import Report IN", path: "/coinsandbars/reportIn" },
        { title: "Import Report SG", path: "/coinsandbars/reportSg" },
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

  const LogOut = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/users/mis-logout`, {}, { withCredentials: true });
      if (response?.data?.success) {
        localStorage.removeItem('mistoken')
        toast.success(response?.data?.message);
        router.push("/login");
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <>
      {/* Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#8a5a20] text-white flex justify-around items-center py-3 z-50 shadow-lg">

        {/* LEFT ICON */}
        <button onClick={() => router.push("/")}>
          <LuLayoutDashboard size={26} />
        </button>

        {/* CENTER MENU BUTTON */}
        <button
          onClick={() => setOpenMenu(true)}
          className="bg-white text-[#8a5a20] px-6 py-2 rounded-full font-semibold shadow-md"
        >
          MENU
        </button>

        {/* RIGHT ICON */}
        <button onClick={() => LogOut()}>
          <AiOutlineLogout size={26} />
        </button>
      </nav>

      {/* FULL-SCREEN MENU OVERLAY */}
      {openMenu && (
        <div
          className="fixed inset-0  bg-opacity-50 z-50"
          onClick={() => setOpenMenu(false)}
        ></div>
      )}

      {/* SLIDE-UP MENU */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#2d3e50] text-white p-4 z-50 transform transition-transform duration-300 
          ${openMenu ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {/* CLOSE BUTTON */}
        <button
          className="absolute top-2 right-4 text-2xl"
          onClick={() => setOpenMenu(false)}
        >
          ×
        </button>

        {/* TITLE */}
        <h2 className="text-sm font-bold mb-4">REPORTS</h2>

        {/* MENU ITEMS */}
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.title} className="border-b border-gray-600 pb-2">
              {item.children ? (
                <>
                  <button
                    className="flex justify-between w-full text-left text-sm"
                    onClick={() => toggleSub(item.title)}
                  >
                    {item.title}
                    {openSub[item.title] ? (
                      <MdOutlineKeyboardArrowDown size={22} />
                    ) : (
                      <MdOutlineKeyboardArrowRight size={22} />
                    )}
                  </button>

                  {/* Submenu */}
                  {openSub[item.title] && (
                    <ul className="ml-4 mt-2 space-y-2">
                      {item.children.map((sub) => (
                        <li key={sub.title}>
                          <Link
                            href={sub.path}
                            className="block py-1 text-sm"
                            onClick={() => setOpenMenu(false)}
                          >
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.path}
                  className="text-sm block py-1"
                  onClick={() => setOpenMenu(false)}
                >
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default MobileBottomMenu