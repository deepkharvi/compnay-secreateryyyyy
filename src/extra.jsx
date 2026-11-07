import { useState, useEffect, useRef } from 'react'
import { CO, CAL, DIR, SH } from './data'
import { NAV } from './more'

const nm = id => CO.find(c => c.id === id)?.name
const Head = ({ h, s, children }) => <div className="top"><div><h1>{h}</h1><p className="sub">{s}</p></div>{children}</div>
const dl = (name, type, body) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type })); a.download = name; a.click() }

export function Login({ onIn }) {
  const [e, setE] = useState(''), [p, setP] = useState('')
  return <div className="login"><form className="card" onSubmit={x => { x.preventDefault(); if (e && p) onIn() }}>
    <div className="logo dark"><i>T</i>The Cybertech</div><h1>Welcome back</h1><p className="sub">Sign in to your practice</p>
    <label>Email address<input className="inp" type="email" value={e} onChange={x => setE(x.target.value)} placeholder="you@example.com" /></label>
    <label>Password<input className="inp" type="password" value={p} onChange={x => setP(x.target.value)} /></label>
    <button className="btn pk wide">Sign in</button><p className="sub">Demo sign-in: any email and password. Replace with your real auth.</p></form></div>
}

export function Palette({ open, onClose, go }) {
  const [q, setQ] = useState(''), ref = useRef()
  useEffect(() => { if (open) { setQ(''); setTimeout(() => ref.current?.focus(), 0) } }, [open])
  if (!open) return null
  const items = NAV.flatMap(g => g[1].map(n => ({ k: n[0], l: n[1], g: g[0] }))).filter(n => (n.l + n.g).toLowerCase().includes(q.toLowerCase())).slice(0, 8)
  return <div className="scrim" onClick={onClose}><div className="pal card" onClick={e => e.stopPropagation()}>
    <input ref={ref} className="inp" placeholder="Jump to a screen…" value={q} onChange={e => setQ(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter' && items[0]) { go(items[0].k); onClose() } if (e.key === 'Escape') onClose() }} />
    {items.map(n => <button key={n.k} onClick={() => { go(n.k); onClose() }}>{n.l}<small>{n.g}</small></button>)}
    {!items.length && <p className="empty">No screen matches “{q}”.</p>}</div></div>
}

export function NewMenu({ go }) {
  const [o, setO] = useState(false)
  const L = [['Company', 'companies'], ['LLP', 'llps'], ['Task', 'tasks'], ['Meeting', 'meetings'], ['Invoice', 'invoices'], ['Time entry', 'time'], ['DSC', 'dsc'], ['Document', 'afs']]
  return <div className="newwrap"><button className="btn pk" onClick={() => setO(!o)}>+ New</button>
    {o && <div className="ddm card" onMouseLeave={() => setO(false)}>{L.map(([l, k]) => <button key={k} onClick={() => { go(k); setO(false) }}>{l}</button>)}</div>}</div>
}

const COLS = ['Backlog', 'To-do', 'Doing', 'Review', 'Done']
export function Tasks({ sel }) {
  const [tasks, setTasks] = useState([
    { t: 'Collect DIR-3 KYC from Imran Sheikh', c: 2, s: 'To-do', due: '2026-11-12' }, { t: 'Draft AGM notice', c: 1, s: 'Doing', due: '2026-11-15' },
    { t: 'File MSME-1', c: 2, s: 'Backlog', due: '2026-11-20' }, { t: 'Review directors report', c: 1, s: 'Review', due: '2026-11-18' }, { t: 'Renew DSC', c: 2, s: 'Done', due: '2026-11-01' }])
  const [view, setView] = useState('Kanban'), [text, setText] = useState(''), [dr, setDr] = useState(false)
  const shown = tasks.filter(t => !sel || t.c === sel)
  const move = (t, d) => setTasks(tasks.map(x => x === t ? { ...x, s: COLS[Math.max(0, Math.min(4, COLS.indexOf(x.s) + d))] } : x))
  const add = () => { if (text.trim()) { setTasks([{ t: text.trim(), c: sel || 1, s: 'To-do', due: '' }, ...tasks]); setText('') } }
  const Card = ({ t }) => <div className="tcard"><b>{t.t}</b><small>{nm(t.c)}{t.due && ' · due ' + t.due}{t.who && t.who !== 'Unassigned' ? ' · ' + t.who : ''}</small>{(t.pr || t.rec || t.sub?.length) && <small>{[t.pr, t.rec && '↻ ' + t.rec, t.sub?.length && t.sub.length + ' subtasks'].filter(Boolean).join(' · ')}</small>}
    <div className="mv"><button aria-label="Move back" onClick={() => move(t, -1)}>‹</button><button aria-label="Move forward" onClick={() => move(t, 1)}>›</button></div></div>
  return <><Head h="Tasks" s={shown.filter(t => t.s !== 'Done').length + ' open tasks'}><div className="tabs">{['Kanban', 'List'].map(v => <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>{v}</button>)}</div></Head>
    <div className="row"><input className="inp" value={text} placeholder="New task title" onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} /><button className="btn ghost" onClick={add}>Quick add</button><button className="btn pk" onClick={() => setDr(true)}>New task</button></div>
    {dr && <TaskDrawer sel={sel} onClose={() => setDr(false)} onAdd={t => setTasks([t, ...tasks])} />}
    {view === 'Kanban' ? <div className="kan">{COLS.map(c => <div key={c} className="kcol"><h4>{c}<span>{shown.filter(t => t.s === c).length}</span></h4>{shown.filter(t => t.s === c).map((t, i) => <Card key={i} t={t} />)}</div>)}</div>
      : <div className="card">{shown.map((t, i) => <div className="chk" key={i}><span style={{ flex: 1 }}><b>{t.t}</b><br /><small className="mute">{nm(t.c)} · {t.due || 'no due date'}</small></span><span className="chip pkc">{t.s}</span></div>)}</div>}</>
}

export function Calendar({ sel }) {
  const [m, setM] = useState(10), y = 2026, rows = CAL.filter(r => !sel || r[0] === sel)
  const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate(), pad = n => String(n).padStart(2, '0')
  const on = d => rows.filter(r => r[3] === `${y}-${pad(m + 1)}-${pad(d)}`)
  return <><Head h="Compliance calendar" s="Statutory due dates by company, with status"><div className="tabs"><button onClick={() => setM(m - 1)}>‹</button><button className="on">{new Date(y, m).toLocaleString('en', { month: 'long' })} {y}</button><button onClick={() => setM(m + 1)}>›</button></div></Head>
    <div className="cal card">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <h6 key={d}>{d}</h6>)}
      {Array.from({ length: first }, (_, i) => <div key={'p' + i} className="day off" />)}
      {Array.from({ length: days }, (_, i) => <div key={i} className={'day' + (m === 10 && i + 1 === 7 ? ' today' : '')}><span>{i + 1}</span>{on(i + 1).map((r, k) => <em key={k} className={r[4]}>{r[1]} · {nm(r[0]).split(' ')[0]}</em>)}</div>)}</div></>
}

const body = (t, c) => `<h2>${t}</h2><p><b>${c.name}</b>${c.cin ? ' (CIN/LLPIN: ' + c.cin + ')' : ''}</p><p>Date: ${new Date().toLocaleDateString('en-IN')}</p>
<p>${/resolution|appoint/i.test(t) ? 'RESOLVED THAT approval be and is hereby accorded for the matter described below.' : 'This is a draft prepared from the company master data. Edit the text below before use.'}</p>
<p>Directors: ${DIR.filter(d => d[0] === c.id).map(d => d[1]).join(', ') || 'not on record'}.</p><p>Authorised signatory: ____________________</p>`
export function Gen({ cfg, sel, say }) {
  const [it, setIt] = useState(null), ref = useRef(), c = CO.find(x => x.id === (sel || 1))
  const html = () => ref.current.innerHTML
  const word = () => dl(it + '.doc', 'application/msword', `<html><body>${html()}</body></html>`)
  const pdf = () => { const w = open('', '_blank'); if (!w) return say('Allow pop-ups to print'); w.document.write(`<title>${it}</title>${html()}`); w.document.close(); w.print() }
  const xls = () => dl(it + '.csv', 'text/csv', 'Name,DIN / Shares,Role / Holding\n' + DIR.filter(d => d[0] === c.id).map(d => `${d[1]},${d[2]},${d[3]}`).concat(SH.filter(s => s[0] === c.id).map(s => `${s[1]},${s[2]},${s[3]}%`)).join('\n'))
  return <><Head h={cfg.t} s={cfg.s} />
    {it ? <div className="card"><div className="row"><button className="btn ghost" onClick={() => setIt(null)}>‹ All documents</button><b style={{ flex: 1 }}>{it} for {c.name}</b>
      <button className="btn ghost" onClick={word}>Generate Word</button><button className="btn ghost" onClick={xls}>Generate Excel</button><button className="btn pk" onClick={pdf}>Generate PDF</button></div>
      <div ref={ref} className="paper" contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: body(it, c) }} /></div>
      : <div className="ev">{cfg.items.map(i => <button key={i} onClick={() => setIt(i)}>{i}<small>Preview and edit for {c.name}</small></button>)}</div>}</>
}

export function Billing({ say }) {
  return <><Head h="Billing and plan" s="Free accounts include 5 companies; the annual plan unlocks unlimited companies and team seats" />
    <div className="two"><div className="card"><b>Annual unlimited plan</b>
      {[['Plan price', '₹25,000'], ['GST (18%)', '₹4,500'], ['Total payable per year', '₹29,500']].map(r => <div className="chk" key={r[0]}><span style={{ flex: 1 }}>{r[0]}</span><b>{r[1]}</b></div>)}
      <p><button className="btn pk" onClick={() => say('Checkout opens here')}>Continue to secure payment</button></p></div>
      <div className="card"><b>Your usage</b><p className="mute">3 of 5 companies used</p><div className="bar"><div style={{ width: '60%' }} /></div>
        <p className="mute">Add billing entity, GSTIN and address in Settings before paying.</p></div></div></>
}

export function Health({ sel }) {
  const r = CAL.filter(x => !sel || x[0] === sel), p = Math.round(100 * r.filter(x => x[4] === 'done').length / (r.length || 1)), L = 2 * Math.PI * 34
  return <div className="ring"><svg viewBox="0 0 80 80" width="96" height="96"><circle cx="40" cy="40" r="34" className="rb" /><circle cx="40" cy="40" r="34" className="rf" strokeDasharray={`${L * p / 100} ${L}`} transform="rotate(-90 40 40)" /><text x="40" y="45" textAnchor="middle">{p}%</text></svg><div><b>Compliance health</b><p className="mute">{r.filter(x => x[4] === 'overdue').length} overdue, {r.filter(x => x[4] === 'pending').length} pending</p></div></div>
}

/* ===================== Forms ===================== */
import { TABLES } from './more'
import { inr } from './data'
try { JSON.parse(localStorage.getItem('cybertech.co') || '[]').forEach(c => { if (!CO.some(x => x.id === c.id)) CO.push(c) }) } catch {}
const store = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
const aud = a => { try { const l = JSON.parse(localStorage.getItem('cybertech.audit') || '[]'); localStorage.setItem('cybertech.audit', JSON.stringify([{ t: new Date().toISOString().slice(0, 16).replace('T', ' '), who: 'Deep', a }, ...l].slice(0, 500))) } catch {} }
const STATUS = ['pending', 'done', 'due', 'overdue']
const DATEC = /date|due|created|appointed|expiry|issued|filed|^from$/i, NUMC = /amount|shares|paid|authorised|hours|value|turnover|profit|worth|rate/i, MONEY = /amount|paid-up|authorised|value|turnover|net profit|net worth/i
const STC = /status|severity|stage|gstr|aoc-4|mgt-7|verified|ben-2/i
const CHP = { done: 'ok', pending: 'warn', due: 'warn', overdue: 'bad' }

export function Drawer({ title, sub, onClose, onSave, label = 'Save', children }) {
  useEffect(() => { const k = e => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [])
  return <div className="scrim side" onClick={onClose}><form className="drawer card" onClick={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); onSave() }}>
    <div className="dh"><div><h2>{title}</h2><p className="sub">{sub}</p></div><button type="button" className="btn ghost" onClick={onClose} aria-label="Close">✕</button></div>
    <div className="db">{children}</div>
    <div className="df"><button type="button" className="btn ghost" onClick={onClose}>Cancel</button><button className="btn pk">{label}</button></div></form></div>
}
export const Field = ({ f, v, set, err }) => <label className={'fld' + (f.wide ? ' wide2' : '')}><span>{f.label}{f.req && <i> *</i>}</span>
  {f.type === 'select' ? <select className="inp" value={v ?? f.opts[0]} onChange={e => set(f.k, e.target.value)}>{f.opts.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}</select>
    : f.type === 'textarea' ? <textarea className="inp" rows="3" value={v || ''} onChange={e => set(f.k, e.target.value)} />
    : f.type === 'check' ? <input type="checkbox" checked={!!v} onChange={e => set(f.k, e.target.checked)} />
    : <input className={'inp' + (err ? ' bad' : '')} type={f.type || 'text'} value={v || ''} onChange={e => set(f.k, e.target.value)} placeholder={f.ph} />}
  {err && <small className="err">{err}</small>}</label>
export function useForm(fields, init = {}) {
  const [v, setV] = useState(init), [er, setEr] = useState({})
  const set = (k, x) => setV(p => ({ ...p, [k]: x }))
  const check = () => { const e = {}; fields.forEach(f => { if (f.req && !String(v[f.k] ?? '').trim()) e[f.k] = 'Required' }); setEr(e); return !Object.keys(e).length }
  return { v, set, er, check }
}
const Fields = ({ fields, form }) => <div className="fgrid">{fields.map(f => <Field key={f.k} f={f} v={form.v[f.k]} set={form.set} err={form.er[f.k]} />)}</div>
const coOpts = () => CO.filter(c => c.id).map(c => ({ v: c.id, l: c.name }))

const fieldsFor = (k, cfg) => [
  ...(cfg.scoped ? [{ k: '_co', label: cfg.first, type: 'select', opts: coOpts(), req: 1 }] : []),
  ...cfg.cols.map((c, i) => ({ k: 'c' + i, label: c, req: i === 0, type: STC.test(c) ? 'select' : DATEC.test(c) ? 'date' : NUMC.test(c) ? 'number' : 'text', opts: /stage/i.test(c) ? ['active', 'progress', 'pending', 'done'] : STATUS })),
]
const COFIELDS = [{ k: 'name', label: 'Legal name', req: 1, wide: 1 }, { k: 'cin', label: 'CIN / LLPIN', req: 1 }, { k: 'type', label: 'Type', type: 'select', opts: ['Company', 'LLP'] },
  { k: 'doi', label: 'Date of incorporation', type: 'date' }, { k: 'email', label: 'Email', type: 'email' }, { k: 'phone', label: 'Phone', type: 'tel' }, { k: 'addr', label: 'Registered office address', type: 'textarea', wide: 1 }]

function Rows({ cols, rows, extraFrom, del }) {
  return <div className="card tbl"><table><thead><tr>{cols.map(c => <th key={c}>{c}</th>)}<th /></tr></thead><tbody>
    {rows.length ? rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{typeof c === 'string' && c.startsWith('chip:') ? <span className={'chip ' + (CHP[c.slice(5)] || 'pkc')}>{c.slice(5)}</span> : j === 0 ? <b>{c}</b> : c}</td>)}
      <td>{i >= extraFrom && <button className="btn ghost" onClick={() => del(i - extraFrom)}>Remove</button>}</td></tr>) : <tr><td colSpan={cols.length + 1} className="empty">Nothing here for this company yet.</td></tr>}</tbody></table></div>
}

function InvoiceBody({ form }) {
  const lines = form.v.lines || [{ d: '', q: 1, p: 0 }], setL = (i, k, x) => form.set('lines', lines.map((l, j) => j === i ? { ...l, [k]: x } : l))
  const sub = lines.reduce((a, l) => a + (+l.q || 0) * (+l.p || 0), 0), gst = sub * (+(form.v.gst ?? 18)) / 100
  return <><Fields form={form} fields={INV} />
    <h4>Line items</h4>{lines.map((l, i) => <div className="li" key={i}><input className="inp" placeholder="Service or description" value={l.d} onChange={e => setL(i, 'd', e.target.value)} />
      <input className="inp" type="number" min="1" value={l.q} onChange={e => setL(i, 'q', e.target.value)} aria-label="Quantity" /><input className="inp" type="number" min="0" value={l.p} onChange={e => setL(i, 'p', e.target.value)} aria-label="Unit price" />
      <button type="button" className="btn ghost" onClick={() => form.set('lines', lines.filter((_, j) => j !== i))} aria-label="Remove line">✕</button></div>)}
    <button type="button" className="btn ghost" onClick={() => form.set('lines', [...lines, { d: '', q: 1, p: 0 }])}>+ Add line</button>
    <div className="tot"><span>Subtotal</span><b>{inr(sub)}</b><span>GST {form.v.gst ?? 18}%</span><b>{inr(Math.round(gst))}</b><span>Total</span><b>{inr(Math.round(sub + gst))}</b></div></>
}
const INV = [{ k: '_co', label: 'Client', type: 'select', opts: [], req: 1 }, { k: 'no', label: 'Invoice number', ph: 'Auto' }, { k: 'issue', label: 'Issue date', type: 'date' }, { k: 'due', label: 'Due date', type: 'date' },
  { k: 'gst', label: 'GST %', type: 'select', opts: ['18', '12', '5', '0'] }, { k: 'notes', label: 'Notes and payment terms', type: 'textarea', wide: 1 }]

export function DataScreen2({ k, cfg, sel, say }) {
  const [open, setOpen] = useState(false), [, tick] = useState(0), key = 'cybertech.rows.' + k
  const [added, setAdded] = useState(() => store(key, []))
  const isCo = k === 'companies' || k === 'llps', isInv = k === 'invoices'
  INV[0].opts = coOpts()
  const fields = isCo ? COFIELDS : fieldsFor(k, cfg)
  const form = useForm(isInv ? INV : fields, isCo ? { type: k === 'llps' ? 'LLP' : 'Company' } : { _co: sel || 1, issue: new Date().toISOString().slice(0, 10) })
  const close = () => setOpen(false)
  const commit = () => {
    if (!form.check()) return
    const v = form.v
    if (isCo) {
      const c = { id: Math.max(...CO.map(x => x.id)) + 1, name: v.name.trim(), cin: v.cin.trim(), llp: v.type === 'LLP' ? 1 : undefined }
      CO.push(c); save('cybertech.co', store('cybertech.co', []).concat(c)); aud('Added ' + c.name); tick(n => n + 1); say(c.name + ' added'); return close()
    }
    let row
    if (isInv) { const l = v.lines || [], sub = l.reduce((a, x) => a + (+x.q || 0) * (+x.p || 0), 0); row = [v.no || 'INV-2026-' + String(14 + added.length).padStart(4, '0'), nm(+v._co), inr(Math.round(sub * (1 + (+(v.gst ?? 18)) / 100))), 'chip:pending'] }
    else row = [...(cfg.scoped ? [+v._co] : []), ...cfg.cols.map((c, i) => { const x = v['c' + i] ?? (STC.test(c) ? (/stage/i.test(c) ? 'active' : 'pending') : ''); return STC.test(c) ? 'chip:' + x : MONEY.test(c) && x !== '' ? inr(+x) : x })]
    const next = [...added, row]; setAdded(next); save(key, next); aud('Added entry in ' + cfg.t); say('Saved'); close()
  }
  const base = isCo ? (k === 'llps' ? CO.filter(c => c.llp).map(c => [c.id, c.cin, DIR.filter(d => d[0] === c.id).length, '—']) : CO.filter(c => c.id).map(c => [c.id, c.cin, c.llp ? 'LLP' : 'Company'])) : cfg.rows
  let rows = [...base, ...added]
  const n0 = base.length
  if (cfg.scoped) rows = rows.map((r, i) => [r, i]).filter(([r]) => !sel || r[0] === sel).map(([r, i]) => [[nm(r[0]), ...r.slice(1)], i])
  else rows = rows.map((r, i) => [r, i])
  if (cfg.sort != null) rows = [...rows].sort((a, b) => (a[0][cfg.sort] < b[0][cfg.sort] ? -1 : 1))
  const shown = rows.map(r => r[0]), cols = cfg.scoped ? [cfg.first, ...cfg.cols] : cfg.cols
  const idx = rows.map(r => r[1])
  const remove = j => { const gi = idx[j] - n0; if (gi >= 0) { const next = added.filter((_, x) => x !== gi); setAdded(next); save(key, next); say('Removed') } }
  const addLabel = isCo ? (k === 'llps' ? 'Add LLP' : 'Add company') : isInv ? 'New invoice' : cfg.add
  return <><Head h={cfg.t} s={cfg.s}>{addLabel && <button className="btn pk" onClick={() => { form.set('_co', sel || 1); setOpen(true) }}>{addLabel}</button>}</Head>
    <div className="card tbl"><table><thead><tr>{cols.map(c => <th key={c}>{c}</th>)}<th /></tr></thead><tbody>
      {shown.length ? shown.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{typeof c === 'string' && c.startsWith('chip:') ? <span className={'chip ' + (CHP[c.slice(5)] || 'pkc')}>{c.slice(5)}</span> : j === 0 ? <b>{c}</b> : c}</td>)}<td>{idx[i] >= n0 && <button className="btn ghost" onClick={() => remove(i)}>Remove</button>}</td></tr>)
        : <tr><td colSpan={cols.length + 1} className="empty">Nothing here for this company yet.</td></tr>}</tbody></table></div>
    {open && <Drawer title={addLabel} sub={isCo ? 'Saved in this browser. Connect your API to store it on the server.' : 'Fields marked * are required.'} onClose={close} onSave={commit} label={isInv ? 'Create invoice' : 'Save'}>
      {isInv ? <InvoiceBody form={form} /> : <Fields fields={fields} form={form} />}</Drawer>}</>
}

/* Rich task form */
export const TASKF = [{ k: 'title', label: 'Title', req: 1, wide: 1 }, { k: 'c', label: 'Company', type: 'select', opts: [], req: 1 }, { k: 's', label: 'Status', type: 'select', opts: COLS }, { k: 'pr', label: 'Priority', type: 'select', opts: ['Low', 'Med', 'High', 'Critical'] },
  { k: 'who', label: 'Assignee', type: 'select', opts: ['Unassigned', 'Neha', 'Arjun', 'Deep'] }, { k: 'start', label: 'Start date', type: 'date' }, { k: 'due', label: 'Due date', type: 'date' }, { k: 'tags', label: 'Tags', ph: 'Comma separated' },
  { k: 'desc', label: 'Description', type: 'textarea', wide: 1 }, { k: 'sub', label: 'Subtasks (one per line)', type: 'textarea', wide: 1 }, { k: 'rec', label: 'Recurring task', type: 'check' }, { k: 'freq', label: 'Repeats', type: 'select', opts: ['Monthly', 'Quarterly', 'Yearly'] }]
export function TaskDrawer({ sel, onClose, onAdd }) {
  TASKF[1].opts = coOpts()
  const form = useForm(TASKF, { c: sel || 1, s: 'To-do', pr: 'Med' })
  return <Drawer title="New task" sub="Add a task for a company. Subtasks and repeats are optional." onClose={onClose} label="Create task"
    onSave={() => { if (form.check()) { const v = form.v; onAdd({ t: v.title.trim(), c: +v.c, s: v.s || 'To-do', pr: v.pr || 'Med', who: v.who, due: v.due || '', sub: (v.sub || '').split('\n').filter(Boolean), rec: v.rec ? v.freq || 'Monthly' : '' }); onClose() } }}>
    <Fields fields={TASKF} form={form} /></Drawer>
}
