"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import HeroJustice from "../../components/hero/HeroJustice"
import { apiRequest } from "../../lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const email = e.target.email.value
    const password = e.target.password.value

    try {
      const data = await apiRequest(
        "/api/auth/login",
        "POST",
        { email, password }
      )

      // ✅ Store JWT token
      localStorage.setItem("token", data.token)

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
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">

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
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="text-center mt-6 text-sm text-zinc-400">
            Don't have an account?
            <Link
              href="/auth/register"
              className="ml-2 text-[#C6A85C] hover:underline"
            >
              Register
            </Link>
          </div>

        </div>
      </div>
    </main>
  )
}