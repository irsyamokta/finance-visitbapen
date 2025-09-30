import useSWR from "swr";
import StatCard from "../cards/StatsCard";
import InfoCard from "../cards/InfoCard";
import { LuWallet } from "react-icons/lu";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { getDashboard } from "../../services/dashboardService";
import { DashboardResponse } from "../../types";

const fetcher = async () => {
    const res: DashboardResponse = await getDashboard();
    return res.data;
};

const DashboardCard = () => {
    const { data, error, isLoading } = useSWR("dashboard", fetcher);

    if (isLoading) {
        return <p className="text-gray-500 text-center py-4">Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center py-4">Gagal memuat data dashboard</p>;
    }

    if (!data) return null;

    const { stats, recent_transactions, overview } = data;

    return (
        <div>
            {stats && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatCard
                        iconBgClass="bg-blue-500"
                        icon={<LuWallet className="w-6 h-6 text-white" />}
                        title="Jumlah Saldo"
                        value={`Rp ${stats.saldo.toLocaleString("id-ID")}`}
                    />
                    <StatCard
                        iconBgClass="bg-green-500"
                        icon={<FaArrowTrendUp className="w-6 h-6 text-white" />}
                        title="Total Pendapatan"
                        value={`Rp ${stats.total_income.toLocaleString("id-ID")}`}
                    />
                    <StatCard
                        iconBgClass="bg-red-500"
                        icon={<FaArrowTrendDown className="w-6 h-6 text-white" />}
                        title="Total Pengeluaran"
                        value={`Rp ${stats.total_expense.toLocaleString("id-ID")}`}
                    />
                    <StatCard
                        iconBgClass="bg-yellow-500"
                        icon={<GrTransaction className="w-6 h-6 text-white" />}
                        title="Transaksi"
                        value={stats.total_transactions}
                    />
                </div>
            )}

            <div className="mt-4 grid grid-cols-1 gap-4">
                <InfoCard type="transaction" title="Transaksi Terkini" transactions={recent_transactions} />
                <InfoCard type="overview" title="Ikhtisar Keuangan" transactions={overview} />
            </div>
        </div>
    );
};

export default DashboardCard;
