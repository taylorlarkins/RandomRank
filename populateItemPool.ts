import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const wordnikApiKey = process.env.WORDNIK_API_KEY;

if (!supabaseUrl) throw new Error("Missing VITE_SUPABASE_URL env variable");
if (!supabaseServiceRole) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY env variable");
if (!wordnikApiKey) throw new Error("Missing WORDNIK_API_KEY env variable");

const supabase = createClient(supabaseUrl, supabaseServiceRole);

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchBatchWords(batchSize = 100): Promise<string[]> {
  const url = `https://api.wordnik.com/v4/words.json/randomWords` +
    `?hasDictionaryDef=true` +
    `&includePartOfSpeech=noun,adjective` +
    `&minLength=3` +
    `&minDictionaryCount=3` +
    `&minCorpusCount=5000` +
    `&excludePartOfSpeech=abbreviation,given-name,family-name,noun-plural` +
    `&limit=${batchSize}` +
    `&api_key=${wordnikApiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Wordnik API error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.map((w: any) => w.word.trim().toLowerCase());
  } catch (err) {
    console.error("Error fetching batch:", err);
    return [];
  }
}

async function insertWords(words: string[]) {
  const rows = words.map(word => ({ item: word }));
  const { data, error } = await supabase.from('item_pool').insert(rows).select();

  if (error) {
    console.error("Supabase insert error:", error);
  } else {
    console.log(`✅ Inserted ${data.length} rows into item_pool`);
  }
}

async function populateItemPool(totalWords = 1000, batchSize = 100, delayMs = 3000) {
  console.log(`🌱 Starting population of ${totalWords} items...`);

  const allWords = new Set<string>();
  const batches = Math.ceil(totalWords / batchSize);

  for (let i = 0; i < batches; i++) {
    console.log(`Fetching batch ${i + 1}/${batches} from Wordnik...`);
    const batch = await fetchBatchWords(batchSize);
    batch.forEach(word => allWords.add(word));
    console.log(`Collected ${allWords.size}/${totalWords} unique words so far`);

    // Delay before next batch to avoid rate limiting
    await sleep(delayMs);
  }

  console.log(`\n🔢 Total unique words collected: ${allWords.size}`);
  console.log("📥 Inserting into Supabase...");
  await insertWords([...allWords].slice(0, totalWords));

  console.log("🎉 Done!");
}

populateItemPool().catch(err => {
  console.error("Fatal error:", err);
});
