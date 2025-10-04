import { z } from "zod";

export const transactionSchema = z.object({
    user_id: z.string().optional(),
    title: z.string()
        .nonempty({ message: "Judul wajib diisi." })
        .max(255, { message: "Judul maksimal 255 karakter." }),
    amount: z.number()
        .nonnegative({ message: "Jumlah tidak boleh negatif." }),
    type: z.enum(["income", "expense"], { message: "Tipe harus pendapatan atau pengeluaran." }),
    category: z.string()
        .nonempty({ message: "Kategori wajib diisi." }),
    transaction_date: z.date({ message: "Tanggal transaksi wajib diisi." }),
    name: z.string().optional(),
    ticket_id: z.string().optional(),
    quantity: z.number().min(1, { message: "Jumlah pembelian minimal 1." }).optional(),
});

export type ITransactionPayload = z.infer<typeof transactionSchema>;
