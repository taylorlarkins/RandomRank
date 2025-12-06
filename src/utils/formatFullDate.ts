export function formatFullDate(dateStr: string): string {
  // Force Mountain Time interpretation
  const date = new Date(`${dateStr}T00:00:00-07:00`);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const suffix =
    day === 1 || day === 21 || day === 31 ? "st" :
    day === 2 || day === 22 ? "nd" :
    day === 3 || day === 23 ? "rd" :
    "th";

  return `${month} ${day}${suffix}, ${year}`;
}
