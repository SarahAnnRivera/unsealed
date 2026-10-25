
import { useState } from "react";
import "./FAQ.css";

const questions = [
  {
    question: "What is UNSEALED?",
    answer:
      "UNSEALED is a collection of original historical fiction told through letters, diaries, recordings, and personal records. Each archive follows a fictional life in a different time and place, revealing its story one document at a time.",
  },
  {
    question: "Are these real historical documents?",
    answer:
      "No. Every archive is a work of fiction, inspired by historical settings and the everyday lives of people who might have lived there. The documents are designed to feel discovered, but the stories and characters are imagined.",
  },
  {
    question: "How does following an archive work?",
    answer:
      "Choose an archive and select Follow. Enter your email address, and the first document will be sent to you. Additional installments arrive by email according to that archive's release schedule. You can read each document directly in your inbox.",
  },
  {
    question: "How often will I receive new documents?",
    answer:
      "Each archive has its own delivery schedule. New installments are sent automatically, so you don't need to return to the website to check for updates.",
  },
  {
    question: "Is following an archive free?",
    answer:
      "Some archives are free to follow, while others have a one-time Follow price. Violet is currently free to follow. Charles and Denise have a one-time Follow price of $2.99 each. The price is shown before you choose.",
  },
  {
    question: "Will I have to buy coins or pay to unlock later chapters?",
    answer:
      "Never. UNSEALED has no coins, chapter-by-chapter unlock fees, or recurring subscriptions. You know the price before you begin, and there are no surprise charges to continue a story.",
  },
  {
    question: "What does Unseal Everything mean?",
    answer:
      "Unseal Everything lets you purchase the complete archive at once instead of waiting for installments. You'll receive the full story as a downloadable PDF, with no recurring payments.",
  },
  {
    question: "How are payments handled?",
    answer:
      "Payments are processed securely through Stripe. Purchases are one-time payments, not subscriptions.",
  },
  {
    question: "What is The Margins?",
    answer:
      "The Margins is UNSEALED's creative community, where readers can share interpretations, explore unanswered questions, and create their own work inspired by the archives.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <main className="faq-page">
      <div className="faq-page__inner">
        <span className="faq-page__eyebrow">
          A FEW THINGS WORTH KNOWING
        </span>

        <h1>Frequently Asked Questions</h1>

        <p className="faq-page__intro">
          Everything you need to know before opening an archive.
        </p>

        <div className="faq-page__questions">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div className="faq-page__item" key={item.question}>
                <h2 className="faq-page__question">
                  <button
                    type="button"
                    className="faq-page__toggle"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                  >
                    <span>{item.question}</span>
                    <span className="faq-page__symbol" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h2>

                <div
                  id={`faq-answer-${index}`}
                  className="faq-page__answer"
                  hidden={!isOpen}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="faq-page__closing">
          Every story begins somewhere.
          <br />
          Yours begins with opening the archive.
        </p>
      </div>
    </main>
  );
}

export default FAQ;
