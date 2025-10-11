/* -------------------------------------------------------------------------- */
// FILE: app/api/assistant/route.js (Next.js App Router). Copy into app/api/assistant/route.js

import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const msgs = body.messages || []

    const chatMessages = msgs.map(m => ({ role: m.role === 'user' ? 'user' : m.role === 'assistant' ? 'assistant' : 'system', content: m.content }))

    const OPENAI_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_KEY) return NextResponse.json({ error: 'Missing OPENAI_API_KEY env var' }, { status: 500 })

    const payload = {
      model: 'gpt-4o-mini',
      messages: chatMessages,
      temperature: 0.2,
      max_tokens: 800,
    }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (!r.ok) {
      const text = await r.text()
      return NextResponse.json({ error: text }, { status: r.status })
    }

    const data = await r.json()
    const assistantReply = data.choices?.[0]?.message?.content || data.choices?.[0]?.message || null

    return NextResponse.json({ response: assistantReply })
  } catch (err) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}

