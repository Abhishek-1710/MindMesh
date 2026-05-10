import { useState, useEffect } from 'react'
import { api } from '../services/api'

export default function BriefingPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getBriefing().then(setData).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: '#64748b' }}>
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent" style={{ animation: 'spin 1s linear infinite' }} />
      <p className="text-sm">Generating your AI briefing...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center h-full gap-2">
      <p className="text-red-400 text-sm">Error: {error}</p>
      <p className="text-xs" style={{ color: '#64748b' }}>Is the backend running on port 8000?</p>
    </div>
  )

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-mono mb-1" style={{ color: '#475569' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: '#e2e8f0' }}>{data?.greeting}</h1>
        <p className="mt-2 text-sm leading-relaxed max-w-xl" style={{ color: '#94a3b8' }}>{data?.summary}</p>
      </div>

      <Section title="🔴 Urgent topics" count={data?.urgent_topics?.length}>
        {data?.urgent_topics?.map((t, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{t.title}</h3>
              <span className={`text-xs shrink-0 badge-${t.risk_level || 'low'}`}>{t.risk_level}</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{t.detail}</p>
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {t.sources?.map(s => <span key={s} className={`source-${s} text-xs font-mono`}>{s}</span>)}
            </div>
          </div>
        ))}
      </Section>

      {data?.connections_found?.length > 0 && (
        <Section title="🕸️ AI-detected connections">
          {data.connections_found.map((c, i) => (
            <div key={i} className="card p-4" style={{ borderColor: 'rgba(99,102,241,0.25)' }}>
              <p className="text-sm leading-relaxed" style={{ color: '#a5b4fc' }}>{c.description}</p>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {c.sources?.map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded font-mono"
                    style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </Section>
      )}

      <Section title="✅ Suggested actions">
        {data?.suggested_actions?.map((a, i) => (
          <div key={i} className="card p-3 flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5"
              style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
              {a.priority || i + 1}
            </span>
            <div>
              <p className="text-sm" style={{ color: '#e2e8f0' }}>{a.action}</p>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{a.reason}</p>
            </div>
          </div>
        ))}
      </Section>
    </div>
  )
}

function Section({ title, count, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-medium" style={{ color: '#cbd5e1' }}>{title}</h2>
        {count !== undefined && (
          <span className="text-xs px-1.5 py-0.5 rounded font-mono"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>{count}</span>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}