import { useEffect,useMemo,useState } from "react";
import { Link,useParams } from "react-router-dom";
import { getBlogData,readableDate,useBlogHead } from "./blogApi";
import "./Blog.css";
function prepareArticle(html) {
  const doc=new DOMParser().parseFromString(html||"","text/html");
  const headings=Array.from(doc.querySelectorAll("h2[id]"))
    .filter(h=>h.id!=="faq").map(h=>({id:h.id,text:h.textContent}));
  if(headings.length){
    const toc=doc.createElement("nav");toc.className="blog-toc";toc.setAttribute("aria-label","Table of contents");
    const heading=doc.createElement("h2");heading.textContent="Table of contents";toc.appendChild(heading);
    const list=doc.createElement("ul");
    headings.forEach(h=>{const li=doc.createElement("li"),a=doc.createElement("a");a.href=`#${encodeURIComponent(h.id)}`;a.textContent=h.text;li.appendChild(a);list.appendChild(li);});
    toc.appendChild(list);
    const first=doc.body.querySelector("h2");
    if(first && first.textContent.trim().toLowerCase()==="key takeaways"){
      let node=first.nextElementSibling;
      while(node && node.tagName!=="UL" && node.tagName!=="OL")node=node.nextElementSibling;
      if(node)node.after(toc);else first.after(toc);
    } else doc.body.prepend(toc);
  }
  return doc.body.innerHTML;
}
export default function BlogPost(){
  const {slug}=useParams();const [article,setArticle]=useState(null);const [message,setMessage]=useState("Loading article…");
  useEffect(()=>{
    let active=true;setArticle(null);setMessage("Loading article…");
    getBlogData(`/api/blog?slug=${encodeURIComponent(slug)}`).then(data=>{
      if(!active)return;setArticle(data.article);setMessage(data.article?"":"Article not found.");
    }).catch(error=>{if(active)setMessage(error.status===404?"Article not found.":"The journal is temporarily unavailable.");});
    return ()=>{active=false;};
  },[slug]);
  const html=useMemo(()=>prepareArticle(article?.content_html),[article]);
  const jsonLd=useMemo(()=>article?.jsonLd||null,[article]);
  useBlogHead({title:article?`${article.title} | UNSEALED`:null,description:article?.meta_description||"",canonical:`/blog/${encodeURIComponent(slug)}`,article:true,jsonLd});
  const rtl=["ar","he","fa","ur"].includes((article?.language||"").split("-")[0]);
  return <main className="blog-page"><article className="blog-article" lang={article?.language||undefined} dir={rtl?"rtl":undefined}>
    <Link className="blog-back" to="/blog">← Back to Blog</Link>
    {message && <p className="blog-message" role="status">{message}</p>}
    {article && <><h1>{article.title}</h1><div className="blog-meta">{readableDate(article.published_at||article.published)}{article.read_time?` · ${article.read_time} min read`:""}</div>
      <div className="blog-article__body" dangerouslySetInnerHTML={{__html:html}} />
    </>}
  </article></main>;
}
