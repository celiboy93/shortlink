import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  // POST request မှလွဲရင် လက်မခံပါ
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // ၆ လုံးတွဲ Random စာသားထုတ်မည် (Example: xYz123)
  const slug = nanoid(6);

  // Supabase ထဲ သိမ်းမည်
  const { data, error } = await supabase
    .from('links')
    .insert([{ slug: slug, url: url }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Short Link ပြန်ပို့မည်
  // req.headers.host က လက်ရှိ Domain ကို အလိုလိုသိပါတယ်
  const shortLink = `https://${req.headers.host}/${slug}`;
  
  return res.status(200).json({ shortUrl: shortLink });
}
