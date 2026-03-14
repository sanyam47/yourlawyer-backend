const BASE_URL = "http://localhost:5000"

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

/* ================= GENERIC API ================= */

export const apiRequest = async (endpoint, method = "GET", body = null) => {

  const token = getToken()

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  }

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
  }

  return data
}

/* ================= TEMPLATE GENERATION ================= */

export const generateTemplate = async ({ type, partyA, partyB, details }) => {

  const token = getToken()

  const response = await fetch(`${BASE_URL}/api/template`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type,
      partyA,
      partyB,
      details,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Template generation failed")
  }

  return data
}

/* ================= PDF DOWNLOAD ================= */

export const downloadTemplatePDF = async (content) => {

  const token = getToken()

  const response = await fetch(`${BASE_URL}/api/template/pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  })

  if (!response.ok) {
    throw new Error("PDF generation failed")
  }

  const blob = await response.blob()

  const url = window.URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "legal-document.pdf"
  document.body.appendChild(a)
  a.click()
  a.remove()
}