import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { slug } = req.query;

  // 1. Database ရှာမယ် (.single ဖြုတ်ထားသည်)
  const { data, error } = await supabase
    .from('links')
    .select('url')
    .eq('slug', slug);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // 2. Data ရှိမရှိ စစ်မယ် (Array အနေနဲ့)
  if (data && data.length > 0) {
    let destination = data[0].url;
    
    // 3. URL မှာ https:// မပါရင် ထည့်ပေးမယ် (Supabase မှာ www.google.com လို့ထည့်ထားရင် ပြင်ပေးဖို့)
    if (!destination.startsWith('http://') && !destination.startsWith('https://')) {
        destination = 'https://' + destination;
    }

    return res.redirect(307, destination);
  }

  return res.status(404).send("Link Not Found");
}
