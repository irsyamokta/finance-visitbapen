import EmptyState from "../empty/EmptyState";
import { FiClock, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { capitalizeWords } from "../../utils/capitalizeWord";
import { Transaction } from "../../types";

interface InfoCardProps {
    type: "transaction" | "overview";
    title: string;
    transactions?: Transaction[];
}

const InfoCard: React.FC<InfoCardProps> = ({ type, title, transactions }) => {
    let income = 0;
    let expense = 0;

    if (transactions && transactions.length > 0) {
        transactions.forEach((t) => {
            if (t.type === "income") {
                income += t.amount;
            } else {
                expense += t.amount;
            }
        });
    }

    let status = "Kesehatan Keuangan Sangat Baik!";
    let description = "Pendapatanmu melebihi pengeluaranmu. Teruskan!";
    let progress = 100;
    let barColor = "bg-emerald-500";
    let statusColor = "text-emerald-600";
    let boxColor = "bg-green-50";
    let overviewIcon = <FiTrendingUp className="text-emerald-500" size={24} />;

    if (expense > income) {
        status = "Peringatan: Pengeluaran Melebihi Pendapatan!";
        description =
            "Pengeluaran Anda lebih besar daripada penghasilan Anda. Pertimbangkan untuk mengurangi pengeluaran.";
        progress = Math.min(100, Math.round((income / expense) * 100));
        barColor = "bg-red-500";
        statusColor = "text-red-600";
        boxColor = "bg-red-50";
        overviewIcon = <FiTrendingDown className="text-red-500" size={24} />;
    } else {
        progress = Math.min(
            100,
            Math.round((income / (income + expense)) * 100)
        );
    }

    const formatAmount = (t: Transaction) => {
        const prefix = t.type === "income" ? "+" : "-";
        return `${prefix}Rp ${t.amount.toLocaleString()}`;
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200">
            <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    {type === "transaction" ? (
                        <FiClock className="text-emerald-500" size={24} />
                    ) : (
                        overviewIcon
                    )}
                    <h2 className="font-semibold">{title}</h2>
                </div>

                {type === "transaction" && transactions && (
                    <>
                        {transactions.length > 0 ? (
                            <div className="space-y-3">
                                {transactions.map((t, idx) => {
                                    const isIncome = t.type === "income";
                                    return (
                                        <div
                                            key={t.id ?? idx}
                                            className="flex items-center justify-between bg-slate-50 p-3 rounded-xl"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-2 rounded-lg ${isIncome ? "bg-emerald-500/20" : "bg-red-500/20"
                                                        }`}
                                                >
                                                    {isIncome ? (
                                                        <FiTrendingUp
                                                            className="text-emerald-500"
                                                            size={18}
                                                        />
                                                    ) : (
                                                        <FiTrendingDown
                                                            className="text-red-500"
                                                            size={18}
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{capitalizeWords(t.title)}</p>
                                                    <p className="text-sm text-slate-500">
                                                        {new Date(t.transaction_date).toLocaleDateString("id-ID")}

                                                    </p>
                                                </div>
                                            </div>
                                            <p
                                                className={`font-semibold ${isIncome ? "text-emerald-500" : "text-red-500"
                                                    }`}
                                            >
                                                {formatAmount(t)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <EmptyState
                                title="Belum ada transaksi"
                                description="Mulailah menambahkan transaksi pertama kamu"
                            />
                        )}
                    </>
                )}

                {type === "overview" && (
                    <>
                        {transactions && transactions.length > 0 ? (
                            <div>
                                <div className="w-full bg-slate-200 h-2 rounded-full mb-3">
                                    <div
                                        className={`h-2 ${barColor} rounded-full`}
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className={`${boxColor} p-6 rounded-xl`}>
                                    <p className={`${statusColor} font-semibold mb-1`}>
                                        {status}
                                    </p>
                                    <p className="text-sm text-slate-500">{description}</p>
                                </div>
                            </div>
                        ) : (
                            <EmptyState
                                title="Belum ada ikhtisar keuangan"
                                description="Tambahkan transaksi terlebih dahulu untuk melihat kesehatan keuanganmu"
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default InfoCard;
