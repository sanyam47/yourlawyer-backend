"use client"

export default function DocumentsPage() {
  return (
    <main className="min-h-screen bg-[#0b1220] text-white px-12 py-14">

      {/* ================= PAGE TITLE ================= */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold text-[#E5E0D5] mb-2">
          Document Upload & Analysis
        </h1>
        <p className="text-zinc-400">
          Upload contracts or legal documents for AI review.
        </p>
      </div>

      {/* ================= UPLOAD BOX ================= */}
      <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center mb-10 bg-[#10182b]">
        <p className="text-zinc-400 mb-4">
          Drag & drop files or browse
        </p>

        <button className="px-6 py-3 bg-[#C6A85C] text-black rounded-lg font-medium hover:translate-y-[-2px] transition">
          Browse Files
        </button>
      </div>


      {/* ================= DOCUMENT NAME BOX ================= */}
      <div className="bg-[#10182b] border border-white/5 rounded-xl p-5 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-[#C6A85C]">📄</span>
          <span className="text-zinc-300">
            document-name.pdf
          </span>
        </div>

        <button className="text-red-500 hover:text-red-400 transition text-sm">
          ✕
        </button>
      </div>


      {/* ================= AI ANALYSIS BOX ================= */}
      <div className="bg-[#10182b] border border-white/5 rounded-2xl p-8 min-h-[300px]">
        
        <h2 className="text-xl font-semibold text-[#E5E0D5] mb-6">
          AI Analysis
        </h2>

        {/* EMPTY CONTENT AREA */}
        <div className="h-[220px] bg-[#0f172a] border border-white/5 rounded-xl"></div>

      </div>

    </main>
  )
}
