import { FiBarChart2 } from "react-icons/fi";

const FeatureComingSoon: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <FiBarChart2 size={32} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Fitur Analitik Belum Tersedia
            </h2>
            <p className="text-gray-500 max-w-md">
                Kami sedang menyiapkan fitur analitik agar kamu bisa memantau data transaksi lebih mudah. Nantikan update selanjutnya!
            </p>
        </div>
    );
};

export default FeatureComingSoon;
