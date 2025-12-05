import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { slug } = req.query;

  // 1. Database ထဲမှာ သွားရှာမယ်
  // 🔥 FIX: .single() အစား .maybeSingle() သုံးပါ
  // ဒါမှ Data မရှိရင် Error မတက်ဘဲ null ပြန်မှာပါ
  const { data, error } = await supabase
    .from('links')
    .select('url')
    .eq('slug', slug)
    .maybeSingle(); 

  // Database Error ရှိရင်ပြမယ်
  if (error) {
    return res.status(500).json({ 
      message: "Database Error", 
      details: error.message 
    });
  }

  // 2. Link တွေ့ရင် Redirect လုပ်မယ်
  if (data && data.url) {
    return res.redirect(307, data.url);
  }

  // 3. မတွေ့ရင် 404 ပြမယ်
  return res.status(404).send(`Link Not Found: ${slug}`);
}
