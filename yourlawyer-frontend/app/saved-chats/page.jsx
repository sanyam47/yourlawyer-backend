"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SavedChatsPage() {

  const [chats, setChats] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetchSavedChats()
  }, [])

  const fetchSavedChats = async () => {
    try {

      const res = await fetch("http://localhost:5000/api/chats")

      const data = await res.json()

      setChats(data)

    } catch (error) {
      console.error("Error fetching chats:", error)
    }
  }

  const openChat = (id) => {
    router.push(`/chat/${id}`)
  }

  return (
    <div className="min-h-screen bg-[#03050b] text-white p-10">

      <h1 className="text-3xl font-bold text-[#c6a85c] mb-8">
        Saved Chats
      </h1>

      {chats.length === 0 ? (
        <p className="text-gray-400">
          No saved chats found.
        </p>
      ) : (

        <div className="space-y-4">

          {chats.map((chat) => (

            <div
              key={chat._id}
              onClick={() => openChat(chat._id)}
              className="p-4 rounded-xl bg-[#0b132b] border border-[#c6a85c33] hover:border-[#c6a85c] cursor-pointer transition"
            >

              <div className="flex justify-between items-center">

                <span className="font-medium">
                  {chat.title || "Legal Consultation"}
                </span>

                <span className="text-sm text-gray-400">
                  {new Date(chat.createdAt).toLocaleDateString()}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}