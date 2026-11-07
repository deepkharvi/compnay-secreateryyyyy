// Sample data. Replace each export with calls to your API / database.
export const inr = n => '₹' + n.toLocaleString('en-IN')
export const CO = [
  { id: 0, name: 'All companies' },
  { id: 1, name: 'Aarav Textiles Pvt Ltd', cin: 'U17120MH2015PTC268841' },
  { id: 2, name: 'Bluefin Logistics Ltd', cin: 'U63090MH2012PLC231907' },
  { id: 3, name: 'Kaveri Foods LLP', cin: 'AAB-4412', llp: 1 },
]
// [companyId, name, DIN, designation, appointed, KYC due, KYC status]
export const DIR = [
  [1, 'Rohan Mehta', '08123456', 'Managing Director', '2015-04-02', '2026-09-30', 'done'],
  [1, 'Neha Kulkarni', '07654321', 'Director', '2018-06-11', '2026-09-30', 'due'],
  [2, 'Imran Sheikh', '06543210', 'Whole-time Director', '2012-01-19', '2026-09-30', 'overdue'],
  [2, 'Priya Nair', '09871234', 'Independent Director', '2020-08-05', '2026-09-30', 'done'],
  [3, 'Anil Deshpande', '05432109', 'Designated Partner', '2019-03-14', '2026-09-30', 'due'],
]
// [companyId, holder, shares, percent]
export const SH = [[1, 'Rohan Mehta', 60000, 60], [1, 'Neha Kulkarni', 40000, 40], [2, 'Bluefin Holdings', 720000, 72], [2, 'Imran Sheikh', 280000, 28]]
// [companyId, form, description, due date, status]
export const CAL = [
  [1, 'DPT-3', 'Return of deposits', '2026-06-30', 'done'], [1, 'MGT-7', 'Annual return', '2026-11-29', 'pending'],
  [1, 'AOC-4', 'Financial statements', '2026-10-30', 'overdue'], [2, 'AOC-4', 'Financial statements', '2026-10-30', 'done'],
  [2, 'MGT-7', 'Annual return', '2026-11-29', 'pending'], [2, 'MSME-1', 'Half-yearly return', '2026-10-31', 'overdue'],
  [3, 'Form 11', 'LLP annual return', '2026-05-30', 'done'], [3, 'Form 8', 'Statement of accounts', '2026-10-30', 'overdue'],
]
export const EVT = ['Director appointment', 'Director resignation', 'KMP appointment', 'Share capital change', 'Address change', 'Object clause change', 'Alteration of articles', 'Share transfer', 'Related-party transactions', 'Beneficial ownership (SBO)', 'Inter-corporate loans', 'Loans from directors', 'ESOP compliance', 'Company name change', 'Dividend declaration', 'CSR', 'Convert company into LLP', 'Merger and takeover', 'Dormant company', 'Strike off', 'Demat and PAS-6']
export const EVSTEPS = ['Board meeting notice', 'Board resolution', 'Filing form on MCA portal', 'Update registers', 'File copy to Document Library']
export const MEET = ['Board meeting', 'AGM', 'EGM', 'Committee meeting']

// [id, label, isNew, isExistingScreen]
export const NAV = [
  ['Overview', [['dashboard', 'Dashboard']]],
  ['Management', [['companies', 'Companies'], ['llps', 'LLPs', 1], ['directors', 'Directors', 1], ['shareholders', 'Shareholders', 1], ['kmp', 'KMP', 1], ['sharecap', 'Share capital', 1], ['charges', 'Charges', 1], ['auditors', 'Auditors', 1], ['pcs', 'PCS master', 1], ['groups', 'Groups and industries', 1], ['tasks', 'Tasks', 1]]],
  ['Compliance', [['calendar', 'Compliance calendar', 1], ['kyc', 'Director KYC', 1], ['meetings', 'Meeting scheduler', 1], ['events', 'Event-based compliance', 1], ['review', 'Review sheet', 1], ['afstatus', 'Annual filing status', 1], ['reminders', 'Reminders', 1], ['limits', 'Limits and alerts', 1], ['borrow', 'Borrowing register', 1], ['loans', 'Loans and investments', 1], ['filings', 'Filings', 0, 1], ['registers', 'Registers', 0, 1], ['documents', 'Documents', 0, 1]]],
  ['Annual filing suite', [['afs', 'Company documents', 1], ['llpdocs', 'LLP documents', 1]]],
  ['Operations', [['engage', 'Client engagement', 1], ['finance', 'Financial information', 1], ['dsc', 'DSC and file manager', 1], ['library', 'Document library', 1], ['reports', 'Reports', 1], ['activity', 'Activity log', 1]]],
  ['AI tools', [['ai', 'AI assistant', 1], ['formcheck', 'AI form checker', 1]]],
  ['Tax and finance', [['gst', 'GST', 0, 1], ['tds', 'TDS', 0, 1], ['returns', 'Tax returns', 0, 1], ['invoices', 'Invoices', 0, 1], ['imports', 'Imports', 0, 1], ['analytics', 'Analytics', 0, 1]]],
  ['System', [['team', 'Team', 0, 1], ['settings', 'Settings', 1]]],
]

// Table screens. scoped:true means first cell of each row is a company id (filtered by the header selector).
// Cells written as 'chip:status' render as a status badge.
export const TABLES = {
  companies: { t: 'Companies', s: 'Manage your client companies', add: 'Import MCA Excel', scoped: 1, first: 'Company', cols: ['CIN / LLPIN', 'Type'], rows: CO.filter(c => c.id).map(c => [c.id, c.cin, c.llp ? 'LLP' : 'Company']) },
  llps: { t: 'LLPs', s: 'Limited liability partnerships you manage', add: 'Add LLP', scoped: 1, first: 'LLP', cols: ['LLPIN', 'Designated partners', 'Next filing'], rows: [[3, 'AAB-4412', 1, 'Form 8 · 2026-10-30']] },
  directors: { t: 'Directors', s: 'Directors and partners across your companies', add: 'Import director data', scoped: 1, first: 'Company', cols: ['Director', 'DIN', 'Designation', 'Appointed'], rows: DIR.map(d => [d[0], d[1], d[2], d[3], d[4]]) },
  shareholders: { t: 'Shareholders', s: 'Shareholding by company', scoped: 1, first: 'Company', cols: ['Shareholder', 'Shares', 'Holding'], rows: SH.map(s => [s[0], s[1], s[2].toLocaleString('en-IN'), s[3] + '%']) },
  kmp: { t: 'Key managerial personnel', s: 'KMP appointments by company', add: 'Add KMP', scoped: 1, first: 'Company', cols: ['Name', 'Role'], rows: [[1, 'Rohan Mehta', 'Managing Director'], [1, 'Sunita Rao', 'Company Secretary'], [2, 'Imran Sheikh', 'Chief Financial Officer']] },
  sharecap: { t: 'Share capital', s: 'Authorised and paid-up capital', add: 'Record change', scoped: 1, first: 'Company', cols: ['Authorised', 'Paid-up', 'Face value', 'Shares'], rows: [[1, inr(2500000), inr(1000000), '₹10', '1,00,000'], [2, inr(15000000), inr(10000000), '₹10', '10,00,000']] },
  charges: { t: 'Charges', s: 'Charges registered against each company', add: 'Add charge', scoped: 1, first: 'Company', cols: ['Lender', 'Nature', 'Amount', 'Created', 'Status'], rows: [[1, 'HDFC Bank', 'Hypothecation of stock', inr(5000000), '2024-02-10', 'chip:pending'], [2, 'SBI', 'Mortgage on plant', inr(20000000), '2023-07-21', 'chip:pending'], [2, 'Axis Bank', 'Vehicle loan', inr(1800000), '2021-11-03', 'chip:done']] },
  auditors: { t: 'Auditors', s: 'Statutory auditors and their terms', add: 'Add auditor', scoped: 1, first: 'Company', cols: ['Firm', 'Term', 'Appointed at AGM'], rows: [[1, 'Shah and Co', '2024-25 to 2028-29', '2024-09-28'], [2, 'Rao Mehta LLP', '2022-23 to 2026-27', '2022-09-30']] },
  pcs: { t: 'PCS master', s: 'Practising company secretaries you work with', add: 'Add PCS', cols: ['Name', 'Membership no.', 'CP no.', 'Firm'], rows: [['Meera Joshi', 'A31204', '11876', 'Joshi and Associates'], ['Karan Bhatt', 'A45521', '17402', 'Bhatt CS']] },
  calendar: { t: 'Compliance calendar', s: 'Statutory due dates by company, with status', add: 'Add custom due date', scoped: 1, first: 'Company', cols: ['Due date', 'Form', 'Description', 'Status'], sort: 1, rows: CAL.map(r => [r[0], r[3], r[1], r[2], 'chip:' + r[4]]) },
  kyc: { t: 'Director KYC', s: 'DIR-3 KYC status for every director and partner', scoped: 1, first: 'Company', cols: ['Director', 'DIN', 'KYC due', 'Status'], rows: DIR.map(d => [d[0], d[1], d[2], d[5], 'chip:' + d[6]]) },
  afstatus: { t: 'Annual filing status', s: 'AOC-4 and MGT-7 status for each company', scoped: 1, first: 'Company', cols: ['FY', 'AOC-4', 'MGT-7'], rows: [[1, '2025-26', 'chip:overdue', 'chip:pending'], [2, '2025-26', 'chip:done', 'chip:done'], [3, '2025-26', 'chip:overdue', 'chip:pending']] },
  borrow: { t: 'Borrowing register', s: 'Party-wise borrowings', add: 'Add borrowing', scoped: 1, first: 'Company', cols: ['Lender', 'Amount', 'Rate', 'Date'], rows: [[1, 'HDFC Bank', inr(5000000), '9.5%', '2024-02-10'], [2, 'SBI', inr(20000000), '9.1%', '2023-07-21']] },
  loans: { t: 'Loans and investments', s: 'Loans given and investments made', add: 'Add entry', scoped: 1, first: 'Company', cols: ['Party', 'Type', 'Amount', 'Section'], rows: [[2, 'Bluefin Holdings', 'Loan', inr(3000000), '186'], [1, 'Kaveri Foods LLP', 'Investment', inr(1200000), '186']] },
  finance: { t: 'Financial information', s: 'Key figures by financial year', add: 'Add year', scoped: 1, first: 'Company', cols: ['FY', 'Turnover', 'Net profit', 'Net worth'], rows: [[1, '2025-26', inr(42000000), inr(3100000), inr(18000000)], [2, '2025-26', inr(165000000), inr(9800000), inr(64000000)]] },
  dsc: { t: 'DSC and file manager', s: 'Digital signature certificates', add: 'Add DSC', cols: ['Holder', 'Class', 'Expiry', 'Status'], rows: [['Rohan Mehta', 'Class 3', '2027-03-14', 'chip:done'], ['Imran Sheikh', 'Class 3', '2026-11-20', 'chip:due'], ['Neha Kulkarni', 'Class 3', '2026-10-01', 'chip:overdue']] },
}
// Document generator screens
export const GENS = {
  afs: { t: 'Annual filing suite', s: 'Documents needed for the annual cycle', items: ['Directors report', 'List of directors', 'List of shareholders', 'Board meeting (accounts)', 'AGM notice', 'Meeting minutes', 'Shorter notice', 'Attendance sheet', 'Board meeting attendance', 'Auditor appointment', 'Auditor casual vacancy', 'Secretarial audit (MR-3)'] },
  llpdocs: { t: 'LLP documents', s: 'Forms and agreements for LLPs', items: ['LLP Form 11', 'LLP Form 8', 'LLP agreement', 'Change in address of LLP', 'Partners meeting resolutions', 'Register of partners', 'Bank search report'] },
  reports: { t: 'Reports', s: 'Download portfolio reports', items: ['Compliance status', 'Director KYC summary', 'Overdue filings', 'Charges register', 'Shareholding pattern'] },
}
