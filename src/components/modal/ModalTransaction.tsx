import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AxiosError } from "axios";
import { format } from "date-fns-tz";

import { transactionSchema, ITransactionPayload } from "../../utils/validator/transactionValidator";
import { createTransaction, updateTransaction } from "../../services/transactionService";

import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import CurrencyInput from "../form/input/CurrencyInput";
import DatePicker from "../form/DatePicker";
import Select from "../form/Select";
import Label from "../form/Label";
import Button from "../ui/button/Button";

interface ModalTransactionProps {
    isOpen: boolean;
    onClose: () => void;
    mutateData: () => void;
    initialData?: any | null;
}

export const ModalTransaction = ({ isOpen, onClose, mutateData, initialData }: ModalTransactionProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const incomeCategories = [
        { value: "Penjualan Batik", label: "Penjualan Batik" },
        { value: "Penjualan Tiket", label: "Penjualan Tiket" },
        { value: "Pemodalan", label: "Pemodalan" },
        { value: "Penjualan Tiket", label: "Penjualan Tiket" },
        { value: "Lainnya", label: "Lainnya" },
    ];

    const expenseCategories = [
        { value: "Operasional", label: "Biaya Operasional" },
        { value: "Pemasaran", label: "Pemasaran" },
        { value: "Akomodasi", label: "Akomodasi" },
        { value: "Lainnya", label: "Lainnya" },
    ];

    const timeZone = "Asia/Jakarta";

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
        setValue,
        watch
    } = useForm<ITransactionPayload>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            title: "",
            amount: 0,
            type: "income",
            category: "",
            transaction_date: new Date(),
        },
    });

    const type = watch("type");

    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title || "",
                amount: initialData.amount || 0,
                type: initialData.type || "income",
                category: initialData.category || "",
                transaction_date: initialData.transaction_date ? new Date(initialData.transaction_date) : new Date(),
            });
        } else {
            reset({
                title: "",
                amount: 0,
                type: "income",
                category: "",
                transaction_date: new Date(),
            });
        }
    }, [initialData, reset, isOpen]);

    const onSubmit = async (data: ITransactionPayload) => {
        try {
            setIsLoading(true);

            const payload = {
                title: data.title,
                amount: data.amount,
                type: data.type,
                category: data.category,
                transaction_date: format(data.transaction_date, "yyyy-MM-dd HH:mm:ss", { timeZone }),
            };

            if (initialData) {
                await updateTransaction(initialData.id, payload);
                toast.success("Transaksi berhasil diperbarui!");
                onClose();
                reset();
            } else {
                await createTransaction(payload);
                toast.success("Transaksi berhasil ditambahkan!");
                onClose();
                reset();
            }

            mutateData();
            onClose();
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Gagal menyimpan transaksi.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xs xsm:max-w-sm sm:max-w-lg">
            <div className="p-6 bg-white rounded-lg dark:bg-gray-900">
                <h4 className="text-xl font-semibold mb-4">
                    {initialData ? "Edit Transaksi" : "Tambah Transaksi"}
                </h4>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Title */}
                    <div>
                        <Label required>Judul</Label>
                        <Input {...register("title")} placeholder="Masukkan judul transaksi" />
                        {errors.title && <p className="text-sm text-red-500 mt-2">{errors.title.message}</p>}
                    </div>

                    {/* Amount */}
                    <div>
                        <Label required>Jumlah (Rp)</Label>
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <CurrencyInput
                                    value={field.value}
                                    onChange={(val) => field.onChange(val)}
                                    placeholder="0"
                                />
                            )}
                        />
                        {errors.amount && <p className="text-sm text-red-500 mt-2">{errors.amount.message}</p>}
                    </div>

                    {/* Type */}
                    <div>
                        <Label required>Tipe</Label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        className={`w-full px-4 py-3 rounded-lg text-sm ${field.value === "income"
                                            ? "bg-green-100 border-2 border-green-500 text-green-500"
                                            : "bg-gray-100 border-2 border-gray-200 text-gray-300"
                                            }`}
                                        onClick={() => setValue("type", "income")}
                                    >
                                        Pendapatan
                                    </button>
                                    <button
                                        type="button"
                                        className={`w-full px-4 py-3 rounded-lg text-sm ${field.value === "expense"
                                            ? "bg-red-100 border-2 border-red-500 text-red-500"
                                            : "bg-gray-100 border-2 border-gray-200 text-gray-300"
                                            }`}
                                        onClick={() => setValue("type", "expense")}
                                    >
                                        Pengeluaran
                                    </button>
                                </div>
                            )}
                        />
                        {errors.type && <p className="text-sm text-red-500 mt-2">{errors.type.message}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <Label required>Kategori</Label>
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={type === "income" ? incomeCategories : expenseCategories}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.category && <p className="text-sm text-red-500 mt-2">{errors.category.message}</p>}
                    </div>

                    {/* Date */}
                    <div>
                        <Label required>Tanggal</Label>
                        <Controller
                            name="transaction_date"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    mode="single"
                                    value={field.value}
                                    onChange={(date) => field.onChange(date ?? new Date())}
                                    placeholder="Pilih tanggal"
                                />
                            )}
                        />
                        {errors.transaction_date && <p className="text-sm text-red-500 mt-2">{errors.transaction_date.message}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Batal
                        </Button>
                        <Button type="submit" variant="default" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                                    Loading...
                                </>
                            ) : (
                                "Simpan"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
