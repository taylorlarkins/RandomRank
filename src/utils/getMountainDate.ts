export function getMountainDateString() {
  const now = new Date();
  const mstTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Denver" }));
  const year = mstTime.getFullYear();
  const month = String(mstTime.getMonth() + 1).padStart(2, "0");
  const day = String(mstTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}