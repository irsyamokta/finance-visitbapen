import { useState } from "react";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import Button from "../ui/button/Button";
import EmptyTable from "../empty/EmptyTable";
import DatePicker from "../form/DatePicker";
import type { DateRange } from "react-day-picker";

import { FiSearch, FiDownload, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";

function normalizeDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const TransactionTab = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [type, setType] = useState("all");

    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const transactions = [
        {
            subtitle: "Helo",
            type: "Income",
            category: "Salary",
            date: "2025-09-25",
            amount: "+Rp 9.999",
        },
        {
            subtitle: "Belanja",
            type: "Expense",
            category: "Shopping",
            date: "2025-09-24",
            amount: "-Rp 500.000",
        },
    ];

    let filteredTransactions = transactions.filter((t) =>
        t.subtitle.toLowerCase().includes(search.toLowerCase())
    );

    if (category !== "all") {
        filteredTransactions = filteredTransactions.filter(
            (t) => t.category.toLowerCase() === category
        );
    }

    if (type !== "all") {
        filteredTransactions = filteredTransactions.filter(
            (t) => t.type.toLowerCase() === type
        );
    }

    if (dateRange?.from && dateRange?.to) {
        filteredTransactions = filteredTransactions.filter((t) => {
            const txDate = normalizeDate(new Date(t.date));
            const from = normalizeDate(dateRange.from!);
            const to = normalizeDate(dateRange.to!);
            return txDate >= from && txDate <= to;
        });
    }

    return (
        <div className="p-6 bg-white border rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <GrTransaction size={24} className="text-emerald-500" />
                    <h2 className="text-lg font-semibold">Transaksi</h2>
                </div>
                <Button>
                    <FiDownload /> Unduh Data
                </Button>
            </div>

            {/* Search & Filter */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-6">
                <div className="relative col-span-2">
                    <Input
                        placeholder="Cari transaksi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <Select
                    options={[
                        { value: "all", label: "Semua Kategori" },
                        { value: "salary", label: "Salary" },
                        { value: "shopping", label: "Shopping" },
                    ]}
                    value={category}
                    onChange={setCategory}
                />
                <Select
                    options={[
                        { value: "all", label: "Semua Tipe" },
                        { value: "income", label: "Pendapatan" },
                        { value: "expense", label: "Pengeluaran" },
                    ]}
                    value={type}
                    onChange={setType}
                />

                {/* Range date */}
                <div className="col-span-2 lg:col-span-1">
                    <DatePicker
                        mode="range"
                        value={dateRange}
                        onChange={setDateRange}
                        placeholder="Rentang tanggal"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table className="text-sm text-left text-gray-400">
                    <TableHeader>
                        <TableRow className="border-b border-gray-400 text-gray-500">
                            <TableCell isHeader className="px-4 py-3 whitespace-nowrap">
                                Riwayat Transaksi
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3 whitespace-nowrap">
                                Kategori
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3 whitespace-nowrap">
                                Tanggal
                            </TableCell>
                            <TableCell isHeader className="px-4 py-3 whitespace-nowrap">
                                Jumlah
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((t, idx) => (
                                <TableRow
                                    key={idx}
                                    className="border-b border-gray-300 hover:bg-gray-300/10"
                                >
                                    <TableCell className="px-4 py-3 font-medium">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg ${t.type === "Income" ? "bg-green-600" : "bg-red-600"
                                                    }`}
                                            >
                                                {t.type === "Income" ? (
                                                    <FiTrendingUp color="white" />
                                                ) : (
                                                    <FiTrendingDown color="white" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-500 whitespace-nowrap">
                                                    {t.subtitle}
                                                </p>
                                                <span className="text-xs text-gray-400">{t.type}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 whitespace-nowrap">
                                        {t.category}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 whitespace-nowrap">
                                        {t.date}
                                    </TableCell>
                                    <TableCell
                                        className={`px-4 py-3 font-semibold ${t.type === "Income"
                                            ? "text-green-400"
                                            : "text-red-400 whitespace-nowrap"
                                            }`}
                                    >
                                        {t.amount}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <EmptyTable
                                colspan={4}
                                title="Belum ada transaksi"
                                description="Mulailah dengan menambahkan transaksi pertama Anda."
                            />
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TransactionTab;
