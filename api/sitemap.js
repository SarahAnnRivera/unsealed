import { listArticles } from "./blog.js";
export default async function handler(req,res){
  const base=(process.env.SITE_URL||process.env.REACT_APP_SITE_URL||"https://readunsealed.com").replace(/\/$/,"");
  res.setHeader("Content-Type","application/xml; charset=utf-8");
  res.setHeader("Cache-Control","s-maxage=120, stale-while-revalidate=60");
  if(!base)return res.status(503).send("Production domain not configured");
  const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  try{
    const {articles}=await listArticles();
    const urls=[{loc:`${base}/blog`},...articles.map(a=>({loc:`${base}/blog/${encodeURIComponent(a.slug)}`,lastmod:a.updated||undefined}))];
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${esc(u.loc)}</loc>${u.lastmod?`<lastmod>${esc(u.lastmod)}</lastmod>`:""}</url>`).join("")}</urlset>`);
  }catch{return res.status(503).send("Sitemap temporarily unavailable");}
}
