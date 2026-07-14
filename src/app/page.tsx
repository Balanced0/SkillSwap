import { ArrowRight, Clock, Person, Star } from "@gravity-ui/icons";
import Link from "next/link";
import { HomeLiveSections } from "@/components/home-live-sections";
import { SectionHeading } from "@/components/section-heading";
import { skillCategories } from "@/lib/types";
import { HeroInteractive } from "@/components/hero-interactive";

const categoryDescriptions: Record<(typeof skillCategories)[number], string> = {
  Music: "Instruments, theory, vocals",
  Coding: "Programming and dev tools",
  Language: "Conversation and grammar practice",
  Design: "UI, brand, illustration",
  Fitness: "Movement, strength, mobility",
  Cooking: "Techniques, cuisines, baking",
  Art: "Drawing, painting, mixed media",
  Business: "Strategy, marketing, operations",
  Other: "Practical knowledge worth sharing",
};

const faqs = [
  ["What is a credit?", "One credit is one hour of learning. You earn one only after you teach for an hour and both people confirm the session took place."],
  ["Why do I start with two credits?", "Two welcome credits let you book your first lessons before you have taught. It is the on-ramp to a community where everyone can contribute."],
  ["How do sessions get confirmed?", "The teacher and learner each confirm completion. Only then does SkillSwap move one credit from the learner to the teacher."],
  ["Can I teach more than one skill?", "Absolutely. Each skill gets its own listing, availability, level, and description so members know exactly what an hour with you can cover."],
];

export default function Home() {
  return (
    <>
      <section className="hero shell" style={{ gap: "2rem" }}>
        <p className="eyebrow rust">TIME IS THE CURRENCY</p>
        <h1>Trade your hours,<br />not your <span>money.</span></h1>
        <p className="hero-copy">The time-banked barter network. Teach Python for an hour, earn one credit. Spend it to learn cello from an expert. Human exchange, exactly 1:1.</p>
        <div className="hero-actions" style={{ marginBottom: "1rem" }}>
          <Link className="button button-rust" href="/register">Start swapping <ArrowRight /></Link>
          <Link className="button button-outline" href="/how-it-works">How it works</Link>
        </div>
        <HeroInteractive />
      </section>

      <HomeLiveSections />

      <section className="section shell how-section" aria-labelledby="how-it-works">
        <SectionHeading eyebrow="THE SIMPLE PART" title="How SkillSwap works" copy="Three steps. No wallets. No pricing. Just hours." />
        <div className="steps-grid">
          <Step number="01" title="List a skill" icon={<Star />} copy="Publish what you can teach in a one-hour block. From watercolour to Kubernetes." />
          <Step number="02" title="Get matched" icon={<Person />} copy="Learners request a time. You accept, both parties show up, and the hour is yours." />
          <Step number="03" title="Swap hours" icon={<Clock />} copy="Both confirm the session ended. One credit moves. Ratings settle. Repeat." />
        </div>
        <div className="section-cta"><Link className="text-link" href="/how-it-works">See the full flow →</Link></div>
      </section>

      <section className="section shell categories-section" aria-labelledby="popular-categories">
        <SectionHeading eyebrow="EQUAL VALUE" title="Popular skill categories" copy="Every kind of hour is worth the same." />
        <div className="category-grid">
          {skillCategories.slice(0, 8).map((category, index) => (
            <Link className="category-card" href={`/explore?category=${encodeURIComponent(category)}`} key={category}>
              <span className="category-index">0{index + 1}</span>
              <h3>{category}</h3>
              <p>{categoryDescriptions[category]}</p>
              <ArrowRight />
            </Link>
          ))}
        </div>
      </section>

      <section className="section shell values-section" aria-labelledby="built-on-trust">
        <SectionHeading eyebrow="BUILT TO BE FAIR" title="Trust is earned in hours" copy="SkillSwap treats the credit ledger like a promise: simple, transparent, and impossible to game alone." />
        <div className="values-grid">
          <article><span>01</span><h3>Two-sided completion</h3><p>No one loses a credit until teacher and learner independently say the hour happened.</p></article>
          <article><span>02</span><h3>Reputation that means something</h3><p>Ratings follow completed swaps, so your track record reflects actual time shared.</p></article>
          <article><span>03</span><h3>One hour always equals one hour</h3><p>There are no prices, bidding, or hidden fees—only skills, curiosity, and time.</p></article>
        </div>
      </section>

      <section className="section shell faq-section" aria-labelledby="faq-heading">
        <SectionHeading eyebrow="GOOD QUESTIONS" title="Frequently asked" copy="Everything you need to know before your first swap." />
        <div className="faq-list">
          {faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}
        </div>
        <div className="section-cta"><Link className="text-link" href="/faq">Read all FAQs →</Link></div>
      </section>

      <section className="cta-section">
        <div className="shell cta-content">
          <p className="eyebrow rust">YOUR FIRST TWO ARE ON US</p>
          <h2>Ready to trade an hour?</h2>
          <p>Sign up and you get two free credits—enough to book your first two lessons before you teach a thing.</p>
          <Link className="button button-rust" href="/register">Claim your 2 credits <ArrowRight /></Link>
        </div>
      </section>
    </>
  );
}

function Step({ number, title, copy, icon }: { number: string; title: string; copy: string; icon: React.ReactNode }) {
  return <article className="step-card"><span className="step-number">{number}</span><div className="step-icon">{icon}</div><h3>{title}</h3><p>{copy}</p></article>;
}
