import { useState, useRef, useEffect } from 'react'
import { api } from '../services/api'

const SUGGESTIONS = [
  'What is blocking Project Alpha?',
  'What did we promise to Client Alpha?',
  'What needs to be done before the investor meeting?',
  'What has Rahul been working on?',
]

export default function AskPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const ask = async (question) => {
    if (!question.trim() || loading) return
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setInput('')
    setLoading(true)
    try {
      const res = await api.ask(question)
      setMessages(prev => [...prev, { role: 'assistant', text: res.answer, sources: res.sources_used, items: res.items_found }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'error', text: e.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-5 border-b border-indigo-900/30">
        <h1 className="text-lg font-semibold" style={{ color: '#e2e8f0' }}>Ask your brain</h1>
        <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Natural language across all your connected data</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="mt-6">
            <p className="text-sm mb-3" style={{ color: '#64748b' }}>Try asking:</p>
            <div className="space-y-2 max-w-lg">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => ask(s)}
                  className="w-full text-left text-sm px-4 py-3 card transition-all"
                  style={{ color: '#94a3b8' }}
                  onMouseEnter={e => e.target.style.color = '#a5b4fc'}
                  onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'user' ? (
              <div className="max-w-lg px-4 py-2.5 rounded-2xl rounded-br-sm text-sm"
                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', color: '#e2e8f0' }}>
                {msg.text}
              </div>
            ) : msg.role === 'error' ? (
              <p className="text-sm text-red-400">{msg.text}</p>
            ) : (
              <div className="card px-5 py-4 max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono" style={{ color: '#818cf8' }}>NeuroSync</span>
                  {msg.items > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded font-mono"
                      style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                      {msg.items} items searched
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#cbd5e1' }}>{msg.text}</p>
                {msg.sources?.length > 0 && (
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {[...new Set(msg.sources)].map(s => (
                      <span key={s} className={`source-${s} text-xs font-mono`}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="card px-5 py-3 flex items-center gap-2">
              {[0,1,2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                  style={{ animation: `bounce 1s infinite ${i * 0.15}s` }} />
              ))}
              <span className="text-xs ml-1" style={{ color: '#64748b' }}>Searching all sources...</span>
              <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-indigo-900/30">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input) } }}
            placeholder="Ask anything about your work..." rows={1}
            className="flex-1 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none"
            style={{ background: 'rgba(22,30,58,0.8)', border: '1px solid rgba(99,102,241,0.2)', color: '#e2e8f0' }} />
          <button onClick={() => ask(input)} disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ background: loading || !input.trim() ? 'rgba(99,102,241,0.3)' : '#6366f1' }}>
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}