import { useState } from 'react'
import { CO, DIR } from './data'
import { Drawer, Field, useForm } from './extra'

const Head = ({ h, s, children }) => <div className="top"><div><h1>{h}</h1><p className="sub">{s}</p></div>{children}</div>
const ld = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }
const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
const dl = (n, t, b) => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([b], { type: t })); a.download = n; a.click() }

/* Audit trail: every important action is recorded here */
export const audit = a => { const l = ld('cybertech.audit', []); sv('cybertech.audit', [{ t: new Date().toISOString().slice(0, 16).replace('T', ' '), who: 'Deep', a }, ...l].slice(0, 500)) }
const SEED = [['2026-11-06 16:42', 'Neha Kulkarni', 'Generated AGM notice for Aarav Textiles'], ['2026-11-06 11:05', 'Arjun Rao', 'Marked AOC-4 as filed for Bluefin Logistics'], ['2026-11-05 18:20', 'Deep', 'Added director Priya Nair']]

export function AuditTrail() {
  const [q, setQ] = useState(''), rows = [...ld('cybertech.audit', []).map(r => [r.t, r.who, r.a]), ...SEED].filter(r => r.join(' ').toLowerCase().includes(q.toLowerCase()))
  return <><Head h="Audit trail" s="A tamper-evident record of who did what and when"><button className="btn ghost" onClick={() => dl('audit-trail.csv', 'text/csv', 'When,Who,Action\n' + rows.map(r => r.map(c => '"' + c + '"').join(',')).join('\n'))}>Export CSV</button></Head>
    <div className="row"><input className="inp" placeholder="Search the audit trail" value={q} onChange={e => setQ(e.target.value)} /></div>
    <div className="card tbl"><table><thead><tr><th>When</th><th>Who</th><th>Action</th></tr></thead><tbody>{rows.map((r, i) => <tr key={i}><td>{r[0]}</td><td><b>{r[1]}</b></td><td>{r[2]}</td></tr>)}</tbody></table></div></>
}

const APR0 = [{ id: 1, t: 'Board resolution: loan of ₹30 lakh', c: 'Bluefin Logistics Ltd', by: 'Arjun Rao', type: 'Board resolution', s: 'pending' }, { id: 2, t: 'File MGT-7 on MCA', c: 'Aarav Textiles Pvt Ltd', by: 'Neha Kulkarni', type: 'Filing', s: 'pending' }]
const AF = [{ k: 't', label: 'What needs approval', req: 1, wide: 1 }, { k: 'c', label: 'Company', type: 'select', opts: [] }, { k: 'type', label: 'Type', type: 'select', opts: ['Board resolution', 'Filing', 'Share transfer', 'Payment'] }, { k: 'n', label: 'Notes for the approver', type: 'textarea', wide: 1 }]
export function Approvals({ say }) {
  const [l, setL] = useState(() => ld('cybertech.approvals', APR0)), [o, setO] = useState(false), [tab, setTab] = useState('pending')
  AF[1].opts = CO.filter(c => c.id).map(c => c.name)
  const f = useForm(AF, { type: 'Board resolution', c: AF[1].opts[0] })
  const put = n => { setL(n); sv('cybertech.approvals', n) }
  const act = (x, s) => { put(l.map(y => y.id === x.id ? { ...y, s } : y)); audit(`${s === 'approved' ? 'Approved' : 'Rejected'}: ${x.t}`); say(s === 'approved' ? 'Approved' : 'Rejected') }
  return <><Head h="Approvals" s="Maker-checker workflow: nothing is filed or signed until an approver signs off"><button className="btn pk" onClick={() => setO(true)}>Request approval</button></Head>
    <div className="tabs">{['pending', 'approved', 'rejected'].map(k => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{k} ({l.filter(x => x.s === k).length})</button>)}</div>
    <div className="card">{l.filter(x => x.s === tab).map(x => <div className="chk" key={x.id}><span style={{ flex: 1 }}><b>{x.t}</b><br /><small className="mute">{x.type} · {x.c} · requested by {x.by}</small></span>
      {tab === 'pending' ? <><button className="btn ghost" onClick={() => act(x, 'rejected')}>Reject</button><button className="btn pk" onClick={() => act(x, 'approved')}>Approve</button></> : <span className={'chip ' + (x.s === 'approved' ? 'ok' : 'bad')}>{x.s}</span>}</div>)}
      {!l.some(x => x.s === tab) && <p className="empty">No {tab} requests.</p>}</div>
    {o && <Drawer title="Request approval" sub="The approver is notified and the request is logged." onClose={() => setO(false)} label="Send request"
      onSave={() => { if (f.check()) { put([{ id: Date.now(), t: f.v.t.trim(), c: f.v.c, by: 'Deep', type: f.v.type, s: 'pending' }, ...l]); audit('Requested approval: ' + f.v.t); say('Request sent'); setO(false) } }}>
      <div className="fgrid">{AF.map(a => <Field key={a.k} f={a} v={f.v[a.k]} set={f.set} err={f.er[a.k]} />)}</div></Drawer>}</>
}

export function OrgChart() {
  return <><Head h="Group structure" s="Holding and subsidiary view with directors for each entity" />
    <div className="card org"><div className="node root">Your portfolio</div><ul>{CO.filter(c => c.id).map(c => <li key={c.id}><div className="node"><b>{c.name}</b><small>{c.llp ? 'LLP' : 'Company'} · {c.cin}</small></div>
      <ul>{DIR.filter(d => d[0] === c.id).map(d => <li key={d[2]}><div className="node leaf">{d[1]}<small>{d[3]}</small></div></li>)}</ul></li>)}</ul></div></>
}

/* ---------------- Settings ---------------- */
const T = (label, f) => ({ label, f })
const TEXT = (k, label, o = {}) => ({ k, label, ...o })
const GROUPS = [
  ['Firm', ['Firm profile', 'Team and roles', 'Security']],
  ['Workspace', ['Preferences', 'Notifications', 'Templates']],
  ['Integrations', ['AI and API keys', 'Email and reminders', 'Telegram and WhatsApp', 'Google Drive', 'Webhooks']],
  ['Data', ['Data and privacy']],
]
const FORMS = {
  'Firm profile': { s: 'Shown on notices, letters and invoices', f: [TEXT('firm', 'Firm name', { wide: 1 }), TEXT('pcs', 'Practising company secretary'), TEXT('mem', 'Membership no.'), TEXT('cp', 'Certificate of practice no.'), TEXT('gstin', 'GSTIN'), TEXT('email', 'Email', { type: 'email' }), TEXT('phone', 'Phone', { type: 'tel' }), TEXT('addr', 'Address', { type: 'textarea', wide: 1 })] },
  Security: { s: 'Controls for sign-in, sessions and access', f: [TEXT('mfa', 'Require two-step verification for everyone', { type: 'check', wide: 1 }), TEXT('sso', 'Single sign-on (SAML)', { type: 'check', wide: 1 }), TEXT('ssoUrl', 'SSO metadata URL', { wide: 1 }), TEXT('timeout', 'Sign out after inactivity', { type: 'select', opts: ['15 minutes', '30 minutes', '1 hour', '8 hours'] }), TEXT('pw', 'Minimum password length', { type: 'select', opts: ['8', '10', '12', '16'] }), TEXT('ips', 'Allowed IP addresses (one per line, blank allows all)', { type: 'textarea', wide: 1 }), TEXT('alert', 'Email me when a new device signs in', { type: 'check', wide: 1 })] },
  Preferences: { s: 'How dates, numbers and the workspace look', f: [TEXT('Theme', 'Theme', { type: 'select', opts: ['Light', 'Dark'] }), TEXT('fy', 'Default financial year', { type: 'select', opts: ['2026-27', '2025-26', '2024-25'] }), TEXT('df', 'Date format', { type: 'select', opts: ['DD/MM/YYYY', 'YYYY-MM-DD'] }), TEXT('tz', 'Time zone', { type: 'select', opts: ['Asia/Kolkata (IST)', 'UTC'] }), TEXT('lang', 'Language', { type: 'select', opts: ['English', 'Hindi'] }), TEXT('num', 'Number format', { type: 'select', opts: ['1,00,000 (Indian)', '100,000 (International)'] })] },
  'AI and API keys': { s: 'Keys stay in this browser. Store production keys on your server.', f: [TEXT('aip', 'AI provider', { type: 'select', opts: ['Anthropic', 'OpenAI'] }), TEXT('aim', 'Model'), TEXT('aik', 'API key', { type: 'password', wide: 1 }), TEXT('aiu', 'AI assistant server URL', { wide: 1 })] },
  'Email and reminders': { s: 'Used to email clients, directors and your team', f: [TEXT('ep', 'Email provider', { type: 'select', opts: ['Resend', 'SMTP'] }), TEXT('ek', 'API key or SMTP host', { type: 'password' }), TEXT('es', 'Sender email', { type: 'email' }), TEXT('ed', 'Remind before due date (days)', { type: 'number' }), TEXT('dig', 'Send a daily digest to the team', { type: 'check', wide: 1 })] },
  'Telegram and WhatsApp': { s: 'Send alerts to a chat instead of email', f: [TEXT('tb', 'Telegram bot token', { type: 'password', wide: 1 }), TEXT('tc', 'Telegram chat ID'), TEXT('wa', 'WhatsApp number', { type: 'tel' }), TEXT('twa', 'Send due-date alerts on WhatsApp', { type: 'check', wide: 1 })] },
  'Google Drive': { s: 'Sync a folder per company for saved documents', f: [TEXT('gd', 'Drive folder link', { wide: 1 }), TEXT('gds', 'Save generated documents to Drive automatically', { type: 'check', wide: 1 })] },
}
const NEV = ['Filing due in 7 days', 'Overdue filing', 'Director KYC due', 'DSC expiring', 'Meeting notice sent', 'Approval requested'], NCH = ['In-app', 'Email', 'WhatsApp']
const MODS = ['Companies and LLPs', 'Directors and shareholders', 'Filings and compliance', 'Documents', 'Invoices and billing', 'Team and settings'], RL = ['Admin', 'Manager', 'Associate', 'Viewer']
const LV = ['None', 'View', 'Edit', 'Approve']
const defPerm = (r, m) => r === 'Admin' ? 'Approve' : r === 'Viewer' ? (m === 'Team and settings' || m === 'Invoices and billing' ? 'None' : 'View') : r === 'Manager' ? (m === 'Team and settings' ? 'View' : 'Approve') : (m === 'Team and settings' || m === 'Invoices and billing' ? 'None' : 'Edit')
const MEM0 = [{ n: 'Deep', e: 'deep@example.com', r: 'Owner' }, { n: 'Neha Kulkarni', e: 'neha@example.com', r: 'Admin' }, { n: 'Arjun Rao', e: 'arjun@example.com', r: 'Manager' }, { n: 'Meera Joshi', e: 'meera@example.com', r: 'Associate' }]
const INV = [{ k: 'e', label: 'Email address', type: 'email', req: 1, wide: 1 }, { k: 'r', label: 'Role', type: 'select', opts: RL }]
const SESS = [['Chrome on Windows', 'Mumbai, India', 'This device'], ['Safari on iPhone', 'Mumbai, India', '2 hours ago']]

function Team({ say }) {
  const [m, setM] = useState(() => ld('cybertech.team', MEM0)), [o, setO] = useState(false), [pm, setPm] = useState(() => ld('cybertech.perms', {}))
  const f = useForm(INV, { r: 'Associate' }), put = n => { setM(n); sv('cybertech.team', n) }
  const setP = (r, mod, v) => { const n = { ...pm, [r + '|' + mod]: v }; setPm(n); sv('cybertech.perms', n); audit(`Changed ${r} access to ${mod}: ${v}`) }
  return <><div className="row"><b style={{ flex: 1 }}>{m.length} members</b><button className="btn pk" onClick={() => setO(true)}>Invite member</button></div>
    <div className="card tbl"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th /></tr></thead><tbody>{m.map(x => <tr key={x.e}><td><b>{x.n}</b></td><td>{x.e}</td>
      <td>{x.r === 'Owner' ? 'Owner' : <select className="inp" value={x.r} onChange={e => { put(m.map(y => y === x ? { ...y, r: e.target.value } : y)); audit(`Changed role of ${x.n} to ${e.target.value}`) }}>{RL.map(r => <option key={r}>{r}</option>)}</select>}</td>
      <td>{x.r !== 'Owner' && <button className="btn ghost" onClick={() => { put(m.filter(y => y !== x)); audit('Removed member ' + x.n); say(x.n + ' removed') }}>Remove</button>}</td></tr>)}</tbody></table></div>
    <h3>Roles and permissions</h3><p className="mute">Choose what each role can do in each area. Owners always have full access.</p>
    <div className="card tbl"><table><thead><tr><th>Area</th>{RL.map(r => <th key={r}>{r}</th>)}</tr></thead><tbody>{MODS.map(mod => <tr key={mod}><td><b>{mod}</b></td>{RL.map(r => <td key={r}><select className="inp" value={pm[r + '|' + mod] || defPerm(r, mod)} onChange={e => setP(r, mod, e.target.value)}>{LV.map(l => <option key={l}>{l}</option>)}</select></td>)}</tr>)}</tbody></table></div>
    {o && <Drawer title="Invite member" sub="They get an email to set a password." onClose={() => setO(false)} label="Send invite"
      onSave={() => { if (f.check()) { put([...m, { n: f.v.e.split('@')[0], e: f.v.e, r: f.v.r || 'Associate' }]); audit('Invited ' + f.v.e + ' as ' + (f.v.r || 'Associate')); say('Invite sent'); setO(false) } }}>
      <div className="fgrid">{INV.map(a => <Field key={a.k} f={a} v={f.v[a.k]} set={f.set} err={f.er[a.k]} />)}</div></Drawer>}</>
}
function Templates({ say }) {
  const [l, setL] = useState(() => ld('cybertech.templates', [])), [t, setT] = useState({ type: 'Board resolution', name: '', body: '' })
  const put = n => { setL(n); sv('cybertech.templates', n) }
  return <><div className="fgrid"><label className="fld"><span>Document type</span><select className="inp" value={t.type} onChange={e => setT({ ...t, type: e.target.value })}>{['Board resolution', 'AGM notice', 'Appointment letter', 'Engagement letter', 'Minutes'].map(x => <option key={x}>{x}</option>)}</select></label>
    <label className="fld"><span>Template name</span><input className="inp" value={t.name} onChange={e => setT({ ...t, name: e.target.value })} /></label>
    <label className="fld wide2"><span>Text (use {'{{company}}'}, {'{{cin}}'} and {'{{date}}'})</span><textarea className="inp" rows="5" value={t.body} onChange={e => setT({ ...t, body: e.target.value })} /></label></div>
    <p><button className="btn pk" onClick={() => { if (!t.name.trim()) return say('Give the template a name'); put([...l, t]); audit('Created template ' + t.name); setT({ ...t, name: '', body: '' }); say('Template saved') }}>Create template</button></p>
    <h3>Your templates</h3>{l.length ? l.map((x, i) => <div className="chk" key={i}><span style={{ flex: 1 }}><b>{x.name}</b><br /><small className="mute">{x.type}</small></span><button className="btn ghost" onClick={() => put(l.filter((_, j) => j !== i))}>Delete</button></div>) : <p className="empty">No templates yet. Create your first one above.</p>}</>
}
function Hooks({ v, set, say }) {
  const key = v.apikey || ''
  return <><div className="fgrid"><label className="fld wide2"><span>Webhook URL</span><input className="inp" value={v.hook || ''} placeholder="https://example.com/hooks/cybertech" onChange={e => set('hook', e.target.value)} /></label>
    {['Filing completed', 'Filing overdue', 'Approval decided', 'Member invited'].map(x => <label className="fld" key={x}><span>{x}</span><input type="checkbox" checked={!!v['h:' + x]} onChange={e => set('h:' + x, e.target.checked)} /></label>)}</div>
    <h3>API key</h3><div className="row"><input className="inp" readOnly value={key ? key.slice(0, 7) + '••••••••••••' : 'No key generated'} /><button className="btn ghost" onClick={() => { const k = 'ct_live_' + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12); set('apikey', k); navigator.clipboard?.writeText(k); audit('Generated API key'); say('New key copied. Store it safely.') }}>{key ? 'Rotate key' : 'Generate key'}</button></div></>
}
function Data({ say }) {
  const all = () => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('cybertech.') && !/auth|aik|apikey/.test(k)) o[k] = localStorage.getItem(k) } return o }
  return <><p className="mute">Download everything stored in this browser, or erase it. Keys and passwords are left out of exports.</p>
    <div className="row"><button className="btn ghost" onClick={() => { dl('cybertech-data.json', 'application/json', JSON.stringify(all(), null, 2)); audit('Exported workspace data') }}>Export all data</button>
      <button className="btn ghost" onClick={() => { if (confirm('Erase all data stored in this browser?')) { Object.keys(all()).forEach(k => localStorage.removeItem(k)); say('Data erased. Reloading…'); setTimeout(() => location.reload(), 800) } }}>Erase browser data</button></div>
    <h3>Active sessions</h3>{SESS.map(s => <div className="chk" key={s[0]}><span style={{ flex: 1 }}><b>{s[0]}</b><br /><small className="mute">{s[1]}</small></span><span className="mute">{s[2]}</span></div>)}</>
}

export function SettingsPage({ say }) {
  const [tab, setTab] = useState('Firm profile'), [v, setV] = useState(() => ld('cybertech.settings', {}))
  const set = (k, x) => setV(p => ({ ...p, [k]: x }))
  const cfg = FORMS[tab]
  const save = () => { sv('cybertech.settings', v); if (v.Theme) { dispatchEvent(new CustomEvent('cybertech:theme', { detail: v.Theme })) } audit('Updated settings: ' + tab); say('Settings saved') }
  const body = tab === 'Team and roles' ? <Team say={say} /> : tab === 'Templates' ? <Templates say={say} /> : tab === 'Data and privacy' ? <Data say={say} />
    : tab === 'Notifications' ? <div className="card tbl"><table><thead><tr><th>Send me an alert when</th>{NCH.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>{NEV.map(e => <tr key={e}><td><b>{e}</b></td>{NCH.map(c => <td key={c}><input type="checkbox" aria-label={e + ' by ' + c} checked={v['n:' + e + c] ?? c !== 'WhatsApp'} onChange={x => set('n:' + e + c, x.target.checked)} /></td>)}</tr>)}</tbody></table></div>
    : tab === 'Webhooks' ? <Hooks v={v} set={set} say={say} />
    : <div className="fgrid">{cfg.f.map(f => <Field key={f.k} f={f} v={v[f.k]} set={set} />)}</div>
  const own = !['Team and roles', 'Templates', 'Data and privacy'].includes(tab)
  return <><Head h="Settings" s="Firm details, access control, integrations and data" />
    <div className="sgrid"><div className="snav">{GROUPS.map(g => <div key={g[0]}><h6>{g[0]}</h6>{g[1].map(k => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{k}</button>)}</div>)}</div>
      <div className="card sbody"><h2>{tab}</h2>{cfg && <p className="mute">{cfg.s}</p>}{body}{own && <p><button className="btn pk" onClick={save}>Save changes</button></p>}</div></div></>
}
