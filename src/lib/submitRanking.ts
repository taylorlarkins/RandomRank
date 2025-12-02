import { supabase } from "../supabaseClient";

export async function submitRanking(items: string[]) {
  const { data, error } = await supabase
    .rpc("submit_ranking", { ranked_items: items });

  if (error) throw new Error(error.message);
  return data;
}

