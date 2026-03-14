"use client"

import { useState } from "react"
import { generateTemplate, downloadTemplatePDF } from "../lib/api"

export default function TemplatesPage() {

  const [docType, setDocType] = useState("Rental Agreement")
  const [partyA, setPartyA] = useState("")
  const [partyB, setPartyB] = useState("")
  const [details, setDetails] = useState("")
  const [amount, setAmount] = useState("")
  const [duration, setDuration] = useState("")
  const [location, setLocation] = useState("")

  const [documentText, setDocumentText] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    try {

      setLoading(true)

      const fullDetails = `
${details}
Amount: ${amount}
Duration: ${duration}
Location: ${location}
`

      const data = await generateTemplate({
        type: docType,
        partyA,
        partyB,
        details: fullDetails,
      })

      setDocumentText(data.document)

    } catch (err) {
      alert("Failed to generate template")
    }

    setLoading(false)
  }

  const handleDownloadPDF = async () => {
    try {
      await downloadTemplatePDF(documentText)
    } catch (err) {
      alert("PDF generation failed")
    }
  }

  return (
    <main className="min-h-screen bg-[#0b1220] text-white px-12 py-16">

      <h1 className="text-3xl font-semibold mb-10 text-[#E5E0D5]">
        AI Template Generator
      </h1>

      <div className="grid md:grid-cols-3 gap-6 mb-6">

        <div>
          <label className="block mb-2 text-sm text-zinc-400">
            Select Document Type
          </label>

          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 focus:border-[#C6A85C] outline-none"
          >
            <option>Rental Agreement</option>
            <option>Employment Contract</option>
            <option>NDA</option>
            <option>Service Agreement</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm text-zinc-400">
            Party A
          </label>

          <input
            value={partyA}
            onChange={(e) => setPartyA(e.target.value)}
            placeholder="Enter Party A name"
            className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 focus:border-[#C6A85C] outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-zinc-400">
            Party B
          </label>

          <input
            value={partyB}
            onChange={(e) => setPartyB(e.target.value)}
            placeholder="Enter Party B name"
            className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 focus:border-[#C6A85C] outline-none"
          />
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <input
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Purpose / Details"
          className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 focus:border-[#C6A85C] outline-none"
        />

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount / Salary / Rent"
          className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 focus:border-[#C6A85C] outline-none"
        />

      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration / Term"
          className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 focus:border-[#C6A85C] outline-none"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location / Jurisdiction"
          className="w-full bg-[#111827] border border-white/10 rounded-lg px-4 py-3 focus:border-[#C6A85C] outline-none"
        />

      </div>

      <button
        onClick={handleGenerate}
        className="bg-[#C6A85C] text-black px-8 py-3 rounded-lg font-semibold hover:scale-105 transition"
      >
        {loading ? "Generating..." : "Generate Draft (AI)"}
      </button>

      {documentText && (
        <div className="mt-14">

          <h2 className="text-xl font-semibold mb-4 text-[#E5E0D5]">
            Generated Document
          </h2>

          <pre className="bg-[#111827] border border-white/10 p-6 rounded-lg whitespace-pre-wrap">
            {documentText}
          </pre>

          <button
            onClick={handleDownloadPDF}
            className="mt-6 bg-[#C6A85C] text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            Download PDF
          </button>

        </div>
      )}

    </main>
  )
}