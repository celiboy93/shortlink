import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { slug } = req.query;

  // Database ထဲမှာ Slug တူတာ သွားရှာမယ်
  const { data } = await supabase
    .from('links')
    .select('url')
    .eq('slug', slug)
    .single();

  if (data && data.url) {
    // တွေ့ရင် Redirect လုပ်မယ် (307 Temporary Redirect)
    return res.redirect(307, data.url);
  }

  return res.status(404).send("Link Not Found / Expired");
}
