import { z } from "zod";

export const transactionSchema = z.object({
    title: z.string().min(1, "Judul transaksi wajib diisi.").max(255, "Judul transaksi maksimal 255 karakter."),
    amount: z
        .number({ invalid_type_error: "Jumlah transaksi harus berupa angka." })
        .min(0, "Jumlah transaksi tidak boleh negatif."),
    type: z.enum(["income", "expense"], { required_error: "Tipe transaksi wajib diisi." }),
    category: z.string().min(1, "Kategori transaksi wajib diisi.").max(255, "Kategori transaksi maksimal 255 karakter."),
    transaction_date: z.date({ required_error: "Tanggal transaksi wajib diisi." }),
});

export type ITransactionPayload = z.infer<typeof transactionSchema>;
