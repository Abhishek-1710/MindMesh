const BASE = '/api'

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export const api = {
  getBriefing: () => get('/briefing'),
  ask:         (question) => post('/ask', { question }),
  getActions:  () => get('/actions'),
  getGraph:    () => get('/graph'),
  search:      (query, n=5) => post('/search', { query, n_results: n }),
  health:      () => get('/health'),
}