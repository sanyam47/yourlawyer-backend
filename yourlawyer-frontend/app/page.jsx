"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import HeroJustice from "./components/hero/HeroJustice"
import FadeInSection from "./components/hero/ui/FadeInSection"

export default function Home() {
  const [stage, setStage] = useState(0)
  const cardSectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect()
          setTimeout(() => setStage(1), 200)
          setTimeout(() => setStage(2), 600)
          setTimeout(() => setStage(3), 1000)
        }
      },
      { threshold: 0.4 }
    )

    if (cardSectionRef.current) {
      observer.observe(cardSectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <main className="relative text-white overflow-x-hidden">

      <HeroJustice />

      {/* ================= HERO ================= */}
      <section className="relative z-10 min-h-[90vh] flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">

          <h1 className="text-5xl md:text-6xl font-bold text-[#E5E0D5]">
            YourLawyer — AI Lawyer Consultant
          </h1>

          <p className="mt-6 text-lg text-zinc-300">
            Get instant legal guidance, analyze documents,
            and generate attorney-grade templates.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-[#E5E0D5] text-black rounded-md hover:opacity-90 transition inline-block"
            >
              Get Started
            </Link>

            <button className="px-8 py-3 border border-[#C6A85C] text-[#C6A85C] rounded-md hover:bg-[#C6A85C]/10 transition">
              Try AI Chat
            </button>
          </div>

        </div>
      </section>

      {/* ================= CONCEPT CARDS ================= */}
      <section
        ref={cardSectionRef}
        className="relative z-10 flex flex-col items-center pb-40 -mt-24"
      >

        <div className={`main-card ${stage >= 1 ? "show" : ""}`}>
          <h3>AI Legal Intelligence</h3>
          <p>
            Everything you need to understand and draft legal documents intelligently.
          </p>
        </div>

        <div className="child-wrapper">
          <div className={`child-card left ${stage >= 2 ? "show" : ""}`}>
            <h4>Document Analysis</h4>
            <p>Upload contracts and receive structured risk breakdowns.</p>
          </div>

          <div className={`child-card right ${stage >= 3 ? "show" : ""}`}>
            <h4>Template Generator</h4>
            <p>Generate professional NDAs and legal drafts.</p>
          </div>
        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}
      <FadeInSection>
        <section className="relative z-10 py-32 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold text-[#E5E0D5]">
              How It Works
            </h2>
            <p className="mt-6 text-zinc-400">
              Simple. Intelligent. Secure.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="feature-card">
              <div className="feature-glow" />
              <h3 className="feature-title">Upload or Ask</h3>
              <p className="feature-text">
                Submit legal documents or describe your concern.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-glow" />
              <h3 className="feature-title">AI Legal Analysis</h3>
              <p className="feature-text">
                AI processes clauses and risks instantly.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-glow" />
              <h3 className="feature-title">Structured Insights</h3>
              <p className="feature-text">
                Receive actionable summaries and templates.
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

    </main>
  )
}
