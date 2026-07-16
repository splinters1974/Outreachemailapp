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
  { key: "fullName", label: "Full name", partial: ["full name", "fullname", "contact name"], exact: ["name"] },
  { key: "firstName", label: "First name", partial: ["first name", "firstname"], exact: ["first", "forename"] },
  { key: "lastName", label: "Last name", partial: ["last name", "lastname", "surname"], exact: ["last"] },
  { key: "jobTitle", label: "Job title / role", partial: ["job title", "jobtitle", "position"], exact: ["title", "role", "job"] },
  { key: "company", label: "Company", partial: ["company", "organisation", "organization", "employer"], exact: ["account", "business"] },
  { key: "website", label: "Website / domain", partial: ["website", "domain"], exact: ["url", "web", "site"] },
];

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
}
init();

// ---------------------------------------------------------------------------
// Step 1 — CSV upload & column mapping
// ---------------------------------------------------------------------------

$("csvFile").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
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

    let name = m.fullName ? String(row[m.fullName] || "").trim() : "";
    if (!name) {
      name = [m.firstName && row[m.firstName], m.lastName && row[m.lastName]]
        .filter(Boolean)
        .map((v) => String(v).trim())
        .join(" ");
    }

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

  $("researchBox").value = state.researchCache[company.name] || "";
  $("researchNote").textContent = "";
  $("subjectBox").value = "";
  $("bodyBox").value = "";
  $("rationaleBox").hidden = true;
  $("lengthWarning").hidden = true;
  $("workCard").hidden = false;
  $("workCard").scrollIntoView({ behavior: "smooth" });
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

$("generateBtn").addEventListener("click", async () => {
  const company = state.selectedCompany;
  const contact = state.selectedContact;
  if (!company || !contact) return;
  setBusy($("generateBtn"), true, "Writing…");
  try {
    const valueProp = await getValueProp();
    const { text } = await streamRequest("/api/generate", {
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
      },
      sender: getSender(),
      valueProp,
    });

    let email;
    try {
      email = JSON.parse(text);
    } catch {
      throw new Error(
        "The model returned an unexpected response — please try again."
      );
    }
    $("subjectBox").value = email.subject;
    $("bodyBox").value = email.body;
    const rationale = $("rationaleBox");
    rationale.textContent = `Why this angle: ${email.rationale}`;
    rationale.hidden = false;
    updateLengthWarning();
  } catch (err) {
    toast(err.message, true);
  } finally {
    setBusy($("generateBtn"), false);
  }
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
    `&body=${encodeURIComponent(body)}`;
  window.location.href = href;
});

$("copyBtn").addEventListener("click", async () => {
  const subject = $("subjectBox").value.trim();
  const body = $("bodyBox").value;
  if (!body.trim()) {
    toast("Nothing to copy yet.", true);
    return;
  }
  await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
  toast("Email copied to clipboard.");
});

// ---------------------------------------------------------------------------
// Settings (stored in this browser only)
// ---------------------------------------------------------------------------

$("settingsBtn").addEventListener("click", async () => {
  $("valuePropBox").value = await getValueProp();
  const sender = getSender();
  $("senderName").value = sender.name || "";
  $("senderTitle").value = sender.title || "";
  $("senderPhone").value = sender.phone || "";
  $("passcodeInput").value = getPasscode();
  $("passcodeField").hidden = !state.passcodeRequired;
  $("settingsModal").showModal();
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
