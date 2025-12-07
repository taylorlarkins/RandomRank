import { supabase } from "../supabaseClient";
import { getMountainDateString } from "./getMountainDate";

export async function getDailyItems() {
  const today = getMountainDateString();

  const { data, error } = await supabase
    .from("daily_items")
    .select("items")
    .eq("date", today)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error(`No daily items found for ${today}`);
  }
  return data.items;
}
