import { parseDocument } from "htmlparser2";
const BASE = "https://api.heycatch.ai/v1";
const CACHE_SECONDS = 120;
// HTML parsed and rendered through a strict allowlist before reaching React.
const allowedTags = new Set(["h2","h3","h4","p","ul","ol","li","table","thead","tbody","tr","th","td","a","blockquote","strong","em","code","pre","br","hr","div","span"]);
const voidTags = new Set(["br","hr"]);
function escapeHtml(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function safeUrl(s){try {const url=new URL(s,"https://example.com");return ["https:","http:","mailto:"].includes(url.protocol)?s:null;}catch{return null;}}
function sanitizeHtml(html){
  const root=parseDocument(html||"",{decodeEntities:true});
  function render(node){
    if(node.type==="text")return escapeHtml(node.data);
    if(["script","style","iframe","svg","math","object","embed","form"].includes(node.name))return "";
    const children=(node.children||[]).map(render).join("");
    if(!allowedTags.has(node.name))return children;
    const attrs=[];
    if((node.name==="h2"||node.name==="h3") && node.attribs?.id && /^[a-zA-Z][\w:-]*$/.test(node.attribs.id))attrs.push(`id="${escapeHtml(node.attribs.id)}"`);
    if(node.name==="a" && node.attribs?.href){const href=safeUrl(node.attribs.href);if(href)attrs.push(`href="${escapeHtml(href)}"`);}
    return `<${node.name}${attrs.length?" "+attrs.join(" "):""}>${voidTags.has(node.name)?"":children+("</"+node.name+">")}`;
  }
  return (root.children||[]).map(render).join("");
}
async function request(path) {
  const key = process.env.HEYCATCH_API_KEY;
  if (!key) throw Object.assign(new Error("Configure HEYCATCH_API_KEY in Vercel environment variables."),{status:503});
  const url = new URL(BASE + path);
  url.searchParams.set("key",key);
  const get = () => fetch(url.toString(), {signal:AbortSignal.timeout(9000)});
  let response = await get();
  if (response.status === 429) {
    const seconds = Math.min(10,Math.max(0,Number(response.headers.get("retry-after")) || 1));
    await new Promise(resolve=>setTimeout(resolve,seconds*1000));
    response = await get();
  }
  if (!response.ok) throw Object.assign(new Error(response.status===404?"Article not found.":"The journal is temporarily unavailable."),{status:response.status});
  return response.json();
}
export async function listArticles() {
  const articles=[]; let offset=0; let total=0;
  do {
    const data=await request(`/articles?limit=50&offset=${offset}`);
    const batch=Array.isArray(data.articles)?data.articles:[];
    articles.push(...batch);
    total=Number(data.total)||0;
    offset+=50;
    if (!batch.length) break;
  } while (offset<total && offset<10000);
  return {articles,total};
}
export default async function handler(req,res) {
  if (req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
  res.setHeader("Cache-Control",`s-maxage=${CACHE_SECONDS}, stale-while-revalidate=60`);
  try {
    if (typeof req.query.slug === "string") {
      const data=await request(`/articles/${encodeURIComponent(req.query.slug)}`);
      const article=data.article;
      if (!article) return res.status(404).json({error:"Article not found."});
      return res.status(200).json({article:{...article,content_html:sanitizeHtml(article.content_html||"")}});
    }
    const data=await listArticles();
    return res.status(200).json(data);
  } catch(error) {
    return res.status(error.status===404?404:error.status===401?401:error.status===403?403:503).json({error:error.message||"The journal is temporarily unavailable."});
  }
}
