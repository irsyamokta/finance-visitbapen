import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { format } from "date-fns-tz";
import useSWR from "swr";

import { useAuth } from "../../context/AuthContext";
import { getSettings } from "../../services/settingService";
import { getTickets } from "../../services/ticketService";
import { transactionSchema, ITransactionPayload } from "../../utils/validator/transactionValidator";
import { createTransaction, getOrderPrintData, updateTransaction } from "../../services/transactionService";
import { formatCurrency } from "../../utils/currencyFormatter";
import { printReceipt } from "../../utils/printReceipt";

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
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const { user } = useAuth();
    const isTourismRole = user?.role === "finance_tourism" || user?.role === "admin_tourism";

    const { data: response = [] } = useSWR("settings", getSettings, { suspense: true });
    const { data: ticket = [] } = useSWR("tickets", getTickets, { suspense: true });

    const ticketOptions = ticket.map((item: { id: string; title: string }) => ({
        value: item.id,
        label: item.title,
    }));

    const currentType =
        user?.role === "finance_tourism" || user?.role === "admin_tourism"
            ? "tourism"
            : user?.role === "finance_batik" || user?.role === "admin_batik"
                ? "batik"
                : null;

    const incomeCategories =
        response
            ?.filter(
                (item: { category: string; type?: string }) =>
                    item.category === "Pendapatan" &&
                    (!currentType || item.type === currentType)
            )
            .map((item: { name: string }) => ({
                value: item.name,
                label: item.name,
            })) ?? [];

    const expenseCategories =
        response
            ?.filter(
                (item: { category: string; type?: string }) =>
                    item.category === "Pengeluaran" &&
                    (!currentType || item.type === currentType)
            )
            .map((item: { name: string }) => ({
                value: item.name,
                label: item.name,
            })) ?? [];

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
            name: "",
            ticket_id: "",
            quantity: 1,
            financier: "",
        },
    });

    const type = watch("type");

    useEffect(() => {
        if (initialData) {
            reset({
                user_id: initialData.user_id || user?.id || "",
                title: initialData.title || "",
                amount: initialData.amount || 0,
                type: initialData.type || "income",
                category: initialData.category || "",
                transaction_date: initialData.transaction_date ? new Date(initialData.transaction_date) : new Date(),
                name: initialData.name || "",
                ticket_id: initialData.ticket_id || "",
                quantity: initialData.quantity || 1,
                financier: initialData.financier || "",
            });
            setSelectedTicketId(initialData.ticket_id || null);
            setQuantity(initialData.quantity || 1);
        } else {
            reset({
                user_id: user?.id || "",
                title: "",
                amount: 0,
                type: "income",
                category: "",
                transaction_date: new Date(),
                name: "",
                ticket_id: "",
                quantity: 1,
                financier: "",
            });
            setSelectedTicketId(null);
            setQuantity(1);
        }
    }, [initialData, reset, isOpen, user?.id]);

    useEffect(() => {
        if (selectedTicketId && quantity >= 1) {
            const selectedTicket = ticket.find((t: { id: string }) => t.id === selectedTicketId);
            if (selectedTicket) {
                setValue("amount", selectedTicket.price * quantity);
                setValue("ticket_id", selectedTicketId);
                setValue("quantity", quantity);
            }
        } else {
            setValue("ticket_id", "");
            setValue("quantity", 1);
        }
    }, [selectedTicketId, quantity, setValue, ticket]);

    // const onSubmit = async (data: ITransactionPayload) => {
    //     const payload = {
    //         ...data,
    //         user_id: user?.id || "",
    //         transaction_date: format(data.transaction_date, "yyyy-MM-dd HH:mm:ss", { timeZone }),
    //     };

    //     try {
    //         setIsLoading(true);

    //         if (initialData) {
    //             await updateTransaction(initialData.id, payload);
    //             toast.success("Transaksi berhasil diperbarui!");
    //         } else {
    //             await createTransaction(payload);
    //             toast.success("Transaksi berhasil ditambahkan!");
    //         }

    //         mutateData();
    //         onClose();
    //         reset();
    //     } catch (error: any) {
    //         toast.error("Terjadi kesalahan saat menyimpan transaksi.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const onSubmit = async (data: ITransactionPayload) => {
        const payload = {
            ...data,
            user_id: user?.id || "",
            transaction_date: format(
                data.transaction_date,
                "yyyy-MM-dd HH:mm:ss",
                { timeZone }
            ),
        };

        try {
            setIsLoading(true);

            let response;

            if (initialData) {
                response = await updateTransaction(initialData.id, payload);
                toast.success("Transaksi berhasil diperbarui!");
            } else {
                response = await createTransaction(payload);
                toast.success("Transaksi berhasil ditambahkan!");
            }

            if (
                payload.type === "income" &&
                payload.category === "Penjualan Tiket" &&
                response?.data.order_id
            ) {
                const printData = await getOrderPrintData(response.data.order_id);
                console.log(printData);
                await printReceipt(printData);
                console.log(printData);
            }

            mutateData();
            onClose();
            reset();
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan transaksi.");
        } finally {
            setIsLoading(false);
        }
    };

    const selectedTicket = selectedTicketId ? ticket.find((t: { id: string }) => t.id === selectedTicketId) : null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xs xsm:max-w-sm sm:max-w-[700px]">
            <div className="no-scrollbar relative w-full max-w-[700px] max-h-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <h4 className="text-xl font-semibold mb-4">
                    {initialData ? "Edit Transaksi" : "Tambah Transaksi"}
                </h4>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                            e.preventDefault();
                        }
                    }}
                    className="flex flex-col gap-4"
                >
                    <div className="grid grid-cols-1 gap-4">
                        {/* Title */}
                        <div>
                            <Label required>Judul</Label>
                            <Input {...register("title")} placeholder="Masukkan judul transaksi" />
                            {errors.title && <p className="text-sm text-red-500 mt-2">{errors.title.message}</p>}
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
                                            className={`w-full px-4 py-2 rounded-lg text-sm ${field.value === "income"
                                                ? "bg-green-100 border-2 border-green-500 text-green-500"
                                                : "bg-gray-100 border-2 border-gray-200 text-gray-300"
                                                }`}
                                            onClick={() => setValue("type", "income")}
                                        >
                                            Pendapatan
                                        </button>
                                        <button
                                            type="button"
                                            className={`w-full px-4 py-2 rounded-lg text-sm ${field.value === "expense"
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

                    {/* Ticket Selection (only for tourism roles and income type) */}
                    {type === "income" && (
                        <>
                            {/* Jika kategori = Penjualan Tiket */}
                            {isTourismRole && watch("category") === "Penjualan Tiket" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label required>Pilih Tiket</Label>
                                        <Select
                                            options={ticketOptions}
                                            value={selectedTicketId || ""}
                                            onChange={(value) => setSelectedTicketId(value)}
                                        />
                                    </div>

                                    {selectedTicket && (
                                        <>
                                            <div>
                                                <Label required>Nama Pembeli</Label>
                                                <Input {...register("name")} placeholder="Masukkan nama pembeli" />
                                                {errors.name && <p className="text-sm text-red-500 mt-2">{errors.name.message}</p>}
                                            </div>

                                            <div>
                                                <Label>Harga Tiket</Label>
                                                <p className="px-4 py-2 rounded-lg bg-gray-100 text-sm text-gray-700">
                                                    {formatCurrency(selectedTicket.price)}
                                                </p>
                                            </div>

                                            <div>
                                                <Label required>Jumlah Pembelian</Label>
                                                <CurrencyInput
                                                    value={quantity}
                                                    onChange={(value) => setQuantity(value)}
                                                    placeholder="Masukkan jumlah pembelian"
                                                />
                                                {errors.quantity && <p className="text-sm text-red-500 mt-2">{errors.quantity.message}</p>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Jika kategori = Pemodalan */}
                            {(watch("category") === "Pemodalan Wisata" || watch("category") === "Pemodalan Batik") && (
                                <div>
                                    <Label required>Nama Pemberi Modal</Label>
                                    <Input {...register("financier")} placeholder="Masukkan nama pemberi modal" />
                                    {errors.financier && <p className="text-sm text-red-500 mt-2">{errors.financier.message}</p>}
                                </div>
                            )}
                        </>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-4">
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