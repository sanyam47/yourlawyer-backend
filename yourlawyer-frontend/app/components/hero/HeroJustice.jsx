"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

export default function HeroJustice() {
  const [stars, setStars] = useState([])
  const [position, setPosition] = useState({ x: 50, y: 50 })

  // Generate stars
  useEffect(() => {
    const generated = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }))
    setStars(generated)
  }, [])

  // Mouse glow movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,#0d1326_0%,#05070f_60%,#000000_100%)]" />

      {/* Mouse Reactive Gold Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="gold-aura animate-auraPulse mouse-glow"
          style={{
            background: `radial-gradient(
              circle at ${position.x}% ${position.y}%,
              rgba(198,168,92,0.55),
              rgba(198,168,92,0.25) 30%,
              rgba(198,168,92,0.1) 55%,
              transparent 70%
            )`
          }}
        />
      </div>

      {/* Orbit Ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="orbit-ring" />
      </div>

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Lady Justice */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/lady3.png"
          alt="Lady Justice"
          width={700}
          height={1200}
          className="animate-float"
          priority
        />
      </div>

    </div>
  )
}