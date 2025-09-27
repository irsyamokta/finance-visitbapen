import StatCard from "../cards/StatsCard";
import InfoCard from "../cards/InfoCard";
import { LuWallet } from "react-icons/lu";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";

const transactions = [
    {
        subtitle: "Pemasukan",
        date: "Sep 25, 2025",
        category: "Salary",
        amount: "+Rp 10.000.000",
    },
    {
        subtitle: "Belanja",
        date: "Sep 24, 2025",
        category: "Shopping",
        amount: "+Rp 11.500.000",
    },
    {
        subtitle: "Makan",
        date: "Sep 23, 2025",
        category: "Food",
        amount: "+Rp 2.200.000",
    },
    {
        subtitle: "Bonus",
        date: "Sep 22, 2025",
        category: "Work",
        amount: "-Rp 2.000.000",
    },
    {
        subtitle: "Transport",
        date: "Sep 21, 2025",
        category: "Grab",
        amount: "-Rp 50.000",
    },
    {
        subtitle: "Cicilan",
        date: "Sep 20, 2025",
        category: "Loan",
        amount: "-Rp 500.000",
    },
];

const DashboardCard = () => {
    return (
        <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatCard iconBgClass="bg-blue-500" icon={<LuWallet className="w-6 h-6 text-white" />} title="Jumlah Saldo" value="10" />
                <StatCard iconBgClass="bg-green-500" icon={<FaArrowTrendUp className="w-6 h-6 text-white" />} title="Total Pendapatan" value="10" />
                <StatCard iconBgClass="bg-red-500" icon={<FaArrowTrendDown className="w-6 h-6 text-white" />} title="Total Pengeluaran" value="10" />
                <StatCard iconBgClass="bg-yellow-500" icon={<GrTransaction className="w-6 h-6 text-white" />} title="Transaksi" value="10" />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4">
                <InfoCard
                    type="transaction"
                    title="Transaksi Terkini"
                    transactions={transactions.slice(0, 5)}
                />
                <InfoCard
                    type="overview"
                    title="Ikhtisar Keuangan"
                    transactions={transactions}
                />

            </div>
        </div>
    )
}

export default DashboardCard;