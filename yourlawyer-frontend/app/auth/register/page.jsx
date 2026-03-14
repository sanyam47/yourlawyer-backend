"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import HeroJustice from "../../components/hero/HeroJustice"
import { apiRequest } from "../../lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)

    const name = e.target.name.value
    const email = e.target.email.value
    const password = e.target.password.value

    try {
      const data = await apiRequest(
        "/api/auth/register",
        "POST",
        { name, email, password }
      )

      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      router.push("/dashboard")

    } catch (error) {
      alert(error.message)
    }

    setLoading(false)
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      <HeroJustice />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="auth-card animate-authFade">

          <h2 className="text-3xl font-semibold text-[#E5E0D5] text-center mb-8">
            Create Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-5">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="auth-input"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="auth-input"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="auth-input"
              required
            />

            <button type="submit" className="auth-button">
              {loading ? "Creating account..." : "Register"}
            </button>

          </form>

          <div className="text-center mt-6 text-sm text-zinc-400">
            Already have an account?
            <Link
              href="/auth/login"
              className="ml-2 text-[#C6A85C] hover:underline"
            >
              Login
            </Link>
          </div>

        </div>
      </div>
    </main>
  )
}