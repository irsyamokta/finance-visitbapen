import useSWR from "swr";
import { getAnalytics } from "../../services/transactionService";
import AnalyticsCard from "../cards/AnalyticCard";
import { FiClock, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function AnalyticTab() {
    const { data, error, isLoading } = useSWR("analytics", getAnalytics);

    if (isLoading) return;
    if (error) return <p className="text-red-500">Failed to load data</p>;

    const {
        expense_breakdown = [],
        income_sources = [],
        monthly_trends = [],
    } = data.data;

    return (
        <div className="flex flex-col justify-center gap-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnalyticsCard
                    icon={<FiTrendingUp size={24} className="text-emerald-500"/>}
                    type="income"
                    title="Sumber Pendapatan"
                    data={income_sources}
                />
                <AnalyticsCard
                    icon={<FiTrendingDown size={24} className="text-red-500"/>}
                    type="expense"
                    title="Rincian Pengeluaran"
                    data={expense_breakdown}
                />
            </div>
            <AnalyticsCard
                icon={<FiClock size={24} className="text-emerald-500"/>}
                type="trends"
                title="Tren Bulanan"
                data={monthly_trends}
            />
        </div>
    );
}
