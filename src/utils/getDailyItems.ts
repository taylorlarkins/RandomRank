import { supabase } from "../supabaseClient";
import { getMountainDateString } from "./getMountainDate";

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
