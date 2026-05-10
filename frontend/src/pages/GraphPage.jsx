import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { api } from '../services/api'

const COLORS = { gmail: '#ef4444', slack: '#a855f7', jira: '#3b82f6', calendar: '#10b981' }

export default function GraphPage() {
  const svgRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getGraph().then(data => { setLoading(false); drawGraph(data) })
  }, [])

  const drawGraph = ({ nodes, edges }) => {
    const el = svgRef.current
    if (!el) return
    const W = el.clientWidth || 800, H = el.clientHeight || 520
    d3.select(el).selectAll('*').remove()
    const svg = d3.select(el)
    const g = svg.append('g')
    svg.call(d3.zoom().scaleExtent([0.3, 3]).on('zoom', e => g.attr('transform', e.transform)))

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id(d => d.id).distance(130))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide(42))

    const link = g.selectAll('line').data(edges).enter().append('line')
      .attr('stroke', '#1e2a4a').attr('stroke-width', d => Math.min(d.weight * 1.5, 4))

    const node = g.selectAll('g').data(nodes).enter().append('g')
      .attr('cursor', 'pointer')
      .on('click', (_, d) => setSelected(d))
      .call(d3.drag()
        .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
        .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y })
        .on('end',   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null }))

    node.append('circle').attr('r', 20)
      .attr('fill', d => COLORS[d.source] || '#6366f1').attr('fill-opacity', 0.15)
      .attr('stroke', d => COLORS[d.source] || '#6366f1').attr('stroke-width', 1.5)

    node.append('text').text(d => d.source[0].toUpperCase())
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
      .attr('fill', d => COLORS[d.source] || '#6366f1')
      .attr('font-size', '11px').attr('font-family', 'JetBrains Mono, monospace')

    node.append('text').text(d => d.label.length > 20 ? d.label.slice(0, 20) + '…' : d.label)
      .attr('text-anchor', 'middle').attr('y', 32)
      .attr('fill', '#64748b').attr('font-size', '9px')

    sim.on('tick', () => {
      link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="p-5 border-b border-indigo-900/30">
          <h1 className="text-lg font-semibold" style={{ color: '#e2e8f0' }}>Context graph</h1>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Drag · scroll to zoom · click to inspect</p>
        </div>
        <div className="flex-1 relative">
          {loading && <div className="absolute inset-0 flex items-center justify-center text-sm" style={{ color: '#64748b' }}>Building graph...</div>}
          <svg ref={svgRef} className="w-full h-full" />
        </div>
        <div className="p-4 border-t border-indigo-900/30 flex gap-4 flex-wrap">
          {Object.entries(COLORS).map(([src, color]) => (
            <div key={src} className="flex items-center gap-1.5 text-xs" style={{ color: '#64748b' }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />{src}
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="w-64 border-l border-indigo-900/30 p-5 overflow-y-auto" style={{ background: '#0f1629' }}>
          <div className="flex justify-between items-center mb-3">
            <span className={`source-${selected.source} text-xs font-mono`}>{selected.source}</span>
            <button onClick={() => setSelected(null)} style={{ color: '#64748b', fontSize: '18px', lineHeight: 1 }}>×</button>
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#cbd5e1' }}>{selected.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {selected.tags?.map(t => (
              <span key={t} className="text-xs px-2 py-0.5 rounded font-mono"
                style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>{t}</span>
            ))}
          </div>
          {selected.timestamp && (
            <p className="text-xs mt-3 font-mono" style={{ color: '#334155' }}>
              {new Date(selected.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  )
}