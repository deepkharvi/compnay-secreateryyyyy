import { TABLES as T0, GENS as G0, CO, inr } from './data'
// Merged module list: company secretary + practice management + CRM + entity tracking
export const NAV = [
  ['Workspace', [['dashboard', 'Dashboard'], ['companies', 'Companies'], ['llps', 'LLPs'], ['directors', 'Directors'], ['shareholders', 'Shareholders'], ['kmp', 'KMP'], ['tasks', 'Tasks'], ['library', 'Document library']]],
  ['Entity records', [['sharecap', 'Share capital'], ['charges', 'Charges'], ['auditors', 'Auditors'], ['registers', 'Statutory registers'], ['beneficial', 'Beneficial ownership'], ['borrow', 'Borrowing register'], ['loans', 'Loans and investments'], ['limits', 'Limits and alerts']]],
  ['Compliance', [['calendar', 'Compliance calendar'], ['alerts', 'Alerts'], ['kyc', 'Director KYC'], ['afstatus', 'Annual filing status'], ['mca', 'MCA applications'], ['pdr', 'Public documents report'], ['review', 'Review sheet'], ['meetings', 'Meeting scheduler'], ['reminders', 'Reminders'], ['events', 'Event-based compliance']]],
  ['Documents', [['afs', 'Annual filing suite'], ['llpdocs', 'LLP documents'], ['templates', 'Templates']]],
  ['Practice', [['leads', 'Leads and proposals'], ['engage', 'Client engagement'], ['engagements', 'Engagements'], ['time', 'Time tracking'], ['invoices', 'Invoices'], ['gst', 'GST filing'], ['itr', 'ITR tracker'], ['dsc', 'DSC register'], ['finance', 'Financial information'], ['reports', 'Reports'], ['pcs', 'PCS master'], ['groups', 'Groups and industries'], ['activity', 'Activity log']]],
  ['Governance', [['approvals', 'Approvals'], ['audit', 'Audit trail'], ['orgchart', 'Group structure']]],
  ['AI tools', [['ai', 'Sachiv AI'], ['formcheck', 'AI form checker']]],
  ['Account', [['billing', 'Billing and plan'], ['settings', 'Settings']]],
]
export const TABLES = {
  ...T0,
  registers: { t: 'Statutory registers', s: 'Registers required under the Companies Act, kept per company', add: 'Add entry', scoped: 1, first: 'Company', cols: ['Register', 'Section', 'Entries', 'Status'], rows: [[1, 'Register of members', 'MGT-1 · 88', '2', 'chip:done'], [1, 'Register of directors and KMP', '170', '2', 'chip:done'], [1, 'Register of charges', 'CHG-7 · 85', '1', 'chip:pending'], [2, 'Register of members', 'MGT-1 · 88', '2', 'chip:done'], [2, 'Register of loans and investments', 'MBP-2 · 186', '1', 'chip:pending']] },
  beneficial: { t: 'Beneficial ownership', s: 'Significant beneficial owners and BEN-2 filings', add: 'Add SBO', scoped: 1, first: 'Company', cols: ['Owner', 'Holding', 'BEN-2', 'Status'], rows: [[2, 'Bluefin Holdings', '72%', '2025-12-31', 'chip:pending'], [1, 'Rohan Mehta', '60%', '2025-06-30', 'chip:done']] },
  alerts: { t: 'Alerts', s: 'Everything that needs attention across your companies', scoped: 1, first: 'Company', cols: ['Alert', 'Due', 'Severity'], rows: [[1, 'AOC-4 is overdue', '2026-10-30', 'chip:overdue'], [2, 'MSME-1 is overdue', '2026-10-31', 'chip:overdue'], [2, 'Imran Sheikh DIR-3 KYC overdue', '2026-09-30', 'chip:overdue'], [1, 'MGT-7 due in 22 days', '2026-11-29', 'chip:due'], [2, 'DSC for Imran Sheikh expires soon', '2026-11-20', 'chip:due']] },
  mca: { t: 'MCA applications', s: 'Filings read from your MCA session: receipts, approved, processing, rejected', add: 'Inject MCA session', cols: ['SRN', 'Form', 'Entity', 'Status', 'Updated'], rows: [['T12345678', 'AOC-4', 'Bluefin Logistics Ltd', 'chip:done', '2026-10-28'], ['T12345901', 'MGT-7', 'Aarav Textiles Pvt Ltd', 'chip:pending', '2026-11-02']] },
  pdr: { t: 'Public documents report', s: 'Browse and download public documents from MCA', add: 'List documents', cols: ['Category', 'Documents', 'Fee'], rows: [['Annual returns and balance sheet eForms', '14', '₹100 each'], ['Charges documents', '6', '₹100 each'], ['Incorporation documents', '9', '₹100 each']] },
  leads: { t: 'Leads and proposals', s: 'Pipeline from first enquiry to signed engagement', add: 'New lead', cols: ['Lead', 'Service', 'Value', 'Stage'], rows: [['Sundaram Exports', 'Annual compliance', inr(60000), 'chip:active'], ['Nova Pharma', 'Incorporation', inr(25000), 'chip:progress'], ['Greenleaf Agro', 'LLP conversion', inr(45000), 'chip:done']] },
  engagements: { t: 'Engagements', s: 'Work planned for each client, with budget and SLA', add: 'New engagement', scoped: 1, first: 'Client', cols: ['Engagement', 'Service line', 'Due', 'Status'], rows: [[1, 'FY26 statutory audit', 'Audit', '2026-11-30', 'chip:progress'], [2, 'Annual ROC filings', 'Advisory', '2026-12-15', 'chip:active']] },
  time: { t: 'Time tracking', s: 'Hours logged against engagements', add: 'Log time', cols: ['Date', 'Engagement', 'Person', 'Hours'], rows: [['2026-11-06', 'Annual ROC filings', 'Neha', '3.5'], ['2026-11-05', 'FY26 statutory audit', 'Arjun', '5.0']] },
  invoices: { t: 'Invoices', s: 'Bill clients with GST', add: 'New invoice', cols: ['Number', 'Client', 'Amount (incl. 18% GST)', 'Status'], rows: [['INV-2026-0012', 'Aarav Textiles', inr(59000), 'chip:done'], ['INV-2026-0013', 'Bluefin Logistics', inr(118000), 'chip:pending']] },
  gst: { t: 'GST filing', s: 'Latest GSTR-1 and GSTR-3B for each client with a GSTIN', add: 'Add GSTIN', scoped: 1, first: 'Client', cols: ['GSTIN', 'GSTR-1', 'GSTR-3B'], rows: [[1, '27AAAAA0000A1Z5', 'chip:done', 'chip:done'], [2, '27BBBBB1111B1Z3', 'chip:pending', 'chip:overdue']] },
  itr: { t: 'ITR tracker', s: 'Returns for AY 2026-27 and e-verification status', scoped: 1, first: 'Client', cols: ['Form', 'Filed on', 'E-verified'], rows: [[1, 'ITR-6', '2026-10-28', 'chip:done'], [2, 'ITR-6', '—', 'chip:pending']] },
}
export const GENS = {
  ...G0,
  afs: { ...G0.afs, items: [...G0.afs.items] },
  templates: { t: 'Templates', s: 'Reusable drafts for notices, resolutions and letters', items: ['Board resolution', 'AGM notice', 'Appointment letter', 'Engagement letter', 'Proposal', 'Fee schedule'] },
}
export const STAT = { done: 'ok', pending: 'warn', due: 'warn', overdue: 'bad' }
export { CO }
