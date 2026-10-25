import { useEffect } from "react";
export async function getBlogData(path) {
  const response=await fetch(path);
  const data=await response.json().catch(()=>({}));
  if(!response.ok) throw Object.assign(new Error(data.error||"Journal unavailable"),{status:response.status});
  return data;
}
export function readableDate(value) {
  if(!value)return "";
  const d=new Date(value);
  return Number.isNaN(d.getTime())?"":d.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
}
function meta(name,value,property=false) {
  const attr=property?"property":"name";
  let node=document.head.querySelector(`meta[${attr}="${name}"]`);
  if(!node){node=document.createElement("meta");node.setAttribute(attr,name);document.head.appendChild(node);}
  node.content=value||"";
}
export function useBlogHead({title,description,canonical,article=false,jsonLd=null}) {
  useEffect(()=>{
    if(!title)return;
    const original=document.title;
    document.title=title;
    meta("description",description);
    meta("og:title",title,true);meta("og:description",description,true);meta("og:type",article?"article":"website",true);
    meta("twitter:description",description);
    let link=document.head.querySelector('link[rel="canonical"]');
    if(!link){link=document.createElement("link");link.rel="canonical";document.head.appendChild(link);}
    // Configure REACT_APP_SITE_URL with the production domain; never use preview URLs.
    const base=process.env.REACT_APP_SITE_URL || "https://readunsealed.com";
    if(base && canonical)link.href=base.replace(/\/$/,"")+canonical;
    let script=document.getElementById("heycatch-jsonld");
    if(script)script.remove();
    if(jsonLd && Object.keys(jsonLd).length){
      const data={...jsonLd};
      if(base && canonical){const url=base.replace(/\/$/,"")+canonical;data.url ||= url;data.mainEntityOfPage ||= url;}
      script=document.createElement("script");script.id="heycatch-jsonld";script.type="application/ld+json";
      script.textContent=JSON.stringify(data).replace(/</g,"\\u003c");document.head.appendChild(script);
    }
    return ()=>{document.title=original;document.getElementById("heycatch-jsonld")?.remove();};
  },[title,description,canonical,article,jsonLd]);
}
