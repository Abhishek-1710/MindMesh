import { useState } from 'react'
import Sidebar from './components/Sidebar'
import BriefingPage from './pages/BriefingPage'
import AskPage from './pages/AskPage'
import GraphPage from './pages/GraphPage'
import ActionsPage from './pages/ActionsPage'

const PAGES = { briefing: BriefingPage, ask: AskPage, graph: GraphPage, actions: ActionsPage }

export default function App() {
  const [active, setActive] = useState('briefing')
  const Page = PAGES[active]
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0e1a', overflow: 'hidden' }}>
      <Sidebar active={active} setActive={setActive} />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Page />
      </main>
    </div>
  )
}