import { useState } from "react";

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
}

export const ModalTransaction = ({ isOpen, onClose }: ModalTransactionProps) => {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [type, setType] = useState<"income" | "expense">("income");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState<Date | undefined>();

    const incomeCategories = [
        { value: "salary", label: "Salary" },
        { value: "bonus", label: "Bonus" },
        { value: "investment", label: "Investment" },
    ];

    const expenseCategories = [
        { value: "food", label: "Food" },
        { value: "transport", label: "Transport" },
        { value: "other", label: "Other Expense" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            description: title,
            amount,
            type,
            category,
            date,
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-xs xsm:max-w-sm sm:max-w-lg">
            <div className="p-6 bg-white rounded-lg dark:bg-gray-900">
                <h4 className="text-xl font-semibold mb-4">Tambah Transaksi</h4>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                            e.preventDefault();
                        }
                    }}
                >
                    {/* Title */}
                    <div>
                        <Label required={true}>Judul</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Masukkan judul transaksi"
                            required
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <Label required={true}>Jumlah (Rp)</Label>
                        <CurrencyInput
                            value={amount}
                            onChange={(e) => setAmount(e)}
                            placeholder="0"
                        />
                    </div>

                    {/* Type */}
                    <div className="w-full">
                        <Label required={true}>Type</Label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className={`${type === "income"
                                    ? "w-full px-4 py-3 bg-green-100 border-2 border-green-500 rounded-lg text-sm text-green-500"
                                    : "w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg text-sm text-gray-300 hover:border-gray-300 hover:text-gray-400 transition-colors duration-200"
                                    }`}
                                onClick={() => setType("income")}
                            >
                                Pendapatan
                            </button>
                            <button
                                type="button"
                                className={`${type === "expense"
                                    ? "w-full px-4 py-3 bg-red-100 border-2 border-red-500 rounded-lg text-sm text-red-500"
                                    : "w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg text-sm text-gray-300 hover:border-gray-300 hover:text-gray-400 transition-colors duration-200"
                                    }`}
                                onClick={() => setType("expense")}
                            >
                                Pengeluaran
                            </button>

                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <Label required={true}>Kategori</Label>
                        <Select
                            value={category}
                            onChange={(value) => setCategory(value)}
                            options={type === "income" ? incomeCategories : expenseCategories}
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <Label required={true}>Tanggal</Label>
                        <DatePicker
                            mode="single"
                            value={date}
                            onChange={setDate}
                            placeholder="Pilih tanggal"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" variant="default">
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
