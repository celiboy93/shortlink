import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { slug } = req.query;

  // 1. Database ထဲ ရှာမယ်
  const { data, error } = await supabase
    .from('links')
    .select('url')
    .eq('slug', slug)
    .single();

  // 2. Error ရှိရင် ထုတ်ပြမယ် (ဒါမှ ဘာမှားလဲ သိရမှာ)
  if (error) {
    return res.status(500).json({ 
      message: "Supabase Error", 
      details: error.message, 
      hint: "Check Vercel Environment Variables or Supabase RLS"
    });
  }

  // 3. Link ရှိရင် Redirect လုပ်မယ်
  if (data && data.url) {
    return res.redirect(307, data.url);
  }

  // 4. မရှိရင်
  return res.status(404).send(`Link Not Found for slug: ${slug}`);
}
