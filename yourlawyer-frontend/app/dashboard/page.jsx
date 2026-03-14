"use client"

import Link from "next/link"

export default function ClientDashboard() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-white px-12 py-16 relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-[#C6A85C]/10 blur-[140px] rounded-full"></div>

      {/* HERO SECTION */}
      <div className="dashboard-hero mb-20">

        <div className="dashboard-hero-left">
          <h1 className="hero-title">
            Dashboard
          </h1>

          <p className="hero-sub">
            Welcome back. Your AI-powered legal workspace is active.
          </p>
        </div>

        {/* Document Ring */}
        <div className="doc-ring">
          <svg width="120" height="120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#C6A85C"
              strokeWidth="8"
              fill="none"
              strokeDasharray="314"
              strokeDashoffset="100"
              strokeLinecap="round"
              className="ring-progress"
            />
          </svg>

          <div className="ring-text">
            <span className="ring-number">12</span>
            <span className="ring-label">Documents Analyzed</span>
          </div>
        </div>

      </div>

      {/* ACTION CARDS */}
      <div className="grid md:grid-cols-4 gap-8 mb-24 relative z-10">

        <Link href="/chat" className="dashboard-card group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C6A85C]/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
          <h3 className="card-title">Ask AI Assistant</h3>
          <p className="card-text">
            Chat with legal AI instantly.
          </p>
        </Link>

        <Link href="/documents" className="dashboard-card group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C6A85C]/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
          <h3 className="card-title">Upload Documents</h3>
          <p className="card-text">
            Analyze contracts & agreements.
          </p>
        </Link>

        <Link href="/templates" className="dashboard-card group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C6A85C]/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
          <h3 className="card-title">Generate Templates</h3>
          <p className="card-text">
            Create NDAs & legal drafts.
          </p>
        </Link>

        <Link href="/hire" className="dashboard-card group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C6A85C]/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
          <h3 className="card-title">Hire a Lawyer</h3>
          <p className="card-text">
            Find verified professionals.
          </p>
        </Link>

      </div>

      {/* BOOKINGS */}
      <h2 className="section-title mb-8">
        My Bookings
      </h2>

      <div className="space-y-6 relative z-10">

        {/* Booking 1 */}
        <div className="booking-card hover:shadow-[0_0_20px_rgba(198,168,92,0.15)] transition">

          <div>
            <h4 className="card-title">
              Contract Review
            </h4>
            <p className="card-text">
              Thu Apr 23 2026 | 4:00 AM
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="status-confirmed">
              Confirmed
            </span>

            <button className="btn-dark">
              Open Chat
            </button>

            <button className="btn-gold">
              Pay Now
            </button>
          </div>

        </div>

        {/* Booking 2 */}
        <div className="booking-card hover:shadow-[0_0_20px_rgba(198,168,92,0.15)] transition">

          <div>
            <h4 className="card-title">
              Legal Consultation
            </h4>
            <p className="card-text">
              Date not set
            </p>
          </div>

          <span className="status-pending">
            Pending
          </span>

        </div>

      </div>

    </main>
  )
}