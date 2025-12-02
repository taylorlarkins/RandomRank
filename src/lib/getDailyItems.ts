import { supabase } from "../supabaseClient";

function getMountainDateString() {
  const now = new Date();
  // convert to MST by offset -7 hours
  const mstTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Denver" }));
  const year = mstTime.getFullYear();
  const month = String(mstTime.getMonth() + 1).padStart(2, "0");
  const day = String(mstTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


export async function getDailyItems() {
  const today = getMountainDateString();

  const { data, error } = await supabase
    .from("daily_items")
    .select("items")
    .eq("date", today)
    .single();

  if (error) throw error;
  return data.items;
}
