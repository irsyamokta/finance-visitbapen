
/**
 * Capitalize huruf pertama di tiap kata.
 * @param str string input
 * @returns string dengan huruf pertama tiap kata kapital
 */
export function capitalizeWords(str: string): string {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(" ")
        .filter((word) => word.trim() !== "")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
