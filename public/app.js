/* Ameresco Outreach — front-end logic.
   All CSV parsing happens in the browser; contact data never leaves this page
   except the single selected company/contact sent for email generation.
   Settings (value proposition, sender details, passcode) live in this
   browser's localStorage — nothing is stored on the server. */

const $ = (id) => document.getElementById(id);

const ERROR_MARKER = "\u0000ERROR:";

const state = {
  headers: [],
  rows: [],
  mapping: {},
  companies: [], // { name, domain, contacts: [{name, title, email}] }
  selectedCompany: null,
  selectedContact: null,
  researchCache: {}, // company name -> research text
  passcodeRequired: false,
  defaultValueProp: "",
  bulkMode: false,
  bulkSelected: new Set(), // lowercased emails selected for bulk generation
};

const FIELDS = [
  { key: "email", label: "Email (required)", partial: ["email", "e-mail"], exact: ["mail"] },
  { key: "fullName", label: "Full name (optional — else First + Last)", partial: ["full name", "fullname", "contact name"], exact: ["name"] },
  { key: "firstName", label: "First name", partial: ["first name", "firstname"], exact: ["first", "forename"] },
  { key: "lastName", label: "Last name", partial: ["last name", "lastname", "surname"], exact: ["last"] },
  { key: "jobTitle", label: "Job title / role", partial: ["job title", "jobtitle", "position"], exact: ["title", "role", "job"] },
  { key: "company", label: "Company", partial: ["company", "organisation", "organization", "employer"], exact: ["account", "business"] },
  { key: "website", label: "Website / domain", partial: ["website", "domain"], exact: ["url", "web", "site"] },
  { key: "linkedin", label: "LinkedIn URL (optional)", partial: ["linkedin", "linked in"], exact: ["profile"] },
];

// Normalise a LinkedIn value to a safe https URL, or "" if it isn't one.
function normalizeLinkedIn(value) {
  const v = String(value || "").trim().replace(/^@/, "");
  if (!v || !/linkedin\.com/i.test(v)) return "";
  const withProto = /^https?:\/\//i.test(v) ? v : "https://" + v;
  try {
    const url = new URL(withProto);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    if (!/(^|\.)linkedin\.com$/i.test(url.hostname)) return "";
    url.protocol = "https:";
    return url.toString();
  } catch {
    return "";
  }
}

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "hotmail.com", "hotmail.co.uk", "outlook.com",
  "yahoo.com", "yahoo.co.uk", "icloud.com", "aol.com", "live.com", "live.co.uk",
  "btinternet.com", "sky.com", "protonmail.com", "me.com", "msn.com",
]);

// ---------------------------------------------------------------------------
// Local settings
// ---------------------------------------------------------------------------

function getSender() {
  try {
    return JSON.parse(localStorage.getItem("senderSettings") || "{}");
  } catch {
    return {};
  }
}

async function getValueProp() {
  const saved = localStorage.getItem("valueProp");
  if (saved !== null && saved.trim()) return saved;
  if (!state.defaultValueProp) {
    try {
      const res = await fetch("/value-prop-default.md");
      if (res.ok) state.defaultValueProp = await res.text();
    } catch {
      /* offline */
    }
  }
  return state.defaultValueProp;
}

function getPasscode() {
  return localStorage.getItem("passcode") || "";
}

function getSignatureText() {
  return localStorage.getItem("signatureText") || "";
}

function getSignatureImage() {
  return localStorage.getItem("signatureImage") || ""; // data: URI or ""
}

// Resolve the greeting selector to a concrete phrase for the model.
function resolveGreeting() {
  const choice = $("greetingSelect") ? $("greetingSelect").value : "timeofday";
  if (choice !== "timeofday") return choice; // "Hi" | "Hello" | "Dear"
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// Persisted uploaded contacts (so you don't re-upload/re-map each visit).
function saveContactData() {
  try {
    localStorage.setItem(
      "contactData",
      JSON.stringify({
        companies: state.companies,
        fileName: state.fileName || "",
        savedAt: new Date().toISOString(),
        count: state.companies.reduce((n, c) => n + c.contacts.length, 0),
      })
    );
  } catch {
    /* localStorage full or unavailable — non-fatal */
  }
}

function loadContactData() {
  try {
    const raw = localStorage.getItem("contactData");
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!Array.isArray(data.companies) || data.companies.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

function clearContactData() {
  localStorage.removeItem("contactData");
}

// Per-recipient "emailed" log: { emailLowercased: ISO timestamp }.
function getSentLog() {
  try {
    return JSON.parse(localStorage.getItem("sentLog") || "{}");
  } catch {
    return {};
  }
}

function recordSent(email) {
  const log = getSentLog();
  log[email.toLowerCase()] = new Date().toISOString();
  localStorage.setItem("sentLog", JSON.stringify(log));
}

function sentDateFor(email) {
  return getSentLog()[email.toLowerCase()] || null;
}

function formatSentDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

// --- Outreach status (per contact) --------------------------------------
const STATUS_LABELS = {
  emailed: "awaiting reply",
  replied: "replied",
  meeting: "meeting",
  not_interested: "not interested",
};
const FOLLOWUP_DUE_DAYS = 5; // business days after which a chase is "due"

function getStatusStore() {
  try {
    return JSON.parse(localStorage.getItem("statusStore") || "{}");
  } catch {
    return {};
  }
}

function getStatus(email) {
  return getStatusStore()[email.toLowerCase()]?.status || "";
}

function setStatus(email, status) {
  const s = getStatusStore();
  const key = email.toLowerCase();
  if (status) s[key] = { status, at: new Date().toISOString() };
  else delete s[key];
  localStorage.setItem("statusStore", JSON.stringify(s));
}

function businessDaysSince(iso) {
  const cur = new Date(iso);
  cur.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  let days = 0;
  while (cur < end) {
    cur.setDate(cur.getDate() + 1);
    const dow = cur.getDay();
    if (dow !== 0 && dow !== 6) days++;
  }
  return days;
}

function isDue(email) {
  if (getStatus(email) !== "emailed") return false;
  const iso = sentDateFor(email);
  if (!iso) return false;
  return businessDaysSince(iso) >= FOLLOWUP_DUE_DAYS;
}

// --- Per-contact saved draft (latest generated/edited email) ------------
function getDraft(email) {
  try {
    return JSON.parse(localStorage.getItem("draftStore") || "{}")[email.toLowerCase()] || null;
  } catch {
    return null;
  }
}

function setDraft(email, subject, body) {
  let s = {};
  try {
    s = JSON.parse(localStorage.getItem("draftStore") || "{}");
  } catch {
    /* reset on corruption */
  }
  const key = email.toLowerCase();
  if ((subject && subject.trim()) || (body && body.trim())) {
    s[key] = { subject: subject || "", body: body || "", at: new Date().toISOString() };
  } else {
    delete s[key];
  }
  try {
    localStorage.setItem("draftStore", JSON.stringify(s));
  } catch {
    /* quota */
  }
}

// ---------------------------------------------------------------------------
// Toast + fetch helpers
// ---------------------------------------------------------------------------

let toastTimer;
function toast(message, isError = false) {
  const el = $("toast");
  el.textContent = message;
  el.classList.toggle("error", isError);
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), isError ? 8000 : 3000);
}

function apiHeaders() {
  const headers = { "Content-Type": "application/json" };
  const passcode = getPasscode();
  if (passcode) headers["x-passcode"] = passcode;
  return headers;
}

async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: apiHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

/**
 * POST to a streaming endpoint. Calls onText(accumulated) as chunks arrive
 * and resolves with { text, response }. Prompts for the site passcode on 401
 * and retries once.
 */
async function streamRequest(url, body, onText, isRetry = false) {
  const res = await fetch(url, {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify(body),
  });

  if (res.status === 401 && !isRetry) {
    const entered = window.prompt(
      "This site is protected. Enter the access passcode:"
    );
    if (!entered) throw new Error("Passcode required.");
    localStorage.setItem("passcode", entered.trim());
    return streamRequest(url, body, onText, true);
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    const errIdx = text.indexOf(ERROR_MARKER);
    if (errIdx !== -1) {
      // Drain the rest so the full error message arrives, then fail.
      for (;;) {
        const rest = await reader.read();
        if (rest.done) break;
        text += decoder.decode(rest.value, { stream: true });
      }
      throw new Error(text.slice(errIdx + ERROR_MARKER.length).trim());
    }
    if (onText) onText(text.trimStart());
  }
  return { text: text.trimStart(), response: res };
}

function setBusy(button, busy, busyText) {
  button.disabled = busy;
  if (busy) {
    button.dataset.label = button.textContent;
    button.textContent = busyText;
    button.classList.add("spin");
  } else {
    button.textContent = button.dataset.label || button.textContent;
    button.classList.remove("spin");
  }
}

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------

async function init() {
  try {
    const status = await api("GET", "/api/status");
    $("keyStatus").hidden = status.hasApiKey;
    state.passcodeRequired = status.passcodeRequired;
  } catch {
    /* status is cosmetic */
  }
  restoreSavedContacts();
}

function restoreSavedContacts() {
  const data = loadContactData();
  if (!data) return;
  state.companies = data.companies;
  state.fileName = data.fileName || "";
  const when = data.savedAt ? new Date(data.savedAt).toLocaleDateString() : "";
  $("uploadSummary").textContent =
    `${data.count} saved contacts` +
    (data.fileName ? ` from ${data.fileName}` : "") +
    (when ? ` (loaded ${when})` : "");
  $("clearDataBtn").hidden = false;
  renderCompanyList();
  renderDueBar();
  $("pickCard").hidden = false;
}

init();

$("clearDataBtn").addEventListener("click", () => {
  if (!window.confirm("Remove the saved contacts from this browser?")) return;
  clearContactData();
  state.companies = [];
  state.selectedCompany = null;
  state.selectedContact = null;
  $("companyList").innerHTML = "";
  $("contactList").innerHTML = "";
  $("uploadSummary").textContent = "";
  $("clearDataBtn").hidden = true;
  $("pickCard").hidden = true;
  $("workCard").hidden = true;
  toast("Saved contacts cleared.");
});

// ---------------------------------------------------------------------------
// Step 1 — CSV upload & column mapping
// ---------------------------------------------------------------------------

$("csvFile").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  state.fileName = file.name;
  Papa.parse(file, {
    header: true,
    skipEmptyLines: "greedy",
    complete: (result) => {
      state.headers = (result.meta.fields || []).filter(Boolean);
      state.rows = result.data;
      if (state.headers.length === 0 || state.rows.length === 0) {
        toast("Couldn't read any rows from that file — is it a CSV with a header row?", true);
        return;
      }
      $("uploadSummary").textContent =
        `${state.rows.length} rows, ${state.headers.length} columns`;
      renderMapping();
    },
    error: (err) => toast(`CSV parse error: ${err.message}`, true),
  });
});

function guessColumn(field) {
  const lowered = state.headers.map((h) => h.toLowerCase().trim());
  // Exact matches first (both hint lists), then substring matches on the
  // partial list only — generic words like "name" never substring-match,
  // so "Full name" can't grab a "First Name" column.
  for (const hint of [...field.partial, ...field.exact]) {
    const exact = lowered.findIndex((h) => h === hint);
    if (exact !== -1) return state.headers[exact];
  }
  for (const hint of field.partial) {
    const partial = lowered.findIndex((h) => h.includes(hint));
    if (partial !== -1) return state.headers[partial];
  }
  return "";
}

function renderMapping() {
  const grid = $("mappingGrid");
  grid.innerHTML = "";
  for (const field of FIELDS) {
    const guess = guessColumn(field);
    const label = document.createElement("label");
    label.textContent = field.label;
    const select = document.createElement("select");
    select.dataset.field = field.key;
    select.appendChild(new Option("— not in this file —", ""));
    for (const header of state.headers) {
      select.appendChild(new Option(header, header, false, header === guess));
    }
    label.appendChild(select);
    grid.appendChild(label);
  }
  $("mappingPanel").hidden = false;
}

$("applyMapping").addEventListener("click", () => {
  const mapping = {};
  document
    .querySelectorAll("#mappingGrid select")
    .forEach((sel) => (mapping[sel.dataset.field] = sel.value));
  if (!mapping.email) {
    toast("Please map the Email column — it's required.", true);
    return;
  }
  state.mapping = mapping;
  buildCompanies();
  saveContactData();
  $("clearDataBtn").hidden = false;
  renderCompanyList();
  renderDueBar();
  $("pickCard").hidden = false;
  $("pickCard").scrollIntoView({ behavior: "smooth" });
});

function buildCompanies() {
  const m = state.mapping;
  const byKey = new Map();

  for (const row of state.rows) {
    const email = String(row[m.email] || "").trim();
    if (!email.includes("@")) continue;

    const emailDomain = email.split("@")[1].toLowerCase();
    let companyName = m.company ? String(row[m.company] || "").trim() : "";
    if (!companyName) {
      companyName = FREE_EMAIL_DOMAINS.has(emailDomain)
        ? "(no company given)"
        : emailDomain.split(".")[0].replace(/^\w/, (c) => c.toUpperCase());
    }

    // Prefer a mapped full-name column; otherwise stitch first + last together.
    let name = m.fullName ? String(row[m.fullName] || "").trim() : "";
    if (!name) {
      name = [m.firstName && row[m.firstName], m.lastName && row[m.lastName]]
        .filter(Boolean)
        .map((v) => String(v).trim())
        .filter(Boolean)
        .join(" ");
    }
    name = tidyName(name);

    const website = m.website ? String(row[m.website] || "").trim() : "";
    const key = companyName.toLowerCase();
    if (!byKey.has(key)) {
      byKey.set(key, { name: companyName, contacts: [], websites: [], emailDomains: [] });
    }
    const company = byKey.get(key);
    company.contacts.push({
      name: name || email,
      title: m.jobTitle ? String(row[m.jobTitle] || "").trim() : "",
      email,
      linkedin: m.linkedin ? normalizeLinkedIn(row[m.linkedin]) : "",
    });
    if (website) company.websites.push(website);
    if (!FREE_EMAIL_DOMAINS.has(emailDomain)) company.emailDomains.push(emailDomain);
  }

  state.companies = [...byKey.values()]
    .map((c) => {
      const domain = mostCommon(c.websites) || mostCommon(c.emailDomains) || "";
      return { name: c.name, domain: cleanDomain(domain), contacts: c.contacts };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function mostCommon(values) {
  if (values.length === 0) return "";
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function tidyName(name) {
  const trimmed = name.replace(/\s+/g, " ").trim();
  // Title-case names that arrive fully upper- or lower-case (e.g. "JOHN SMITH").
  if (trimmed && (trimmed === trimmed.toUpperCase() || trimmed === trimmed.toLowerCase())) {
    return trimmed
      .toLowerCase()
      .replace(/\b([a-z])/g, (c) => c.toUpperCase())
      .replace(/\b(Mc)([a-z])/g, (_, p, l) => p + l.toUpperCase());
  }
  return trimmed;
}

function cleanDomain(value) {
  if (!value) return "";
  return value
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split(/[/?#]/)[0]
    .trim();
}

// ---------------------------------------------------------------------------
// Step 2 — company & contact selection
// ---------------------------------------------------------------------------

$("companySearch").addEventListener("input", renderCompanyList);

function renderCompanyList() {
  const query = $("companySearch").value.toLowerCase();
  const list = $("companyList");
  list.innerHTML = "";
  for (const company of state.companies) {
    if (query && !company.name.toLowerCase().includes(query)) continue;
    const li = document.createElement("li");
    li.innerHTML = `<span></span><span class="count"></span>`;
    li.firstChild.textContent = company.name;
    li.lastChild.textContent =
      company.contacts.length === 1 ? "1 person" : `${company.contacts.length} people`;
    if (state.selectedCompany === company) li.classList.add("selected");
    li.addEventListener("click", () => selectCompany(company));
    list.appendChild(li);
  }
}

function selectCompany(company) {
  state.selectedCompany = company;
  state.selectedContact = null;
  renderCompanyList();
  renderContactList();
  $("workCard").hidden = true;
}

function renderContactList() {
  const company = state.selectedCompany;
  $("contactHint").hidden = Boolean(company);
  $("bulkColHead").hidden = !(state.bulkMode && company);
  const list = $("contactList");
  list.innerHTML = "";
  if (!company) return;
  for (const contact of company.contacts) {
    const li = document.createElement("li");

    if (state.bulkMode) {
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "bulk-check";
      cb.checked = state.bulkSelected.has(contact.email.toLowerCase());
      cb.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleBulk(contact.email, cb.checked);
      });
      li.appendChild(cb);
    }

    const wrap = document.createElement("div");
    const nameEl = document.createElement("span");
    nameEl.textContent = contact.name;
    const roleEl = document.createElement("span");
    roleEl.className = "contact-role";
    roleEl.textContent = [contact.title, contact.email].filter(Boolean).join(" · ");
    wrap.appendChild(nameEl);
    wrap.appendChild(roleEl);
    li.appendChild(wrap);

    li.appendChild(contactBadge(contact.email));

    if (state.selectedContact === contact) li.classList.add("selected");
    li.addEventListener("click", () => selectContact(contact));
    list.appendChild(li);
  }
}

// Build the status/follow-up badge for a contact row (or null-ish empty span).
function contactBadge(email) {
  const status = getStatus(email);
  const sentIso = sentDateFor(email);

  if (isDue(email)) {
    const b = document.createElement("span");
    b.className = "due-badge";
    b.textContent = `⏰ follow-up due`;
    b.title = `Emailed ${sentIso ? new Date(sentIso).toLocaleDateString() : ""}, no reply logged`;
    return b;
  }
  if (status) {
    const b = document.createElement("span");
    b.className = `status-badge ${status}`;
    const label = STATUS_LABELS[status] || status;
    b.textContent =
      status === "emailed" && sentIso ? `✓ emailed ${formatSentDate(sentIso)}` : label;
    return b;
  }
  if (sentIso) {
    const b = document.createElement("span");
    b.className = "status-badge emailed";
    b.textContent = `✓ emailed ${formatSentDate(sentIso)}`;
    return b;
  }
  const empty = document.createElement("span");
  return empty;
}

function toggleBulk(email, on) {
  const key = email.toLowerCase();
  if (on) state.bulkSelected.add(key);
  else state.bulkSelected.delete(key);
  updateBulkBar();
}

function selectContact(contact) {
  state.selectedContact = contact;
  renderContactList();

  const company = state.selectedCompany;
  const banner = $("targetBanner");
  banner.textContent = "";
  const strong = document.createElement("strong");
  strong.textContent = contact.name;
  banner.appendChild(strong);
  banner.appendChild(
    document.createTextNode(
      `${contact.title ? " — " + contact.title : ""} at ${company.name}` +
        (company.domain ? ` (${company.domain})` : "")
    )
  );
  if (contact.linkedin) {
    banner.appendChild(document.createTextNode("  "));
    const li = document.createElement("a");
    li.href = contact.linkedin;
    li.target = "_blank";
    li.rel = "noopener noreferrer";
    li.className = "li-link";
    li.textContent = "Check on LinkedIn ↗";
    li.title = "Open their LinkedIn profile to confirm they're still in this role";
    banner.appendChild(li);
  }

  // Prefer in-session cache, then persisted research (avoids re-paying the API
  // to research a company you've already looked at, even across visits).
  let research = state.researchCache[company.name];
  let researchNote = "";
  if (!research) {
    const stored = getStoredResearch(company.name);
    if (stored) {
      research = stored.text;
      state.researchCache[company.name] = stored.text;
      researchNote = `Saved research loaded (${new Date(stored.at).toLocaleDateString()}) — no new API cost. Click "Research company" to refresh.`;
    }
  }
  $("researchBox").value = research || "";
  $("researchNote").textContent = researchNote;
  // Restore a previously generated/edited draft for this person, if any.
  const draft = getDraft(contact.email);
  $("subjectBox").value = draft?.subject || "";
  $("bodyBox").value = draft?.body || "";
  $("rationaleBox").hidden = true;
  $("lengthWarning").hidden = true;
  $("variationsPanel").hidden = true;
  $("tweakRow").hidden = !draft;
  $("statusSelect").value = getStatus(contact.email);
  $("linkedinBtn").hidden = !contact.linkedin;
  $("linkedinNote").textContent = contact.linkedin
    ? "LinkedIn can't pre-fill a message — use Open LinkedIn, then paste with Copy message body."
    : "";
  $("signatureNote").textContent = getSignatureImage()
    ? "Your signature image is included via Copy formatted (paste into Outlook), not the mailto draft."
    : "";
  refreshFollowupAvailability();
  updateLengthWarning();
  $("workCard").hidden = false;
  $("workCard").scrollIntoView({ behavior: "smooth" });
}

$("statusSelect").addEventListener("change", () => {
  if (!state.selectedContact) return;
  setStatus(state.selectedContact.email, $("statusSelect").value);
  renderContactList();
  renderDueBar();
});

// --- Follow-ups-due summary bar -----------------------------------------
function renderDueBar() {
  const bar = $("dueBar");
  const due = [];
  for (const co of state.companies) {
    for (const c of co.contacts) {
      if (isDue(c.email)) due.push({ company: co, contact: c, iso: sentDateFor(c.email) });
    }
  }
  if (due.length === 0) {
    bar.hidden = true;
    bar.innerHTML = "";
    return;
  }
  due.sort((a, b) => new Date(a.iso) - new Date(b.iso)); // oldest first
  bar.hidden = false;
  bar.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "due-wrap";
  const head = document.createElement("span");
  head.className = "due-head";
  head.textContent = `⏰ ${due.length} follow-up${due.length > 1 ? "s" : ""} due (no reply after ${FOLLOWUP_DUE_DAYS} working days)`;
  const toggle = document.createElement("button");
  toggle.className = "btn btn-ghost btn-small";
  toggle.textContent = "Show";
  wrap.appendChild(head);
  wrap.appendChild(toggle);
  bar.appendChild(wrap);

  const listEl = document.createElement("ul");
  listEl.className = "due-list";
  listEl.hidden = true;
  for (const d of due) {
    const li = document.createElement("li");
    li.textContent = `${d.contact.name}${d.contact.title ? " — " + d.contact.title : ""} at ${d.company.name} · emailed ${formatSentDate(d.iso)}`;
    li.addEventListener("click", () => {
      if (state.bulkMode) toggleBulkMode();
      selectCompany(d.company);
      selectContact(d.contact);
    });
    listEl.appendChild(li);
  }
  bar.appendChild(listEl);
  toggle.addEventListener("click", () => {
    listEl.hidden = !listEl.hidden;
    toggle.textContent = listEl.hidden ? "Show" : "Hide";
  });
}

// ---------------------------------------------------------------------------
// Per-recipient email history (used for follow-ups)
// ---------------------------------------------------------------------------

function getEmailHistory(email) {
  try {
    const all = JSON.parse(localStorage.getItem("emailHistory") || "{}");
    return all[email.toLowerCase()] || [];
  } catch {
    return [];
  }
}

function addEmailHistory(email, subject, body) {
  let all = {};
  try {
    all = JSON.parse(localStorage.getItem("emailHistory") || "{}");
  } catch {
    /* reset on corruption */
  }
  const key = email.toLowerCase();
  all[key] = (all[key] || []).concat({
    subject,
    body,
    at: new Date().toISOString(),
  });
  localStorage.setItem("emailHistory", JSON.stringify(all));
}

function refreshFollowupAvailability() {
  const contact = state.selectedContact;
  const history = contact ? getEmailHistory(contact.email) : [];
  const btn = $("followupBtn");
  btn.hidden = history.length === 0;
  $("followupNote").textContent =
    history.length > 0
      ? `${history.length} email${history.length > 1 ? "s" : ""} already sent to this person — a follow-up will take a fresh angle.`
      : "";
}

// ---------------------------------------------------------------------------
// Step 3 — research & generate
// ---------------------------------------------------------------------------

// Persisted research per company (so you never re-pay to research one twice).
function getStoredResearch(companyName) {
  try {
    const all = JSON.parse(localStorage.getItem("researchStore") || "{}");
    return all[companyName.toLowerCase()] || null;
  } catch {
    return null;
  }
}

function setStoredResearch(companyName, text) {
  let all = {};
  try {
    all = JSON.parse(localStorage.getItem("researchStore") || "{}");
  } catch {
    /* reset on corruption */
  }
  if (text && text.trim()) {
    all[companyName.toLowerCase()] = { text, at: new Date().toISOString() };
  } else {
    delete all[companyName.toLowerCase()];
  }
  try {
    localStorage.setItem("researchStore", JSON.stringify(all));
  } catch {
    /* quota — non-fatal */
  }
}

$("researchBtn").addEventListener("click", async () => {
  const company = state.selectedCompany;
  if (!company) return;
  setBusy($("researchBtn"), true, "Researching…");
  $("researchBox").value = "";
  $("researchNote").textContent = "";
  try {
    const { text, response } = await streamRequest(
      "/api/research",
      {
        companyName: company.name,
        domain: company.domain,
        webSearch: $("webSearchToggle").checked,
      },
      (partial) => {
        $("researchBox").value = partial;
      }
    );
    $("researchBox").value = text;
    state.researchCache[company.name] = text;
    setStoredResearch(company.name, text);
    const note = response.headers.get("X-Fetch-Note");
    $("researchNote").textContent = note ? decodeURIComponent(note) : "";
  } catch (err) {
    toast(err.message, true);
  } finally {
    setBusy($("researchBtn"), false);
  }
});

$("researchBox").addEventListener("input", () => {
  if (state.selectedCompany) {
    const text = $("researchBox").value;
    state.researchCache[state.selectedCompany.name] = text;
    setStoredResearch(state.selectedCompany.name, text);
  }
});

// Build the shared request payload for any generation task.
async function generatePayload(task, extra = {}) {
  const company = state.selectedCompany;
  const contact = state.selectedContact;
  return {
    task,
    company: {
      name: company.name,
      research: $("researchBox").value.trim(),
      extraContext: $("extraContext").value.trim(),
    },
    contact,
    options: {
      tone: $("toneSelect").value,
      length: $("lengthSelect").value,
      callToAction: $("ctaSelect").value,
      greeting: resolveGreeting(),
    },
    sender: getSender(),
    valueProp: await getValueProp(),
    ...extra,
  };
}

function showEmail(email) {
  $("subjectBox").value = email.subject || "";
  $("bodyBox").value = email.body || "";
  const rationale = $("rationaleBox");
  if (email.rationale) {
    rationale.textContent = `Why this angle: ${email.rationale}`;
    rationale.hidden = false;
  } else {
    rationale.hidden = true;
  }
  $("tweakRow").hidden = false;
  updateLengthWarning();
  if (state.selectedContact) {
    setDraft(state.selectedContact.email, email.subject || "", email.body || "");
  }
}

async function runGenerate(button, busyText, task, extra) {
  const company = state.selectedCompany;
  const contact = state.selectedContact;
  if (!company || !contact) return;
  setBusy(button, true, busyText);
  try {
    const payload = await generatePayload(task, extra);
    const { text } = await streamRequest("/api/generate", payload);
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("The model returned an unexpected response — please try again.");
    }
    if (task === "variations") {
      renderVariations(parsed.variants || []);
    } else {
      $("variationsPanel").hidden = true;
      showEmail(parsed);
    }
  } catch (err) {
    toast(err.message, true);
  } finally {
    setBusy(button, false);
  }
}

$("generateBtn").addEventListener("click", () =>
  runGenerate($("generateBtn"), "Writing…", "first")
);

$("variationsBtn").addEventListener("click", () =>
  runGenerate($("variationsBtn"), "Writing 3…", "variations")
);

$("followupBtn").addEventListener("click", () => {
  const history = getEmailHistory(state.selectedContact.email);
  runGenerate($("followupBtn"), "Writing…", "followup", { history });
});

function renderVariations(variants) {
  const list = $("variationsList");
  list.innerHTML = "";
  if (variants.length === 0) {
    $("variationsPanel").hidden = true;
    return;
  }
  variants.forEach((v, i) => {
    const card = document.createElement("div");
    card.className = "variation";
    const subj = document.createElement("div");
    subj.className = "v-subject";
    subj.textContent = `${i + 1}. ${v.subject || ""}`;
    const body = document.createElement("div");
    body.className = "v-body";
    body.textContent = v.body || "";
    card.appendChild(subj);
    card.appendChild(body);
    if (v.rationale) {
      const why = document.createElement("div");
      why.className = "v-why";
      why.textContent = v.rationale;
      card.appendChild(why);
    }
    card.addEventListener("click", () => {
      showEmail(v);
      $("bodyBox").scrollIntoView({ behavior: "smooth", block: "center" });
    });
    list.appendChild(card);
  });
  $("variationsPanel").hidden = false;
}

// Quick-tweak buttons: refine the current draft.
document.querySelectorAll(".btn-tweak").forEach((btn) => {
  btn.addEventListener("click", () => {
    const draft = { subject: $("subjectBox").value, body: $("bodyBox").value };
    if (!draft.body.trim()) {
      toast("Generate or write an email first.", true);
      return;
    }
    runGenerate(btn, "…", "refine", {
      draft,
      instruction: btn.dataset.instruction,
    });
  });
});

// ---------------------------------------------------------------------------
// Outlook handoff
// ---------------------------------------------------------------------------

const MAILTO_SAFE_LENGTH = 1800;

function updateLengthWarning() {
  const total =
    encodeURIComponent($("subjectBox").value).length +
    encodeURIComponent($("bodyBox").value).length;
  const warning = $("lengthWarning");
  if (total > MAILTO_SAFE_LENGTH) {
    warning.textContent =
      "This email is long enough that some systems truncate it when opening Outlook. If the draft appears cut off, use 'Copy email' and paste instead.";
    warning.hidden = false;
  } else {
    warning.hidden = true;
  }
}

function saveCurrentDraft() {
  if (state.selectedContact) {
    setDraft(state.selectedContact.email, $("subjectBox").value, $("bodyBox").value);
  }
}
$("bodyBox").addEventListener("input", () => { updateLengthWarning(); saveCurrentDraft(); });
$("subjectBox").addEventListener("input", () => { updateLengthWarning(); saveCurrentDraft(); });

// Record an outreach (any channel): flag the contact, save the email so
// follow-ups can reference it, set status to "emailed" (unless the user has
// already logged a later outcome), and refresh the UI.
function markContacted(contact, subject, body) {
  recordSent(contact.email);
  addEmailHistory(contact.email, subject, body);
  const cur = getStatus(contact.email);
  if (cur === "" || cur === "emailed") {
    setStatus(contact.email, "emailed");
    if (state.selectedContact === contact) $("statusSelect").value = "emailed";
  }
  renderContactList();
  refreshFollowupAvailability();
  renderDueBar();
}

function withTextSignature(body) {
  const sig = getSignatureText().trim();
  return sig ? `${body}\n\n${sig}` : body;
}

function openInOutlook(contact, subject, body) {
  const href =
    `mailto:${encodeURIComponent(contact.email)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(withTextSignature(body))}`;
  markContacted(contact, subject, body);
  window.location.href = href;
}

$("outlookBtn").addEventListener("click", () => {
  const contact = state.selectedContact;
  if (!contact) return;
  const subject = $("subjectBox").value.trim();
  const body = $("bodyBox").value;
  if (!body.trim()) {
    toast("Generate or write an email first.", true);
    return;
  }
  openInOutlook(contact, subject, body);
});

$("linkedinBtn").addEventListener("click", () => {
  const contact = state.selectedContact;
  if (!contact?.linkedin) return;
  const body = $("bodyBox").value;
  // Copy the body so it's ready to paste into the LinkedIn message box.
  if (body.trim() && navigator.clipboard) {
    navigator.clipboard.writeText(body).then(
      () => toast("Message body copied — paste it into LinkedIn."),
      () => {}
    );
    markContacted(contact, $("subjectBox").value.trim(), body);
  }
  window.open(contact.linkedin, "_blank", "noopener,noreferrer");
});

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Build an HTML version of the email + signature (image included) for pasting.
function buildEmailHtml(body) {
  const bodyHtml = escapeHtml(body).replace(/\n/g, "<br>");
  const sigText = getSignatureText().trim();
  const sigImg = getSignatureImage();
  let sig = "";
  if (sigText) sig += `<div>${escapeHtml(sigText).replace(/\n/g, "<br>")}</div>`;
  if (sigImg) sig += `<div style="margin-top:8px"><img src="${sigImg}" alt="signature" style="max-width:400px"></div>`;
  const sigBlock = sig ? `<br>${sig}` : "";
  return `<div style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#1d2530">${bodyHtml}${sigBlock}</div>`;
}

async function copyFormatted(body) {
  const html = buildEmailHtml(body);
  const plain = withTextSignature(body);
  try {
    if (window.ClipboardItem && navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
      toast(
        getSignatureImage()
          ? "Formatted email copied — paste into Outlook (image included)."
          : "Formatted email copied — paste into Outlook."
      );
    } else {
      await navigator.clipboard.writeText(plain);
      toast("Email copied (plain text — this browser can't copy formatting).");
    }
  } catch {
    await navigator.clipboard.writeText(plain);
    toast("Email copied (plain text fallback).");
  }
}

$("copyBtn").addEventListener("click", () => {
  const body = $("bodyBox").value;
  if (!body.trim()) {
    toast("Nothing to copy yet.", true);
    return;
  }
  copyFormatted(body);
});

$("copyBodyBtn").addEventListener("click", async () => {
  const body = $("bodyBox").value;
  if (!body.trim()) {
    toast("Nothing to copy yet.", true);
    return;
  }
  await navigator.clipboard.writeText(body);
  toast("Message body copied (no subject) — ready for LinkedIn.");
});

// ---------------------------------------------------------------------------
// Bulk mode: select several people, generate drafts, review each
// ---------------------------------------------------------------------------

function toggleBulkMode() {
  state.bulkMode = !state.bulkMode;
  const btn = $("bulkToggle");
  btn.textContent = state.bulkMode ? "Exit bulk mode" : "Bulk mode";
  btn.classList.toggle("btn-primary", state.bulkMode);
  btn.classList.toggle("btn-ghost", !state.bulkMode);
  $("bulkHint").hidden = !state.bulkMode;
  $("bulkBar").hidden = !state.bulkMode;
  if (!state.bulkMode) state.bulkSelected.clear();
  renderContactList();
  updateBulkBar();
}

function updateBulkBar() {
  const n = state.bulkSelected.size;
  $("bulkCount").textContent = `${n} selected`;
  $("bulkGenerateBtn").disabled = n === 0;
  $("bulkColHead").hidden = !(state.bulkMode && state.selectedCompany);
}

$("bulkToggle").addEventListener("click", toggleBulkMode);

$("bulkClearBtn").addEventListener("click", () => {
  state.bulkSelected.clear();
  renderContactList();
  updateBulkBar();
});

$("selectAllCompany").addEventListener("click", () => {
  const co = state.selectedCompany;
  if (!co) return;
  for (const c of co.contacts) state.bulkSelected.add(c.email.toLowerCase());
  renderContactList();
  updateBulkBar();
});

// Resolve selected emails to {company, contact} pairs across all companies.
function resolveBulkSelection() {
  const out = [];
  for (const co of state.companies) {
    for (const c of co.contacts) {
      if (state.bulkSelected.has(c.email.toLowerCase())) out.push({ company: co, contact: c });
    }
  }
  return out;
}

$("bulkGenerateBtn").addEventListener("click", bulkGenerate);
$("reviewClose").addEventListener("click", () => $("reviewModal").close());

async function bulkGenerate() {
  const selected = resolveBulkSelection();
  if (selected.length === 0) return;
  const valueProp = await getValueProp();
  if (!valueProp.trim()) {
    toast("Add the Ameresco value proposition in Settings first.", true);
    return;
  }

  const options = {
    tone: $("toneSelect").value,
    length: $("lengthSelect").value,
    callToAction: $("ctaSelect").value,
    greeting: resolveGreeting(),
  };
  const sender = getSender();

  $("reviewList").innerHTML = "";
  $("reviewProgress").textContent = `Generating ${selected.length} draft${selected.length > 1 ? "s" : ""}… you can review each as it lands.`;
  $("reviewModal").showModal();
  setBusy($("bulkGenerateBtn"), true, "Working…");

  let done = 0;
  for (const { company, contact } of selected) {
    const research =
      getStoredResearch(company.name)?.text ||
      state.researchCache[company.name] ||
      "";
    try {
      const { text } = await streamRequest("/api/generate", {
        task: "first",
        company: { name: company.name, research, extraContext: "" },
        contact,
        options,
        sender,
        valueProp,
      });
      const email = JSON.parse(text);
      setDraft(contact.email, email.subject, email.body);
      addReviewItem(company, contact, email, null);
    } catch (err) {
      addReviewItem(company, contact, null, err.message);
    }
    done++;
    $("reviewProgress").textContent = `Generated ${done} of ${selected.length}.`;
  }
  $("reviewProgress").textContent = `Done — ${done} draft${done > 1 ? "s" : ""}. Review, edit and send each below. Drafts are saved against each person.`;
  setBusy($("bulkGenerateBtn"), false);
  renderContactList();
}

function addReviewItem(company, contact, email, errorMsg) {
  const item = document.createElement("div");
  item.className = "review-item" + (errorMsg ? " errored" : "");

  const who = document.createElement("div");
  who.className = "r-who";
  who.textContent = `${contact.name}${contact.title ? " — " + contact.title : ""} · ${company.name}`;
  item.appendChild(who);

  if (errorMsg) {
    const err = document.createElement("div");
    err.className = "muted small";
    err.textContent = `Couldn't generate: ${errorMsg}`;
    item.appendChild(err);
    $("reviewList").appendChild(item);
    return;
  }

  const subj = document.createElement("div");
  subj.className = "r-subject";
  subj.innerHTML = `<strong>Subject:</strong> `;
  subj.appendChild(document.createTextNode(email.subject || ""));
  item.appendChild(subj);

  const bodyEl = document.createElement("div");
  bodyEl.className = "r-body";
  bodyEl.textContent = email.body || "";
  item.appendChild(bodyEl);

  const actions = document.createElement("div");
  actions.className = "r-actions";

  const outBtn = document.createElement("button");
  outBtn.className = "btn btn-primary btn-small";
  outBtn.textContent = "Open in Outlook";
  outBtn.addEventListener("click", () => openInOutlook(contact, email.subject || "", email.body || ""));
  actions.appendChild(outBtn);

  const copyItemBtn = document.createElement("button");
  copyItemBtn.className = "btn btn-secondary btn-small";
  copyItemBtn.textContent = "Copy formatted";
  copyItemBtn.addEventListener("click", async () => {
    await copyFormatted(email.body || "");
    markContacted(contact, email.subject || "", email.body || "");
  });
  actions.appendChild(copyItemBtn);

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-ghost btn-small";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => {
    $("reviewModal").close();
    if (state.bulkMode) toggleBulkMode();
    selectCompany(company);
    selectContact(contact);
  });
  actions.appendChild(editBtn);

  item.appendChild(actions);
  $("reviewList").appendChild(item);
}

// ---------------------------------------------------------------------------
// Settings (stored in this browser only)
// ---------------------------------------------------------------------------

// Pending signature image chosen in the modal but not yet saved.
let pendingSignatureImage = null; // null = unchanged, "" = removed, data: = new

function renderSignatureImagePreview(dataUri) {
  const preview = $("signatureImagePreview");
  preview.innerHTML = "";
  if (dataUri) {
    const img = document.createElement("img");
    img.src = dataUri;
    img.alt = "signature";
    preview.appendChild(img);
    preview.hidden = false;
    $("removeSignatureImage").hidden = false;
  } else {
    preview.hidden = true;
    $("removeSignatureImage").hidden = true;
  }
}

$("settingsBtn").addEventListener("click", async () => {
  $("valuePropBox").value = await getValueProp();
  const sender = getSender();
  $("senderName").value = sender.name || "";
  $("senderTitle").value = sender.title || "";
  $("senderPhone").value = sender.phone || "";
  $("signatureText").value = getSignatureText();
  pendingSignatureImage = null;
  $("signatureImageStatus").textContent = "";
  renderSignatureImagePreview(getSignatureImage());
  $("passcodeInput").value = getPasscode();
  $("passcodeField").hidden = !state.passcodeRequired;
  $("settingsModal").showModal();
});

$("signatureImageInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 1024 * 1024) {
    $("signatureImageStatus").textContent =
      "Image is over 1 MB — please use a smaller one (signatures should be small).";
    event.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    pendingSignatureImage = reader.result;
    renderSignatureImagePreview(pendingSignatureImage);
    $("signatureImageStatus").textContent = "Loaded — Save to keep it.";
  };
  reader.onerror = () => {
    $("signatureImageStatus").textContent = "Couldn't read that image.";
  };
  reader.readAsDataURL(file);
  event.target.value = "";
});

$("removeSignatureImage").addEventListener("click", () => {
  pendingSignatureImage = "";
  renderSignatureImagePreview("");
  $("signatureImageStatus").textContent = "Image will be removed on Save.";
});

$("saveSettings").addEventListener("click", () => {
  localStorage.setItem("valueProp", $("valuePropBox").value);
  localStorage.setItem(
    "senderSettings",
    JSON.stringify({
      name: $("senderName").value.trim(),
      title: $("senderTitle").value.trim(),
      phone: $("senderPhone").value.trim(),
    })
  );
  localStorage.setItem("signatureText", $("signatureText").value);
  if (pendingSignatureImage !== null) {
    if (pendingSignatureImage) {
      try {
        localStorage.setItem("signatureImage", pendingSignatureImage);
      } catch {
        toast("Couldn't save the signature image — it may be too large.", true);
      }
    } else {
      localStorage.removeItem("signatureImage");
    }
  }
  const passcode = $("passcodeInput").value.trim();
  if (passcode) localStorage.setItem("passcode", passcode);
  toast("Settings saved (stored in this browser).");
});

// ---------------------------------------------------------------------------
// Load the value proposition from a PDF (text extracted in the browser)
// ---------------------------------------------------------------------------

if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.js";
}

$("valuePropPdf").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const status = $("pdfStatus");

  if (!window.pdfjsLib) {
    status.textContent = "PDF reader failed to load — please paste the text instead.";
    return;
  }

  status.textContent = `Reading ${file.name}…`;
  try {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const parts = [];
    for (let page = 1; page <= pdf.numPages; page++) {
      const content = await (await pdf.getPage(page)).getTextContent();
      // Rebuild line breaks: pdf.js flags the end of a line with hasEOL.
      let line = "";
      for (const item of content.items) {
        line += item.str;
        if (item.hasEOL) {
          parts.push(line);
          line = "";
        }
      }
      if (line) parts.push(line);
      parts.push(""); // blank line between pages
    }
    const text = parts.join("\n").replace(/\n{3,}/g, "\n\n").trim();
    if (!text) {
      status.textContent =
        "No selectable text found — this looks like a scanned/image PDF. Please paste the text in manually.";
      return;
    }
    $("valuePropBox").value = text;
    status.textContent = `Loaded ${pdf.numPages} page${pdf.numPages > 1 ? "s" : ""} — review below, then Save.`;
  } catch (err) {
    status.textContent = `Couldn't read that PDF (${err.message}). Please paste the text instead.`;
  } finally {
    event.target.value = ""; // allow re-selecting the same file
  }
});
