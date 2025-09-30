import { ReactNode } from "react";
import EmptyState from "../empty/EmptyState";
import { FaCircle } from "react-icons/fa";

interface AnalyticsCardProps {
    icon: ReactNode,
    type: "expense" | "income" | "trends";
    title: string;
    data?: any[];
}

export default function AnalyticsCard({ icon, type, title, data }: AnalyticsCardProps) {
    const hasData = data && data.length > 0;

    const renderContent = () => {
        if (!hasData) {
            if (type === "expense") {
                return (
                    <EmptyState
                        title="Belum ada data pengeluaran"
                        description="Tambahkan transaksi pengeluaran untuk melihat rincian"
                    />
                );
            }
            if (type === "income") {
                return (
                    <EmptyState
                        title="Belum ada data pendapatan"
                        description="Tambahkan transaksi pendapatan untuk melihat sumber pemasukan"
                    />
                );
            }
            if (type === "trends") {
                return (
                    <EmptyState
                        title="Belum ada tren bulanan"
                        description="Tambahkan transaksi untuk melihat tren keuangan"
                    />
                );
            }
        }

        switch (type) {
            case "expense":
            case "income":
                return (
                    <ul className="space-y-3">
                        {data!.map((item, idx) => (
                            <li
                                key={idx}
                                className={`flex justify-between items-center ${type == "expense" ? 'bg-red-50' : 'bg-emerald-50'} p-3 rounded-xl`}
                            >
                                <div className="flex items-center gap-2">
                                    {type == "expense" ? <FaCircle className="text-red-500" /> : <FaCircle className="text-emerald-500" />}

                                    <span>{item.category}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="font-semibold">
                                        Rp {item.amount.toLocaleString("id-ID")}
                                    </span>
                                    <p className="text-xs">({item.percentage}%)</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                );

            case "trends":
                return (
                    <ul className="space-y-3">
                        {data!.map((item, idx) => (
                            <li
                                key={idx}
                                className="flex flex-col md:flex-row justify-between md:items-center bg-slate-50 p-3 rounded-xl"
                            >
                                <span className="font-medium">{item.month}</span>
                                <div className="text-right flex gap-8 mt-2 md:mt-0">
                                    <p className="text-sm md:text-base text-emerald-500 flex flex-col">
                                        +Rp {item.income.toLocaleString("id-ID")}
                                        <span className="text-gray-500 text-xs">Pendapatan</span>
                                    </p>
                                    <p className="text-sm md:text-base text-red-500 flex flex-col">
                                        -Rp {item.expenses.toLocaleString("id-ID")}
                                        <span className="text-gray-500 text-xs">Pengeluaran</span>
                                    </p>
                                    <p
                                        className={`text-sm md:text-base flex flex-col ${item.net >= 0
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                            } font-semibold`}
                                    >
                                        Rp {item.net.toLocaleString("id-ID")}
                                        <span className="text-gray-500 text-xs font-normal">Net</span>
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex gap-2 items-center mb-4">
                {icon}
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            {renderContent()}
        </div>
    );
}
