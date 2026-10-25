import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogData, readableDate, useBlogHead } from "./blogApi";
import "./Blog.css";
export default function BlogIndex() {
  const [articles,setArticles]=useState([]);
  const [message,setMessage]=useState("Loading articles…");
  useBlogHead({title:"Blog | UNSEALED",description:"Articles from the UNSEALED journal.",canonical:"/blog"});
  useEffect(()=>{
    let active=true;
    getBlogData("/api/blog").then(data=>{
      if (!active)return;
      setArticles(data.articles||[]);
      setMessage(data.articles?.length?"":"No articles yet.");
    }).catch(()=>{if(active)setMessage("The journal is temporarily unavailable.");});
    return ()=>{active=false;};
  },[]);
  return <main className="blog-page"><div className="blog-page__inner">
    <span className="blog-page__eyebrow">UNSEALED · BLOG</span>
    <h1>The Journal</h1>
    {message && <p className="blog-message" role="status">{message}</p>}
    <div className="blog-list">{articles.map(article=><article className="blog-item" key={article.id||article.slug}>
      <h2><Link to={`/blog/${encodeURIComponent(article.slug)}`}>{article.title}</Link></h2>
      <span className="blog-meta">{readableDate(article.published_at||article.published)}{article.read_time?` · ${article.read_time} min read`:""}</span>
    </article>)}</div>
  </div></main>;
}
