import { FiHome, FiLogOut } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { MdOutlineAnalytics } from "react-icons/md";

interface MobileNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    handleLogout: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, handleLogout }) => {
    const tabs = [
        { key: "dashboard", label: "Dashboard", icon: <FiHome size={22} /> },
        { key: "transactions", label: "Transaksi", icon: <IoWalletOutline size={22} /> },
        { key: "analytics", label: "Analitik", icon: <MdOutlineAnalytics size={22} /> },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 grid grid-cols-4 items-center border-t border-gray-200 bg-white py-3 z-50">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex flex-col items-center text-xs transition-colors duration-200
        ${activeTab === tab.key ? "text-primary" : "text-gray-600"}
        hover:text-primary`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}

            <button
                onClick={handleLogout}
                className="flex flex-col items-center text-xs text-gray-600 transition-colors duration-200 hover:text-red-500"
            >
                <FiLogOut size={22} />
                Logout
            </button>
        </nav>
    );
};

export default MobileNav;
