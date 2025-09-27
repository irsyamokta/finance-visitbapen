import { FiHome, FiLogOut } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { MdOutlineAnalytics } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";

interface MobileNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    handleLogout: () => void;
    handleOpenModal: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, handleLogout, handleOpenModal }) => {
    const tabs = [
        { key: "dashboard", label: "Dashboard", icon: <FiHome size={22} /> },
        { key: "transactions", label: "Transaksi", icon: <IoWalletOutline size={22} /> },
        { key: "analytics", label: "Analitik", icon: <MdOutlineAnalytics size={22} /> },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 grid grid-cols-4 items-center border-t border-gray-200 bg-white py-6 z-50">
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

            {/* FAB (Tambah) */}
            <button
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-200"
                onClick={handleOpenModal}
            >
                <AiOutlinePlus size={26} />
            </button>
        </nav>
    );
};

export default MobileNav;
