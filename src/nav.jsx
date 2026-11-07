import { useState } from 'react'
import { NAV } from './more'

const IC = {
  Workspace: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  'Entity records': 'M4 21V5l8-2v18M12 9h8v12M7 9h2M7 13h2M7 17h2',
  Compliance: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  Documents: 'M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6',
  Practice: 'M3 8h18v12H3zM9 8V5h6v3M3 13h18',
  'AI tools': 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
  Governance: 'M12 3l8 4v5c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V7zM8 10h8M8 14h5',
  Account: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6',
}
export const Icon = ({ n }) => <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={IC[n]} /></svg>

export function Sidebar({ cur, go, open, rail, setRail }) {
  const home = NAV.find(g => g[1].some(n => n[0] === cur))?.[0]
  const [exp, setExp] = useState({ [home || 'Workspace']: true }), [q, setQ] = useState('')
  const toggle = g => { if (rail) setRail(false); setExp({ ...exp, [g]: rail ? true : !exp[g] }) }
  const hit = n => n[1].toLowerCase().includes(q.toLowerCase())
  return <nav className={(open ? 'open ' : '') + (rail ? 'rail' : '')} aria-label="Main">
    <div className="logo"><i>T</i><span className="lt">The Cybertech</span><button className="rbtn" onClick={() => setRail(!rail)} aria-label="Collapse sidebar">{rail ? '›' : '‹'}</button></div>
    {!rail && <input className="inp nq" placeholder="Search menu" value={q} onChange={e => setQ(e.target.value)} />}
    {NAV.map(g => { const items = g[1].filter(hit); if (!items.length) return null; const isOpen = q || exp[g[0]]
      return <div key={g[0]} className="grp">
        <button className={'gh' + (home === g[0] ? ' cur' : '')} onClick={() => toggle(g[0])} title={g[0]} aria-expanded={!!isOpen}><Icon n={g[0]} /><span className="lt">{g[0]}</span><span className="lt car">{isOpen ? '⌃' : '⌄'}</span></button>
        {isOpen && !rail && items.map(n => <a key={n[0]} tabIndex={0} className={cur === n[0] ? 'on' : ''} onClick={() => go(n[0])} onKeyDown={e => e.key === 'Enter' && go(n[0])}>{n[1]}</a>)}
      </div> })}
    <div className="me"><b>D</b><span className="lt"><strong>Deep</strong><small>Owner · Free plan</small></span></div>
  </nav>
}

export function Bottom({ cur, go, openMenu }) {
  return <div className="bnav">{[['dashboard', 'Home'], ['companies', 'Companies'], ['tasks', 'Tasks'], ['calendar', 'Calendar']].map(([k, l]) =>
    <button key={k} className={cur === k ? 'on' : ''} onClick={() => go(k)}>{l}</button>)}<button onClick={openMenu}>Menu</button></div>
}
