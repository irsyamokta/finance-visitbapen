import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/button/Button";
import { ModalTransaction } from "../components/modal/ModalTransaction";
import DashboardTab from "../components/tabs/DashboardTab";
import DesktopNav from "../components/navigation/DesktopNav";
import MobileNav from "../components/navigation/MobileNav";
import TransactionTab from "../components/tabs/TransactionTab";
import FeatureComingSoon from "../components/common/FeatureCommingSoon";

import { LuPlus } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";

import LogoColor from "../assets/logo/logo-color.png";

const AppHeader: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { logout } = useAuth();
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
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="default"
              className="border border-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <LuPlus />
              Tambah
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
            >
              <FiLogOut />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <DesktopNav activeTab={activeTab} setActiveTab={handleSetActiveTab} />
      </header>

      <MobileNav
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        handleLogout={handleLogout}
        handleOpenModal={() => setIsModalOpen(true)}
      />

      {/* Content Tab */}
      <div className="px-4 lg:px-24 py-6 pb-24 lg:pb-6">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "transactions" && <TransactionTab />}
        {activeTab === "analytics" && <FeatureComingSoon />}
      </div>

      {/* Modal */}
      <ModalTransaction
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AppHeader;
