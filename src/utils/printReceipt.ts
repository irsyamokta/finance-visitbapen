import qz from "qz-tray";

interface PrintTicketPayload {
    buyer_name: string;
    items: {
        category_name: string;
        quantity: number;
    }[];
    total_price: number;
    ticket_details: {
        qr_code: string;
    }[];
}

export async function printReceipt({
    buyer_name,
    items,
    total_price,
    ticket_details,
}: PrintTicketPayload) {
    if (!buyer_name || !items?.length || !ticket_details?.length) return;

    try {
        if (!qz.websocket.isActive()) {
            await qz.websocket.connect({
                host: "print.soetala.id",
                usingSecure: true,
            });
        }

        const printer = await qz.printers.find("POS80 Printer");
        const config = qz.configs.create(printer as any);

        const printData: any[] = [];

        printData.push({ type: "raw", data: "\x1B\x40" });

        printData.push({ type: "raw", data: "\x1B\x61\x01" });
        printData.push({ type: "raw", data: "\x1B!\x30" });
        printData.push({ type: "raw", data: "VISITBAPEN\n\n" });

        printData.push({ type: "raw", data: "\x1B!\x00" });
        printData.push({ type: "raw", data: "\x1B\x61\x00" });
        printData.push({ type: "raw", data: `Nama Pembeli : ${buyer_name}\n` });
        printData.push({ type: "raw", data: "----------------------------\n" });

        const ticket = items[0];
        printData.push({
            type: "raw",
            data: `${ticket.category_name} x${ticket.quantity}\n`,
        });

        printData.push({ type: "raw", data: "----------------------------\n" });
        printData.push({
            type: "raw",
            data: `Total : Rp${total_price.toLocaleString("id-ID")}\n\n`,
        });

        const qr = ticket_details[0].qr_code;
        const size = 8;
        const ec = 49;
        const pL = (qr.length + 3) % 256;
        const pH = Math.floor((qr.length + 3) / 256);

        printData.push({ type: "raw", data: "\x1B\x61\x01" });
        printData.push({ type: "raw", data: "\x1D\x28\x6B\x03\x00\x31\x41\x32" });
        printData.push({
            type: "raw",
            data: `\x1D\x28\x6B\x03\x00\x31\x43${String.fromCharCode(size)}`,
        });
        printData.push({
            type: "raw",
            data: `\x1D\x28\x6B\x03\x00\x31\x45${String.fromCharCode(ec)}`,
        });
        printData.push({
            type: "raw",
            data: `\x1D\x28\x6B${String.fromCharCode(pL)}${String.fromCharCode(
                pH
            )}\x31\x50\x30${qr}`,
        });
        printData.push({ type: "raw", data: "\x1D\x28\x6B\x03\x00\x31\x51\x30\n" });

        printData.push({ type: "raw", data: "\x1B\x61\x01" });
        printData.push({ type: "raw", data: "Terima kasih telah berkunjung\n\n\n" });
        printData.push({ type: "raw", data: "\x1B\x69" });

        await qz.print(config, printData);
    } catch (err) {
        console.error("Print error:", err);
        throw err;
    } finally {
        if (qz.websocket.isActive()) {
            try {
                await qz.websocket.disconnect();
                console.log("QZ Tray disconnected.");
            } catch (e) {
                console.warn("Failed to disconnect QZ Tray:", e);
            }
        }
    }
}
