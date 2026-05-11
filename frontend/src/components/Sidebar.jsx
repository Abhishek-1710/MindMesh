export default function Sidebar({ active, setActive }) {
  const items = [
    { id: 'briefing', icon: '⚡', label: 'AI Briefing' },
    { id: 'ask',      icon: '🧠', label: 'Ask Your Brain' },
    { id: 'graph',    icon: '🕸️', label: 'Context Graph' },
    { id: 'actions',  icon: '✅', label: 'Actions' },
  ]

  return (
    <div className="w-56 h-screen flex flex-col border-r border-indigo-900/30" style={{ background: '#0f1629' }}>
      <div className="p-5 border-b border-indigo-900/30">
        <div className="text-lg font-semibold glow-text" style={{ color: '#a5b4fc' }}>MindMesh</div>
        <div className="text-xs mt-0.5" style={{ color: '#475569' }}>Cognitive Operating System</div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
            style={{
              background: active === item.id ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: active === item.id ? '#a5b4fc' : '#94a3b8',
              border: active === item.id ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
            }}>
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-900/30">
        <div className="flex items-center gap-2 text-xs" style={{ color: '#475569' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse 2s infinite' }} />
          All sources active
        </div>
        <div className="mt-1 text-xs font-mono" style={{ color: '#334155' }}>Gmail · Slack · Jira · Cal</div>
      </div>
    </div>
  )
}