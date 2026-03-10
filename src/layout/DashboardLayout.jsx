import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';

import { useBusiness } from '../context/BusinessContext';
import {
  FaPlusCircle,
  FaTags,
  FaMoneyCheckAlt,
  FaClipboardList,
  FaBell,
  FaSearch,
  FaUserCircle,
  FaStore,
  FaUsers,FaShoppingCart
} from 'react-icons/fa';
import { FaPercent } from 'react-icons/fa';
import { MdOutlineAccountBalance } from 'react-icons/md'
import { useEffect, useState } from "react"
import { apiGet } from "../services/api"

import { RiDashboardFill, RiSettings4Line } from 'react-icons/ri';
import FloatingNotification from '../components/FloatingNotification';
import logolight from '../assets/logodark.png';
import LTS from '../assets/LTS_Animation.gif';

const DashboardLayout = () => {
  const { businessId } = useBusiness();
  const location = useLocation();
  const navigate = useNavigate();

  const [businessInfo, setBusinessInfo] = useState(null)
const [loadingBusiness, setLoadingBusiness] = useState(false)


useEffect(() => {
  const fetchBusinessInfo = async () => {
    setLoadingBusiness(true)
    try {
      const response = await apiGet("/open/business/info")

      // console.log("Full API Response:", response.data)

      if (response?.data?.success) {
        // console.log("Business Data:", response.data.data)
        // console.log("Logo URL:", response.data.data?.branding?.logoUrl)

        setBusinessInfo(response.data.data)
      }
    } catch (error) {
      console.error("Business info error", error)
    } finally {
      setLoadingBusiness(false)
    }
  }

  fetchBusinessInfo()
}, [])

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: <RiDashboardFill /> },
    { name: 'Products', path: '/dashboard/add-item', icon: <FaPlusCircle /> },
    { name: 'Categories', path: '/dashboard/categories', icon: <FaTags /> },
    { name: 'Orders', path: '/dashboard/orders', icon: <FaClipboardList /> },
    { name: 'Payments', path: '/dashboard/transactions', icon: <FaMoneyCheckAlt /> },
{ name: 'Customers', path: '/dashboard/customers', icon: <FaUsers /> },   
  { name: 'Discounts', path: '/dashboard/discounts', icon: <FaPercent /> }, // 👈 ADD THIS
    // { name: 'Tax Settings', path: '/dashboard/tax', icon: <MdOutlineAccountBalance /> },

{ name: 'Purchases', path: '/dashboard/purchases', icon: <FaShoppingCart /> },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E8ECF0] text-[#212121] overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-[72px] lg:w-64 bg-white flex flex-col border-r border-gray-100 shadow-lg">

        {/* Logo */}
        <div className="flex items-center h-20 px-4 overflow-hidden border-b border-gray-100 lg:px-6">
          <div className="relative w-40 h-16">
            <img
              src={logolight}
              alt="Ab Shopee Logo"
              className="absolute w-auto h-16 animate-logoOne"
            />
            <img
              src={LTS}
              alt="LTS Logo"
              className="absolute w-auto h-16 animate-logoTwo"
            />
          </div>
        </div>


        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto lg:px-4">
  {menuItems.map((item) => {
    const isActive = location.pathname === item.path; // ← current line
    return (
      <NavLink
  key={item.path}
  to={item.path}
  end={item.path === '/dashboard'} // important for exact match on overview
  className={({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative group
    ${isActive
      ? 'bg-[#0B77A7] text-white shadow-lg shadow-[#0B77A7]/30'
      : 'text-gray-600 hover:bg-gray-50 hover:text-[#0B77A7]'}`
  }
>
  <span className="text-lg transition-transform group-hover:scale-110">
    {item.icon}
  </span>
  <span className="hidden text-sm font-semibold lg:block">
    {item.name}
  </span>
  {isActive && (
    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0B77A7] rounded-l-full" />
  )}
</NavLink>
    );
  })}
</nav>

        {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-100">
  <div
    onClick={() => navigate("/dashboard/business-profile")}
    className="flex items-center gap-3 p-3 transition-all cursor-pointer rounded-xl hover:bg-gray-50"
  >
    <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-200 shadow-md rounded-xl">
      {businessInfo?.branding?.logoUrl ? (
        <img
          src={businessInfo.branding.logoUrl}
          alt="logo"
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="text-sm font-bold text-[#0B77A7]">
          {businessInfo?.name
            ?.split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "—"}
        </span>
      )}
    </div>

    <div className="flex-1 hidden lg:block">
      <p className="text-sm font-bold text-[#212121]">
        {loadingBusiness ? "Loading..." : businessInfo?.name || "—"}
      </p>
      <p className="text-xs font-medium text-gray-500">
        {businessInfo?.address?.city && businessInfo?.address?.state
          ? `${businessInfo.address.city}, ${businessInfo.address.state}`
          : ""}
      </p>
    </div>
  </div>
</div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* ===== TOP HEADER BAR ===== */}
        <header className="flex items-center h-20 px-6 border-b border-gray-100 shadow-sm bg-white/80 backdrop-blur-xl">
          <div className="flex-1 flex items-center justify-between max-w-[1440px] mx-auto w-full">

            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
{menuItems.find(item => location.pathname.startsWith(item.path))?.name || 'Dashboard'}              </h1>
              <p className="text-sm text-gray-500 mt-0.5"> 
                Welcome back! Here's what's happening today.
              </p>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#0B77A7] focus:ring-2 focus:ring-[#0B77A7]/20 focus:bg-white text-sm transition-all outline-none w-64"
                />
              </div>

              {/* Notifications */}
              <button
                onClick={() => navigate('/dashboard/notifications')}
                className="relative w-10 h-10 rounded-xl bg-gray-50 cursor-pointer  hover:bg-[#0B77A7] hover:text-white text-gray-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              >
                <FaBell className="text-lg" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                  3
                </span>
              </button>

              {/* Settings */}
              <button className="w-10 h-10 cursor-pointer rounded-xl bg-gray-50 hover:bg-[#0B77A7] hover:text-white text-gray-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95">
                <RiSettings4Line className="text-lg" />
              </button>

              {/* Profile */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B77A7] to-[#0057ae] flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-md">
<span className="text-sm font-bold">
  {businessInfo?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "—"}
</span>              </div>
            </div>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto">
{/* <Outlet key={location.pathname} />      */}

<Outlet/>
     </div>
        </main>
      </div>

      <FloatingNotification  />

    </div>
  );
};

export default DashboardLayout;
