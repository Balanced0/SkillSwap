"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "@gravity-ui/icons";
import Link from "next/link";
import { skillCategories } from "@/lib/types";

const mockSwaps = [
  { teach: "Python", learn: "Guitar", category: "Coding" },
  { teach: "French", learn: "UI Design", category: "Language" },
  { teach: "Sourdough", learn: "Yoga", category: "Cooking" },
  { teach: "Watercolor", learn: "Business Strategy", category: "Art" },
  { teach: "Piano", learn: "Spanish", category: "Music" },
];

export function HeroInteractive() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Teach/Learn Builder state
  const [teachCategory, setTeachCategory] = useState("Coding");
  const [learnCategory, setLearnCategory] = useState("Music");

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % mockSwaps.length);
        setAnimate(true);
      }, 300); // fade out duration
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setAnimate(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + mockSwaps.length) % mockSwaps.length);
      setAnimate(true);
    }, 200);
  };

  const handleNext = () => {
    setAnimate(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % mockSwaps.length);
      setAnimate(true);
    }, 200);
  };

  const currentSwap = mockSwaps[index];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
      {/* Dynamic Slide Carousel Visualizer */}
      <div 
        className="swap-visual" 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "auto 1fr auto 1fr auto", 
          alignItems: "center", 
          justifyContent: "center",
          gap: "1.5rem",
          minHeight: "100px",
          width: "min(100%, 650px)",
          padding: "1.5rem 2rem",
          borderTop: "1px solid var(--line)", 
          borderBottom: "1px solid var(--line)",
          background: "var(--panel)",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
          position: "relative"
        }}
      >
        <button 
          onClick={handlePrev}
          style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", padding: "0.5rem" }}
          aria-label="Previous swap"
        >
          <ArrowLeft />
        </button>

        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          opacity: animate ? 1 : 0, 
          transition: "opacity 0.3s ease",
          textAlign: "center"
        }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>Teach</span>
          <strong style={{ fontSize: "1.25rem", color: "var(--ink)", marginTop: "0.25rem" }}>{currentSwap.teach}</strong>
        </div>

        <span style={{ fontSize: "1.75rem", color: "var(--rust)", fontWeight: "300" }}>↔</span>

        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          opacity: animate ? 1 : 0, 
          transition: "opacity 0.3s ease",
          textAlign: "center"
        }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>Learn</span>
          <strong style={{ fontSize: "1.25rem", color: "var(--ink)", marginTop: "0.25rem" }}>{currentSwap.learn}</strong>
        </div>

        <button 
          onClick={handleNext}
          style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", padding: "0.5rem" }}
          aria-label="Next swap"
        >
          <ArrowRight />
        </button>

        <span style={{ gridColumn: "1 / -1", textAlign: "center", fontFamily: "var(--font-geist-mono), monospace", fontSize: "9px", letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--muted)", marginTop: "0.5rem" }}>
          1 credit transfers after both users confirm completion
        </span>
      </div>

      {/* Interactive Swap Builder / Simulator */}
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          gap: "1.25rem", 
          background: "var(--panel)", 
          border: "1px solid var(--line)", 
          borderRadius: "20px", 
          padding: "2rem",
          width: "min(100%, 650px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", letterSpacing: "-0.02em" }}>
          Simulate your trade:
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "1rem", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>I can teach</span>
            <select 
              value={teachCategory} 
              onChange={(e) => setTeachCategory(e.target.value)}
              style={{ padding: "0.5rem 1rem", borderRadius: "10px", border: "1px solid var(--line)", background: "var(--paper)", width: "100%", height: "45px" }}
            >
              {skillCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <span style={{ fontSize: "1.5rem", color: "var(--rust)", marginTop: "1rem" }}>↔</span>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)" }}>I want to learn</span>
            <select 
              value={learnCategory} 
              onChange={(e) => setLearnCategory(e.target.value)}
              style={{ padding: "0.5rem 1rem", borderRadius: "10px", border: "1px solid var(--line)", background: "var(--paper)", width: "100%", height: "45px" }}
            >
              {skillCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <Link 
          href={`/explore?category=${encodeURIComponent(learnCategory)}`} 
          className="button button-rust compact"
          style={{ width: "100%", marginTop: "0.5rem" }}
        >
          Find {learnCategory} Teachers <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
