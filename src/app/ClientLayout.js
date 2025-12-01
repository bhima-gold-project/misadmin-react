"use client";

import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-grid.css';
import Sidebar from "@/components/SideBar";
import MobileBottomMenu from "@/components/MobileBottomMenu";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/login";

  return (
    <>
   <div className="grid grid-cols-12 min-h-screen ">

  {/* SIDEBAR – only show on md+ */}
  {showSidebar && (
    <aside className="hidden lg:block lg:col-span-3  xl:block xl:col-span-2 bg-[#8a5a20]">
      <Sidebar />
    </aside>
  )}

  {/* MAIN CONTENT */}
  <main
    className={`${showSidebar ? 
      "col-span-12 lg:col-span-9 xl:col-span-10 overflow-y-scroll h-screen" : 
      "col-span-12"
    } p-4`}
  >
    <div id="root">{children}</div>
  </main>

  {/* MOBILE BOTTOM MENU – only show on small screens */}
  {showSidebar && (
    <div className="fixed block xl:hidden lg:hidden bottom-0 left-0 right-0 z-50">
      <MobileBottomMenu />
    </div>
  )}
</div>

      <ToastContainer
        position="top-right"
        autoClose={800}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
