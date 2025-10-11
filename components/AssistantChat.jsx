// FILE: components/AssistantChat.jsx
// React client component (copy into components/AssistantChat.jsx)

'use client'

import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown';


export default function AssistantChat() {
  const [messages, setMessages] = useState([
    { id: 'sys-1', role: 'system', text: 'Hi , I am Sora your AI assistant ! \nHow can I help you?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  async function sendMessage(e) {
    e && e.preventDefault()
    const text = input.trim()
    if (!text) return

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.text })) }),
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || 'Assistant error')
      }

      const data = await res.json()
      const assistantText = data?.response || 'Sorry — I could not get an answer.'

      const assistantMsg = { id: `a-${Date.now()}`, role: 'assistant', text: assistantText }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      const errMsg = { id: `err-${Date.now()}`, role: 'assistant', text: `Error: ${err.message || String(err)}` }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.focus()
    }
  }

  function quickPrompt(t) {
    setInput(t)
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus()
    }, 50)
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow p-4 flex flex-col gap-4">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Sora - AI Chatbot</h3>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm rounded-md border" onClick={() => quickPrompt('Create a 6-month savings plan for someone earning ₹60,000/month with a goal to save ₹1,00,000.')}>Savings Plan</button>
            <button className="px-3 py-1 text-sm rounded-md border" onClick={() => quickPrompt('Suggest 3 diversified investment ideas for a conservative investor with 2 lakh rupees to invest for 3 years.')}> Investment Ideas</button>
          </div>
        </header>

        <div ref={listRef} className="h-72 overflow-y-auto border rounded-lg p-3 bg-slate-50 dark:bg-slate-900">
           {messages.map(m => (
    <div key={m.id} className={`mb-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
      <div className={`${m.role === 'assistant' ? 'inline-block bg-slate-100 dark:bg-slate-800 p-3 rounded-lg' : 'inline-block bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg'}`}>
        <div className="text-sm whitespace-pre-wrap">
          {m.role === 'assistant' ? <ReactMarkdown>{m.text}</ReactMarkdown> : m.text}
        </div>
      </div>
    </div>
  ))}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={2}
            placeholder="Ask about budgeting, investments, goals..."
            className="flex-1 p-2 rounded-md border resize-none bg-transparent"
          />
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-slate-800 text-white disabled:opacity-50">
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </form>

        <footer className="text-xs text-muted-foreground">Tip: Don’t share real bank details. The assistant gives educational guidance — verify with a certified advisor for legal or tax matters.</footer>
      </div>
    </div>
  )
}


