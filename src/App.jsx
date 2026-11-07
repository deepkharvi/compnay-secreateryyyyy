import { useState, useEffect } from 'react'
import { CO, DIR, SH, CAL, EVT, EVSTEPS, MEET } from './data'
import { NAV, TABLES, GENS } from './more'
import { SettingsPage, Approvals, AuditTrail, OrgChart } from './settings'
import { Sidebar, Bottom } from './nav'
import { DataScreen2, Palette, NewMenu, Tasks as Kanban, Calendar, Gen, Billing, Health } from './extra'

const nm = id => CO[id].name
const CHIP = { done: 'ok', pending: 'warn', due: 'warn', overdue: 'bad', active: 'pkc', progress: 'warn' }
const Chip = ({ s }) => <span className={`chip ${CHIP[s] || 'pkc'}`}>{s}</span>
const Head = ({ h, s, children }) => <div className="top"><div><h1>{h}</h1><p className="sub">{s}</p></div>{children}</div>
const Bar = ({ p }) => <div style={{ background: 'var(--line)', borderRadius: 6, height: 8, minWidth: 90 }}><div style={{ background: p > 85 ? 'var(--bad)' : 'var(--pink)', height: 8, borderRadius: 6, width: p + '%' }} /></div>
const Cell = ({ c }) => (typeof c === 'string' && c.startsWith('chip:') ? <Chip s={c.slice(5)} /> : c)
const Check = ({ children, ...p }) => <label className="chk"><input type="checkbox" {...p} />{children}</label>

function Table({ cols, rows }) {
  return (
    <div className="card tbl"><table>
      <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>{rows.length ? rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 0 ? <b><Cell c={c} /></b> : <Cell c={c} />}</td>)}</tr>)
        : <tr><td colSpan={cols.length} className="empty">Nothing here for this company yet.</td></tr>}</tbody>
    </table></div>
  )
}

function DataScreen({ cfg, sel, say }) {
  let rows = cfg.scoped ? cfg.rows.filter(r => !sel || r[0] === sel).map(r => [nm(r[0]), ...r.slice(1)]) : cfg.rows
  if (cfg.sort != null) rows = [...rows].sort((a, b) => (a[cfg.sort] < b[cfg.sort] ? -1 : 1))
  const cols = cfg.scoped ? [cfg.first, ...cfg.cols] : cfg.cols
  return <><Head h={cfg.t} s={cfg.s}>{cfg.add && <button className="btn pk" onClick={() => say(cfg.add + ' form opens here')}>{cfg.add}</button>}</Head><Table cols={cols} rows={rows} /></>
}

function GenScreen({ cfg, sel, say }) {
  return <><Head h={cfg.t} s={cfg.s} /><div className="ev">{cfg.items.map(i =>
    <button key={i} onClick={() => say('Generating ' + i)}>{i}<small>Generate for {nm(sel || 1)}</small></button>)}</div></>
}

function Dashboard({ sel, go }) {
  const f = r => !sel || r[0] === sel
  const c = CAL.filter(f), d = DIR.filter(f)
  const stats = [
    ['Companies', CO.filter(x => x.id && !x.llp && (!sel || x.id === sel)).length],
    ['LLPs', CO.filter(x => x.llp && (!sel || x.id === sel)).length],
    ['Directors', d.length], ['Shareholders', SH.filter(f).length],
    ['Overdue tasks', c.filter(x => x[4] === 'overdue').length]]
  return <>
    <Head h="Welcome back" s="Your compliance overview at a glance"><button className="btn pk" onClick={() => go('calendar')}>Open calendar</button></Head>
    <div className="card"><Health sel={sel} /></div>
    <div className="grid">{stats.map(s => <div key={s[0]} className="card stat"><small>{s[0]}</small><strong>{s[1]}</strong></div>)}</div>
    <div className="two">
      <div className="card"><b>Upcoming and overdue</b>
        {c.filter(x => x[4] !== 'done').map((x, i) => <div key={i} className="chk"><span style={{ flex: 1 }}><b>{x[1]}</b> · {x[2]}<br /><small style={{ color: 'var(--mute)' }}>{nm(x[0])} – due {x[3]}</small></span><Chip s={x[4]} /></div>)}
        {!c.some(x => x[4] !== 'done') && <p className="empty">All caught up.</p>}</div>
      <div className="card"><b>Director KYC</b>{d.map((x, i) => <div key={i} className="chk"><span style={{ flex: 1 }}>{x[1]}</span><Chip s={x[6]} /></div>)}</div>
    </div></>
}

function Tasks() {
  const [tasks, setTasks] = useState([{ t: 'Collect DIR-3 KYC from Imran Sheikh', s: 'active' }, { t: 'Draft AGM notice for Aarav Textiles', s: 'progress' }, { t: 'File MSME-1 for Bluefin', s: 'active' }])
  const [tab, setTab] = useState('active'), [text, setText] = useState('')
  const add = () => { if (text.trim()) { setTasks([{ t: text.trim(), s: 'active' }, ...tasks]); setText('') } }
  return <>
    <Head h="Tasks" s={tasks.filter(t => t.s !== 'done').length + ' open'} />
    <div className="tabs">{['active', 'progress', 'done', 'all'].map(k => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{k}</button>)}</div>
    <div className="row"><input className="inp" value={text} placeholder="New task" onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} /><button className="btn pk" onClick={add}>Add task</button></div>
    <div className="card">{tasks.map((t, i) => (tab === 'all' || t.s === tab) &&
      <Check key={i} checked={t.s === 'done'} onChange={e => setTasks(tasks.map((x, j) => j === i ? { ...x, s: e.target.checked ? 'done' : 'active' } : x))}><span style={{ flex: 1 }}>{t.t}</span><Chip s={t.s} /></Check>)}</div></>
}

function Meetings({ sel, say }) {
  return <><Head h="Meeting scheduler" s="Schedule a meeting and generate notice, minutes and attendance sheet together" />
    <div className="card"><div className="row"><select className="inp">{MEET.map(m => <option key={m}>{m}</option>)}</select><input className="inp" type="date" /><input className="inp" type="time" defaultValue="11:00" /><input className="inp" placeholder="Venue" /></div>
      {['Notice', 'Agenda', 'Minutes', 'Attendance sheet'].map(x => <Check key={x} defaultChecked>{x}</Check>)}
      <p><button className="btn pk" onClick={() => say('Meeting pack generated for ' + nm(sel || 1))}>Generate meeting pack</button></p></div></>
}

function Events() {
  const [i, setI] = useState(0)
  return <><Head h="Event-based compliance" s="Pick an event to get its filing checklist" />
    <div className="ev">{EVT.map((e, k) => <button key={e} className={i === k ? 'on' : ''} onClick={() => setI(k)}>{e}<small>{EVSTEPS.length} steps</small></button>)}</div>
    <div className="card" style={{ marginTop: 14 }}><b>{EVT[i]}</b>{EVSTEPS.map(s => <Check key={s + i}>{s}</Check>)}</div></>
}

function Limits() {
  return <><Head h="Limits and alerts" s="Borrowing and investment limits under the Companies Act" />
    <div className="grid">{[['Section 180 borrowing', 62], ['Section 185 loans to directors', 18], ['Section 186 loans and investments', 91]].map(x =>
      <div className="card" key={x[0]}><small style={{ color: 'var(--mute)' }}>{x[0]}</small><strong style={{ fontSize: 24, display: 'block' }}>{x[1]}% used</strong><Bar p={x[1]} /></div>)}</div></>
}

function Review({ sel }) {
  const n = a => a.filter(r => !sel || r[0] === sel).length
  return <><Head h="Review sheet" s="Company master data for a financial year, loaded automatically" />
    <div className="row"><select className="inp"><option>FY 2025-26</option><option>FY 2024-25</option></select></div>
    <Table cols={['Item', 'Records', 'Check']} rows={[['Directors', n(DIR)], ['Shareholders', n(SH)], ['Auditors', 2], ['Charges', 3], ['Share capital entries', 2]].map(r => [...r, <span className="chip ok">loaded</span>])} /></>
}

function Reminders({ say }) {
  return <><Head h="Reminders" s="Email clients, directors and your team before a due date" />
    <div className="card"><div className="row"><select className="inp"><option>Clients</option><option>Directors</option><option>Team</option></select><select className="inp"><option>Filing due date</option><option>Meeting notice</option><option>Director KYC</option></select><input className="inp" type="date" /></div>
      <p style={{ color: 'var(--mute)' }}>Add an email provider in Settings before sending.</p><button className="btn pk" onClick={() => say('Reminder scheduled')}>Schedule reminder</button></div></>
}

function Simple({ h, s, items }) {
  return <><Head h={h} s={s} /><div className="card">{items.map((x, i) => <Check key={i}>{x}</Check>)}</div></>
}

function Groups({ say }) {
  const L = ({ t, a, items }) => <div className="card"><b>{t}</b>{items.map(x => <div key={x} className="chk">{x}</div>)}<p><button className="btn pk" onClick={() => say(a + ' form opens here')}>{a}</button></p></div>
  return <><Head h="Groups and industries" s="Used to filter clients on the Companies page" />
    <div className="two"><L t="Professional groups" a="Add group" items={['Direct clients', 'Group A', 'Group B']} /><L t="Industries" a="Add industry" items={['Textiles', 'Logistics', 'Food and beverage', 'IT services']} /></div></>
}

function Library({ say }) {
  return <><Head h="Document library" s="Saved documents by company" /><div className="card">
    <p style={{ color: 'var(--mute)' }}>Connect Google Drive in Settings to sync folders per company.</p>
    {['AGM notice 2025.docx', 'Board resolution – loan.docx', 'Form MGT-7.pdf'].map(x => <div key={x} className="chk"><span style={{ flex: 1 }}>{x}</span><button className="btn ghost" onClick={() => say('Downloading ' + x)}>Download</button></div>)}</div></>
}

function Activity() {
  return <><Head h="Activity log" s="Recent actions by your team" /><div className="card">
    {[['Neha', 'generated an AGM notice', 'Today 10:42'], ['Arjun', 'added a director to Bluefin Logistics', 'Today 09:15'], ['Neha', 'marked AOC-4 as filed', 'Yesterday']].map(r =>
      <div key={r[1]} className="chk"><span style={{ flex: 1 }}><b>{r[0]}</b> {r[1]}</span><small style={{ color: 'var(--mute)' }}>{r[2]}</small></div>)}</div></>
}

function AI() {
  const [msgs, setMsgs] = useState([]), [q, setQ] = useState('')
  // TODO: call your backend here, which calls the Anthropic API (never put API keys in frontend code).
  const ask = () => { if (q.trim()) { setMsgs([...msgs, ['You', q.trim()], ['Assistant', 'Connect your AI backend to get answers here.']]); setQ('') } }
  return <><Head h="AI assistant" s="Ask about the Companies Act, resolutions and drafting" /><div className="card">
    {msgs.length ? msgs.map((m, i) => <div key={i} className="chk"><b>{m[0]}</b>&nbsp;{m[1]}</div>) : <p className="empty">Ask a question to get started.</p>}
    <div className="row"><input className="inp" value={q} placeholder="Ask a question" onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} /><button className="btn pk" onClick={ask}>Ask</button></div></div></>
}

function FormCheck({ say }) {
  return <><Head h="AI form checker" s="Review an MCA e-form before you file it" /><div className="card">
    <div className="row"><input className="inp" type="file" accept=".pdf" /><button className="btn pk" onClick={() => say('Connect the form checker service in Settings')}>Check form</button></div>
    <p style={{ color: 'var(--mute)' }}>Upload the e-form PDF. The checker flags missing or mismatched fields.</p></div></>
}

const SETTINGS = {
  'Firm profile': [['Firm name', 'text'], ['Membership / registration no.', 'text'], ['Email', 'email'], ['Phone', 'tel'], ['Address', 'text']],
  'Email and reminders': [['Email provider', 'select', ['Resend', 'SMTP']], ['API key or SMTP host', 'password'], ['Sender email', 'email'], ['Remind before due date (days)', 'number'], ['Send daily digest', 'check']],
  'Integrations': [['Google Drive folder link', 'text'], ['AI assistant server URL', 'text'], ['Tally sync URL', 'text']],
  'Preferences': [['Theme', 'select', ['System', 'Light', 'Dark']], ['Default financial year', 'select', ['2025-26', '2024-25', '2023-24']], ['Date format', 'select', ['YYYY-MM-DD', 'DD/MM/YYYY']]],
}
const applyTheme = t => { const r = document.documentElement; t === 'Light' ? r.dataset.theme = 'light' : t === 'Dark' ? r.dataset.theme = 'dark' : delete r.dataset.theme }
const loadSettings = () => { try { return JSON.parse(localStorage.getItem('cybertech.settings')) || {} } catch { return {} } }

function Settings({ say }) {
  const [tab, setTab] = useState('Firm profile'), [v, setV] = useState(loadSettings)
  const set = (k, x) => { setV({ ...v, [k]: x }); if (k === 'Theme') applyTheme(x) }
  const save = () => { try { localStorage.setItem('cybertech.settings', JSON.stringify(v)); say('Settings saved') } catch { say('Could not save settings') } }
  const exportJson = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(v, null, 2)], { type: 'application/json' })); a.download = 'cybertech-settings.json'; a.click() }
  const reset = () => { localStorage.removeItem('cybertech.settings'); setV({}); applyTheme('System'); say('Settings reset') }
  return <><Head h="Settings" s="Firm details, reminders, integrations and preferences" />
    <div className="tabs">{[...Object.keys(SETTINGS), 'Data'].map(k => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{k}</button>)}</div>
    <div className="card" style={{ maxWidth: 640 }}>
      {tab === 'Data' ? <>
        <p style={{ color: 'var(--mute)' }}>Download your settings as a file, or reset everything to defaults.</p>
        <div className="row"><button className="btn ghost" onClick={exportJson}>Export settings</button><button className="btn ghost" onClick={reset}>Reset to defaults</button></div></>
      : <>{SETTINGS[tab].map(([k, type, opts]) => type === 'check'
          ? <Check key={k} checked={!!v[k]} onChange={e => set(k, e.target.checked)}>{k}</Check>
          : <div key={k} style={{ marginBottom: 12 }}><label htmlFor={k} style={{ display: 'block', color: 'var(--mute)', fontSize: 12 }}>{k}</label>
              {type === 'select' ? <select id={k} className="inp" style={{ width: '100%' }} value={v[k] || opts[0]} onChange={e => set(k, e.target.value)}>{opts.map(o => <option key={o}>{o}</option>)}</select>
                : <input id={k} className="inp" style={{ width: '100%' }} type={type} value={v[k] || ''} onChange={e => set(k, e.target.value)} />}</div>)}
        {tab === 'Email and reminders' && <p style={{ color: 'var(--mute)' }}>Keys typed here are stored in this browser only. Store real keys on your server.</p>}
        <button className="btn pk" onClick={save}>Save settings</button></>}
    </div></>
}

const CUSTOM = {
  dashboard: Dashboard, tasks: Kanban, calendar: Calendar, billing: Billing, meetings: Meetings, events: Events, limits: Limits, review: Review, reminders: Reminders,
  groups: Groups, library: Library, activity: Activity, ai: AI, formcheck: FormCheck, settings: SettingsPage, approvals: Approvals, audit: AuditTrail, orgchart: OrgChart,
  engage: () => <Simple h="Client engagement" s="Acceptance, due diligence, proposal and engagement letter" items={['Client acceptance checks', 'Due diligence', 'Communication with previous incumbent', 'Proposal', 'Fee schedule', 'Terms and engagement letter', 'Client acceptance back']} />,
}

export default function App() {
  const [cur, setCur] = useState(() => location.hash.slice(1) || 'dashboard')
  const [sel, setSel] = useState(0), [open, setOpen] = useState(false), [msg, setMsg] = useState(''), [pal, setPal] = useState(false), [rail, setRail] = useState(false)
  const [th, setTh] = useState(() => loadSettings().Theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light'))
  useEffect(() => { applyTheme(th) }, [th])
  useEffect(() => { const h = e => setTh(e.detail); addEventListener('cybertech:theme', h); return () => removeEventListener('cybertech:theme', h) }, [])
  const flip = () => { const t = th === 'Dark' ? 'Light' : 'Dark'; setTh(t); try { localStorage.setItem('cybertech.settings', JSON.stringify({ ...loadSettings(), Theme: t })) } catch {} }
  useEffect(() => { const k = e => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setPal(p => !p) } }; addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [])
  useEffect(() => { applyTheme(loadSettings().Theme); const h = () => setCur(location.hash.slice(1) || 'dashboard'); addEventListener('hashchange', h); return () => removeEventListener('hashchange', h) }, [])
  const say = t => { setMsg(t); setTimeout(() => setMsg(''), 2200) }
  const go = k => { location.hash = k; setOpen(false) }
  const Page = CUSTOM[cur]
  const label = NAV.flatMap(g => g[1]).find(n => n[0] === cur)?.[1] || cur
  return <div className="app">
    <Sidebar cur={cur} go={go} open={open} rail={rail} setRail={setRail} />
    <main>
      <header><button className="btn ghost menu" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <div className="crumb"><small>{NAV.find(g => g[1].some(n => n[0] === cur))?.[0] || 'Workspace'}</small><b>{label}</b></div>
        <select id="co" aria-label="Working company" value={sel} onChange={e => setSel(+e.target.value)}>{CO.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <button className="btn ghost srch" onClick={() => setPal(true)}>Search <kbd>Ctrl K</kbd></button><NewMenu go={go} />
        <button className="btn ghost ico" onClick={flip} aria-label="Switch light or dark theme" title="Switch theme">{th === 'Dark' ? '☀' : '☾'}</button></header>
      <div className="pg">
        {Page ? <Page sel={sel} say={say} go={go} />
          : TABLES[cur] ? <DataScreen2 key={cur} k={cur} cfg={TABLES[cur]} sel={sel} say={say} />
          : GENS[cur] ? <Gen cfg={GENS[cur]} sel={sel} say={say} />
          : <Head h={label} s="This screen already exists in your project. Only its sidebar position and company selector change." />}
      </div>
    </main>
    <Bottom cur={cur} go={go} openMenu={() => setOpen(!open)} />
    <Palette open={pal} onClose={() => setPal(false)} go={go} />
    <div className={`toast ${msg ? 'show' : ''}`}>{msg}</div>
  </div>
}
