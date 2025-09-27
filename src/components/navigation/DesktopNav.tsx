import { FiHome } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { MdOutlineAnalytics } from "react-icons/md";

interface DesktopNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { key: "dashboard", label: "Dashboard", icon: <FiHome size={20} /> },
        { key: "transactions", label: "Transaksi", icon: <IoWalletOutline size={20} /> },
        { key: "analytics", label: "Analitik", icon: <MdOutlineAnalytics size={20} /> },
    ];

    return (
        <nav className="hidden lg:flex gap-6 px-4 py-2 lg:px-24 bg-white border-t border-b border-gray-200">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-3 py-2 border-b-2 text-sm font-medium transition ${activeTab === tab.key
                            ? "text-primary border-primary"
                            : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
                        }`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default DesktopNav;
