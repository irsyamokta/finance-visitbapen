import { z } from "zod";

export const transactionSchema = z
    .object({
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
        financier: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.category === "Penjualan Tiket") {
            if (!data.name || data.name.trim() === "") {
                ctx.addIssue({
                    path: ["name"],
                    message: "Nama pembeli wajib diisi.",
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!data.ticket_id || data.ticket_id.trim() === "") {
                ctx.addIssue({
                    path: ["ticket_id"],
                    message: "Pilih tiket terlebih dahulu.",
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!data.quantity || data.quantity < 1) {
                ctx.addIssue({
                    path: ["quantity"],
                    message: "Jumlah pembelian minimal 1.",
                    code: z.ZodIssueCode.custom,
                });
            }
        }

        if (data.category === "Pemodalan") {
            if (!data.financier || data.financier.trim() === "") {
                ctx.addIssue({
                    path: ["financier"],
                    message: "Nama pemberi modal wajib diisi.",
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });

export type ITransactionPayload = z.infer<typeof transactionSchema>;
