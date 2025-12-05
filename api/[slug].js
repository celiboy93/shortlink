import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { slug } = req.query;

  // 1. Database ထဲမှာ သွားရှာမယ်
  // ⚠️ ပြင်ဆင်ချက်: .single() ကို ဖြုတ်လိုက်ပါပြီ
  const { data, error } = await supabase
    .from('links')
    .select('url')
    .eq('slug', slug)
    .limit(1); // တစ်ခုပဲ ယူမယ်

  // Error စစ်မယ်
  if (error) {
    return res.status(500).json({ 
      message: "Supabase Error", 
      details: error.message 
    });
  }

  // 2. Data ရှိမရှိ စစ်မယ် (Array အနေနဲ့ စစ်တာ ပိုစိတ်ချရတယ်)
  if (data && data.length > 0) {
    // Redirect လုပ်မယ် (data[0] ဆိုပြီး ပထမဆုံးအကြောင်းကို ယူမယ်)
    return res.redirect(307, data[0].url);
  }

  // မရှိရင် 404
  return res.status(404).send("Link Not Found / Expired");
}
