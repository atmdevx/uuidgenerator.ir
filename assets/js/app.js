// ============================================
// UUID Generation Functions
// ============================================

function generateUUIDv1() {
  const now = Date.now();
  const timestamp = now.toString(16).padStart(12, "0");
  const clockSeq = ((Math.random() * 0x3fff) | 0x8000).toString(16);
  const node = Math.random().toString(16).substring(2, 14).padEnd(12, "0");
  return [
    timestamp.substring(0, 8),
    timestamp.substring(8, 12),
    "1" + timestamp.substring(12, 15),
    clockSeq,
    node,
  ].join("-");
}

function generateUUIDv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateUUIDv7() {
  const timestamp = Date.now();
  const timeHex = timestamp.toString(16).padStart(12, "0");
  const rand1 = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, "0");
  const rand2 = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, "0");
  const rand3 = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, "0");
  const timeHigh = parseInt(timeHex.substring(6, 12), 16);
  const versionHigh = (timeHigh & 0x0fff) | 0x7000;
  const versionHex = versionHigh.toString(16);
  return [
    timeHex.substring(0, 8),
    timeHex.substring(8, 12),
    versionHex,
    rand1,
    rand2 + rand3,
  ].join("-");
}

// State
let currentVersion = "v1";
let currentUUID = "";
let batchUUIDs = [];

// UI Elements
const uuidDisplay = document.getElementById("uuidDisplay");
const copyBtn = document.getElementById("copyBtn");
const generateBtn = document.getElementById("generateBtn");
const versionBadge = document.getElementById("versionBadge");
const timeBadge = document.getElementById("timeBadge");
const statVersion = document.getElementById("statVersion");
const statEntropy = document.getElementById("statEntropy");
const detailAlgorithm = document.getElementById("detailAlgorithm");
const detailUseCase = document.getElementById("detailUseCase");
const charTimeOrdered = document.getElementById("charTimeOrdered");
const charSortable = document.getElementById("charSortable");
const charPrivacy = document.getElementById("charPrivacy");

const tabV1 = document.getElementById("tabV1");
const tabV4 = document.getElementById("tabV4");
const tabV7 = document.getElementById("tabV7");

const batchCount = document.getElementById("batchCount");
const batchGenerateBtn = document.getElementById("batchGenerateBtn");
const batchClearBtn = document.getElementById("batchClearBtn");
const batchDownloadBtn = document.getElementById("batchDownloadBtn");
const batchEmpty = document.getElementById("batchEmpty");
const batchList = document.getElementById("batchList");

function updateUIForVersion() {
  if (currentVersion === "v1") {
    statVersion.textContent = "1";
    statEntropy.textContent = "122 bits";
    versionBadge.innerHTML = '<i class="fas fa-tag mr-1"></i>Version 1';
    versionBadge.className =
      "badge bg-blue-950/30 border-blue-900/50 text-blue-400";
    detailAlgorithm.textContent = "Time-based + MAC address";
    detailUseCase.textContent = "Distributed systems, cross-device uniqueness";
    charTimeOrdered.innerHTML = "Yes";
    charTimeOrdered.className = "text-emerald-400";
    charSortable.innerHTML = "No";
    charSortable.className = "text-red-400";
    charPrivacy.innerHTML = "Contains MAC";
    charPrivacy.className = "text-yellow-400";
  } else if (currentVersion === "v4") {
    statVersion.textContent = "4";
    statEntropy.textContent = "122 bits";
    versionBadge.innerHTML = '<i class="fas fa-tag mr-1"></i>Version 4';
    versionBadge.className =
      "badge bg-emerald-950/30 border-emerald-900/50 text-emerald-400";
    detailAlgorithm.textContent = "Cryptographically secure random";
    detailUseCase.textContent = "General purpose, most common version";
    charTimeOrdered.innerHTML = "No";
    charTimeOrdered.className = "text-red-400";
    charSortable.innerHTML = "No";
    charSortable.className = "text-red-400";
    charPrivacy.innerHTML = "Privacy focused";
    charPrivacy.className = "text-emerald-400";
  } else {
    statVersion.textContent = "7";
    statEntropy.textContent = "74 + 48 bits";
    versionBadge.innerHTML = '<i class="fas fa-tag mr-1"></i>Version 7';
    versionBadge.className =
      "badge bg-purple-950/30 border-purple-900/50 text-purple-400";
    detailAlgorithm.textContent = "Unix timestamp + random bits";
    detailUseCase.textContent = "Database indexes, sortable IDs";
    charTimeOrdered.innerHTML = "Yes";
    charTimeOrdered.className = "text-emerald-400";
    charSortable.innerHTML = "Yes";
    charSortable.className = "text-emerald-400";
    charPrivacy.innerHTML = "Privacy focused";
    charPrivacy.className = "text-emerald-400";
  }
}

function generateCurrentUUID() {
  switch (currentVersion) {
    case "v1":
      currentUUID = generateUUIDv1();
      break;
    case "v4":
      currentUUID = generateUUIDv4();
      break;
    case "v7":
      currentUUID = generateUUIDv7();
      break;
  }
  uuidDisplay.textContent = currentUUID;
  updateUIForVersion();

  // Show timestamp badge
  timeBadge.classList.remove("hidden");
  timeBadge.innerHTML = `<i class="fas fa-clock mr-1"></i>${new Date().toLocaleTimeString()}`;
  setTimeout(() => {
    timeBadge.classList.add("hidden");
  }, 3000);

  return currentUUID;
}

async function copyToClipboard(text, btn) {
  if (!text || text === "Click generate") {
    showToast("⚠️ Generate a UUID first", true);
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast("✓ UUID copied to clipboard");
  } catch (e) {
    showToast("❌ Failed to copy", true);
  }
}

function showToast(msg, isError = false) {
  const toast = document.createElement("div");
  toast.innerHTML = msg;
  toast.className = `fixed bottom-5 left-1/2 -translate-x-1/2 text-white px-4 py-2 rounded-lg text-xs z-50 shadow-lg border ${isError ? "bg-red-600 border-red-700" : "bg-zinc-800 border-zinc-700"}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function switchTab(version) {
  currentVersion = version;

  tabV1.className =
    version === "v1"
      ? "tab-active px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
      : "tab-inactive px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all";
  tabV4.className =
    version === "v4"
      ? "tab-active px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
      : "tab-inactive px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all";
  tabV7.className =
    version === "v7"
      ? "tab-active px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
      : "tab-inactive px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all";

  generateCurrentUUID();
}

function renderBatchList() {
  if (batchUUIDs.length === 0) {
    batchEmpty.classList.remove("hidden");
    batchList.classList.add("hidden");
    batchDownloadBtn.classList.add("hidden");
    return;
  }

  batchEmpty.classList.add("hidden");
  batchList.classList.remove("hidden");
  batchList.innerHTML = "";

  batchUUIDs.forEach((uuid, index) => {
    const li = document.createElement("li");
    li.className =
      "flex items-center justify-between bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 group hover:bg-zinc-800 transition-all";
    li.innerHTML = `
          <code class="font-mono text-cyan-400 text-xs md:text-sm break-all flex-1">${escapeHtml(uuid)}</code>
          <button data-batch-copy="${escapeHtml(uuid)}" class="batch-copy bg-zinc-700 hover:bg-zinc-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors ml-3 flex-shrink-0">
            <i class="fas fa-copy"></i> Copy
          </button>
        `;
    batchList.appendChild(li);
  });

  batchDownloadBtn.classList.remove("hidden");

  document.querySelectorAll(".batch-copy").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const uuid = btn.getAttribute("data-batch-copy");
      copyToClipboard(uuid, btn);
    });
  });
}

function generateBatch() {
  let count = parseInt(batchCount.value, 10);
  if (isNaN(count)) count = 5;
  if (count < 1) count = 1;
  if (count > 100) count = 100;
  batchCount.value = count;

  batchUUIDs = [];
  for (let i = 0; i < count; i++) {
    if (currentVersion === "v1") batchUUIDs.push(generateUUIDv1());
    else if (currentVersion === "v4") batchUUIDs.push(generateUUIDv4());
    else batchUUIDs.push(generateUUIDv7());
  }
  renderBatchList();
  showToast(`✨ Generated ${count} UUID${count > 1 ? "s" : ""}`);
}

function downloadBatch() {
  if (batchUUIDs.length === 0) return;
  const blob = new Blob([batchUUIDs.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `uuids_${currentVersion}_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("📁 File downloaded");
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

// Event Listeners
tabV1.addEventListener("click", () => switchTab("v1"));
tabV4.addEventListener("click", () => switchTab("v4"));
tabV7.addEventListener("click", () => switchTab("v7"));

generateBtn.addEventListener("click", () => generateCurrentUUID());
copyBtn.addEventListener("click", () => copyToClipboard(currentUUID, copyBtn));

batchGenerateBtn.addEventListener("click", generateBatch);
batchClearBtn.addEventListener("click", () => {
  batchUUIDs = [];
  renderBatchList();
  showToast("🗑️ Batch cleared");
});
batchDownloadBtn.addEventListener("click", downloadBatch);

// API example toggle
const showApiBtn = document.getElementById("showApiBtn");
const apiExample = document.getElementById("apiExample");
if (showApiBtn && apiExample) {
  showApiBtn.addEventListener("click", () => {
    apiExample.classList.toggle("hidden");
  });
}

// Input validation
batchCount.addEventListener("change", () => {
  let val = parseInt(batchCount.value, 10);
  if (isNaN(val)) batchCount.value = 5;
  else if (val < 1) batchCount.value = 1;
  else if (val > 100) batchCount.value = 100;
});

// Initialize
generateCurrentUUID();
