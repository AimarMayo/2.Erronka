// ===== Splash / App switch =====
const hasiera = document.getElementById("hasiera");
const app = document.getElementById("app");
const sartuBtn = document.getElementById("sartu");
const itzuliBtn = document.getElementById("itzuli");

sartuBtn.addEventListener("click", () => {
  hasiera.classList.add("hidden");
  app.classList.remove("hidden");
});
itzuliBtn.addEventListener("click", () => {
  app.classList.add("hidden");
  hasiera.classList.remove("hidden");
});

// ===== DOM =====
const btnAukeratu = document.getElementById("aukeratu");
const btnBerkargatu = document.getElementById("berkargatu");

const egoeraEl = document.getElementById("egoera");
const kopuruaEl = document.getElementById("kopurua");
const karpetaIzenaEl = document.getElementById("karpetaIzena");

const bilatuEl = document.getElementById("bilatu");
const ordenatuEl = document.getElementById("ordenatu");

const zerrendaEl = document.getElementById("zerrenda");
const emptyEl = document.getElementById("empty");

const detailEmptyEl = document.getElementById("detailEmpty");
const detailEl = document.getElementById("detail");
const detailNameEl = document.getElementById("detailName");
const detailDateEl = document.getElementById("detailDate");
const detailSizeEl = document.getElementById("detailSize");
const detailTextEl = document.getElementById("detailText");
const btnKopiatu = document.getElementById("kopiatu");
const btnDeskargatu = document.getElementById("deskargatu");

// ✅ Kutxen DOM
const fIzena = document.getElementById("fIzena");
const fSaila = document.getElementById("fSaila");
const fKant  = document.getElementById("fKant");
const fUnit  = document.getElementById("fUnit");
const fTotal = document.getElementById("fTotal");

// ===== State =====
let dirHandle = null;
let tickets = []; // { name, handle, lastModified, size, preview, textCache }
let activeIndex = -1;

// ===== Helpers =====
function fmtDate(d){ try { return new Date(d).toLocaleString(); } catch { return "—"; } }
function fmtBytes(bytes){
  if (typeof bytes !== "number") return "—";
  const u = ["B","KB","MB","GB"]; let b = bytes, i=0;
  while (b>=1024 && i<u.length-1){ b/=1024; i++; }
  return `${b.toFixed(i===0?0:1)} ${u[i]}`;
}
function setEgoera(t){ egoeraEl.textContent = t; }
function setKopurua(n){ kopuruaEl.textContent = String(n ?? 0); }
function setKarpeta(n){ karpetaIzenaEl.textContent = n || "—"; }

function ticketPreview(text){
  const cleaned = (text || "").replace(/\r\n/g,"\n").trim();
  const first = cleaned.split("\n").slice(0,3).join(" | ");
  return first.slice(0, 160);
}
function escapeHtml(s){
  return (s ?? "").toString()
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

// ✅ Parser ($ banaketa)
function parseTicketLine(text){
  const line = (text || "").replace(/\r\n/g,"\n").split("\n")[0]?.trim() || "";
  const parts = line.split("$").map(p => p.trim());
  // [0]=izena, [1]=saila, [2]=kant, [3]=unit, [4]=total
  const izena = parts[0] || null;
  const saila = parts[1] || null;

  // Kantitatea: "a18" bezala bada, zenbakia bakarrik hartu
  const kantRaw = parts[2] || null;
  const kant = kantRaw ? kantRaw.replace(/[^\d.,-]/g, "") : null;

  const unit = parts[3] || null;
  const total = parts[4] || null;

  return { izena, saila, kantitatea: kant, unitatea: unit, totala: total };
}

// ===== Events =====
btnAukeratu.addEventListener("click", async () => {
  if (!window.showDirectoryPicker){
    setEgoera("Errorea: Chrome/Edge + Live Server (localhost) behar da.");
    return;
  }
  try{
    setEgoera("Karpeta aukeratzen...");
    dirHandle = await window.showDirectoryPicker();
    btnBerkargatu.disabled = false;
    setKarpeta(dirHandle.name);
    await kargatu();
  }catch{
    setEgoera("Ez da karpetarik aukeratu");
  }
});
btnBerkargatu.addEventListener("click", async () => { if (dirHandle) await kargatu(); });

bilatuEl.addEventListener("input", render);
ordenatuEl.addEventListener("change", () => { ordenatuTickets(); render(); });

btnKopiatu.addEventListener("click", async () => {
  const t = tickets[activeIndex]; if (!t) return;
  const text = await getText(t);
  await navigator.clipboard.writeText(text);
  setEgoera("Kopiatu da ✅"); setTimeout(() => setEgoera("Prest"), 900);
});

btnDeskargatu.addEventListener("click", async () => {
  const t = tickets[activeIndex]; if (!t) return;
  const text = await getText(t);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${t.name}`;
  document.body.appendChild(a);
  a.click(); a.remove();
  URL.revokeObjectURL(url);
  setEgoera("Deskargatzen…"); setTimeout(() => setEgoera("Prest"), 900);
});

// ===== Core =====
async function kargatu(){
  setEgoera("Ticketak kargatzen...");
  zerrendaEl.innerHTML = "";
  tickets = [];
  activeIndex = -1;
  clearDetail();

  // fitxategiak irakurri
  for await (const [name, handle] of dirHandle.entries()){
    if (handle.kind !== "file") continue;
    const fileObj = await handle.getFile();

    // Onartu .txt eta “luzapenik gabe” testuak
    const nameLower = name.toLowerCase();
    const looksTxt = nameLower.endsWith(".txt")
      || (!nameLower.includes(".") && (fileObj.type === "" || fileObj.type.startsWith("text/")));
    if (!looksTxt) continue;

    const text = await fileObj.text();
    tickets.push({
      name, handle,
      lastModified: fileObj.lastModified,
      size: fileObj.size,
      preview: ticketPreview(text),
      textCache: text
    });
  }

  ordenatuTickets();
  setKopurua(tickets.length);
  setEgoera("Prest");
  render();
}

function ordenatuTickets(){
  const mode = ordenatuEl.value;
  tickets.sort((a,b) => {
    if (mode === "berriena") return (b.lastModified ?? 0) - (a.lastModified ?? 0);
    if (mode === "zaharrena") return (a.lastModified ?? 0) - (b.lastModified ?? 0);
    if (mode === "izenaAZ") return a.name.localeCompare(b.name);
    if (mode === "izenaZA") return b.name.localeCompare(a.name);
    return 0;
  });
}

function render(){
  const term = (bilatuEl.value || "").toLowerCase().trim();

  const filtered = tickets
    .map((t, idx) => ({ t, idx }))
    .filter(({t}) => !term || t.name.toLowerCase().includes(term) || (t.textCache||"").toLowerCase().includes(term));

  zerrendaEl.innerHTML = "";
  emptyEl.style.display = tickets.length === 0 ? "block" : "none";

  filtered.forEach(({t, idx}) => {
    const li = document.createElement("li");
    li.className = "card" + (idx === activeIndex ? " active" : "");
    li.innerHTML = `
      <div class="cardTop">
        <div class="fileName">📄 ${escapeHtml(t.name)}</div>
        <div class="fileDate">${escapeHtml(fmtDate(t.lastModified))}</div>
      </div>
      <div class="preview">${escapeHtml(t.preview || "")}</div>
    `;
    li.addEventListener("click", () => openTicket(idx));
    zerrendaEl.appendChild(li);
  });

  setEgoera(`Erakusten: ${filtered.length}`);
}

async function openTicket(idx){
  activeIndex = idx;
  render();

  const t = tickets[idx];
  if (!t) return;

  const text = await getText(t);

  detailEmptyEl.style.display = "none";
  detailEl.classList.remove("hidden");

  detailNameEl.textContent = t.name;
  detailDateEl.textContent = fmtDate(t.lastModified);
  detailSizeEl.textContent = fmtBytes(t.size);

  // ✅ HEMEN BETETZEN DIRA KUTXAK
  const p = parseTicketLine(text);
  fIzena.textContent = p.izena ?? "—";
  fSaila.textContent = p.saila ?? "—";
  fKant.textContent  = p.kantitatea ?? "—";
  fUnit.textContent  = p.unitatea ?? "—";
  fTotal.textContent = p.totala ?? "—";

  // Testu gordina ere erakutsi (behean)
  detailTextEl.textContent = text;
}

function clearDetail(){
  detailEmptyEl.style.display = "block";
  detailEl.classList.add("hidden");
  detailNameEl.textContent = "—";
  detailDateEl.textContent = "—";
  detailSizeEl.textContent = "—";
  detailTextEl.textContent = "";

  fIzena.textContent = "—";
  fSaila.textContent = "—";
  fKant.textContent  = "—";
  fUnit.textContent  = "—";
  fTotal.textContent = "—";
}

async function getText(t){
  if (t.textCache != null) return t.textCache;
  const fileObj = await t.handle.getFile();
  const text = await fileObj.text();
  t.textCache = text;
  t.preview = ticketPreview(text);
  t.size = fileObj.size;
  t.lastModified = fileObj.lastModified;
  return text;
}
