
import { useParams, Link } from "react-router-dom";
import { samples } from "../data/samples";
import "./SampleLetter.css";

function SampleLetter() {
  const { storyId } = useParams();
  const sample = samples[storyId];

  if (!sample) {
    return (
      <main className="sample-page">
        <p>This archive sample is not available yet.</p>
        <Link to="/">Return to the Archives</Link>
      </main>
    );
  }

  return (
    <main className="sample-page">
      <div className="sample-page__header">
        <span>{sample.archive}</span>
        <h1>{sample.title}</h1>
        <p>{sample.subtitle}</p>
      </div>

      <article className="sample-page__document">
        {sample.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </article>

      <Link to="/#archives" className="sample-page__back">
        Return to the Archives
      </Link>
    </main>
  );
}

export default SampleLetter;
