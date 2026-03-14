# ⚖️ YourLawyer — AI Legal Intelligence Platform

YourLawyer is a full‑stack AI-powered legal assistant that provides:
- Instant legal guidance
- AI document analysis
- Semantic document Q&A
- ML-powered Retrieval-Augmented Generation (RAG)

Built with:
- Next.js (Frontend)
- Node.js + Express (Backend)
- MongoDB
- Ollama (Local LLM + Embeddings)
- Vector Similarity Search

---

## 🚀 Features

### 🤖 AI Legal Chat
- Conversational legal assistance
- Memory summarization
- Context-aware responses

### 📄 Document Analysis
- Upload PDFs or images
- OCR text extraction
- AI clause analysis
- Risk detection

### 🧠 Real ML-Powered RAG
- Document text chunking
- Embedding generation using `nomic-embed-text`
- Vector storage in MongoDB
- Cosine similarity semantic retrieval
- Context-grounded LLM responses

This is NOT keyword search.
This is semantic vector retrieval.

---

## 🏗 Architecture

User Upload → OCR → Text Extraction  
→ Chunking  
→ Embedding Generation (Ollama `nomic-embed-text`)  
→ Store Vectors in MongoDB  
→ User Question  
→ Query Embedding  
→ Cosine Similarity Search  
→ Top Relevant Chunks  
→ Inject into LLM (`mistral`)  
→ Grounded AI Response  

---

## 🛠 Tech Stack

**Frontend**
- Next.js 14
- Tailwind CSS

**Backend**
- Node.js
- Express
- MongoDB (Mongoose)

**AI Layer**
- Ollama
- mistral (generation)
- nomic-embed-text (embeddings)

---

## 🧠 Machine Learning Components

- Vector Embeddings
- Cosine Similarity
- Semantic Search
- Retrieval-Augmented Generation (RAG)
- Conversational Memory Summarization

---

## 📦 Installation

### 1️⃣ Clone Repositories

Frontend:
