export function convertDate(date: string) {
    const d = new Date(date);
    const tanggal = d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const jam = d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return {
        tanggal,
        jam,
    };
}