import { useState } from "react";
import useSWR from "swr";
import { useAuth } from "../../context/AuthContext";
import {
    getTransactions,
    deleteTransaction,
    exportTransaction,
} from "../../services/transactionService";
import { getSettings } from "../../services/settingService";

import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui/table";
import Button from "../ui/button/Button";
import EmptyTable from "../empty/EmptyTable";
import DatePicker from "../form/DatePicker";
import type { DateRange } from "react-day-picker";

import { confirmDialog } from "../../utils/confirmationAlert";
import { toast } from "react-toastify";
import {
    FiPlus,
    FiSearch,
    FiDownload,
    FiTrendingUp,
    FiTrendingDown,
    FiEdit2,
    FiTrash2,
} from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";
import { ModalTransaction } from "../modal/ModalTransaction";
import { format } from "date-fns";
import Pagination from "../ui/pagination/Pagination";
import { capitalizeWords } from "../../utils/capitalizeWord";

const TransactionTab = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [type, setType] = useState("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<any | null>(null);

    const [currentPage, setCurrentPage] = useState(1);

    const { user } = useAuth();
    const canManage = ["admin_batik", "admin_tourism"].includes(user?.role || "");

    const { data, isLoading, mutate } = useSWR(
        ["transactions", currentPage, search, category, type, dateRange],
        () =>
            getTransactions({
                page: currentPage,
                search: search || undefined,
                category: category !== "all" ? category : undefined,
                type: type !== "all" ? type : undefined,
                start_date: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
                end_date: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
            }),
        { revalidateOnFocus: false }
    );

    const { data: response = [] } = useSWR("settingOptions", getSettings, { suspense: true });

    const allCategories =
        response
            ?.filter((item: { category: string }) =>
                ["Pendapatan", "Pengeluaran"].includes(item.category)
            )
            .map((item: { name: string }) => ({
                value: item.name,
                label: item.name,
            })) ?? [];


    const transactions = data?.data?.data || [];
    const lastPage = data?.data?.last_page || 1;
    const total = data?.data?.total || 0;

    const handleEdit = (tx: any) => {
        setSelectedTx(tx);
        setModalOpen(true);
    };

    const handleExport = async () => {
        try {
            let params: any = {};
            if (dateRange?.from && dateRange?.to) {
                params.start_date = format(dateRange.from, "yyyy-MM-dd");
                params.end_date = format(dateRange.to, "yyyy-MM-dd");
            }
            if (search) params.search = search;
            if (category !== "all") params.category = category;
            if (type !== "all") params.type = type;

            await exportTransaction(params);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Tidak ada data transaksi untuk diunduh");
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = await confirmDialog({
            title: "Hapus Transaksi",
            text: "Apakah Anda yakin ingin menghapus transaksi ini?",
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
        });
        if (!confirmed) return;

        try {
            await deleteTransaction(id);
            toast.success("Transaksi berhasil dihapus!");
            mutate();
        } catch (err) {
            toast.error("Gagal menghapus transaksi");
        }
    };

    return (
        <div className="p-6 bg-white border rounded-xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <GrTransaction size={24} className="text-emerald-500" />
                    <h2 className="text-lg font-semibold">Transaksi</h2>
                </div>
                <div className="flex w-full sm:w-auto flex-row gap-2">
                    <div className="w-full sm:w-auto">
                        <Button
                            onClick={() => {
                                setSelectedTx(null);
                                setModalOpen(true);
                            }}
                            className="w-full"
                        >
                            <FiPlus /> Tambah
                        </Button>
                    </div>
                    <div className="w-full sm:w-auto">
                        <Button onClick={handleExport} className="w-full">
                            <FiDownload /> Unduh
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-6">
                <div className="relative col-span-2">
                    <Input
                        placeholder="Cari transaksi..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-10"
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <Select
                    options={[
                        { value: "all", label: "Semua Kategori" },
                        ...allCategories,   
                    ]}
                    value={category}
                    onChange={(val) => {
                        setCategory(val);
                        setCurrentPage(1);
                    }}
                />
                <Select
                    options={[
                        { value: "all", label: "Semua Tipe" },
                        { value: "income", label: "Pendapatan" },
                        { value: "expense", label: "Pengeluaran" },
                    ]}
                    value={type}
                    onChange={(val) => {
                        setType(val);
                        setCurrentPage(1);
                    }}
                />
                <div className="col-span-2 lg:col-span-1">
                    <DatePicker
                        mode="range"
                        value={dateRange}
                        onChange={(range) => {
                            setDateRange(range);
                            setCurrentPage(1);
                        }}
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
                            {canManage && (
                                <TableCell isHeader className="px-4 py-3 whitespace-nowrap">
                                    Aksi
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center p-4">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : transactions.length > 0 ? (
                            transactions.map((t: any, idx: number) => (
                                <TableRow key={idx} className="border-b border-gray-300 hover:bg-gray-300/10">
                                    <TableCell className="px-4 py-3 font-medium">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 flex items-center justify-center rounded-lg ${t.type === "income" ? "bg-green-600" : "bg-red-600"
                                                    }`}
                                            >
                                                {t.type === "income" ? (
                                                    <FiTrendingUp color="white" />
                                                ) : (
                                                    <FiTrendingDown color="white" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-500 whitespace-nowrap">
                                                    {capitalizeWords(t.title)}
                                                </p>
                                                <span className="text-xs text-gray-400">
                                                    {t.type === "income" ? "Pendapatan" : "Pengeluaran"}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 whitespace-nowrap">
                                        {t.category}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 whitespace-nowrap">
                                        {new Date(t.transaction_date).toLocaleDateString("id-ID")}
                                    </TableCell>
                                    <TableCell
                                        className={`px-4 py-3 font-semibold ${t.type === "income"
                                            ? "text-green-400 whitespace-nowrap"
                                            : "text-red-400 whitespace-nowrap"
                                            }`}
                                    >
                                        Rp {t.amount.toLocaleString("id-ID")}
                                    </TableCell>
                                    {canManage && (
                                        <TableCell className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(t)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <EmptyTable
                                colspan={5}
                                title="Belum ada transaksi"
                                description="Mulailah dengan menambahkan transaksi pertama Anda."
                            />
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {total > 0 && (
                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    total={total}
                    onPageChange={(page: number) => setCurrentPage(page)}
                />
            )}

            {/* Modal */}
            {modalOpen && (
                <ModalTransaction
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    mutateData={mutate}
                    initialData={selectedTx}
                />
            )}
        </div>
    );
};

export default TransactionTab;
