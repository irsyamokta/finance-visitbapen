import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import DashboardTab from "../components/tabs/DashboardTab";
import DesktopNav from "../components/navigation/DesktopNav";
import MobileNav from "../components/navigation/MobileNav";
import TransactionTab from "../components/tabs/TransactionTab";
import AnalyticsTab from "../components/tabs/AnalyticsTab";

import { FiLogOut } from "react-icons/fi";

import LogoColor from "../assets/logo/logo-color.png";

const AppHeader: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("activeTab");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.name || "User"
  )}&background=d1d5db&color=111827`;

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 w-full border-b border-gray-200 bg-white z-50">
        <div className="flex flex-row items-center justify-between w-full gap-4 px-4 py-3 lg:px-24">
          {/* Left */}
          <div className="flex items-center gap-3">
            <img src={LogoColor} alt="Logo" className="w-40" />
          </div>

          {/* Right (Desktop Only) */}
          <div className="flex items-center gap-3 relative">
            {/* Avatar & Dropdown */}
            <div className="relative">
              <img
                src={avatarUrl}
                alt="User Avatar"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="w-12 h-12 rounded-full cursor-pointer select-none border"
              />

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-gray-700 font-medium border-b">
                    {user?.name || "User"}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <DesktopNav activeTab={activeTab} setActiveTab={handleSetActiveTab} />
      </header>

      <MobileNav
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        handleLogout={handleLogout}
      />

      {/* Content Tab */}
      <div className="px-4 lg:px-24 py-6 pb-24 lg:pb-6">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "transactions" && <TransactionTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </>
  );
};

export default AppHeader;
