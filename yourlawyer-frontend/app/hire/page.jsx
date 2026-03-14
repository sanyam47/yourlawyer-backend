"use client"

import { useState } from "react"

const lawyers = [
  {
    name: "Adv. Riya Sharma",
    specialization: "Corporate Law",
    experience: "6 years",
    price: "₹1200 / session",
    rating: 4.9,
  },
  {
    name: "Adv. Arjun Patel",
    specialization: "Criminal Law",
    experience: "4 years",
    price: "₹900 / session",
    rating: 4.7,
  },
  {
    name: "Adv. Meera Nair",
    specialization: "Intellectual Property",
    experience: "8 years",
    price: "₹1500 / session",
    rating: 4.8,
  },
  {
    name: "Adv. Rohan Desai",
    specialization: "Family Law",
    experience: "5 years",
    price: "₹800 / session",
    rating: 4.6,
  },
]

export default function HirePage() {
  const [search, setSearch] = useState("")

  const filteredLawyers = lawyers.filter((lawyer) =>
    lawyer.name.toLowerCase().includes(search.toLowerCase()) ||
    lawyer.specialization.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-[#0b1220] text-white px-12 py-16">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#E5E0D5]">
          Hire a Lawyer
        </h1>
        <p className="text-zinc-400 mt-2">
          Find verified lawyers by specialization, rating, or price.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-12">
        <input
          type="text"
          placeholder="Search lawyers by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111827] border border-white/10 rounded-xl px-5 py-4 focus:border-[#C6A85C] outline-none"
        />
      </div>

      {/* LAWYER CARDS */}
      <div className="grid md:grid-cols-3 gap-8">

        {filteredLawyers.map((lawyer, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-white/5 rounded-2xl p-6 hover:border-[#C6A85C] transition duration-300"
          >
            {/* Name + Rating */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#E5E0D5]">
                {lawyer.name}
              </h3>
              <span className="text-[#C6A85C] font-medium">
                ⭐ {lawyer.rating}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm text-zinc-400 mb-6">
              <p>{lawyer.specialization}</p>
              <p>Experience: {lawyer.experience}</p>
              <p>{lawyer.price}</p>
            </div>

            {/* Button */}
            <button className="w-full bg-[#C6A85C] text-black py-3 rounded-lg font-semibold hover:scale-105 transition">
              Hire Lawyer
            </button>
          </div>
        ))}

      </div>

    </main>
  )
}
