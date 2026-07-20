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
  const list = $("contactList");
  list.innerHTML = "";
  if (!company) return;
  for (const contact of company.contacts) {
    const li = document.createElement("li");
    const wrap = document.createElement("div");
    const nameEl = document.createElement("span");
    nameEl.textContent = contact.name;
    const roleEl = document.createElement("span");
    roleEl.className = "contact-role";
    roleEl.textContent = [contact.title, contact.email].filter(Boolean).join(" · ");
    wrap.appendChild(nameEl);
    wrap.appendChild(roleEl);
    li.appendChild(wrap);

    const sentIso = sentDateFor(contact.email);
    if (sentIso) {
      li.classList.add("emailed");
      const badge = document.createElement("span");
      badge.className = "sent-badge";
      badge.textContent = `✓ emailed ${formatSentDate(sentIso)}`;
      badge.title = `Marked as emailed on ${new Date(sentIso).toLocaleString()}`;
      li.appendChild(badge);
    }

    if (state.selectedContact === contact) li.classList.add("selected");
    li.addEventListener("click", () => selectContact(contact));
    list.appendChild(li);
  }
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

  $("researchBox").value = state.researchCache[company.name] || "";
  $("researchNote").textContent = "";
  $("subjectBox").value = "";
  $("bodyBox").value = "";
  $("rationaleBox").hidden = true;
  $("lengthWarning").hidden = true;
  $("variationsPanel").hidden = true;
  $("tweakRow").hidden = true;
  $("linkedinBtn").hidden = !contact.linkedin;
  $("linkedinNote").textContent = contact.linkedin
    ? "LinkedIn can't pre-fill a message — use Open LinkedIn, then paste with Copy message body."
    : "";
  $("signatureNote").textContent = getSignatureImage()
    ? "Your signature image is included via Copy formatted (paste into Outlook), not the mailto draft."
    : "";
  refreshFollowupAvailability();
  $("workCard").hidden = false;
  $("workCard").scrollIntoView({ behavior: "smooth" });
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

$("researchBtn").addEventListener("click", async () => {
  const company = state.selectedCompany;
  if (!company) return;
  setBusy($("researchBtn"), true, "Researching…");
  $("researchBox").value = "";
  try {
    const { text, response } = await streamRequest(
      "/api/research",
      { companyName: company.name, domain: company.domain },
      (partial) => {
        $("researchBox").value = partial;
      }
    );
    $("researchBox").value = text;
    state.researchCache[company.name] = text;
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
    state.researchCache[state.selectedCompany.name] = $("researchBox").value;
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

$("bodyBox").addEventListener("input", updateLengthWarning);
$("subjectBox").addEventListener("input", updateLengthWarning);

// Record an outreach (any channel): flag the contact, save the email so
// follow-ups can reference it, and refresh the UI.
function markContacted(contact, subject, body) {
  recordSent(contact.email);
  addEmailHistory(contact.email, subject, body);
  renderContactList();
  refreshFollowupAvailability();
}

function withTextSignature(body) {
  const sig = getSignatureText().trim();
  return sig ? `${body}\n\n${sig}` : body;
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
  const href =
    `mailto:${encodeURIComponent(contact.email)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(withTextSignature(body))}`;

  markContacted(contact, subject, body);
  window.location.href = href;
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

$("copyBtn").addEventListener("click", async () => {
  const body = $("bodyBox").value;
  if (!body.trim()) {
    toast("Nothing to copy yet.", true);
    return;
  }
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
