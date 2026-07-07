/* Ameresco Outreach — front-end logic.
   All CSV parsing happens in the browser; contact data never leaves this page
   except the single selected company/contact sent for email generation. */

const $ = (id) => document.getElementById(id);

const state = {
  headers: [],
  rows: [],
  mapping: {},
  companies: [], // { name, domain, contacts: [{name, title, email}] }
  selectedCompany: null,
  selectedContact: null,
  researchCache: {}, // company name -> research text
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

async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
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
    const settings = await api("GET", "/api/settings");
    localStorage.setItem("senderSettings", JSON.stringify(settings));
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
      const domain =
        mostCommon(c.websites) ||
        mostCommon(c.emailDomains) ||
        "";
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
  try {
    const data = await api("POST", "/api/research", {
      companyName: company.name,
      domain: company.domain,
    });
    $("researchBox").value = data.summary;
    $("researchNote").textContent = data.fetchNote || "";
    state.researchCache[company.name] = data.summary;
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
    const settings = JSON.parse(localStorage.getItem("senderSettings") || "{}");
    const data = await api("POST", "/api/generate", {
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
      sender: settings,
    });
    $("subjectBox").value = data.subject;
    $("bodyBox").value = data.body;
    const rationale = $("rationaleBox");
    rationale.textContent = `Why this angle: ${data.rationale}`;
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
// Settings
// ---------------------------------------------------------------------------

$("settingsBtn").addEventListener("click", async () => {
  try {
    const [vp, settings] = await Promise.all([
      api("GET", "/api/value-prop"),
      api("GET", "/api/settings"),
    ]);
    $("valuePropBox").value = vp.text || "";
    $("senderName").value = settings.name || "";
    $("senderTitle").value = settings.title || "";
    $("senderPhone").value = settings.phone || "";
  } catch (err) {
    toast(err.message, true);
  }
  $("settingsModal").showModal();
});

$("saveSettings").addEventListener("click", async () => {
  const sender = {
    name: $("senderName").value.trim(),
    title: $("senderTitle").value.trim(),
    phone: $("senderPhone").value.trim(),
  };
  try {
    await Promise.all([
      api("PUT", "/api/value-prop", { text: $("valuePropBox").value }),
      api("PUT", "/api/settings", sender),
    ]);
    localStorage.setItem("senderSettings", JSON.stringify(sender));
    toast("Settings saved.");
  } catch (err) {
    toast(err.message, true);
  }
});
