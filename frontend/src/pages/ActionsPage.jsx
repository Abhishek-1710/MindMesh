import { useState, useEffect } from 'react'
import { api } from '../services/api'

const ORDER = { high: 0, medium: 1, low: 2 }

export default function ActionsPage() {
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.getActions()
      .then(data => setActions(data.sort((a, b) => (ORDER[a.urgency] ?? 2) - (ORDER[b.urgency] ?? 2))))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? actions : actions.filter(a => a.urgency === filter)

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-semibold" style={{ color: '#e2e8f0' }}>Extracted actions</h1>
        <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Commitments and deadlines found across all sources</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'high', 'medium', 'low'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
            style={{
              background: filter === f ? 'rgba(99,102,241,0.2)' : 'transparent',
              color: filter === f ? '#a5b4fc' : '#64748b',
              border: `1px solid ${filter === f ? 'rgba(99,102,241,0.4)' : 'transparent'}`
            }}>
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs self-center font-mono" style={{ color: '#334155' }}>{filtered.length} items</span>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
          <div className="w-4 h-4 rounded-full border border-indigo-500 border-t-transparent" style={{ animation: 'spin 1s linear infinite' }} />
          Scanning for commitments...
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="space-y-3">
        {filtered.map((a, i) => (
          <div key={i} className="card p-4 flex gap-3 items-start">
            <span className={`shrink-0 text-xs badge-${a.urgency || 'low'}`}>{a.urgency || 'low'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm" style={{ color: '#e2e8f0' }}>{a.action}</p>
              {a.original_text && (
                <p className="text-xs mt-1 italic font-mono" style={{ color: '#475569' }}>"{a.original_text}"</p>
              )}
              <div className="flex gap-3 mt-2 flex-wrap text-xs" style={{ color: '#475569' }}>
                {a.owner && <span>👤 {a.owner}</span>}
                {a.deadline && <span>📅 {a.deadline}</span>}
                {a.source_type && <span className={`source-${a.source_type} font-mono`}>{a.source_type}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="text-sm" style={{ color: '#334155' }}>No actions found.</p>
      )}
    </div>
  )
}