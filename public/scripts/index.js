async function applyLogSettingsFromServer() {
    try {
        const { data: currentSettings } = await axios.get('/settings');
        const lc = currentSettings?.logCategories || {};
        const bind = (id) => { const el = document.getElementById(id); if (el) el.checked = lc[id.replace('log_', '')] !== false; };
        const mask = document.getElementById('log_maskPii'); if (mask) mask.checked = !!currentSettings?.logMaskPii;
        bind('log_tokenManager');
        bind('log_cache');
        bind('log_queuePreview');
        bind('log_painting');
        bind('log_startTurn');
        bind('log_mismatches');
        bind('log_estimatedTime');
    } catch (_) { }
}
const $ = (id) => document.getElementById(id);
const main = $("main");
const openManageUsers = $("openManageUsers");
const openAddTemplate = $("openAddTemplate");
const openManageTemplates = $("openManageTemplates");
const openSettings = $("openSettings");
const openChangelog = $("openChangelog");
const userForm = $("userForm");
const scookie = $("scookie");
const jcookie = $("jcookie");
const submitUser = $("submitUser");
const manageUsers = $("manageUsers");
const userList = $("userList");
const checkUserStatus = $("checkUserStatus");
const checkUsersProgress = $("checkUsersProgress");
const checkUsersResult = $("checkUsersResult");
const cleanupExpiredBtn = $("cleanupExpiredBtn");
const cleanupExpiredWrap = $("cleanupExpiredWrap");
const addTemplate = $("addTemplate");
const convert = $("convert");
const details = $("details");
const size = $("size");
const ink = $("ink");
const templateCanvas = $("templateCanvas");


const previewCanvas = $("previewCanvas");
const previewCanvasButton = $("previewCanvasButton");
const previewBorder = $("previewBorder");
const usePaidColors = $("usePaidColors");

const templateForm = $("templateForm");
const templateFormTitle = $("templateFormTitle");
const convertInput = $("convertInput");
const templateName = $("templateName");
const tx = $("tx");
const ty = $("ty");
const px = $("px");
const py = $("py");
const userSelectList = $("userSelectList");
const selectAllUsers = $("selectAllUsers");
const unselectAllUsers = $("unselectAllUsers");
const canBuyMaxCharges = $("canBuyMaxCharges");
const canBuyCharges = $("canBuyCharges");
const autoBuyNeededColors = $("autoBuyNeededColors");
const antiGriefMode = $("antiGriefMode");
const skipPaintedPixels = $("skipPaintedPixels");
const outlineMode = $("outlineMode");
const paintTransparent = $("paintTransparent");
const heatmapEnabled = $("heatmapEnabled");
const heatmapLimit = $("heatmapLimit");
const heatmapLimitWrap = $("heatmapLimitWrap");
const autoStart = $("autoStart");
const submitTemplate = $("submitTemplate");
const manageTemplates = $("manageTemplates");
const templateList = $("templateList");
const PINNED_TEMPLATES_KEY = 'wplacer_pinned_templates_v1';
const getPinned = () => { try { return JSON.parse(localStorage.getItem(PINNED_TEMPLATES_KEY) || '[]') || []; } catch { return []; } };
const savePinned = (arr) => { try { localStorage.setItem(PINNED_TEMPLATES_KEY, JSON.stringify(Array.from(new Set(arr)))) } catch { } };
const startAll = $("startAll");
const stopAll = $("stopAll");
const totalDropletsEl = $("totalDroplets");
const regenPphEl = $("regenPph");
const settings = $("settings");
const turnstileNotifications = $("turnstileNotifications");
const accountCooldown = $("accountCooldown");
const purchaseCooldown = $("purchaseCooldown");
const accountCheckCooldown = $("accountCheckCooldown");
const dropletReserve = $("dropletReserve");
const antiGriefStandby = $("antiGriefStandby");
const chargeThreshold = $("chargeThreshold");
const chargeThresholdContainer = $("chargeThresholdContainer");
const totalCharges = $("totalCharges");
const totalMaxCharges = $("totalMaxCharges");
const messageBoxOverlay = $("messageBoxOverlay");
const alwaysDrawOnCharge = $("alwaysDrawOnCharge");
const maxPixelsPerPass = $("maxPixelsPerPass");
const messageBoxTitle = $("messageBoxTitle");
const messageBoxContent = $("messageBoxContent");
const messageBoxConfirm = $("messageBoxConfirm");
const messageBoxCancel = $("messageBoxCancel");
const manageUsersTitle = $("manageUsersTitle");
const previewSpeed = $("previewSpeed");
const previewSpeedLabel = $("previewSpeedLabel");
const showLatestInfo = $("showLatestInfo");
const buyMaxUpgradesAll = $("buyMaxUpgradesAll");
const buyChargesAll = $("buyChargesAll");
const liveLogs = $("liveLogs");
const logsOutput = $("logsOutput");
const toggleMaskLogs = $("toggleMaskLogs");
const clearLogs = $("clearLogs");

const queuePreview = $("queuePreview");
const refreshQueuePreview = $("refreshQueuePreview");
const autoRefreshQueue = $("autoRefreshQueue");
const autoRefreshGroup = $("autoRefreshGroup");
const queueRefreshIntervalInput = $("queueRefreshInterval");
const intervalLabel = $("intervalLabel");
const hideSensitiveInfoQueue = $("hideSensitiveInfoQueue");
const queueLastUpdate = $("queueLastUpdate");
const queueTotalUsers = $("queueTotalUsers");
const queueReadyUsers = $("queueReadyUsers");
const queueUserList = $("queueUserList");

let queueRefreshInterval = null;
let currentQueueData = null;
let isFirstLoad = true;
let __logMaskEnabled = false;
let __sse; // EventSource

// Keep raw lines to allow re-render on mask toggle
const __logsRaw = [];


// flagsManager
const flagsManager = $("flagsManager");
const flagsAllList = $("flagsAllList");
const flagDetailsCard = $("flagDetailsCard");
const selectedFlagTitle = $("selectedFlagTitle");
const selectedFlagId = $("selectedFlagId");
const selectedFlagEmoji = $("selectedFlagEmoji");
const usersHaveFlag = $("usersHaveFlag");
const usersNoFlag = $("usersNoFlag");
const selectAllNoFlag = $("selectAllNoFlag");
const UnselectAllNoFlag = $("UnselectAllNoFlag");
const selectAllHaveFlag = $("selectAllHaveFlag");
const unselectAllHaveFlag = $("unselectAllHaveFlag");
const purchaseFlagBtn = $("purchaseFlagBtn");
const equipFlagBtn = $("equipFlagBtn");
const purchaseFlagReport = $("purchaseFlagReport");
const flagsLastCheckLabel = $("flagsLastCheckLabel");
const equipFlagBatchBtn = $("equipFlagBatchBtn");
const unequipFlagBatchBtn = $("unequipFlagBatchBtn");

let FLAGS_INIT = false;
let CURRENT_SELECTED_FLAG = null;

// ---- Flags helpers (shared) ----
function countryCodeToEmoji(code) {
    try {
        const cc = String(code || '').trim().toUpperCase();
        if (cc.length !== 2) return '';
        const base = 0x1F1E6;
        const a = cc.charCodeAt(0) - 0x41;
        const b = cc.charCodeAt(1) - 0x41;
        if (a < 0 || a > 25 || b < 0 || b > 25) return '';
        return String.fromCodePoint(base + a) + String.fromCodePoint(base + b);
    } catch { return ''; }
}

function flagMetaToEmoji(meta) {
    if (!meta) return '';
    const ccEmoji = countryCodeToEmoji(meta.code);
    return ccEmoji || String(meta.flag || '') || '';
}

function parseTwemojiIn(container, sizePx) {
    try {
        if (!container) return;
        if (window.twemoji && typeof window.twemoji.parse === 'function') {
            window.twemoji.parse(container, {
                folder: 'svg',
                ext: '.svg',
                base: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/',
                className: 'twemoji',
            });
            if (sizePx) {
                container.querySelectorAll('img.twemoji').forEach(img => {
                    img.style.width = `${sizePx}px`;
                    img.style.height = `${sizePx}px`;
                });
            }
        }
    } catch (_) { }
}

const FLAGS_CACHE_KEY = 'wplacer_flags_cache_v1';
let FLAGS_CACHE = null; try { FLAGS_CACHE = JSON.parse(localStorage.getItem(FLAGS_CACHE_KEY) || 'null'); } catch (_) { FLAGS_CACHE = null; }
const saveFlagsCache = () => { try { localStorage.setItem(FLAGS_CACHE_KEY, JSON.stringify(FLAGS_CACHE)); } catch (_) { } };

// USERS_FLAG_STATE[userId] = { name, flagsBitmap(b64), equippedFlag, droplets }
const USERS_FLAG_STATE = {};

function bitmapToFlagIds(b64) {
    const bytes = (typeof Buffer !== 'undefined' && Buffer.from)
        ? Uint8Array.from(Buffer.from(b64, 'base64'))
        : Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const L = bytes.length; const ids = [];
    for (let i = 0; i < L; i++) {
        const v = bytes[i]; if (v === 0) continue;
        for (let bit = 0; bit < 8; bit++) if (v & (1 << bit)) ids.push((L - 1 - i) * 8 + bit);
    }
    return ids.sort((a, b) => a - b);
}

let FLAGS_LIST = [];

//

const renderLogLine = (raw) => {
    try {
        const masked = __logMaskEnabled ? maskLogText(raw.line) : raw.line;
        const cat = String(raw.category || 'general');
        const level = String(raw.level || 'info');
        const isErrorSymbol = /❌/.test(raw.line || '');
        const isPainted = /\uD83C\uDFA8|🎨\s*Painted/i.test(raw.line || '');
        const isPurchase = /\uD83D\uDED2|🛒|\bBought\b/i.test(raw.line || '');

        const isSeparator = /^---\s+.*\s+---$/.test(raw.line || '');
        const isValidationSection = /^---\s+(JSON Files Validation|Log Files Cleanup)/.test(raw.line || '') ||
            /^✅\s+(File|All JSON files|All log files)/.test(raw.line || '') ||
            /^---\s+(JSON Files Validation|Log Files Cleanup)\s+Complete\s+---$/.test(raw.line || '') ||
            /^📊\s+Log file/.test(raw.line || '') ||
            /^Log file.*lines/.test(raw.line || '') ||
            /^Log file.*within limits/.test(raw.line || '') ||
            /^All log files are within size limits/.test(raw.line || '') ||
            /^Created backup/.test(raw.line || '') ||
            /^Failed to create backup/.test(raw.line || '') ||
            /^ℹ️\s+File.*not found/.test(raw.line || '');
        const cls = `log-line log-${cat} ${level === 'error' || isErrorSymbol ? 'log-error' : ''} ${level === 'warning' ? 'log-warning' : ''} ${isPainted ? 'log-success' : ''} ${isPurchase ? 'log-success-purchase' : ''} ${isSeparator || isValidationSection ? 'log-separator' : ''}`;

        const div = document.createElement('div');
        div.className = cls;

        // Split prefix: [time] (name#id) [Template]? — template part is optional
        const m = String(masked).match(/^\[[^\]]+\]\s*\([^\)]+\)(?:\s*\[[^\]]+\])?\s*/);
        if (m) {
            const prefix = m[0];
            const rest = masked.slice(prefix.length);
            const spanPrefix = document.createElement('span');
            spanPrefix.className = 'log-prefix';
            spanPrefix.textContent = prefix;
            const spanRest = document.createElement('span');
            spanRest.textContent = rest;
            div.appendChild(spanPrefix);
            div.appendChild(spanRest);
        } else {
            div.textContent = masked;
        }

        logsOutput.appendChild(div);
        logsOutput.parentElement.scrollTop = logsOutput.parentElement.scrollHeight;
    } catch (_) { }
};

const rerenderAllLogs = () => {
    if (!logsOutput) return;
    logsOutput.innerHTML = '';
    for (const raw of __logsRaw) renderLogLine(raw);
};

const maskLogText = (s) => {
    try {
        let t = String(s || '');
        // (nick#123456) -> (NickName#1111111)
        t = t.replace(/\([^)#]+#\d+\)/g, (m) => {
            try { return m.replace(/\([^#)]+/, '(NickName').replace(/#\d+\)/, '#1111111)'); } catch { return '(NickName#1111111)'; }
        });
        // #11240474 -> #1111111 (for 3+ digits)
        t = t.replace(/#\d{3,}/g, '#1111111');
        // tile 1227, 674 -> tile 1, 1
        t = t.replace(/tile\s+\d+\s*,\s*\d+/gi, 'tile 1, 1');
        return t;
    } catch (_) { return String(s || ''); }
};

function startLogsStream() {
    try { if (__sse) { __sse.close(); __sse = null; } } catch (_) { }
    try {
        __sse = new EventSource('/logs/stream');
        __sse.onmessage = (ev) => {
            try {
                const data = JSON.parse(ev.data || '{}');
                const rawObj = { line: String(data.line || ''), category: String(data.category || 'general'), level: String(data.level || 'info') };
                __logsRaw.push(rawObj);
                renderLogLine(rawObj);
            } catch (_) { }
        };
        __sse.onerror = () => { /* keep alive */ };
    } catch (e) { console.warn('SSE init failed', e); }
}

toggleMaskLogs?.addEventListener('click', () => {
    __logMaskEnabled = !__logMaskEnabled;
    toggleMaskLogs.textContent = __logMaskEnabled ? 'Show Sensitive Info' : 'Hide Sensitive Info';
    rerenderAllLogs();
});

clearLogs?.addEventListener('click', () => {
    if (logsOutput) logsOutput.innerHTML = '';
    __logsRaw.length = 0;
});

let pendingUserSelection = null;
let editSelectedUserIds = null; // Set of selected user ids while editing template

const LAST_STATUS_KEY = 'wplacer_latest_user_status';
const LAST_TOTALS_KEY = 'wplacer_latest_totals_v1';
let LAST_USER_STATUS = {};
try {
    LAST_USER_STATUS = JSON.parse(localStorage.getItem(LAST_STATUS_KEY) || '{}') || {};
} catch (_) { LAST_USER_STATUS = {}; }

const saveLastStatus = () => {
    try { localStorage.setItem(LAST_STATUS_KEY, JSON.stringify(LAST_USER_STATUS)); } catch (_) { }
};

const saveLatestTotals = (totals) => {
    try { localStorage.setItem(LAST_TOTALS_KEY, JSON.stringify(totals || {})); } catch (_) { }
};

const loadLatestTotals = () => {
    try { return JSON.parse(localStorage.getItem(LAST_TOTALS_KEY) || 'null'); } catch (_) { return null; }
};


const seedCountHidden = $("seedCount");


let templateUpdateInterval = null;


let confirmCallback = null;

const showMessage = (title, content) => {
    messageBoxTitle.textContent = title;
    messageBoxContent.innerHTML = String(content);
    messageBoxCancel.classList.add('hidden');
    messageBoxConfirm.textContent = 'OK';
    messageBoxOverlay.classList.remove('hidden');
    confirmCallback = null;
};

const showMessageBig = (title, content) => {
    messageBoxTitleBig.textContent = title;
    messageBoxContentBig.innerHTML = String(content);
    messageBoxCancelBig.classList.add('hidden');
    messageBoxConfirmBig.textContent = 'OK';
    messageBoxOverlayBig.classList.remove('hidden');
    confirmCallback = null;
};

const showConfirmationBig = (title, content, onConfirm) => {
    messageBoxTitleBig.textContent = title;
    messageBoxContentBig.innerHTML = String(content);
    messageBoxCancelBig.classList.remove('hidden');
    messageBoxConfirmBig.textContent = 'Confirm';
    messageBoxOverlayBig.classList.remove('hidden');
    confirmCallback = onConfirm;
};

const showConfirmation = (title, content, onConfirm) => {
    messageBoxTitle.textContent = title;
    messageBoxContent.innerHTML = String(content);
    messageBoxCancel.classList.remove('hidden');
    messageBoxConfirm.textContent = 'Confirm';
    messageBoxOverlay.classList.remove('hidden');
    confirmCallback = onConfirm;
};

const closeMessageBoxBig = () => {
    messageBoxOverlayBig.classList.add('hidden');
    confirmCallback = null;
};

const closeMessageBox = () => {
    messageBoxOverlay.classList.add('hidden');
    confirmCallback = null;
};


const proxyEnabled = $("proxyEnabled");
const proxyFormContainer = $("proxyFormContainer");
const proxyRotationMode = $("proxyRotationMode");
const proxyCount = $("proxyCount");
const reloadProxiesBtn = $("reloadProxiesBtn");
const parallelWorkers = $("parallelWorkers");
const logProxyUsage = $("logProxyUsage");

messageBoxConfirmBig.addEventListener('click', () => {
    if (confirmCallback) {
        confirmCallback();
    }
    closeMessageBoxBig();
});

messageBoxCancelBig.addEventListener('click', () => {
    closeMessageBoxBig();
});

messageBoxConfirm.addEventListener('click', () => {
    if (confirmCallback) {
        confirmCallback();
    }
    closeMessageBox();
});

messageBoxCancel.addEventListener('click', () => {
    closeMessageBox();
});


const DISCLAIMER_KEY = 'wplacer_disclaimer_ack_v1';
function showDisclaimerIfNeeded() {
    try { if (localStorage.getItem(DISCLAIMER_KEY) === '1') return; } catch (_) { }
    const content = `
      <div style="text-align:left; max-height:80vh; overflow:auto; line-height:1.45">
        <p><b>Important notice</b></p>
        <p>This software is provided <b>for educational and research purposes only</b>. You must use it responsibly and in full compliance with the rules, Terms of Service, and policies of the target website/platform. Any actions that violate the platform's rules, disrupt services, harm other users, or seek unfair advantage are <b>strictly discouraged</b>.</p>
        <p>By proceeding, you confirm that:</p>
        <ul>
          <li>You will strictly follow the rules of the <b>wplace</b> website and will not attempt to bypass or violate them.</li>
          <li>You will not use this tool for profit, abuse, harassment, fraud, or any unlawful activity.</li>
          <li>You will respect rate limits, security measures, and fair‑use policies of the platform.</li>
          <li>You take full responsibility for how you use this software. The authors and distributors are not liable for any consequences of misuse.</li>
        </ul>
        <p>If you do not agree, please close this window and stop using the application.</p>
      </div>`;

    messageBoxTitle.textContent = 'Disclaimer';
    messageBoxContent.innerHTML = content;
    messageBoxCancel.classList.add('hidden');
    messageBoxConfirm.textContent = 'I understand and agree';
    messageBoxOverlay.classList.remove('hidden');
    confirmCallback = () => {
        try { localStorage.setItem(DISCLAIMER_KEY, '1'); } catch (_) { }
    };
}

document.addEventListener('DOMContentLoaded', showDisclaimerIfNeeded);


function escapeHtml(s) { return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function renderMarkdown(md) {
    const lines = String(md || '').split(/\r?\n/);
    let html = '';
    let listDepth = 0;
    const openList = () => { html += '<ul>'; listDepth += 1; };
    const closeList = () => { html += '</ul>'; listDepth -= 1; };
    const flushAllLists = () => { while (listDepth > 0) closeList(); };

    for (const raw of lines) {
        const line = raw.replace(/\s+$/, '');
        if (!line.trim()) { flushAllLists(); continue; }

        if (line.startsWith('### ')) { flushAllLists(); html += `<h3>${escapeHtml(line.slice(4))}</h3>`; continue; }
        if (line.startsWith('## ')) { flushAllLists(); html += `<h2>${escapeHtml(line.slice(3))}</h2>`; continue; }
        if (line.startsWith('# ')) { flushAllLists(); html += `<h1>${escapeHtml(line.slice(2))}</h1>`; continue; }

        const m = line.match(/^(\s*)-\s+(.*)$/);
        if (m) {
            const indent = m[1] || '';
            const content = m[2] || '';
            const targetDepth = Math.max(0, Math.floor(indent.length / 2) + 1);
            while (listDepth < targetDepth) openList();
            while (listDepth > targetDepth) closeList();
            html += `<li>${escapeHtml(content)}</li>`;
            continue;
        }

        flushAllLists();
        html += `<p>${escapeHtml(line)}</p>`;
    }

    flushAllLists();
    return html
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1<\/a>')
        .replace(/\*\*(.+?)\*\*/g, '<b>$1<\/b>')
        .replace(/\*(.+?)\*/g, '<i>$1<\/i>');
}
async function checkVersionAndWarn() {
    try {
        const { data } = await axios.get('/version');
        const latest = String(data?.latest || '');
        const outdated = !!data?.outdated;

        // Skip if user chose to ignore this specific latest version
        try {
            const ignored = String(localStorage.getItem('wplacer_ignore_version') || '');
            if (outdated && latest && ignored === latest) return;
        } catch (_) { }

        if (outdated) {
            let changelog = '';
            try {
                const ch = await axios.get('/changelog');

                const content = (ch.data?.remote || '').trim() || (ch.data?.local || '').trim();
                if (content) {
                    const mdHtml = renderMarkdown(content);
                    changelog = `<div style="max-height:60vh; overflow:auto; border:1px solid var(--border); padding:8px; border-radius:6px; background: rgba(255,255,255,.04); text-align: left;">${mdHtml}</div>`;
                }
            } catch (_) { }

            const html = `A new version is available.<br><br>
                <b>Current:</b> ${data.local}<br>
                <b>Latest:</b> ${data.latest}<br><br>
                ${changelog}
                <div style="margin-top:8px">Please update from <a href="https://github.com/lllexxa/wplacer" target="_blank" rel="noreferrer noopener">GitHub</a> or use 'git pull' command.</div>`;
            showMessageBig('Update available', html);

            // Allow user to ignore this specific latest version
            try {
                if (typeof messageBoxCancelBig !== 'undefined' && typeof messageBoxConfirmBig !== 'undefined') {
                    messageBoxCancelBig.classList.remove('hidden');
                    messageBoxConfirmBig.textContent = 'OK';
                    messageBoxCancelBig.textContent = latest ? `Don't remind for ${latest}` : `Don't remind for this version`;

                    messageBoxConfirmBig.onclick = () => {
                        closeMessageBoxBig();
                    };
                    messageBoxCancelBig.onclick = () => {
                        try { localStorage.setItem('wplacer_ignore_version', latest || ''); } catch (_) { }
                        closeMessageBoxBig();
                    };
                }
            } catch (_) { }
        }
    } catch (_) { }
}
document.addEventListener('DOMContentLoaded', checkVersionAndWarn);


const CHANGELOG_ACK_KEY = 'wplacer_ack_version';
async function showChangelogOnFirstLoad() {
    try {
        const { data } = await axios.get('/version');
        const local = String(data?.local || '');
        const outdated = !!data?.outdated;
        if (!local || outdated) return;

        let ack = '';
        try { ack = String(localStorage.getItem(CHANGELOG_ACK_KEY) || ''); } catch (_) { ack = ''; }
        if (ack === local) return;

        let changelog = '';
        try {
            const ch = await axios.get('/changelog');
            const content = (ch.data?.local || '').trim();
            if (content) {
                const mdHtml = renderMarkdown(content);
                changelog = `<div style="max-height:60vh; overflow:auto; border:1px solid var(--border); padding:8px; border-radius:6px; background: rgba(255,255,255,.04); text-align: left;">${mdHtml}</div>`;
            }
        } catch (_) { }

        const html = `<b>Updated to</b> ${local}<br><br>${changelog || 'No changelog available.'}`;
        showMessageBig('Changelog', html);

        try {
            messageBoxConfirmBig.onclick = () => {
                try { localStorage.setItem(CHANGELOG_ACK_KEY, local); } catch (_) { }
                closeMessageBoxBig();
            };
            messageBoxCancelBig.classList.add('hidden');
            messageBoxConfirmBig.textContent = 'OK';
        } catch (_) { }
    } catch (_) { }
}
document.addEventListener('DOMContentLoaded', showChangelogOnFirstLoad);

previewSpeed?.addEventListener('input', (e) => {
    const v = parseFloat(e.target.value) || 1;
    localStorage.setItem('wplacer_preview_speed', v);
    if (previewSpeedLabel) previewSpeedLabel.textContent = `${v}×`;
    if (typeof MODE_PREVIEW !== 'undefined' && MODE_PREVIEW.setSpeed) {
        MODE_PREVIEW.setSpeed(v);
    }
});

const handleError = (error) => {
    console.error(error);
    let message = "An unknown error occurred. Check the console for details.";

    if (error.code === 'ERR_NETWORK') {
        message = "Could not connect to the server. Please ensure the bot is running and accessible.";
    } else if (error.response && error.response.data && error.response.data.error) {
        const errMsg = error.response.data.error;
        if (errMsg.includes("(1015)")) {
            message = "You are being rate-limited by the server. Please wait a moment before trying again.";
        } else if (errMsg.includes("(500)")) {
            message = "Authentication failed. The user's cookie may be expired or invalid. Please try adding the user again with a new cookie.";
        } else if (errMsg.includes("(502)")) {
            message = "The server reported a Bad Gateway (502). It might be restarting. Try again shortly.";
        } else {
            message = errMsg; // Show the full error if it's not a known one
        }
    }
    showMessage("Error", message);
};


const loadUsers = async (f) => {
    try {
        const users = await axios.get("/users");
        if (f) f(users.data);
    } catch (error) {
        handleError(error);
    };
};
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('/user', { cookies: { s: scookie.value, j: jcookie.value } });
        if (response.status === 200) {
            showMessage("Success", `Logged in as ${response.data.name} (#${response.data.id})!`);
            userForm.reset();
            openManageUsers.click();
        }
    } catch (error) {
        handleError(error);
    };
});


const basic_colors = { "0,0,0": 1, "60,60,60": 2, "120,120,120": 3, "210,210,210": 4, "255,255,255": 5, "96,0,24": 6, "237,28,36": 7, "255,127,39": 8, "246,170,9": 9, "249,221,59": 10, "255,250,188": 11, "14,185,104": 12, "19,230,123": 13, "135,255,94": 14, "12,129,110": 15, "16,174,166": 16, "19,225,190": 17, "40,80,158": 18, "64,147,228": 19, "96,247,242": 20, "107,80,246": 21, "153,177,251": 22, "120,12,153": 23, "170,56,185": 24, "224,159,249": 25, "203,0,122": 26, "236,31,128": 27, "243,141,169": 28, "104,70,52": 29, "149,104,42": 30, "248,178,119": 31 };
const premium_colors = { "170,170,170": 32, "165,14,30": 33, "250,128,114": 34, "228,92,26": 35, "214,181,148": 36, "156,132,49": 37, "197,173,49": 38, "232,212,95": 39, "74,107,58": 40, "90,148,74": 41, "132,197,115": 42, "15,121,159": 43, "187,250,242": 44, "125,199,255": 45, "77,49,184": 46, "74,66,132": 47, "122,113,196": 48, "181,174,241": 49, "219,164,99": 50, "209,128,81": 51, "255,197,165": 52, "155,82,73": 53, "209,128,120": 54, "250,182,164": 55, "123,99,82": 56, "156,132,107": 57, "51,57,65": 58, "109,117,141": 59, "179,185,209": 60, "109,100,63": 61, "148,140,107": 62, "205,197,158": 63 };
const colors = { ...basic_colors, ...premium_colors };

const colorById = (id) => Object.keys(colors).find(key => colors[key] === id);
const closest = (rgb) => {
    const [tr, tg, tb] = rgb.split(',').map(Number);
    const palette = (usePaidColors && usePaidColors.checked) ? colors : basic_colors;
    let bestKey = null, best = Infinity;
    for (const key in palette) {
        const [r, g, b] = key.split(',').map(Number);
        const d = (tr - r) * (tr - r) + (tg - g) * (tg - g) + (tb - b) * (tb - b);
        if (d < best) { best = d; bestKey = key; }
    }
    return palette[bestKey];
};

const drawTemplate = (template, canvas) => {
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, template.width, template.height);
    const imageData = new ImageData(template.width, template.height);
    for (let x = 0; x < template.width; x++) {
        for (let y = 0; y < template.height; y++) {
            const color = template.data[x][y];
            if (color === 0) continue;
            const i = (y * template.width + x) * 4;
            if (color === -1) {
                imageData.data[i] = 158;
                imageData.data[i + 1] = 189;
                imageData.data[i + 2] = 255;
                imageData.data[i + 3] = 255;
                continue;
            }
            const [r, g, b] = colorById(color).split(',').map(Number);
            imageData.data[i] = r;
            imageData.data[i + 1] = g;
            imageData.data[i + 2] = b;
            imageData.data[i + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
};

const loadTemplates = async (f) => {
    try {
        const templates = await axios.get("/templates");
        if (f) f(templates.data);
    } catch (error) {
        handleError(error);
    };
};

let previewRenderId = 0;


const fetchCanvas = async (txVal, tyVal, pxVal, pyVal, width, height) => {
    const RID = ++previewRenderId;
    const TILE_SIZE = 1000;
    const radius = Math.max(0, parseInt(previewBorder.value, 10) || 0);

    const startX = txVal * TILE_SIZE + pxVal - radius;
    const startY = tyVal * TILE_SIZE + pyVal - radius;
    const displayWidth = width + radius * 2;
    const displayHeight = height + radius * 2;
    const endX = startX + displayWidth;
    const endY = startY + displayHeight;

    const startTileX = Math.floor(startX / TILE_SIZE);
    const startTileY = Math.floor(startY / TILE_SIZE);
    const endTileX = Math.floor((endX - 1) / TILE_SIZE);
    const endTileY = Math.floor((endY - 1) / TILE_SIZE);


    const buffer = document.createElement('canvas');
    buffer.width = displayWidth;
    buffer.height = displayHeight;
    const bctx = buffer.getContext('2d');
    bctx.imageSmoothingEnabled = false;

    const tileTasks = [];
    const concurrency = 8;
    for (let txi = startTileX; txi <= endTileX; txi++) {
        for (let tyi = startTileY; tyi <= endTileY; tyi++) {
            tileTasks.push(async () => {
                try {
                    const { data } = await axios.get('/canvas', { params: { tx: txi, ty: tyi } });
                    if (RID !== previewRenderId) return;
                    const img = new Image();
                    img.src = data.image;
                    await img.decode();
                    if (RID !== previewRenderId) return;

                    const sx = (txi === startTileX) ? startX - txi * TILE_SIZE : 0;
                    const sy = (tyi === startTileY) ? startY - tyi * TILE_SIZE : 0;
                    const ex = (txi === endTileX) ? endX - txi * TILE_SIZE : TILE_SIZE;
                    const ey = (tyi === endTileY) ? endY - tyi * TILE_SIZE : TILE_SIZE;
                    const sw = ex - sx;
                    const sh = ey - sy;
                    const dx = txi * TILE_SIZE + sx - startX;
                    const dy = tyi * TILE_SIZE + sy - startY;

                    bctx.drawImage(img, sx, sy, sw, sh, dx, dy, sw, sh);
                } catch (error) {
                    handleError(error);
                }
            });
        }
    }
    await processInParallel(tileTasks, concurrency);
    if (RID !== previewRenderId) return;
    if (RID !== previewRenderId) return;


    previewCanvas.width = displayWidth;
    previewCanvas.height = displayHeight;
    const ctx = previewCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.drawImage(buffer, 0, 0);


    ctx.globalAlpha = 0.5;
    ctx.drawImage(templateCanvas, radius, radius);
    ctx.globalAlpha = 1;
};


let MT_PREVIEW_RENDER_ID = 0;

function ensureMtPreviewOverlay() {
    let overlay = document.getElementById('mtPreviewOverlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'mtPreviewOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 999;
        display: none; align-items: center; justify-content: center; padding: 24px;
    `;

    const box = document.createElement('div');
    box.id = 'mtPreviewBox';
    box.style.cssText = `
        position: relative; background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius);
        padding: 10px 40px; max-width: 75vw; min-width: 800px; box-shadow: var(--shadow);
        display: flex; flex-direction: column; gap: 8px; max-height: 95vh;
    `;

    const boxcontainer = document.createElement('div');
    boxcontainer.id = 'mtPreviewBoxContainer';
    boxcontainer.style.cssText = `display:flex; flex-direction:column; gap:4px; overflow: auto; max-height: 90vh;`;

    const head = document.createElement('div');
    head.style.cssText = `display:flex; align-items:center; justify-content:space-between; gap:8px;`;

    const title = document.createElement('div');
    title.id = 'mtPreviewTitle';
    title.style.cssText = `color:#fff; font-weight:600;`;

    const close = document.createElement('button');
    close.type = 'button';
    close.innerHTML = '✕';
    close.title = 'Close';
    close.style.cssText = `
        background: var(--bg-2); border: 1px solid var(--border); color:#ddd; padding:6px 10px; border-radius:6px; cursor:pointer;
    `;
    close.addEventListener('click', () => overlay.style.display = 'none');

    head.append(title, close);

    // Inline style for pressed/disabled controls (scoped to overlay)
    let inlineStyle = document.getElementById('mtPreviewInlineStyle');
    if (!inlineStyle) {
        inlineStyle = document.createElement('style');
        inlineStyle.id = 'mtPreviewInlineStyle';
        inlineStyle.textContent = `
            #mtPreviewOverlay .mt-ctrl-group button.pressed { border-color: var(--accent); box-shadow: inset 0 0 0 2px var(--ring);background: var(--accent) !important; }
            #mtPreviewOverlay .mt-ctrl-group.disabled { opacity: .5; }
            #mtPreviewOverlay .mt-ctrl-group.disabled * { pointer-events: none; }
            #mtPreviewOverlay .mt-ctrl-group button img { width: 14px; height: 14px; display:inline-block; }
        `;
        document.head.appendChild(inlineStyle);
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'mtPreviewCanvas';
    canvas.style.cssText = `
        image-rendering: pixelated; height: auto; max-height: 555px; background:#f8f4f0; border-radius: 6px;
        cursor: default;
    `;

    const bottomControls = document.createElement('div');
    bottomControls.id = 'mtPreviewControls';
    bottomControls.style.cssText = `display:flex; align-items:center; gap:3px; flex-wrap: wrap;max-width: 680px;`;

    const btnOverlay = document.createElement('button');
    btnOverlay.id = 'mtToggleOverlay';
    btnOverlay.type = 'button';
    btnOverlay.innerHTML = '<img src="icons/overlay.svg" alt=""/>Overlay';
    btnOverlay.style.cssText = `
        background: var(--bg-2); border:1px solid var(--border); color:#ddd; padding:4px 8px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px; font-size:12px;
    `;

    const btnMismatch = document.createElement('button');
    btnMismatch.id = 'mtToggleMismatch';
    btnMismatch.type = 'button';
    btnMismatch.innerHTML = '<img src="icons/eye.svg" alt=""/>Mismatch';
    btnMismatch.style.cssText = `
        background: var(--bg-2); border:1px solid var(--border); color:#ddd; padding:4px 8px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px; font-size:12px;
    `;



    const btnRefresh = document.createElement('button');
    btnRefresh.id = 'mtRefreshCanvas';
    btnRefresh.type = 'button';
    btnRefresh.innerHTML = '<img src="icons/restart.svg" alt=""/>Refresh';
    btnRefresh.style.cssText = `
        background: var(--bg-2); border:1px solid var(--border); color:#ddd; padding:4px 8px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px; font-size:12px;
    `;



    const overlayScaleWrap = document.createElement('div');
    overlayScaleWrap.style.cssText = 'display:flex; align-items:center; gap:6px; color:#ddd; font-size:12px;';
    const overlayScaleLabel = document.createElement('label');
    overlayScaleLabel.setAttribute('for', 'mtOverlayPixelScale');
    overlayScaleLabel.style.cssText = 'margin:0px;';
    const overlayScalePercent = Math.max(50, Math.min(100, parseInt(localStorage.getItem('wplacer_overlay_pixel_scale') || '100', 10) || 100));
    const overlayScaleLabelText = document.createElement('span');
    overlayScaleLabelText.id = 'mtOverlayPixelScaleLabel';
    overlayScaleLabelText.textContent = `${overlayScalePercent}%`;
    overlayScaleLabel.textContent = '';
    const overlayScaleInput = document.createElement('input');
    overlayScaleInput.type = 'range';
    overlayScaleInput.id = 'mtOverlayPixelScale';
    overlayScaleInput.min = '50';
    overlayScaleInput.max = '100';
    overlayScaleInput.step = '5';
    overlayScaleInput.value = String(overlayScalePercent);
    overlayScaleWrap.append(overlayScaleLabel, overlayScaleInput, overlayScaleLabelText);

    // Heatmap controls
    const btnHeatmap = document.createElement('button');
    btnHeatmap.id = 'mtToggleHeatmap';
    btnHeatmap.type = 'button';
    btnHeatmap.innerHTML = '<img src="icons/heat-map.svg" alt=""/>Heatmap';
    btnHeatmap.style.cssText = `
        background: var(--bg-2); border:1px solid var(--border); color:#ddd; padding:4px 8px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px; font-size:12px;
    `;

    const heatWrap = document.createElement('div');
    heatWrap.id = 'mtHeatWrap';
    heatWrap.style.cssText = 'display:flex; align-items:center; gap:6px; color:#ddd; font-size:12px; min-width:180px;';
    const heatLabelEl = document.createElement('label');
    heatLabelEl.setAttribute('for', 'mtHeatSlider');
    heatLabelEl.style.cssText = 'margin:0px;';
    heatLabelEl.textContent = '';
    const heatSlider = document.createElement('input');
    heatSlider.type = 'range';
    heatSlider.id = 'mtHeatSlider';
    heatSlider.min = '0';
    heatSlider.max = '0';
    heatSlider.step = '1';
    heatSlider.value = '0';
    const heatLabel = document.createElement('span');
    heatLabel.id = 'mtHeatLabel';
    heatLabel.textContent = '0';
    heatWrap.append(heatLabelEl, heatSlider, heatLabel);

    const btnClearHeat = document.createElement('button');
    btnClearHeat.id = 'mtClearHeatmap';
    btnClearHeat.type = 'button';
    btnClearHeat.innerHTML = '<img src="icons/remove.svg" alt=""/>';
    btnClearHeat.style.cssText = `
        background: var(--bg-2); border:1px solid var(--border); color:#f66; padding:4px 8px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px; font-size:12px;
    `;

    // Build compact grouped controls
    const groupStyle = 'display:flex; align-items:center; gap:4px; padding:4px 6px; background: var(--bg-1); border:1px solid var(--border); border-radius:6px;';
    const groupStyleTop = 'display:flex; align-items:center; gap:2px; border-radius:6px;';
    const overlayGroup = document.createElement('div');
    overlayGroup.className = 'mt-ctrl-group overlay';
    overlayGroup.style.cssText = groupStyle;
    // tighten overlay pixel label
    try { overlayScaleWrap.querySelector('label')?.appendChild(document.createTextNode('')); } catch (_) { }
    overlayGroup.append(btnOverlay, overlayScaleWrap);

    const heatGroup = document.createElement('div');
    heatGroup.className = 'mt-ctrl-group heatmap';
    heatGroup.style.cssText = groupStyle;
    heatGroup.append(btnHeatmap, heatWrap, btnClearHeat);

    const mismatchGroup = document.createElement('div');
    mismatchGroup.className = 'mt-ctrl-group mismatch';
    mismatchGroup.style.cssText = groupStyleTop;
    mismatchGroup.append(btnMismatch);

    const refreshGroup = document.createElement('div');
    refreshGroup.className = 'mt-ctrl-group refresh';
    refreshGroup.style.cssText = groupStyleTop;
    refreshGroup.append(btnRefresh);

    // Top controls (above canvas)
    const topControls = document.createElement('div');
    topControls.id = 'mtPreviewTopControls';
    topControls.style.cssText = 'display:flex; align-items:center; gap:4px; flex-wrap: wrap;';
    topControls.append(mismatchGroup, refreshGroup);

    // Apply a slightly tighter layout
    bottomControls.style.gap = '4px';
    bottomControls.append(overlayGroup, heatGroup);

    const stats = document.createElement('div');
    stats.id = 'mtPreviewStats';
    stats.style.cssText = 'color:#ddd; font-size:12px;';


    const palWrap = document.createElement('div');
    palWrap.id = 'mtPreviewPaletteWrap';
    palWrap.style.cssText = 'margin-top:6px;';
    const palTitle = document.createElement('div');
    palTitle.id = 'mtPreviewPaletteTitle';
    palTitle.textContent = 'Remaining colors';
    palTitle.style.cssText = 'color:#ddd; font-size:12px; margin-bottom:4px;';
    const palGrid = document.createElement('div');
    palGrid.id = 'mtPreviewPaletteGrid';
    palGrid.style.cssText = 'display:grid; grid-template-columns: repeat(auto-fill, minmax(44px,1fr)); gap:4px;';
    palWrap.append(palTitle, palGrid);

    const hint = document.createElement('div');
    hint.style.cssText = 'color:#bbb; font-size:12px;';
    hint.textContent = 'Mouse wheel — zoom. Left mouse drag — pan. Esc — close.';

    boxcontainer.append(topControls, canvas, bottomControls, stats, palWrap);
    box.append(head, boxcontainer, hint);
    overlay.append(box);
    document.body.append(overlay);

    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.style.display = 'none'; });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.style.display !== 'none') overlay.style.display = 'none';
    });

    return overlay;
}

async function showManageTemplatePreview(t) {
    const overlay = ensureMtPreviewOverlay();
    const titleEl = document.getElementById('mtPreviewTitle');
    const preview = document.getElementById('mtPreviewCanvas');
    const statsEl = document.getElementById('mtPreviewStats');
    const btnOverlay = document.getElementById('mtToggleOverlay');
    const btnMismatch = document.getElementById('mtToggleMismatch');
    const btnRefresh = document.getElementById('mtRefreshCanvas');
    const btnClearHeat = document.getElementById('mtClearHeatmap');
    const overlayScaleInput = document.getElementById('mtOverlayPixelScale');
    const overlayScaleLabelText = document.getElementById('mtOverlayPixelScaleLabel');
    const palTitleEl = document.getElementById('mtPreviewPaletteTitle');
    const btnHeatmap = document.getElementById('mtToggleHeatmap');
    const heatSlider = document.getElementById('mtHeatSlider');
    const heatLabel = document.getElementById('mtHeatLabel');
    titleEl.textContent = `Preview: ${t.name}`;

    const RID = ++MT_PREVIEW_RENDER_ID;
    const TILE_SIZE = 1000;
    const [txVal, tyVal, pxVal, pyVal] = t.coords.map(Number);
    const width = t.template?.width || 0;
    const height = t.template?.height || 0;

    if (!Number.isFinite(txVal) || !Number.isFinite(tyVal) || !Number.isFinite(pxVal) || !Number.isFinite(pyVal) || width === 0) {
        showMessage("Error", "Template has no image or invalid coordinates.");
        return;
    }

    const startX = txVal * TILE_SIZE + pxVal;
    const startY = tyVal * TILE_SIZE + pyVal;
    const displayWidth = width;
    const displayHeight = height;
    const endX = startX + displayWidth;
    const endY = startY + displayHeight;

    const startTileX = Math.floor(startX / TILE_SIZE);
    const startTileY = Math.floor(startY / TILE_SIZE);
    const endTileX = Math.floor((endX - 1) / TILE_SIZE);
    const endTileY = Math.floor((endY - 1) / TILE_SIZE);

    const buffer = document.createElement('canvas');
    buffer.width = displayWidth;
    buffer.height = displayHeight;
    const bctx = buffer.getContext('2d');
    bctx.imageSmoothingEnabled = false;
    bctx.clearRect(0, 0, displayWidth, displayHeight);

    async function loadTilesIntoBuffer() {
        // clear before refill
        bctx.clearRect(0, 0, displayWidth, displayHeight);
        for (let txi = startTileX; txi <= endTileX; txi++) {
            for (let tyi = startTileY; tyi <= endTileY; tyi++) {


            }
        }
        const tileTasks = [];
        const concurrency = 8;
        for (let txi = startTileX; txi <= endTileX; txi++) {
            for (let tyi = startTileY; tyi <= endTileY; tyi++) {
                tileTasks.push(async () => {
                    const { data } = await axios.get('/canvas', { params: { tx: txi, ty: tyi } });
                    if (RID !== MT_PREVIEW_RENDER_ID) return;

                    const img = new Image();
                    img.src = data.image;
                    await img.decode();
                    if (RID !== MT_PREVIEW_RENDER_ID) return;

                    const sx = (txi === startTileX) ? (startX - txi * TILE_SIZE) : 0;
                    const sy = (tyi === startTileY) ? (startY - tyi * TILE_SIZE) : 0;
                    const ex = (txi === endTileX) ? (endX - txi * TILE_SIZE) : TILE_SIZE;
                    const ey = (tyi === endTileY) ? (endY - tyi * TILE_SIZE) : TILE_SIZE;
                    const sw = ex - sx;
                    const sh = ey - sy;
                    const dx = txi * TILE_SIZE + sx - startX;
                    const dy = tyi * TILE_SIZE + sy - startY;

                    bctx.drawImage(img, sx, sy, sw, sh, dx, dy, sw, sh);
                });
            }
        }
        await processInParallel(tileTasks, concurrency);
    }
    try { await loadTilesIntoBuffer(); if (RID !== MT_PREVIEW_RENDER_ID) return; } catch (error) { handleError(error); return; }

    const SCALE = 4;
    let src = bctx.getImageData(0, 0, displayWidth, displayHeight).data;

    const rgbOfId = (id) => {
        const s = colorById(id);
        if (!s) return null;
        const [r, g, b] = s.split(',').map(n => parseInt(n, 10));
        return [r, g, b];
    };

    let totalTpl = 0, matched = 0;
    for (let y = 0; y < displayHeight; y++) {
        for (let x = 0; x < displayWidth; x++) {
            const id = t.template?.data?.[x]?.[y] ?? 0;
            if (id > 0) {
                totalTpl++;
                const tplRGB = rgbOfId(id);
                const i = (y * displayWidth + x) * 4;
                const br = src[i], bg = src[i + 1], bb = src[i + 2], ba = src[i + 3];
                if (tplRGB && ba === 255 && br === tplRGB[0] && bg === tplRGB[1] && bb === tplRGB[2]) matched++;
            }
        }
    }
    const pct = totalTpl ? (matched / totalTpl) * 100 : 0;
    statsEl.textContent = `Matches: ${matched} / ${totalTpl} (${(Math.round(pct * 100) / 100).toFixed(2)}%)`;


    try {
        const left = new Map();
        for (let y = 0; y < displayHeight; y++) {
            for (let x = 0; x < displayWidth; x++) {
                const id = t.template?.data?.[x]?.[y] ?? 0;
                if (id <= 0) continue;
                const i = (y * displayWidth + x) * 4;
                const br = src[i], bg = src[i + 1], bb = src[i + 2], ba = src[i + 3];
                const tplRGB = rgbOfId(id);
                if (!tplRGB) continue;
                const ok = (ba === 255 && br === tplRGB[0] && bg === tplRGB[1] && bb === tplRGB[2]);
                if (!ok) left.set(id, (left.get(id) || 0) + 1);
            }
        }
        const grid = document.getElementById('mtPreviewPaletteGrid');
        if (grid) {
            grid.innerHTML = '';
            const entries = Array.from(left.entries()).sort((a, b) => (b[1] - a[1]) || (a[0] - b[0]));
            let totalLeft = 0;
            for (const [, cnt] of entries) totalLeft += cnt;
            if (palTitleEl) palTitleEl.textContent = `Remaining colors (${totalLeft})`;
            for (const [cid, cnt] of entries) {
                const rgbKey = Object.keys(colors).find(k => colors[k] === cid);
                const [r, g, b] = (rgbKey || '0,0,0').split(',').map(n => parseInt(n, 10) || 0);
                const textColor = getContrastColor(r, g, b);
                const cell = document.createElement('div');
                cell.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:2px; padding:4px; border:1px solid var(--border); border-radius:6px; background: var(--bg-2)';
                const sw = document.createElement('div');
                sw.style.cssText = `width:28px; height:20px; border-radius:4px; background: rgb(${r},${g},${b}); color:${textColor}; display:flex; align-items:center; justify-content:center; font-size:11px;`;
                sw.textContent = `#${cid}`;
                const label = document.createElement('div');
                label.style.cssText = 'font-size:11px; color:#ddd;';
                label.textContent = String(cnt);
                cell.append(sw, label);
                grid.appendChild(cell);
            }
            if (entries.length === 0) {
                if (palTitleEl) palTitleEl.textContent = 'Remaining colors (0)';
                const none = document.createElement('div');
                none.style.cssText = 'color:#aaa; font-size:12px;';
                none.textContent = 'No remaining pixels.';
                grid.appendChild(none);
            }
        }
    } catch (_) { }

    preview.width = displayWidth * SCALE;
    preview.height = displayHeight * SCALE;

    const maxHeight = 555;
    const maxWidth = 700;
    const canvasHeight = displayHeight * SCALE;
    const canvasWidth = displayWidth * SCALE;

    const scaleByHeight = maxHeight / canvasHeight;
    const scaleByWidth = maxWidth / canvasWidth;

    const scaleFactor = Math.min(scaleByHeight, scaleByWidth);

    if (scaleFactor <= 1) {
        preview.style.width = 'max-content';
    } else {
        const scaledWidth = canvasWidth * scaleFactor;
        preview.style.width = `${scaledWidth}px`;
    }

    const pctx = preview.getContext('2d');
    pctx.imageSmoothingEnabled = false;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const initialOverlayScale = Math.max(0.5, Math.min(1, ((parseInt((overlayScaleInput && overlayScaleInput.value) || '100', 10) || 100) / 100)));
    const STATE = {
        w: displayWidth,
        h: displayHeight,
        SCALE,
        buffer,
        src,
        template: t.template,
        zoom: 1,
        maxZoom: Math.max(displayWidth, displayHeight) + 2,
        viewX: 0,
        viewY: 0,
        dragging: false,
        dragStartX: 0,
        dragStartY: 0,
        viewStartX: 0,
        viewStartY: 0,
        showOverlay: true,
        highlightMismatch: false,
        paintTransparent: !!t.paintTransparentPixels,
        overlayPixelScale: initialOverlayScale,
        showHeatmap: false,
        heatCount: 0,
        heatMax: 0,
        heatData: []
    };

    function drawOverlayMiniFit() {
        const MINI = Math.max(1, Math.floor(STATE.SCALE * STATE.overlayPixelScale));
        const OFF = Math.floor((STATE.SCALE - MINI) / 2);
        for (let y = 0; y < STATE.h; y++) {
            for (let x = 0; x < STATE.w; x++) {
                const id = STATE.template?.data?.[x]?.[y] ?? 0;
                const i = (y * STATE.w + x) * 4;
                const br = STATE.src[i], bg = STATE.src[i + 1], bb = STATE.src[i + 2], ba = STATE.src[i + 3];
                if (id > 0) {
                    const tplRGB = rgbOfId(id);
                    if (!tplRGB) continue;
                    if (ba === 255 && br === tplRGB[0] && bg === tplRGB[1] && bb === tplRGB[2]) continue;
                    const dx = x * STATE.SCALE + OFF;
                    const dy = y * STATE.SCALE + OFF;
                    pctx.fillStyle = `rgb(${tplRGB[0]},${tplRGB[1]},${tplRGB[2]})`;
                    pctx.fillRect(dx, dy, MINI, MINI);
                } else if (STATE.paintTransparent) {

                    if (ba !== 0) {
                        const dx = x * STATE.SCALE + OFF;
                        const dy = y * STATE.SCALE + OFF;
                        pctx.fillStyle = 'rgba(0,0,0,0.6)';
                        pctx.fillRect(dx, dy, MINI, MINI);
                    }
                }
            }
        }
    }

    function drawOverlayMiniZoom(sx, sy, vw, vh, cellW, cellH) {
        const miniW = Math.max(1, Math.floor(cellW * STATE.overlayPixelScale));
        const miniH = Math.max(1, Math.floor(cellH * STATE.overlayPixelScale));
        const offX = Math.floor((cellW - miniW) / 2);
        const offY = Math.floor((cellH - miniH) / 2);
        for (let y = sy; y < sy + vh; y++) {
            for (let x = sx; x < sx + vw; x++) {
                const id = STATE.template?.data?.[x]?.[y] ?? 0;
                const i = (y * STATE.w + x) * 4;
                const br = STATE.src[i], bg = STATE.src[i + 1], bb = STATE.src[i + 2], ba = STATE.src[i + 3];
                if (id > 0) {
                    const tplRGB = rgbOfId(id);
                    if (!tplRGB) continue;
                    if (ba === 255 && br === tplRGB[0] && bg === tplRGB[1] && bb === tplRGB[2]) continue;
                    const cx = (x - sx) * cellW + offX;
                    const cy = (y - sy) * cellH + offY;
                    pctx.fillStyle = `rgb(${tplRGB[0]},${tplRGB[1]},${tplRGB[2]})`;
                    pctx.fillRect(Math.floor(cx), Math.floor(cy), Math.floor(miniW), Math.floor(miniH));
                } else if (STATE.paintTransparent) {
                    if (ba !== 0) {
                        const cx = (x - sx) * cellW + offX;
                        const cy = (y - sy) * cellH + offY;
                        pctx.fillStyle = 'rgba(0,0,0,0.6)';
                        pctx.fillRect(Math.floor(cx), Math.floor(cy), Math.floor(miniW), Math.floor(miniH));
                    }
                }
            }
        }
    }

    function drawOverlayRedFit() {
        pctx.fillStyle = '#ff0000';
        for (let y = 0; y < STATE.h; y++) {
            for (let x = 0; x < STATE.w; x++) {
                const id = STATE.template?.data?.[x]?.[y] ?? 0;
                const i = (y * STATE.w + x) * 4;
                const br = STATE.src[i], bg = STATE.src[i + 1], bb = STATE.src[i + 2], ba = STATE.src[i + 3];
                if (id > 0) {
                    const tplRGB = rgbOfId(id);
                    if (!tplRGB) continue;
                    if (ba === 255 && br === tplRGB[0] && bg === tplRGB[1] && bb === tplRGB[2]) continue;
                    pctx.fillRect(x * STATE.SCALE, y * STATE.SCALE, STATE.SCALE, STATE.SCALE);
                } else if (STATE.paintTransparent) {
                    if (ba !== 0) pctx.fillRect(x * STATE.SCALE, y * STATE.SCALE, STATE.SCALE, STATE.SCALE);
                }
            }
        }
    }

    function drawOverlayRedZoom(sx, sy, vw, vh, cellW, cellH) {
        pctx.fillStyle = '#ff0000';
        for (let y = sy; y < sy + vh; y++) {
            for (let x = sx; x < sx + vw; x++) {
                const id = STATE.template?.data?.[x]?.[y] ?? 0;
                const i = (y * STATE.w + x) * 4;
                const br = STATE.src[i], bg = STATE.src[i + 1], bb = STATE.src[i + 2], ba = STATE.src[i + 3];
                let mismatch = false;
                if (id > 0) {
                    const tplRGB = rgbOfId(id);
                    if (!tplRGB) continue;
                    mismatch = !(ba === 255 && br === tplRGB[0] && bg === tplRGB[1] && bb === tplRGB[2]);
                } else if (STATE.paintTransparent) {
                    mismatch = (ba !== 0);
                } else {
                    mismatch = false;
                }
                if (!mismatch) continue;
                const cx = (x - sx) * cellW;
                const cy = (y - sy) * cellH;
                pctx.fillRect(Math.floor(cx), Math.floor(cy), Math.ceil(cellW), Math.ceil(cellH));
            }
        }
    }



    function drawFit() {
        pctx.clearRect(0, 0, preview.width, preview.height);

        pctx.drawImage(STATE.buffer, 0, 0, STATE.w, STATE.h, 0, 0, preview.width, preview.height);
        if (STATE.showHeatmap) drawHeatmapFit();
        else if (STATE.highlightMismatch) drawOverlayRedFit();
        else if (STATE.showOverlay) drawOverlayMiniFit();
    }

    function drawZoom() {
        let vw = Math.max(1, Math.round(STATE.w / STATE.zoom));
        let vh = Math.max(1, Math.round(STATE.h / STATE.zoom));
        if (STATE.zoom >= STATE.maxZoom) { vw = 1; vh = 1; }
        const cellW = preview.width / vw;
        const cellH = preview.height / vh;

        STATE.viewX = clamp(STATE.viewX, 0, STATE.w - vw);
        STATE.viewY = clamp(STATE.viewY, 0, STATE.h - vh);
        const sx = Math.floor(STATE.viewX);
        const sy = Math.floor(STATE.viewY);

        pctx.clearRect(0, 0, preview.width, preview.height);

        pctx.drawImage(STATE.buffer, sx, sy, vw, vh, 0, 0, preview.width, preview.height);
        if (STATE.showHeatmap) drawHeatmapZoom(sx, sy, vw, vh, cellW, cellH);
        else if (STATE.highlightMismatch) drawOverlayRedZoom(sx, sy, vw, vh, cellW, cellH);
        else if (STATE.showOverlay) drawOverlayMiniZoom(sx, sy, vw, vh, cellW, cellH);
    }

    function render() {
        if (STATE.zoom <= 1.0001) {
            preview.style.cursor = 'grab';
            drawFit();
        } else {
            preview.style.cursor = STATE.dragging ? 'grabbing' : 'grab';
            drawZoom();
        }
    }

    function canvasPoint(e) {
        const r = preview.getBoundingClientRect();
        const cx = (e.clientX - r.left) * (preview.width / r.width);
        const cy = (e.clientY - r.top) * (preview.height / r.height);
        return [cx, cy];
    }

    function zoomAround(cx, cy, multiplier) {
        let vw = Math.max(1, Math.round(STATE.w / STATE.zoom));
        let vh = Math.max(1, Math.round(STATE.h / STATE.zoom));
        const cellW = preview.width / vw;
        const cellH = preview.height / vh;
        const worldX = STATE.viewX + cx / cellW;
        const worldY = STATE.viewY + cy / cellH;

        STATE.zoom = clamp(STATE.zoom * multiplier, 1, STATE.maxZoom);

        vw = Math.max(1, Math.round(STATE.w / STATE.zoom));
        vh = Math.max(1, Math.round(STATE.h / STATE.zoom));
        const cellW2 = preview.width / vw;
        const cellH2 = preview.height / vh;

        STATE.viewX = worldX - cx / cellW2;
        STATE.viewY = worldY - cy / cellH2;

        render();
    }

    preview.onwheel = (e) => {
        e.preventDefault();
        const [cx, cy] = canvasPoint(e);
        const base = 1.12;
        const steps = Math.max(1, Math.min(6, Math.abs(e.deltaY) / 60));
        const mul = Math.pow(base, steps);
        if (e.deltaY < 0) zoomAround(cx, cy, mul);
        else zoomAround(cx, cy, 1 / mul);
    };

    preview.onmousedown = (e) => {
        if (e.button !== 0) return;
        if (STATE.zoom <= 1.0001) return;
        const [cx, cy] = canvasPoint(e);
        STATE.dragging = true;
        preview.style.cursor = 'grabbing';
        STATE.dragStartX = cx;
        STATE.dragStartY = cy;
        STATE.viewStartX = STATE.viewX;
        STATE.viewStartY = STATE.viewY;
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);
        window.addEventListener('mouseleave', onDragEnd);
    };

    function onDragMove(e) {
        if (!STATE.dragging) return;
        let vw = Math.max(1, Math.round(STATE.w / STATE.zoom));
        let vh = Math.max(1, Math.round(STATE.h / STATE.zoom));
        const cellW = preview.width / vw;
        const cellH = preview.height / vh;

        const [cx, cy] = canvasPoint(e);
        const dx = cx - STATE.dragStartX;
        const dy = cy - STATE.dragStartY;

        STATE.viewX = clamp(STATE.viewStartX - dx / cellW, 0, STATE.w - vw);
        STATE.viewY = clamp(STATE.viewStartY - dy / cellH, 0, STATE.h - vh);

        render();
    }

    function onDragEnd() {
        STATE.dragging = false;
        preview.style.cursor = 'grab';
        window.removeEventListener('mousemove', onDragMove);
        window.removeEventListener('mouseup', onDragEnd);
        window.removeEventListener('mouseleave', onDragEnd);
    }

    function updateButtons() {
        // Update aria-pressed and pressed class
        const setState = (el, on) => { if (!el) return; el.setAttribute('aria-pressed', on ? 'true' : 'false'); if (on) el.classList.add('pressed'); else el.classList.remove('pressed'); };
        setState(btnOverlay, STATE.showOverlay);
        setState(btnMismatch, STATE.highlightMismatch);
        const btnHeatmap = document.getElementById('mtToggleHeatmap');
        setState(btnHeatmap, STATE.showHeatmap);
    }

    btnOverlay.onclick = () => { STATE.showOverlay = !STATE.showOverlay; updateButtons(); render(); };
    btnMismatch.onclick = () => { STATE.highlightMismatch = !STATE.highlightMismatch; updateButtons(); render(); };
    if (btnHeatmap) btnHeatmap.onclick = () => { if (STATE.heatMax === 0) return; STATE.showHeatmap = !STATE.showHeatmap; updateButtons(); render(); };

    if (overlayScaleInput) overlayScaleInput.addEventListener('input', () => {
        let v = parseInt(overlayScaleInput.value, 10);
        if (!Number.isFinite(v)) v = 100;
        v = Math.max(50, Math.min(100, v));
        overlayScaleInput.value = String(v);
        if (overlayScaleLabelText) overlayScaleLabelText.textContent = `${v}%`;
        localStorage.setItem('wplacer_overlay_pixel_scale', String(v));
        STATE.overlayPixelScale = v / 100;
        render();
    });

    async function recalcStatsAndPalette() {
        // matches
        let totalTpl = 0, matched = 0;
        for (let y = 0; y < displayHeight; y++) {
            for (let x = 0; x < displayWidth; x++) {
                const id = t.template?.data?.[x]?.[y] ?? 0;
                if (id > 0) {
                    totalTpl++;
                    const tplRGB = rgbOfId(id);
                    const i = (y * displayWidth + x) * 4;
                    const br = src[i], bg = src[i + 1], bb = src[i + 2], ba = src[i + 3];
                    if (tplRGB && ba === 255 && br === tplRGB[0] && bg === tplRGB[1] && bb === tplRGB[2]) matched++;
                }
            }
        }
        const pct = totalTpl ? (matched / totalTpl) * 100 : 0;
        statsEl.textContent = `Matches: ${matched} / ${totalTpl} (${(Math.round(pct * 100) / 100).toFixed(2)}%)`;

        // remaining palette
        try {
            const left = new Map();
            for (let y = 0; y < displayHeight; y++) {
                for (let x = 0; x < displayWidth; x++) {
                    const id = t.template?.data?.[x]?.[y] ?? 0;
                    if (id <= 0) continue;
                    const i = (y * displayWidth + x) * 4;
                    const br = src[i], bg = src[i + 1], bb = src[i + 2], ba = src[i + 3];
                    const tplRGB = rgbOfId(id);
                    if (!tplRGB) continue;
                    const ok = (ba === 255 && br === tplRGB[0] && bg === tplRGB[1] && bb === tplRGB[2]);
                    if (!ok) left.set(id, (left.get(id) || 0) + 1);
                }
            }
            const grid = document.getElementById('mtPreviewPaletteGrid');
            if (grid) {
                grid.innerHTML = '';
                const entries = Array.from(left.entries()).sort((a, b) => (b[1] - a[1]) || (a[0] - b[0]));
                let totalLeft = 0;
                for (const [cid, cnt] of entries) totalLeft += cnt;
                if (palTitleEl) palTitleEl.textContent = `Remaining colors (${totalLeft})`;
                for (const [cid, cnt] of entries) {
                    const rgbKey = Object.keys(colors).find(k => colors[k] === cid);
                    const [r, g, b] = (rgbKey || '0,0,0').split(',').map(n => parseInt(n, 10) || 0);
                    const textColor = getContrastColor(r, g, b);
                    const cell = document.createElement('div');
                    cell.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:2px; padding:4px; border:1px solid var(--border); border-radius:6px; background: var(--bg-2)';
                    const sw = document.createElement('div');
                    sw.style.cssText = `width:28px; height:20px; border-radius:4px; background: rgb(${r},${g},${b}); color:${textColor}; display:flex; align-items:center; justify-content:center; font-size:11px;`;
                    sw.textContent = `#${cid}`;
                    const label = document.createElement('div');
                    label.style.cssText = 'font-size:11px; color:#ddd;';
                    label.textContent = String(cnt);
                    cell.append(sw, label);
                    grid.appendChild(cell);
                }
                if (entries.length === 0) {
                    if (palTitleEl) palTitleEl.textContent = 'Remaining colors (0)';
                    const none = document.createElement('div');
                    none.style.cssText = 'color:#aaa; font-size:12px;';
                    none.textContent = 'No remaining pixels.';
                    grid.appendChild(none);
                }
            }
        } catch (_) { }
    }

    // --- Heatmap logic ---
    async function loadHeatData(templateId) {
        try {
            const url = `/data/heat_maps/${templateId}.jsonl`;
            const resp = await fetch(url, { cache: 'no-store' });
            if (!resp.ok) return [];
            const text = await resp.text();
            const lines = text.split(/\r?\n/).filter(Boolean);
            // Latest entries are at the end of file because we append
            const arr = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
            return arr;
        } catch { return []; }
    }

    function drawHeatmapFit() {
        // dark background
        pctx.fillStyle = 'black';
        pctx.fillRect(0, 0, preview.width, preview.height);
        const MINI = STATE.SCALE; // draw full cells
        const count = Math.max(0, Math.min(STATE.heatCount, STATE.heatData.length));
        if (count === 0) return;
        // take last N entries
        const start = STATE.heatData.length - count;
        const used = STATE.heatData.slice(start);
        for (let i = 0; i < used.length; i++) {
            const rec = used[i];
            const x = (rec['Px X'] | 0), y = (rec['Px Y'] | 0);
            const ageIdx = used.length - 1 - i; // 0 = newest, grow older
            const alpha = 1.0 - (ageIdx / Math.max(1, used.length - 1)) * 0.9; // 1.0 .. 0.1
            pctx.fillStyle = `rgba(255,0,0,${alpha.toFixed(3)})`;
            pctx.fillRect(x * MINI, y * MINI, MINI, MINI);
        }
    }

    function drawHeatmapZoom(sx, sy, vw, vh, cellW, cellH) {
        // dark background
        pctx.fillStyle = 'black';
        pctx.fillRect(0, 0, preview.width, preview.height);
        const count = Math.max(0, Math.min(STATE.heatCount, STATE.heatData.length));
        if (count === 0) return;
        const start = STATE.heatData.length - count;
        const used = STATE.heatData.slice(start);
        for (let i = 0; i < used.length; i++) {
            const rec = used[i];
            const x = (rec['Px X'] | 0), y = (rec['Px Y'] | 0);
            if (x < sx || y < sy || x >= sx + vw || y >= sy + vh) continue;
            const ageIdx = used.length - 1 - i;
            const alpha = 1.0 - (ageIdx / Math.max(1, used.length - 1)) * 0.9; // 1.0 .. 0.1
            const cx = (x - sx) * cellW;
            const cy = (y - sy) * cellH;
            pctx.fillStyle = `rgba(255,0,0,${alpha.toFixed(3)})`;
            pctx.fillRect(Math.floor(cx), Math.floor(cy), Math.ceil(cellW), Math.ceil(cellH));
        }
    }

    // expose heat reload
    async function reloadHeat() {
        try {
            const id = String(t.id || t._id || t.__id || '');
            let templateId = id;
            if (!templateId) {
                // Try to find id from list API if not present in object
                try {
                    const { data } = await axios.get('/templates');
                    const entry = Object.entries(data || {}).find(([k, v]) => v && v.name === t.name && JSON.stringify(v.coords) === JSON.stringify(t.coords));
                    if (entry) templateId = entry[0];
                } catch (_) { }
            }
            if (!templateId) return;
            const data = await loadHeatData(templateId);
            STATE.heatData = data;
            STATE.heatMax = data.length;
            STATE.heatCount = data.length;
            const slider = document.getElementById('mtHeatSlider');
            const label = document.getElementById('mtHeatLabel');
            const heatGroupEl = document.querySelector('.mt-ctrl-group.heatmap');
            if (heatGroupEl) {
                if (STATE.heatMax === 0) heatGroupEl.classList.add('disabled'); else heatGroupEl.classList.remove('disabled');
            }
            if (slider) {
                slider.max = String(STATE.heatMax);
                slider.value = String(STATE.heatCount);
                if (label) label.textContent = String(STATE.heatCount);
                slider.oninput = () => {
                    let v = parseInt(slider.value, 10);
                    if (!Number.isFinite(v)) v = 0;
                    v = Math.max(0, Math.min(STATE.heatMax, v));
                    slider.value = String(v);
                    STATE.heatCount = v;
                    if (label) label.textContent = String(v);
                    render();
                };
            }
        } catch (_) { }
    }
    // Init heat controls
    await reloadHeat();

    async function refreshCanvas() {
        if (btnRefresh) { btnRefresh.disabled = true; btnRefresh.textContent = 'Refreshing...'; }
        try {
            await loadTilesIntoBuffer();
            src = bctx.getImageData(0, 0, displayWidth, displayHeight).data;
            STATE.src = src;
            STATE.buffer = buffer;
            await recalcStatsAndPalette();
            await reloadHeat();
            render();
        } catch (e) {
            handleError(e);
        } finally {
            if (btnRefresh) { btnRefresh.disabled = false; btnRefresh.textContent = 'Refresh canvas'; }
        }
    }

    if (btnRefresh) btnRefresh.onclick = () => { refreshCanvas(); };

    if (btnClearHeat) btnClearHeat.onclick = async () => {
        try {
            const id = String(t.id || t._id || t.__id || '');
            let templateId = id;
            if (!templateId) {
                try {
                    const { data } = await axios.get('/templates');
                    const entry = Object.entries(data || {}).find(([k, v]) => v && v.name === t.name && JSON.stringify(v.coords) === JSON.stringify(t.coords));
                    if (entry) templateId = entry[0];
                } catch (_) { }
            }
            if (!templateId) return;
            showConfirmation('Clear heatmap', 'Are you sure you want to clear painting history for this template?', async () => {
                try {
                    await axios.delete(`/template/${templateId}/heatmap`);
                    await reloadHeat();
                    render();
                    showMessage('Heatmap', 'Painting history cleared.');
                } catch (e) { handleError(e); }
            });
        } catch (e) { handleError(e); }
    };



    updateButtons();
    render();
    overlay.style.display = 'flex';
}






const nearestimgdecoder = (imageData, width, height) => {
    const d = imageData.data;
    const matrix = Array.from({ length: width }, () => Array(height).fill(0));
    let ink = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const a = d[i + 3];
            if (a === 255) {
                const r = d[i], g = d[i + 1], b = d[i + 2];
                const rgb = `${r},${g},${b}`;
                if (rgb === "158,189,255") matrix[x][y] = -1;
                else {
                    const id = colors[rgb] && usePaidColors.checked ? colors[rgb] : closest(rgb);
                    matrix[x][y] = id;
                }
                ink++;
            } else {
                matrix[x][y] = 0;
            }
        }
    }
    return { matrix, ink };
};

let currentTemplate = { width: 0, height: 0, data: [] };

const processImageFile = (file, callback) => {
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = async () => {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const { matrix, ink } = nearestimgdecoder(imageData, canvas.width, canvas.height);

                const template = { width: canvas.width, height: canvas.height, ink, data: matrix };
                canvas.remove();
                callback(template);
            };
        };
        reader.readAsDataURL(file);
    }
};

const processEvent = (soft = false) => {

    if (usePaidColors && usePaidColors.__editHandler) {
        try { usePaidColors.removeEventListener('change', usePaidColors.__editHandler); } catch (_) { }
        usePaidColors.__editHandler = null;
    }
    currentTemplate = { width: 0, height: 0, data: [] };
    if (!soft && templateCanvas) {
        const c = templateCanvas.getContext("2d");
        c.clearRect(0, 0, templateCanvas.width, templateCanvas.height);
        templateCanvas.width = 0;
        templateCanvas.height = 0;
    }
    if (previewCanvas) {
        if (!soft) {
            const c2 = previewCanvas.getContext("2d");
            c2.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            previewCanvas.style.display = "none";
        }
    }
    const list = document.getElementById('paletteList');
    const uniqueEl = document.getElementById('paletteUnique');
    const totalEl = document.getElementById('paletteTotal');
    if (!soft && list) list.innerHTML = '';
    if (!soft && uniqueEl) uniqueEl.textContent = '0';
    if (!soft && totalEl) totalEl.textContent = '0';
    if (!soft) details.style.display = "none";
    if (!soft) size.textContent = '';
    if (!soft) ink.textContent = '0';

    const file = convertInput.files[0];
    if (!file) return;
    templateName.value = file.name.replace(/\.[^/.]+$/, "");
    processImageFile(file, (template) => {
        currentTemplate = template;

        drawTemplate(template, templateCanvas);
        size.innerHTML = `${template.width}x${template.height}px`;
        ink.innerHTML = template.ink;
        details.style.display = "block";
        renderPalette(template);
        const sel = document.getElementById('userSortMode');
        if (sel) { sel.value = 'priority'; sel.dispatchEvent(new Event('change', { bubbles: true })); }

    });
};

convertInput.addEventListener('change', processEvent);
if (usePaidColors) {
    usePaidColors.addEventListener('change', () => {
        if (!convertInput?.files?.length) return;

        processEvent(true);
    });
}


previewCanvasButton?.addEventListener('click', async () => {
    const txVal = parseInt(tx.value, 10);
    const tyVal = parseInt(ty.value, 10);
    const pxVal = parseInt(px.value, 10);
    const pyVal = parseInt(py.value, 10);
    if (isNaN(txVal) || isNaN(tyVal) || isNaN(pxVal) || isNaN(pyVal) || currentTemplate.width === 0) {
        showMessage("Error", "Please convert an image and enter valid coordinates before previewing.");
        return;
    }
    try {
        previewCanvasButton.disabled = true;
        previewCanvasButton.innerHTML = '<img src="icons/eye.svg" alt="" /> Loading...';
        await fetchCanvas(txVal, tyVal, pxVal, pyVal, currentTemplate.width, currentTemplate.height);
        previewCanvas.style.display = "block";
    } catch (e) {
        handleError(e);
    } finally {
        previewCanvasButton.disabled = false;
        previewCanvasButton.innerHTML = '<img src="icons/eye.svg" alt="" /> Preview Canvas';
    }
});

canBuyMaxCharges.addEventListener('change', () => {
    if (canBuyMaxCharges.checked) {
        canBuyCharges.checked = false;
        if (autoBuyNeededColors) autoBuyNeededColors.checked = false;
    }
});

canBuyCharges.addEventListener('change', () => {
    if (canBuyCharges.checked) {
        canBuyMaxCharges.checked = false;
        if (autoBuyNeededColors) autoBuyNeededColors.checked = false;
    }
});

autoBuyNeededColors?.addEventListener('change', () => {
    if (autoBuyNeededColors.checked) {
        if (typeof usePaidColors !== 'undefined' && usePaidColors && !usePaidColors.checked) {
            autoBuyNeededColors.checked = false;
            showMessage("Warning", "Enable 'Use premium (paid) colors' to auto-purchase premium colors.");
            return;
        }
        canBuyMaxCharges.checked = false;
        canBuyCharges.checked = false;
    }
});


if (typeof usePaidColors !== 'undefined' && usePaidColors) {
    usePaidColors.addEventListener('change', () => {
        const on = !!usePaidColors.checked;
        if (!on && autoBuyNeededColors) autoBuyNeededColors.checked = false;
    });
}

// Toggle heatmap limit visibility
if (heatmapEnabled && heatmapLimitWrap) {
    heatmapEnabled.addEventListener('change', () => {
        heatmapLimitWrap.style.display = heatmapEnabled.checked ? '' : 'none';
    });
}

const resetTemplateForm = () => {
    killPreviewPipelines()
    templateForm.reset();
    if (convertInput) convertInput.value = '';
    templateFormTitle.textContent = "Add Template";
    submitTemplate.innerHTML = '<img src="icons/addTemplate.svg">Add Template';
    delete templateForm.dataset.editId;
    details.style.display = "none";
    previewCanvas.style.display = "none";
    editTmpltMsg.style.display = "none";
    currentTemplate = { width: 0, height: 0, data: [] };
    if (heatmapLimitWrap) heatmapLimitWrap.style.display = 'none';
};

templateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isEditMode = !!templateForm.dataset.editId;

    if (!isEditMode && (!currentTemplate || currentTemplate.width === 0)) {
        showMessage("Error", "Please convert an image before creating a template.");
        return;
    }
    const selectedUsers = Array.from(document.querySelectorAll('input[name="user_checkbox"]:checked')).map(cb => cb.value);
    if (selectedUsers.length === 0) {
        showMessage("Error", "Please select at least one user.");
        return;
    }

    const data = {
        templateName: templateName.value,
        coords: [tx.value, ty.value, px.value, py.value].map(Number),
        userIds: selectedUsers,
        canBuyCharges: !!canBuyCharges.checked,
        canBuyMaxCharges: !!canBuyMaxCharges.checked,
        autoBuyNeededColors: !!autoBuyNeededColors?.checked && !!(usePaidColors?.checked),
        antiGriefMode: !!antiGriefMode.checked,
        skipPaintedPixels: !!skipPaintedPixels.checked,
        outlineMode: !!outlineMode.checked,
        paintTransparentPixels: !!paintTransparent.checked,
        heatmapEnabled: !!(heatmapEnabled && heatmapEnabled.checked),
        heatmapLimit: Math.max(1, Math.floor(Number(heatmapLimit && heatmapLimit.value ? heatmapLimit.value : 10000))),
        autoStart: !!autoStart.checked
    };

    if (currentTemplate && currentTemplate.width > 0) {
        data.template = currentTemplate;
    }

    try {
        if (isEditMode) {
            await axios.put(`/template/edit/${templateForm.dataset.editId}`, data);
            showMessage("Success", "Template updated!");
        } else {
            await axios.post('/template', data);
            showMessage("Success", "Template created!");
        }
        resetTemplateForm();
        openManageTemplates.click();
    } catch (error) {
        handleError(error);
    };
});
startAll.addEventListener('click', async () => {
    // Always ask for confirmation before starting all templates
    showConfirmation('Start all templates', 'Are you sure you want to start all templates?', async () => {
        for (const child of templateList.children) {
            try {
                await axios.put(`/template/${child.id}`, { running: true });
            } catch (error) {
                handleError(error);
            };
        };
        showMessage("Success", "Finished! Check console for details.");
        openManageTemplates.click();
    });
    if (typeof messageBoxConfirm !== 'undefined' && messageBoxConfirm) messageBoxConfirm.textContent = 'Start';
    if (typeof messageBoxCancel !== 'undefined' && messageBoxCancel) messageBoxCancel.textContent = 'Cancel';
    return;
});
stopAll.addEventListener('click', async () => {
    for (const child of templateList.children) {
        try {
            await axios.put(`/template/${child.id}`, { running: false });
        } catch (error) {
            handleError(error);
        };
    };
    showMessage("Success", "Finished! Check console for details.");
    openManageTemplates.click();
});



let currentTab = main;
const changeTab = (el) => {
    if (currentTab === settings && typeof MODE_PREVIEW !== 'undefined' && MODE_PREVIEW.stopAll) {
        MODE_PREVIEW.stopAll();
    }
    if (currentTab === queuePreview) {
        try { stopQueueAutoRefresh(); } catch (_) { }
    }
    if (currentTab === manageTemplates && templateUpdateInterval) {
        clearInterval(templateUpdateInterval);
        templateUpdateInterval = null;
    }

    currentTab.style.display = "none";
    el.style.display = "block";
    currentTab = el;

    if (currentTab === settings && typeof MODE_PREVIEW !== 'undefined' && MODE_PREVIEW.start) {
        setTimeout(() => {
            const ref = document.getElementById('modeReference');
            if (ref && MODE_PREVIEW.drawReference) MODE_PREVIEW.drawReference(ref);
            document.querySelectorAll('.mode-preview[data-mode]').forEach(cv => MODE_PREVIEW.start(cv));
        }, 50);
    }

    if (currentTab === colorsManager) {
        initColorsManager().catch(console.error);
    }
    if (currentTab === flagsManager) {
        initFlagsManager().catch(console.error);
    }




    function applyFlagsCacheToState() {
        try {
            if (!FLAGS_CACHE?.report) return false;
            (FLAGS_CACHE.report || []).forEach(r => {
                if (!r || !r.userId) return;
                USERS_FLAG_STATE[String(r.userId)] = {
                    name: r.name,
                    flagsBitmap: r.flagsBitmap,
                    equippedFlag: (r.equippedFlag | 0),
                    droplets: (r.droplets | 0)
                };
            });
            if (flagsLastCheckLabel && FLAGS_CACHE?.ts) flagsLastCheckLabel.textContent = new Date(FLAGS_CACHE.ts).toLocaleString();
            return true;
        } catch (_) { return false; }
    }

    async function initFlagsManager() {
        if (FLAGS_INIT) return;
        FLAGS_INIT = true;
        try { if (FLAGS_CACHE?.ts) flagsLastCheckLabel.textContent = new Date(FLAGS_CACHE.ts).toLocaleString(); } catch (_) { }

        // load flags json
        try {
            const { data } = await axios.get('/flags.json');
            if (Array.isArray(data)) FLAGS_LIST = data;
        } catch (_) { }

        // try applying cache on tab open
        const hadCache = applyFlagsCacheToState();
        buildFlagsCatalog();
        if (hadCache && CURRENT_SELECTED_FLAG != null) {
            try { renderFlagDetails(CURRENT_SELECTED_FLAG); } catch (_) { }
        }

        try {
            await loadUsersColorState(true);
        } catch (_) { }
        try { buildFlagsCatalog(); } catch (_) { }

        // click delegation like Colors
        flagsAllList?.addEventListener('click', (e) => {
            const art = e.target.closest('.palette-item');
            if (!art) return;
            const fid = parseInt(art.getAttribute('data-flag-id'), 10);
            if (Number.isFinite(fid)) selectFlag(fid);
            // highlight selected like Colors
            flagsAllList.querySelectorAll('.palette-item.selected').forEach(el => el.classList.remove('selected'));
            art.classList.add('selected');
        });

        try {
            if (!COLORS_CACHE) {
                await loadUsersColorState(false);
                try { buildFlagsCatalog(); } catch (_) { }
            }
        } catch (_) { }

        $("checkFlagsAll")?.addEventListener('click', async () => {
            let timer = null;
            try {
                const btn = document.getElementById('checkFlagsAll');
                if (btn) { btn.disabled = true; btn.textContent = 'Checking...'; }

                const updateProgress = async () => {
                    try {
                        const { data } = await axios.get('/users/flags-check/progress');
                        const total = data?.total || 0;
                        const completed = data?.completed || 0;
                        if (data?.active && total > 0 && btn) btn.textContent = `Checking... ${completed}/${total}`;
                    } catch (_) { }
                };
                timer = setInterval(updateProgress, 500);
                updateProgress().catch(() => { });

                const { data } = await axios.post('/users/flags-check');
                const nowTs = data?.ts || Date.now();
                try {
                    const existing = (COLORS_CACHE?.report || []).reduce((m, r) => { if (r?.userId) m[String(r.userId)] = r; return m; }, {});
                    for (const r of (data?.report || [])) {
                        const prev = existing[String(r.userId)] || { userId: String(r.userId), name: r.name };
                        existing[String(r.userId)] = { ...prev, flagsBitmap: r.flagsBitmap, equippedFlag: r.equippedFlag, droplets: r.droplets ?? prev.droplets };
                    }
                    COLORS_CACHE = { ts: nowTs, report: Object.values(existing) };
                    saveColorsCache();
                } catch (_) { }
                FLAGS_CACHE = { ts: nowTs, report: data?.report || [] };
                saveFlagsCache();
                if (flagsLastCheckLabel) flagsLastCheckLabel.textContent = new Date(nowTs).toLocaleString();
                (FLAGS_CACHE.report || []).forEach(r => { USERS_FLAG_STATE[String(r.userId)] = { name: r.name, flagsBitmap: r.flagsBitmap, equippedFlag: r.equippedFlag | 0, droplets: r.droplets | 0 }; });
                buildFlagsCatalog();
                if (CURRENT_SELECTED_FLAG != null) renderFlagDetails(CURRENT_SELECTED_FLAG);
            } catch (e) { handleError(e); }
            finally {
                if (timer) clearInterval(timer);
                const btn = document.getElementById('checkFlagsAll');
                if (btn) { btn.disabled = false; btn.innerHTML = '<img src="icons/check.svg" alt="" />Check Flags (All)'; }
            }
        });

        $("loadFlagsCache")?.addEventListener('click', () => {
            try {
                if (!FLAGS_CACHE?.report) return;
                (FLAGS_CACHE.report || []).forEach(r => { USERS_FLAG_STATE[String(r.userId)] = { name: r.name, flagsBitmap: r.flagsBitmap, equippedFlag: r.equippedFlag | 0, droplets: r.droplets | 0 }; });

                try {
                    const existing = (COLORS_CACHE?.report || []).reduce((m, rr) => { if (rr?.userId) m[String(rr.userId)] = rr; return m; }, {});
                    for (const r of (FLAGS_CACHE.report || [])) {
                        const prev = existing[String(r.userId)] || { userId: String(r.userId), name: r.name };
                        existing[String(r.userId)] = { ...prev, flagsBitmap: r.flagsBitmap, equippedFlag: r.equippedFlag, droplets: r.droplets ?? prev.droplets };
                    }
                    COLORS_CACHE = { ts: FLAGS_CACHE.ts, report: Object.values(existing) };
                    saveColorsCache();
                } catch (_) { }
                if (flagsLastCheckLabel && FLAGS_CACHE?.ts) flagsLastCheckLabel.textContent = new Date(FLAGS_CACHE.ts).toLocaleString();
                buildFlagsCatalog();
                if (CURRENT_SELECTED_FLAG != null) renderFlagDetails(CURRENT_SELECTED_FLAG);
            } catch (_) { }
        });

        selectAllNoFlag?.addEventListener('click', () => { usersNoFlag.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true); });
        UnselectAllNoFlag?.addEventListener('click', () => { usersNoFlag.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false); });
        selectAllHaveFlag?.addEventListener('click', () => { usersHaveFlag.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true); });
        unselectAllHaveFlag?.addEventListener('click', () => { usersHaveFlag.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false); });

        purchaseFlagBtn?.addEventListener('click', async () => {
            if (CURRENT_SELECTED_FLAG == null) { showMessage('Error', 'Select a flag first.'); return; }
            const flagId = CURRENT_SELECTED_FLAG;
            const selectedUserIds = Array.from(usersNoFlag.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
            if (!selectedUserIds.length) { showMessage('Error', 'Select at least one user without this flag.'); return; }

            const COUNT = selectedUserIds.length;
            const COST_PER = 20000;
            const totalCost = COUNT * COST_PER;
            const confirmHtml = `
      <div style="text-align:left; line-height:1.45">
        <b>Flag:</b> #${flagId}<br>
        <b>Users:</b> ${COUNT}<br>
        <b>Cost per user:</b> ${COST_PER} droplets<br>
        <b>Total cost (max):</b> ${totalCost} droplets<br>
      </div>`;

            showConfirmation('Confirm purchase', confirmHtml, async () => {
                let timer = null;
                try {
                    purchaseFlagBtn.disabled = true; purchaseFlagBtn.textContent = 'Processing...';
                    const updateProgress = async () => {
                        try {
                            const { data } = await axios.get('/users/purchase-flag/progress');
                            const total = data?.total || 0; const completed = data?.completed || 0;
                            if (data?.active && total > 0) purchaseFlagBtn.textContent = `Processing... ${completed}/${total}`;
                        } catch (_) { }
                    };
                    timer = setInterval(updateProgress, 500); updateProgress().catch(() => { });

                    const { data } = await axios.post('/users/purchase-flag', { flagId, userIds: selectedUserIds });
                    const report = data?.report || [];
                    let ok = 0, skipped = 0, failed = 0;
                    const lines = report.map(r => {
                        if (r.error) { failed++; return `❌ ${escapeHtml(r.name || '')} (#${r.userId}): ${escapeHtml(r.error)}`; }
                        if (r.skipped) { skipped++; return `⏭️ ${escapeHtml(r.name || '')} (#${r.userId}): ${escapeHtml(r.reason || 'skipped')}`; }
                        if (r.ok || r.success) {
                            ok++;
                            const before = (r.beforeDroplets ?? '-'), after = (r.afterDroplets ?? '-');
                            return `✅ ${escapeHtml(r.name || '')} (#${r.userId}) — purchased. Droplets ${before} → ${after}`;
                        }
                        return `– ${escapeHtml(r.name || '')} (#${r.userId})`;
                    });

                    const html = `
          <b>Flag:</b> #${flagId}<br>
          <b>Purchased:</b> ${ok}<br>
          <b>Skipped:</b> ${skipped}<br>
          <b>Failed:</b> ${failed}<br><br>
          ${lines.slice(0, 20).join('<br>')}
          ${lines.length > 20 ? `<br>...and ${lines.length - 20} more` : ''}
        `;
                    showMessage('Purchase Report', html);

                    // Update local caches for flags and combined cache similarly to colors flow
                    try {
                        // helpers to set a bit in base64 bitmap (big-endian byte ordering like backend)
                        const setFlagInBitmap = (b64, id) => {
                            const bitIndex = Number(id);
                            const byteIndexFromEnd = Math.floor(bitIndex / 8);
                            const bitInByte = bitIndex % 8;
                            const bytes = (function () {
                                try {
                                    const binaryString = atob(String(b64 || ''));
                                    return new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i));
                                } catch (_) { return new Uint8Array(0); }
                            })();
                            const needLen = byteIndexFromEnd + 1;
                            const arr = new Uint8Array(Math.max(bytes.length, needLen));
                            // copy existing aligned to end
                            if (bytes.length) arr.set(bytes, arr.length - bytes.length);
                            const pos = arr.length - 1 - byteIndexFromEnd;
                            arr[pos] = arr[pos] | (1 << bitInByte);
                            try {
                                const binaryString = String.fromCharCode(...arr);
                                return btoa(binaryString);
                            } catch (_) { return b64 || ''; }
                        };

                        const nowTs = Date.now();
                        // Update USERS_FLAG_STATE and FLAGS_CACHE
                        for (const r of report) {
                            if (r && !r.error && !r.skipped) {
                                const key = String(r.userId);
                                const prev = USERS_FLAG_STATE[key] || { name: r.name, flagsBitmap: '', equippedFlag: 0, droplets: 0 };
                                const updatedBitmap = setFlagInBitmap(prev.flagsBitmap, flagId);
                                USERS_FLAG_STATE[key] = { name: r.name, flagsBitmap: updatedBitmap, equippedFlag: prev.equippedFlag | 0, droplets: r.afterDroplets ?? prev.droplets };
                                console.log(`[FlagPurchase] Updated user ${r.name} (#${r.userId}) - flag #${flagId} added to bitmap: ${prev.flagsBitmap} -> ${updatedBitmap}`);
                            }
                        }
                        // Rebuild FLAGS_CACHE.report from USERS_FLAG_STATE if it exists
                        try {
                            const entries = Object.entries(USERS_FLAG_STATE).map(([uid, v]) => ({ userId: uid, name: v.name, flagsBitmap: v.flagsBitmap, equippedFlag: v.equippedFlag | 0, droplets: v.droplets | 0 }));
                            FLAGS_CACHE = { ts: nowTs, report: entries };
                            saveFlagsCache();
                            console.log(`[FlagPurchase] Rebuilt FLAGS_CACHE with ${entries.length} users, timestamp: ${nowTs}`);
                        } catch (_) { }
                        if (flagsLastCheckLabel) flagsLastCheckLabel.textContent = new Date(nowTs).toLocaleString();

                        // Merge into COLORS_CACHE like in colors purchase flow so badges align
                        try {
                            const existing = (COLORS_CACHE?.report || []).reduce((m, rr) => { if (rr?.userId) m[String(rr.userId)] = rr; return m; }, {});
                            for (const r of (FLAGS_CACHE?.report || [])) {
                                const prev = existing[String(r.userId)] || { userId: String(r.userId), name: r.name };
                                existing[String(r.userId)] = { ...prev, flagsBitmap: r.flagsBitmap, equippedFlag: r.equippedFlag, droplets: r.droplets ?? prev.droplets };
                            }
                            COLORS_CACHE = { ts: FLAGS_CACHE?.ts || nowTs, report: Object.values(existing) };
                            saveColorsCache();
                        } catch (_) { }

                        buildFlagsCatalog();
                        if (CURRENT_SELECTED_FLAG != null) renderFlagDetails(CURRENT_SELECTED_FLAG);

                        // Clear checkboxes after successful purchase
                        usersNoFlag.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                    } catch (_) { }
                } catch (e) {
                    handleError(e);
                } finally {
                    if (timer) clearInterval(timer);
                    purchaseFlagBtn.disabled = false; purchaseFlagBtn.textContent = 'Attempt to Buy for Selected';
                }
            });
        });

        equipFlagBtn?.addEventListener('click', async () => {
            if (CURRENT_SELECTED_FLAG == null) { showMessage('Error', 'Select a flag first.'); return; }
            const selectedUserIds = Array.from(usersHaveFlag.querySelectorAll('input[type="radio"]:checked')).map(cb => cb.value);
            if (selectedUserIds.length !== 1) { showMessage('Info', 'Select exactly one user to equip flag.'); return; }
            const uid = selectedUserIds[0];
            try {
                equipFlagBtn.disabled = true; equipFlagBtn.textContent = 'Equipping...';
                const { data } = await axios.post(`/user/${uid}/flag/equip`, { flagId: CURRENT_SELECTED_FLAG });
                if (data?.success) showMessage('Success', 'Equipped');
            } catch (e) { handleError(e); }
            finally { equipFlagBtn.disabled = false; equipFlagBtn.textContent = 'Equip Selected (single)'; }
        });

        const setFlagButtonsBusy = (busy, textEquip, textUnequip) => {
            if (equipFlagBatchBtn) { equipFlagBatchBtn.disabled = !!busy; if (typeof textEquip === 'string') equipFlagBatchBtn.textContent = textEquip; }
            if (unequipFlagBatchBtn) { unequipFlagBatchBtn.disabled = !!busy; if (typeof textUnequip === 'string') unequipFlagBatchBtn.textContent = textUnequip; }
            if (purchaseFlagBtn) purchaseFlagBtn.disabled = !!busy;
        };

        equipFlagBatchBtn?.addEventListener('click', async () => {
            if (CURRENT_SELECTED_FLAG == null) { showMessage('Error', 'Select a flag first.'); return; }
            const selectedUserIds = Array.from(usersHaveFlag.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
            if (!selectedUserIds.length) { showMessage('Info', 'Select users to equip.'); return; }
            let timer = null;
            try {
                setFlagButtonsBusy(true, 'Equipping...', 'Unequip');
                const updateProgress = async () => {
                    try {
                        const { data } = await axios.get('/users/equip-flag/progress');
                        const total = data?.total || 0; const completed = data?.completed || 0;
                        if (data?.active && total > 0 && equipFlagBatchBtn) equipFlagBatchBtn.textContent = `Equipping... ${completed}/${total}`;
                    } catch (_) { }
                };
                timer = setInterval(updateProgress, 500); updateProgress().catch(() => { });
                const { data } = await axios.post('/users/equip-flag', { flagId: CURRENT_SELECTED_FLAG, userIds: selectedUserIds });
                const report = data?.report || [];
                let ok = 0, skipped = 0, failed = 0;
                const lines = report.map(r => {
                    if (r.error) { failed++; return `❌ ${escapeHtml(r.name || '')} (#${r.userId}): ${escapeHtml(r.error)}`; }
                    if (r.skipped) { skipped++; return `⏭️ ${escapeHtml(r.name || '')} (#${r.userId}): ${escapeHtml(r.reason || 'skipped')}`; }
                    if (r.ok || r.success) { ok++; return `✅ ${escapeHtml(r.name || '')} (#${r.userId}) — equipped`; }
                    return `– ${escapeHtml(r.name || '')} (#${r.userId})`;
                });
                const html = `
        <b>Flag:</b> #${CURRENT_SELECTED_FLAG}<br>
        <b>Equipped:</b> ${ok}<br>
        <b>Skipped:</b> ${skipped}<br>
        <b>Failed:</b> ${failed}<br><br>
        ${lines.slice(0, 20).join('<br>')}
        ${lines.length > 20 ? `<br>...and ${lines.length - 20} more` : ''}
      `;
                showMessage('Equip report', html);

                // Update cache and UI after successful equip operations
                try {
                    const nowTs = Date.now();
                    for (const r of report) {
                        if (r && !r.error && !r.skipped) {
                            const key = String(r.userId);
                            const prev = USERS_FLAG_STATE[key] || { name: r.name, flagsBitmap: '', equippedFlag: 0, droplets: 0 };
                            USERS_FLAG_STATE[key] = {
                                name: r.name,
                                flagsBitmap: prev.flagsBitmap,
                                equippedFlag: CURRENT_SELECTED_FLAG,
                                droplets: prev.droplets
                            };
                        }
                    }
                    // Rebuild FLAGS_CACHE.report from USERS_FLAG_STATE
                    const entries = Object.entries(USERS_FLAG_STATE).map(([uid, v]) => ({
                        userId: uid,
                        name: v.name,
                        flagsBitmap: v.flagsBitmap,
                        equippedFlag: v.equippedFlag | 0,
                        droplets: v.droplets | 0
                    }));
                    FLAGS_CACHE = { ts: nowTs, report: entries };
                    saveFlagsCache();
                    if (flagsLastCheckLabel) flagsLastCheckLabel.textContent = new Date(nowTs).toLocaleString();

                    // Update COLORS_CACHE as well
                    const existing = (COLORS_CACHE?.report || []).reduce((m, rr) => { if (rr?.userId) m[String(rr.userId)] = rr; return m; }, {});
                    for (const r of (FLAGS_CACHE?.report || [])) {
                        const prev = existing[String(r.userId)] || { userId: String(r.userId), name: r.name };
                        existing[String(r.userId)] = { ...prev, flagsBitmap: r.flagsBitmap, equippedFlag: r.equippedFlag, droplets: r.droplets ?? prev.droplets };
                    }
                    COLORS_CACHE = { ts: FLAGS_CACHE?.ts || nowTs, report: Object.values(existing) };
                    saveColorsCache();

                    buildFlagsCatalog();
                    if (CURRENT_SELECTED_FLAG != null) renderFlagDetails(CURRENT_SELECTED_FLAG);
                } catch (_) { }

                // Clear checkboxes after successful operation
                usersHaveFlag.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => cb.checked = false);
            } catch (e) { handleError(e); }
            finally {
                if (timer) clearInterval(timer);
                setFlagButtonsBusy(false, 'Equip', 'Unequip');
            }
        });

        unequipFlagBatchBtn?.addEventListener('click', async () => {
            const selectedUserIds = Array.from(usersHaveFlag.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
            if (!selectedUserIds.length) { showMessage('Info', 'Select users to unequip.'); return; }
            let timer = null;
            try {
                setFlagButtonsBusy(true, 'Equip', 'Unequipping...');
                const updateProgress = async () => {
                    try {
                        const { data } = await axios.get('/users/unequip-flag/progress');
                        const total = data?.total || 0; const completed = data?.completed || 0;
                        if (data?.active && total > 0 && unequipFlagBatchBtn) unequipFlagBatchBtn.textContent = `Unequipping... ${completed}/${total}`;
                    } catch (_) { }
                };
                timer = setInterval(updateProgress, 500); updateProgress().catch(() => { });
                const { data } = await axios.post('/users/unequip-flag', { userIds: selectedUserIds });
                const report = data?.report || [];
                let ok = 0, skipped = 0, failed = 0;
                const lines = report.map(r => {
                    if (r.error) { failed++; return `❌ ${escapeHtml(r.name || '')} (#${r.userId}): ${escapeHtml(r.error)}`; }
                    if (r.skipped) { skipped++; return `⏭️ ${escapeHtml(r.name || '')} (#${r.userId}): ${escapeHtml(r.reason || 'skipped')}`; }
                    if (r.ok || r.success) { ok++; return `✅ ${escapeHtml(r.name || '')} (#${r.userId}) — unequipped`; }
                    return `– ${escapeHtml(r.name || '')} (#${r.userId})`;
                });
                const html = `
        <b>Flag:</b> #${CURRENT_SELECTED_FLAG}<br>
        <b>Unequipped:</b> ${ok}<br>
        <b>Skipped:</b> ${skipped}<br>
        <b>Failed:</b> ${failed}<br><br>
        ${lines.slice(0, 20).join('<br>')}
        ${lines.length > 20 ? `<br>...and ${lines.length - 20} more` : ''}
      `;
                showMessage('Unequip report', html);

                // Update cache and UI after successful unequip operations
                try {
                    const nowTs = Date.now();
                    for (const r of report) {
                        if (r && !r.error && !r.skipped) {
                            const key = String(r.userId);
                            const prev = USERS_FLAG_STATE[key] || { name: r.name, flagsBitmap: '', equippedFlag: 0, droplets: 0 };
                            USERS_FLAG_STATE[key] = {
                                name: r.name,
                                flagsBitmap: prev.flagsBitmap,
                                equippedFlag: 0, // unequip = 0
                                droplets: prev.droplets
                            };
                        }
                    }
                    // Rebuild FLAGS_CACHE.report from USERS_FLAG_STATE
                    const entries = Object.entries(USERS_FLAG_STATE).map(([uid, v]) => ({
                        userId: uid,
                        name: v.name,
                        flagsBitmap: v.flagsBitmap,
                        equippedFlag: v.equippedFlag | 0,
                        droplets: v.droplets | 0
                    }));
                    FLAGS_CACHE = { ts: nowTs, report: entries };
                    saveFlagsCache();
                    if (flagsLastCheckLabel) flagsLastCheckLabel.textContent = new Date(nowTs).toLocaleString();

                    // Update COLORS_CACHE as well
                    const existing = (COLORS_CACHE?.report || []).reduce((m, rr) => { if (rr?.userId) m[String(rr.userId)] = rr; return m; }, {});
                    for (const r of (FLAGS_CACHE?.report || [])) {
                        const prev = existing[String(r.userId)] || { userId: String(r.userId), name: r.name };
                        existing[String(r.userId)] = { ...prev, flagsBitmap: r.flagsBitmap, equippedFlag: r.equippedFlag, droplets: r.droplets ?? prev.droplets };
                    }
                    COLORS_CACHE = { ts: FLAGS_CACHE?.ts || nowTs, report: Object.values(existing) };
                    saveColorsCache();

                    buildFlagsCatalog();
                    if (CURRENT_SELECTED_FLAG != null) renderFlagDetails(CURRENT_SELECTED_FLAG);
                } catch (_) { }

                // Clear checkboxes after successful operation
                usersHaveFlag.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => cb.checked = false);
            } catch (e) { handleError(e); }
            finally {
                if (timer) clearInterval(timer);
                setFlagButtonsBusy(false, 'Equip', 'Unequip');
            }
        });
    }

    function renderFlagDetails(flagId) {
        CURRENT_SELECTED_FLAG = flagId;
        const meta = FLAGS_LIST.find(f => f.id === flagId);
        selectedFlagTitle.textContent = `${meta?.name || 'Flag'} (${meta?.code || 'XX'})`;
        selectedFlagId.textContent = `ID: ${flagId}`;
        // render emoji and parse with Twemoji like in tiles
        (function () {
            const emoji = flagMetaToEmoji(meta) || '🏳️';
            selectedFlagEmoji.textContent = emoji;
            parseTwemojiIn(selectedFlagEmoji, 40);
        })();
        flagDetailsCard.style.display = '';

        try {
            flagsAllList?.querySelectorAll('.color-tile').forEach(el => {
                if (parseInt(el.getAttribute('data-flag-id'), 10) === flagId) el.classList.add('selected');
                else el.classList.remove('selected');
            });
        } catch (_) { }

        // group users
        const have = []; const no = [];
        const byId = FLAGS_CACHE?.report ? new Map(FLAGS_CACHE.report.map(r => [String(r.userId), r])) : new Map();
        for (const [id, u] of Object.entries(USERS_FLAG_STATE)) {
            try {
                const ids = bitmapToFlagIds(String(u.flagsBitmap || ''));
                if (ids.includes(flagId)) have.push([id, u]); else no.push([id, u]);
            } catch (_) { no.push([id, u]); }
        }

        usersHaveFlag.innerHTML = have.length
            ? have.map(([id, u]) => {
                const equippedFlagId = Number(u.equippedFlag || 0);
                const equippedFlag = equippedFlagId > 0 ? FLAGS_LIST.find(f => f.id === equippedFlagId) : null;
                const equippedEmoji = equippedFlag ? flagMetaToEmoji(equippedFlag) : '';
                return `
        <div class="user-select-item">
          <input type="checkbox" id="flag_have_${id}" value="${id}">
          <label class="label-margin0" for="flag_have_${id}">
            ${equippedEmoji ? `<span class="flag-emoji-inline" style="margin-right:6px;font-size:16px;line-height:1">${equippedEmoji}</span>` : ''}${u.name} <span class="muted">(#${id})</span>
          </label>
          <span class="drops-badge" title="Droplets at last check">${u.droplets | 0} drops</span>
        </div>
      `;
            }).join('')
            : `<span class="muted">Nobody has this flag yet.</span>`;

        // toggle bulk select and actions visibility depending on availability
        try {
            const bulkWrap = document.getElementById('haveFlagBulkSelectWrap');
            const actionsWrap = document.getElementById('haveFlagActionsWrap');
            const showControls = have.length > 0;
            if (bulkWrap) bulkWrap.style.display = showControls ? '' : 'none';
            if (actionsWrap) actionsWrap.style.display = showControls ? '' : 'none';
        } catch (_) { }

        usersNoFlag.innerHTML = no.length
            ? no.map(([id, u]) => {
                const equippedFlagId = Number(u.equippedFlag || 0);
                const equippedFlag = equippedFlagId > 0 ? FLAGS_LIST.find(f => f.id === equippedFlagId) : null;
                const equippedEmoji = equippedFlag ? flagMetaToEmoji(equippedFlag) : '';
                return `
        <div class="user-select-item">
          <input type="checkbox" id="flag_user_${id}" value="${id}">
          <label class="label-margin0" for="flag_user_${id}">
            ${equippedEmoji ? `<span class="flag-emoji-inline" style="margin-right:6px;font-size:16px;line-height:1">${equippedEmoji}</span>` : ''}${u.name} <span class="muted">(#${id})</span>
          </label>
          <span class="drops-badge" title="Droplets at last check">${u.droplets | 0} drops</span>
        </div>
      `;
            }).join('')
            : `<span class="muted">Everyone already has this flag.</span>`;

        // parse Twemoji for flag emojis in user lists (after HTML is set)
        [usersHaveFlag, usersNoFlag].filter(Boolean).forEach(el => parseTwemojiIn(el, 16));
    }

    function selectFlag(flagId) {
        renderFlagDetails(flagId);
    }

    function buildFlagsCatalog() {
        if (!flagsAllList || !Array.isArray(FLAGS_LIST)) return;
        // build owners count per flag from USERS_FLAG_STATE
        const countByFlag = new Map();
        try {
            for (const [uid, rec] of Object.entries(USERS_FLAG_STATE)) {
                const ids = bitmapToFlagIds(String(rec.flagsBitmap || ''));
                for (const id of ids) countByFlag.set(id, (countByFlag.get(id) || 0) + 1);
            }
        } catch (_) { }

        const toFlagEmoji = (code, fallback) => flagMetaToEmoji({ code, flag: fallback }) || '🏳️';

        // Sort flags: first those with badge > 0, then by ID
        const sortedFlags = [...FLAGS_LIST].sort((a, b) => {
            const cntA = countByFlag.get(a.id) || 0;
            const cntB = countByFlag.get(b.id) || 0;
            return (cntB > 0) - (cntA > 0) || a.id - b.id;
        });

        const html = sortedFlags.map(f => {
            const cnt = countByFlag.get(f.id) || 0;
            const badge = cnt > 0 ? `<span class="count-badge" title="Users with this flag">${cnt}</span>` : '';
            const type = `${f.code} (#${f.id})`;
            const emoji = toFlagEmoji(f.code, f.flag);
            return `
      <article class="palette-item color-tile" data-flag-id="${f.id}" title="${f.name} ${type}">
        <div class="swatch flag-emoji" style="display:flex;align-items:center;justify-content:center;font-size:18px;line-height:1">${emoji}</div>
        <div class="palette-meta">
          <span class="name"><span class="scroll">${f.name}</span></span>
          <span class="type basic">${type}</span>
        </div>
        ${badge}
      </article>
    `;
        }).join('');
        flagsAllList.innerHTML = html;

        parseTwemojiIn(flagsAllList, 20);
    }


    if (currentTab === liveLogs) {
        // refresh log toggles from backend when opening Live Logs
        try {
            if (typeof applyLogSettingsFromServer === 'function') {
                applyLogSettingsFromServer();
            }
        } catch (_) { }
        // start SSE stream when entering logs tab
        startLogsStream();
    } else {
        try { if (__sse) { __sse.close(); __sse = null; } } catch (_) { }
    }

    if (currentTab === queuePreview) {
        try { loadQueueSettings(); } catch (_) { }
        try { loadQueuePreview(); } catch (_) { }
        try { if (autoRefreshQueue && autoRefreshQueue.checked) startQueueAutoRefresh(); } catch (_) { }
        try { toggleRefreshIntervalInput(); } catch (_) { }
    }
};

(function () {
    const SPEED_PX_S = 40;

    function measureAndMark(nameEl) {
        const scrollEl = nameEl.querySelector('.scroll');
        if (!scrollEl) return;

        nameEl.classList.remove('overflow');
        nameEl.style.removeProperty('--marquee-distance');
        nameEl.style.removeProperty('--marquee-duration');

        const container = nameEl;
        const textW = scrollEl.scrollWidth;
        const boxW = container.clientWidth;

        if (textW > boxW + 1) {
            const distance = textW / 3 + boxW;
            const duration = distance / SPEED_PX_S;

            nameEl.classList.add('overflow');
            nameEl.style.setProperty('--marquee-distance', distance + 'px');
            nameEl.style.setProperty('--marquee-duration', duration.toFixed(2) + 's');
        }
    }

    function scan() {
        document.querySelectorAll('#flagsAllList .palette-meta .name').forEach(measureAndMark);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scan);
    } else {
        scan();
    }
    window.addEventListener('resize', () => scan());
    const list = document.getElementById('flagsAllList');
    if (list) {
        new MutationObserver(() => scan()).observe(list, { childList: true, subtree: true });
    }
})();

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const formatSpaces = (val) => {
    const n = Number(val);
    if (!Number.isFinite(n)) return String(val ?? '');
    return String(Math.trunc(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

openManageUsers.addEventListener("click", async () => {
    userList.innerHTML = "";
    userForm.reset();
    totalCharges.textContent = "?";
    totalMaxCharges.textContent = "?";

    // Initialize flags state from cache if available
    try {
        if (FLAGS_CACHE?.report) {
            (FLAGS_CACHE.report || []).forEach(r => {
                USERS_FLAG_STATE[String(r.userId)] = {
                    name: r.name,
                    flagsBitmap: r.flagsBitmap,
                    equippedFlag: r.equippedFlag | 0,
                    droplets: r.droplets | 0
                };
            });
        }

        // Load FLAGS_LIST if not already loaded
        if (!FLAGS_LIST || FLAGS_LIST.length === 0) {
            try {
                const response = await fetch('/flags.json');
                FLAGS_LIST = await response.json();
            } catch (e) {
                console.error('[ManageUsers] Error loading FLAGS_LIST:', e);
            }
        }
    } catch (e) {
        console.error('[ManageUsers] Error loading flags cache:', e);
    }

    loadUsers(users => {
        const userCount = Object.keys(users).length;
        if (manageUsersTitle) manageUsersTitle.textContent = `Existing Users (${userCount})`;
        for (const id of Object.keys(users)) {
            const user = document.createElement('div');
            user.className = 'user';
            user.id = `user-${id}`;


            const expirationDate = users[id].expirationDate;
            const expirationStr = expirationDate ? new Date(expirationDate * 1000).toLocaleString() : 'N/A';

            const shortLabel = (users[id].shortLabel || '').trim();
            const shortLabelSafe = escapeHtml(shortLabel);
            const shortLabelCut = shortLabelSafe ? (shortLabelSafe.length > 20 ? shortLabelSafe.slice(0, 40) + '…' : shortLabelSafe) : '';

            // Get equipped flag for this user from flags cache
            const userFlagData = USERS_FLAG_STATE[String(id)];
            const equippedFlagId = userFlagData?.equippedFlag || 0;
            const equippedFlag = equippedFlagId > 0 ? FLAGS_LIST.find(f => f.id === equippedFlagId) : null;
            const equippedEmoji = equippedFlag ? flagMetaToEmoji(equippedFlag) : '';

            user.innerHTML = `
                <div class="user-info">
                    <span class="user-info-username">${equippedEmoji ? `<span class="flag-emoji-inline" style="margin-right:6px;font-size:16px;line-height:1" title="${equippedFlag?.name || ''} (${equippedFlag?.code || ''}) - ID: ${equippedFlagId}">${equippedEmoji}</span>` : ''}${users[id].name}${shortLabelCut ? ` <span class="user-info-id">(${shortLabelCut})</span>` : ''}</span>
                    <span class="user-info-id">(#${id})</span>
                    <div class="user-stats">
                        Charges: <b>?</b>/<b>?</b> | Level <b>?</b> <span class="level-progress">(?%)</span> | Droplets: <b>?</b> 
                        <br><span class="muted">Expires: <b>${expirationStr}</b></span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="delete-btn" title="Delete User"><img src="icons/remove.svg"></button>
                    <button class="json-btn" title="Get User Info"><img src="icons/code.svg"></button>
                    <button class="edit-btn" title="Edit User"><img src="icons/pencil.svg"></button>
                    <!-- <button class="open-profile-btn" title="Open Profile"><img src="icons/eye.svg"></button> -->
                </div>`;

            user.querySelector('.delete-btn').addEventListener("click", () => {
                showConfirmation(
                    "Delete User",
                    `Are you sure you want to delete ${users[id].name} (#${id})? This will also remove them from all templates.`,
                    async () => {
                        try {
                            await axios.delete(`/user/${id}`);
                            showMessage("Success", "User deleted.");
                            openManageUsers.click();
                        } catch (error) {
                            handleError(error);
                        };
                    }
                );
            });


            const editBtn = user.querySelector('.edit-btn');
            editBtn.addEventListener('click', async () => {
                let u = {};
                try {
                    const r = await axios.get(`/user/status/${id}`);
                    u = r.data || {};
                } catch (_) { u = {}; }

                const nameInit = String(u.name || users[id].name || '').slice(0, 15);
                const discordInit = String(typeof u.discord === 'string' ? u.discord : (users[id].discord || '')).slice(0, 15);
                const showInit = typeof u.showLastPixel === 'boolean' ? !!u.showLastPixel : !!users[id].showLastPixel;
                const allianceIdInit = u.allianceId || '–';

                const content = `
                    <div class="form-card" style="text-align:left; margin:0;">
                        <div class="muted-user-id">ID: #${id}</div>
                        <div class="field">
                            <label for="edit-name-${id}">Name (max 15)</label>
                            <input id="edit-name-${id}" type="text" maxlength="15" value="${nameInit.replace(/"/g, '&quot;')}" />
                        </div>
                        <div class="field">
                            <label for="edit-discord-${id}">Discord (max 15)</label>
                            <input id="edit-discord-${id}" type="text" maxlength="15" value="${discordInit.replace(/"/g, '&quot;')}" />
                        </div>
                        <div class="field edit-inline">
                            <label for="edit-showLastPixel-${id}" class="label-margin0">Show last pixel</label>
                            <label class="switch">
                                <input id="edit-showLastPixel-${id}" type="checkbox" ${showInit ? 'checked' : ''} />
                                <span class="slider"></span>
                            </label>
                        </div>
                        <small class="help">Changes will be saved to your account on wplace.</small>
                    </div>
                    <div class="form-card" style="margin:8px 0 0; text-align: left;">
                        <div class="field">
                            <label for="edit-shortLabel-${id}">Personal note (max 40)</label>
                            <input id="edit-shortLabel-${id}" type="text" maxlength="40" value="${(users[id].shortLabel || '').replace(/"/g, '&quot;')}" />
                            <small class="help">Only for you. Not shared. Handy to store email/profile name for token updates.</small>
                        </div>
                    </div>
                    <div class="form-card" style="text-align:left; margin-top:8px;">
                        <div class="settings-card-head">
                            <h3 class="settings-card-title">Alliance</h3>
                            <p class="settings-card-sub">Join an alliance by UUID</p>
                        </div>
                        <div class="field">
                            <label for="edit-alliance-uuid-${id}">Alliance UUID</label>
                            <input id="edit-alliance-uuid-${id}" type="text" placeholder="01xxc1c1-1xxx-7xx6-913a-a84xxxx5a83e" />
                            <small class="help">Paste the alliance UUID and press Join. Current id: <span id="edit-alliance-current-${id}">${escapeHtml(allianceIdInit)}</span></small>
                        </div>
                        <div id="edit-alliance-join-wrap-${id}" class="form-actions" style="${allianceIdInit && allianceIdInit !== '–' ? 'display:none' : ''}">
                            <button type="button" id="edit-alliance-join-${id}" class="secondary-button"><img src="icons/addUser.svg" alt=""/>Join</button>
                        </div>
                        <div class="form-actions" style="${allianceIdInit && allianceIdInit !== '–' ? '' : 'display:none'}">
                            <button type="button" id="edit-alliance-leave-${id}" class="secondary-button"><img src="icons/remove.svg" alt=""/>Leave</button>
                        </div>
                    </div>`;

                showConfirmationBig('Edit Account', content, async () => {
                    const nameEl = document.getElementById(`edit-name-${id}`);
                    const shortLabelEl = document.getElementById(`edit-shortLabel-${id}`);
                    const discordEl = document.getElementById(`edit-discord-${id}`);
                    const showEl = document.getElementById(`edit-showLastPixel-${id}`);
                    const name = (nameEl?.value || '').trim().slice(0, 15);
                    const shortLabel = (shortLabelEl?.value || '').trim().slice(0, 40);
                    const discord = (discordEl?.value || '').trim().slice(0, 15);
                    const showLastPixel = !!showEl?.checked;
                    if (name.length < 2) { showMessage('Error', 'Name must be at least 2 characters.'); return; }
                    try {
                        const payload = { name, discord, showLastPixel, shortLabel };
                        const resp = await axios.put(`/user/${id}/update-profile`, payload);
                        if (resp.status === 200 && resp.data?.success) {
                            // Update username + short label inline
                            const usernameEl = user.querySelector('.user-info-username');
                            const shortCut = shortLabel ? escapeHtml(shortLabel.length > 40 ? shortLabel.slice(0, 40) + '…' : shortLabel) : '';
                            if (usernameEl) usernameEl.innerHTML = `${escapeHtml(name)}${shortCut ? ` <span class=\"user-info-id\">(${shortCut})</span>` : ''}`;
                            users[id].name = name;
                            users[id].shortLabel = shortLabel;
                            users[id].discord = discord;
                            users[id].showLastPixel = showLastPixel;
                            closeMessageBox();
                            showMessage('Success', 'Profile updated.');
                        } else {
                            handleError({ response: { data: resp.data, status: resp.status } });
                        }
                    } catch (error) {
                        handleError(error);
                    }
                });
                if (typeof messageBoxConfirmBig !== 'undefined' && messageBoxConfirmBig) messageBoxConfirmBig.textContent = 'Save';

                const joinBtn = document.getElementById(`edit-alliance-join-${id}`);
                const leaveBtn = document.getElementById(`edit-alliance-leave-${id}`);
                const joinWrap = document.getElementById(`edit-alliance-join-wrap-${id}`);
                joinBtn?.addEventListener('click', async () => {
                    const uuidEl = document.getElementById(`edit-alliance-uuid-${id}`);
                    const uuid = (uuidEl?.value || '').trim();
                    if (!uuid) { showMessage('Alliance', 'Please enter Alliance UUID.'); return; }
                    try {
                        joinBtn.disabled = true;
                        joinBtn.innerHTML = 'Joining...';
                        const resp = await axios.post(`/user/${id}/alliance/join`, { uuid });
                        if (resp.status === 200 && resp.data?.success) {
                            showMessage('Alliance', 'Joined successfully.');
                            try {
                                const r = await axios.get(`/user/status/${id}`);
                                const currEl = document.getElementById(`edit-alliance-current-${id}`);
                                if (currEl && r?.data?.allianceId) currEl.textContent = r.data.allianceId;
                                if (r?.data?.allianceId) {
                                    if (joinWrap) joinWrap.style.display = 'none';
                                    if (leaveBtn) leaveBtn.style.display = '';
                                }
                            } catch (_) { }
                        } else {
                            handleError({ response: { data: resp.data, status: resp.status } });
                        }
                    } catch (error) {
                        handleError(error);
                    } finally {
                        joinBtn.disabled = false;
                        joinBtn.innerHTML = '<img src="icons/addUser.svg" alt=""/>Join';
                    }
                });

                leaveBtn?.addEventListener('click', async () => {
                    try {
                        leaveBtn.disabled = true;
                        leaveBtn.innerHTML = 'Leaving...';
                        const resp = await axios.post(`/user/${id}/alliance/leave`);
                        if (resp.status === 200 && resp.data?.success) {
                            showMessage('Alliance', 'Left alliance successfully.');
                            const currEl = document.getElementById(`edit-alliance-current-${id}`);
                            if (currEl) currEl.textContent = '–';
                            if (joinWrap) joinWrap.style.display = '';
                            if (leaveBtn) leaveBtn.style.display = 'none';
                        } else {
                            handleError({ response: { data: resp.data, status: resp.status } });
                        }
                    } catch (error) {
                        handleError(error);
                    } finally {
                        leaveBtn.disabled = false;
                        leaveBtn.innerHTML = '<img src="icons/remove.svg" alt=""/>Leave';
                    }
                });
            });
            user.querySelector('.json-btn').addEventListener("click", async () => {
                try {
                    const response = await axios.get(`/user/status/${id}`);
                    const u = response.data;
                    const paidColors = [];
                    for (let c = 32; c <= 63; c++) {
                        if ((u.extraColorsBitmap | 0) & (1 << (c - 32))) paidColors.push(c);
                    }
                    const paidSwatches = paidColors.map(cid => {
                        const meta = COLORS.find(c => c.id === cid);
                        const rgb = meta ? `rgb(${meta.rgb[0]},${meta.rgb[1]},${meta.rgb[2]})` : '#333';
                        const fg = meta ? getContrastColor(meta.rgb[0], meta.rgb[1], meta.rgb[2]) : '#fff';
                        return `<span class=\"tiny-swatch\" style=\"background:${rgb};color:${fg}\">${cid}</span>`;
                    }).join('');
                    // Load FLAGS_LIST if not already loaded
                    if (!FLAGS_LIST || FLAGS_LIST.length === 0) {
                        try {
                            const response = await fetch('/flags.json');
                            FLAGS_LIST = await response.json();
                        } catch (e) {
                            console.error('[GetUserInfo] Error loading FLAGS_LIST:', e);
                        }
                    }

                    // Get purchased and equipped flags for this user
                    const purchasedFlagIds = u.flagsBitmap ? bitmapToFlagIds(u.flagsBitmap) : [];
                    const purchasedFlags = purchasedFlagIds.map(flagId => FLAGS_LIST.find(f => f.id === flagId)).filter(Boolean);
                    const flagSwatches = purchasedFlags.map(flag => {
                        const emoji = flagMetaToEmoji(flag);
                        const tooltip = `${flag.name} (${flag.code}) - ID: ${flag.id}`;
                        return `<span class="flag-swatch" title="${tooltip}" style="font-size:16px;margin:2px;display:inline-block;">${emoji}</span>`;
                    }).join('');

                    // Get equipped flag
                    const equippedFlagId = u.equippedFlag || 0;
                    const equippedFlag = equippedFlagId > 0 ? FLAGS_LIST.find(f => f.id === equippedFlagId) : null;
                    const equippedEmoji = equippedFlag ? flagMetaToEmoji(equippedFlag) : '';
                    const equippedFlagInfo = equippedFlag ? `${equippedFlag.name} (${equippedFlag.code}) - ID: ${equippedFlagId}` : 'None';


                    const info = `
                        <b>User:</b> <span style="color:#f97a1f">${u.name}</span><br>
                        <b>Charges:</b> <span style="color:#f97a1f">${Math.floor(u.charges.count)}</span>/<span style="color:#f97a1f">${u.charges.max}</span><br>
                        <b>Droplets:</b> <span style="color:#f97a1f">${u.droplets}</span><br>
                        <b>Level:</b> <span style="color:#f97a1f">${Math.floor(u.level)} (${Math.round((u.level % 1) * 100)}%)</span><br>
                        <b>Favorite Locations:</b> <span style="color:#f97a1f">${u.favoriteLocations?.length ?? 0}</span>/<span style="color:#f97a1f">${u.maxFavoriteLocations ?? "?"}</span><br>
                        <b>Discord:</b> <span style="color:#f97a1f">${u.discord ?? "-"}</span><br>
                        <b>Country:</b> <span style="color:#f97a1f">${u.country ?? "-"}</span><br>
                        <b>Pixels Painted:</b> <span style="color:#f97a1f">${u.pixelsPainted ?? "-"}</span><br>
                        <b>Alliance:</b> <span style="color:#f97a1f">${u.allianceId ?? "-"}</span> / <span style="color:#f97a1f">${u.allianceRole ?? "-"}</span><br>
                        <b>Paid colors:</b>
                        <div class=\"tiny-swatches\">${paidSwatches || '<span class=\"muted\">none</span>'}</div>
                        <b>Purchased flags:</b>
                        <div class=\"flag-swatches\">${flagSwatches || '<span class=\"muted\">none</span>'}</div>
                        <b>Equipped flag:</b> ${equippedEmoji ? `<span class="flag-emoji-inline" style="font-size:16px;margin-right:4px;" title="${equippedFlag?.code || ''} (${equippedFlagId})">${equippedEmoji}</span>` : ''}<span style="color:#f97a1f">${equippedFlag?.name || 'None'}</span><br><br>
                        Copy RAW JSON to clipboard?
                    `;

                    try {
                        const nowTs = Date.now();
                        const byId = new Map((COLORS_CACHE?.report || []).map(r => [String(r.userId), r]));
                        byId.set(String(id), {
                            userId: String(id),
                            name: u.name,
                            extraColorsBitmap: u.extraColorsBitmap | 0,
                            droplets: u.droplets | 0,
                            charges: { count: Math.floor(u.charges.count), max: u.charges.max },
                            level: Math.floor(u.level),
                            progress: Math.round((u.level % 1) * 100)
                        });
                        COLORS_CACHE = { ts: nowTs, report: Array.from(byId.values()) };
                        saveColorsCache();
                        if (colorsLastCheckLabel) colorsLastCheckLabel.textContent = new Date(nowTs).toLocaleString();
                        if (usersColorsLastCheckLabel) usersColorsLastCheckLabel.textContent = new Date(nowTs).toLocaleString();
                        USERS_COLOR_STATE[String(id)] = { name: u.name, extraColorsBitmap: u.extraColorsBitmap | 0, droplets: u.droplets | 0 };

                        // Update flags cache with fresh data from /user/status
                        USERS_FLAG_STATE[String(id)] = {
                            name: u.name,
                            flagsBitmap: u.flagsBitmap || '',
                            equippedFlag: u.equippedFlag || 0,
                            droplets: u.droplets || 0
                        };

                        // Update FLAGS_CACHE if it exists
                        if (FLAGS_CACHE?.report) {
                            const flagReport = FLAGS_CACHE.report.filter(r => String(r.userId) !== String(id));
                            flagReport.push({
                                userId: String(id),
                                name: u.name,
                                flagsBitmap: u.flagsBitmap || '',
                                equippedFlag: u.equippedFlag || 0,
                                droplets: u.droplets || 0
                            });
                            FLAGS_CACHE = { ts: nowTs, report: flagReport };
                            saveFlagsCache();
                        }
                    } catch (_) { }

                    showConfirmation("User Info", info, () => {
                        navigator.clipboard.writeText(JSON.stringify(u, null, 2));
                    });

                    // Parse Twemoji for flag emojis in the message box / modal
                    setTimeout(() => {
                        const container =
                            document.querySelector('.modal-content') ||
                            document.getElementById('messageBoxContent') ||
                            document.getElementById('messageBox');

                        if (!container) return;

                        const flagSwatches = container.querySelector('.flag-swatches');
                        const equippedFlags = container.querySelectorAll('.flag-emoji-inline');

                        if (flagSwatches) parseTwemojiIn(flagSwatches, 16);
                        equippedFlags.forEach(el => parseTwemojiIn(el, 16));
                        parseTwemojiIn(container, 16);
                    }, 0);

                } catch (error) {
                    handleError(error);
                }
            });

            /*
            // Open Brave profile by shortLabel (if exists)
            const openProfileBtn = user.querySelector('.open-profile-btn');
            openProfileBtn?.addEventListener('click', async () => {
                try {
                    openProfileBtn.disabled = true;
                    openProfileBtn.innerHTML = 'Opening...';
                    const resp = await axios.post(`/user/${id}/open-profile`);
                    if (resp.status === 200 && resp.data?.success) {
                        // no-op
                    } else {
                        handleError({ response: { data: resp.data, status: resp.status } });
                    }
                } catch (error) {
                    // if server returns bat_not_found — show friendly message
                    if (error?.response?.data?.error === 'bat_not_found') {
                        const p = error.response.data.path || '';
                        showMessage('Profile not found', `File not found:<br><code>${escapeHtml(p)}</code>`);
                    } else if (error?.response?.data?.error === 'no_profile_label') {
                        showMessage('Missing shortLabel', 'The account does not have a shortLabel specified. Specify it in Manage Users.');
                    } else {
                        handleError(error);
                    }
                } finally {
                    openProfileBtn.disabled = false;
                    openProfileBtn.innerHTML = '<img src="icons/eye.svg" alt=""/>';
                }
            });
            */
            userList.appendChild(user);
        }

        // Parse Twemoji for flag emojis in user list
        parseTwemojiIn(userList, 16);

        const totals = loadLatestTotals();
        if (totals) {
            if (totalCharges) totalCharges.textContent = formatSpaces(totals.charges ?? totalCharges.textContent);
            if (totalMaxCharges) totalMaxCharges.textContent = formatSpaces(totals.max ?? totalMaxCharges.textContent);
            if (totalDropletsEl) totalDropletsEl.textContent = formatSpaces(totals.droplets ?? totalDropletsEl.textContent);
            if (regenPphEl) regenPphEl.textContent = formatSpaces(totals.regen ?? regenPphEl.textContent);
        }
    });
    changeTab(manageUsers);
});

async function processInParallel(tasks, concurrency) {
    const queue = [...tasks];
    const workers = [];

    const runTask = async () => {
        while (queue.length > 0) {
            const task = queue.shift();
            if (task) await task();
        }
    };

    for (let i = 0; i < concurrency; i++) {
        workers.push(runTask());
    }

    await Promise.all(workers);
}

checkUserStatus.addEventListener("click", async () => {
    const __bypass = Number(window.__skipAccountCheckCooldownWarningCounter || 0);
    if (__bypass === 0) {
        try {
            const { data: s } = await axios.get('/settings');
            const settingsAccountCheckCooldownEarly = s?.accountCheckCooldown || 0;
            if (settingsAccountCheckCooldownEarly === 0) {
                const content = `
                    <div style="text-align:left">
                        <p><b>Heads‑up: Account Check Cooldown is 0</b></p>
                        <ul>
                            <li>No delay between checks: some accounts may temporarily fail due to rate limits or because the account is busy.</li>
                            <li>This does not necessarily mean the token has expired.</li>
                        </ul>
                        <p><b>What you can do</b></p>
                        <ul>
                            <li>After some time, manually re‑check red‑marked accounts (the middle button <img style="width:20px;height:20px;background: #515151;padding: 3px;border-radius: 5px;" src="icons/code.svg">).</li>
                            <li>If manual check still fails, the token is likely expired. To refresh it, load the extension in your browser/profile, sign in to wplace.live on that account — the extension will update the token automatically.</li>
                        </ul>
                        <p><b>Totals and “Show latest information”</b></p>
                        <ul>
                            <li>Initial totals may exclude accounts that temporarily failed to verify.</li>
                            <li>When you click “Show latest information” later, recalculation uses the last known data for those accounts, so values can be higher.</li>
                        </ul>
                    </div>`;
                showConfirmationBig('Before you start', content, () => {
                    window.__skipAccountCheckCooldownWarningCounter = 1;
                    checkUserStatus.click();
                });
                if (typeof messageBoxConfirmBig !== 'undefined' && messageBoxConfirmBig) messageBoxConfirmBig.textContent = 'OK, start anyway';
                if (typeof messageBoxCancelBig !== 'undefined' && messageBoxCancelBig) messageBoxCancelBig.textContent = 'Close';
                return;
            }
        } catch (_) { }
    } else {
        window.__skipAccountCheckCooldownWarningCounter = __bypass - 1;
    }
    checkUserStatus.disabled = true;
    if (checkUsersResult) { checkUsersResult.style.display = 'none'; checkUsersResult.innerHTML = ''; }
    if (checkUsersProgress) { checkUsersProgress.style.display = 'block'; checkUsersProgress.textContent = 'Progress: 0% (0 checked)'; }
    if (cleanupExpiredWrap) { cleanupExpiredWrap.style.display = 'none'; }
    const userElements = Array.from(document.querySelectorAll('.user'));
    const totalUsersToCheck = userElements.length;
    let checkedUsersCount = 0;
    const updateCheckBtn = () => {
        checkUserStatus.innerHTML = `Checking... ${checkedUsersCount}/${totalUsersToCheck}`;
    };
    updateCheckBtn();

    let totalCurrent = 0;
    let totalMax = 0;
    let totalDroplets = 0;
    const colorReport = [];
    const accountResults = [];


    let settingsAccountCheckCooldown = 0;
    let settingsProxyEnabled = false;
    let settingsParallelWorkers = 5;
    try {
        const { data: s } = await axios.get('/settings');
        settingsAccountCheckCooldown = s.accountCheckCooldown || 0;
        settingsProxyEnabled = !!s.proxyEnabled;
        const pw = Number(s.parallelWorkers);
        settingsParallelWorkers = Number.isFinite(pw) && pw > 0 ? pw : 5;
    } catch (_) { }

    const doOne = async (userEl) => {
        const id = userEl.id.split('-')[1];
        const infoSpans = userEl.querySelectorAll('.user-info > span');
        const currentChargesEl = userEl.querySelector('.user-stats b:nth-of-type(1)');
        const maxChargesEl = userEl.querySelector('.user-stats b:nth-of-type(2)');
        const currentLevelEl = userEl.querySelector('.user-stats b:nth-of-type(3)');
        const currentDroplets = userEl.querySelector('.user-stats b:nth-of-type(4)');
        const levelProgressEl = userEl.querySelector('.level-progress');

        infoSpans.forEach(span => span.style.color = 'var(--warning-color)');

        let success = false;
        let lastReason = 'error';
        let lastName = (() => { try { return userEl.querySelector('.user-info-username')?.textContent?.trim() || `#${id}` } catch (_) { return `#${id}` } })();

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const response = await axios.get(`/user/status/${id}`);
                const userInfo = response.data;

                const charges = Math.floor(userInfo.charges.count);
                const max = userInfo.charges.max;
                const droplets = userInfo.droplets;
                const level = Math.floor(userInfo.level);
                const progress = Math.round((userInfo.level % 1) * 100);

                LAST_USER_STATUS[id] = { charges, max, droplets, level, progress, extraColorsBitmap: userInfo.extraColorsBitmap | 0 };
                saveLastStatus();

                colorReport.push({
                    userId: String(id),
                    name: userInfo.name,
                    extraColorsBitmap: userInfo.extraColorsBitmap | 0,
                    droplets,
                    charges: { count: charges, max },
                    level,
                    progress
                });

                currentChargesEl.textContent = charges;
                maxChargesEl.textContent = max;
                currentLevelEl.textContent = level;
                levelProgressEl.textContent = `(${progress}%)`;
                currentDroplets.textContent = formatSpaces(droplets);

                USERS_COLOR_STATE[id] = {
                    name: userInfo.name || `#${id}`,
                    extraColorsBitmap: userInfo.extraColorsBitmap | 0,
                    droplets
                };
                totalCurrent += charges;
                totalMax += max;
                totalDroplets += Number(droplets) || 0;

                infoSpans.forEach(span => span.style.color = 'var(--success-color)');
                lastName = USERS_COLOR_STATE[id]?.name || userInfo.name || `#${id}`;
                success = true;
                break;
            } catch (error) {
                try { lastReason = (error && error.response && error.response.data && error.response.data.error) ? String(error.response.data.error) : String(error && error.message || error) } catch (_) { lastReason = 'error'; }
                currentChargesEl.textContent = "ERR";
                maxChargesEl.textContent = "ERR";
                currentLevelEl.textContent = "?";
                levelProgressEl.textContent = "(?%)";
                currentDroplets.textContent = "?";
                infoSpans.forEach(span => span.style.color = 'var(--error-color)');
                if (attempt < 3) {
                    await sleep(1000);
                }
            }
        }

        // Save result only once per user
        if (success) {
            accountResults.push({ id, name: lastName, ok: true, reason: 'ok' });
        } else {
            accountResults.push({ id, name: lastName, ok: false, reason: lastReason });
        }

        if (settingsAccountCheckCooldown > 0) {
            await sleep(settingsAccountCheckCooldown);
        }
        checkedUsersCount++;
        updateCheckBtn();
        if (checkUsersProgress) {
            const pct = totalUsersToCheck > 0 ? Math.round(checkedUsersCount / totalUsersToCheck * 100) : 100;
            checkUsersProgress.textContent = `Progress: ${pct}% (${checkedUsersCount} checked)`;
        }
    };

    if (settingsAccountCheckCooldown > 0) {

        for (const el of userElements) {
            await doOne(el);
        }
    } else {
        const tasks = userElements.map(el => () => doOne(el));
        const concurrency = settingsProxyEnabled ? settingsParallelWorkers : 5;
        await processInParallel(tasks, concurrency);
    }

    totalCharges.textContent = formatSpaces(totalCurrent);
    totalMaxCharges.textContent = formatSpaces(totalMax);
    if (totalDropletsEl) totalDropletsEl.textContent = formatSpaces(totalDroplets);
    if (regenPphEl) {
        const userElementsArr = Array.from(document.querySelectorAll('.user'));
        let regen = 0;
        userElementsArr.forEach(el => {
            const id = el.id.split('-')[1];
            const s = LAST_USER_STATUS[id] || {};
            const max = Math.floor(s.max || 0);
            regen += Math.min(120, max);
        });
        regenPphEl.textContent = formatSpaces(regen);
        saveLatestTotals({ charges: totalCurrent, max: totalMax, droplets: totalDroplets, regen });
    }


    try {
        const nowTs = Date.now();
        const byId = new Map((COLORS_CACHE?.report || []).map(r => [String(r.userId), r]));
        for (const r of colorReport) byId.set(String(r.userId), r);
        COLORS_CACHE = { ts: nowTs, report: Array.from(byId.values()) };
        saveColorsCache();
        if (colorsLastCheckLabel) colorsLastCheckLabel.textContent = new Date(nowTs).toLocaleString();
        if (usersColorsLastCheckLabel) usersColorsLastCheckLabel.textContent = new Date(nowTs).toLocaleString();
    } catch (_) { }

    checkUserStatus.disabled = false;
    checkUserStatus.innerHTML = '<img src="icons/check.svg">Check Account Status';

    // Build results table similar to Test proxies
    try {
        const total = accountResults.length;
        let ok = 0, expired = 0, banned = 0, otherErr = 0;
        const isExpired = (r) => {
            const msg = String(r.reason || '').toLowerCase();
            return /authentication failed\s*\(401\)/i.test(r.reason || '') || /unauthorized/i.test(msg);
        };
        const isBanned = (r) => {
            const msg = String(r.reason || '').toLowerCase();
            return /banned|suspended/.test(msg);
        };
        const rows = accountResults.map((r, i) => {
            let status = 'OK';
            let tag = '<span style="color:var(--success-color);">OK</span>';
            if (!r.ok) {
                if (isExpired(r)) { status = 'EXPIRED'; tag = '<span style="color:var(--error-color);">EXPIRED</span>'; expired++; }
                else if (isBanned(r)) { status = 'BANNED'; tag = '<span style="color:var(--error-color);">BANNED</span>'; banned++; }
                else { status = 'ERROR'; tag = '<span style="color:var(--warning-color);">ERROR</span>'; otherErr++; }
            } else { ok++; }
            const reasonShort = String(r.reason || '').slice(0, 180).replace(/</g, '&lt;');
            return `<tr>
                        <td style="padding:6px 8px;">${i + 1}</td>
                        <td style="padding:6px 8px; white-space:nowrap;">${r.name} <span class="muted">(#${r.id})</span></td>
                        <td style="padding:6px 8px;">${tag}</td>
                        <td style="padding:6px 8px;">${r.ok ? '-' : reasonShort}</td>
                    </tr>`;
        }).join('');
        const summary = `<div><b>Total:</b> ${total} • <b>OK:</b> ${ok} • <b>Expired:</b> ${expired} • <b>Banned:</b> ${banned} • <b>Other errors:</b> ${otherErr}</div>`;
        if (checkUsersResult) {
            checkUsersResult.innerHTML = `${summary}
                <div style="max-height:220px; overflow:auto; border:1px solid var(--border); border-radius:6px; margin-top:6px;">
                    <table style="width:100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                            <tr style="background: rgba(255,255,255,.04)">
                                <th style="text-align:left; padding:6px 8px;">#</th>
                                <th style="text-align:left; padding:6px 8px;">User</th>
                                <th style="text-align:left; padding:6px 8px;">Status</th>
                                <th style="text-align:left; padding:6px 8px;">Reason</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>`;
            checkUsersResult.style.display = 'block';
        }
        if (checkUsersProgress) checkUsersProgress.style.display = 'none';

        // Show cleanup button if there are expired or banned accounts
        if (expired > 0 || banned > 0) {
            try {
                const expiredIds = accountResults.filter(r => !r.ok && (isExpired(r) || isBanned(r))).map(r => r.id);
                if (cleanupExpiredWrap) cleanupExpiredWrap.style.display = 'block';
                if (cleanupExpiredBtn) cleanupExpiredBtn.dataset.expiredIds = JSON.stringify(expiredIds);
            } catch (_) { }
        } else {
            if (cleanupExpiredWrap) cleanupExpiredWrap.style.display = 'none';
            if (cleanupExpiredBtn) cleanupExpiredBtn.dataset.expiredIds = '[]';
        }
        showMessage('Success', 'Accounts check finished.');
    } catch (e) { /* no-op */ }
});

// Cleanup expired/banned accounts with confirmation (creates users.json backup)
cleanupExpiredBtn?.addEventListener('click', async () => {
    try {
        const raw = cleanupExpiredBtn.dataset.expiredIds || '[]';
        const toRemove = JSON.parse(raw || '[]');
        if (!Array.isArray(toRemove) || toRemove.length === 0) {
            showMessage('Info', 'No expired accounts to remove.');
            return;
        }
        showConfirmation('Remove expired/banned accounts', `Are you sure you want to remove ${toRemove.length} expired/banned accounts? A backup will be created.`, async () => {
            try {
                const resp = await axios.post('/users/cleanup-expired', { removeIds: toRemove });
                if (resp?.data?.success) {
                    showMessage('Success', `Removed ${resp.data.removed} accounts. Remaining: ${resp.data.remaining}. Backup: ${resp.data.backup}`);
                    if (cleanupExpiredWrap) cleanupExpiredWrap.style.display = 'none';
                    // Refresh Users tab to reflect deleted accounts
                    openManageUsers.click();
                } else {
                    showMessage('Error', 'Cleanup failed.');
                }
            } catch (error) {
                handleError(error);
            }
        });
    } catch (error) { handleError(error); }
});

buyMaxUpgradesAll?.addEventListener("click", () => {
    showConfirmation(
        "Buy max charge upgrades (all)",
        `Buy the maximum number of Max Charge upgrades for all accounts in turn?
        <br><br><b>Note: </b><i>Droplet reserve</i> is used from settings 
        <i>Purchase Cooldown</i> (default 5 sec).`,
        async () => {
            try {
                buyMaxUpgradesAll.disabled = true;
                buyMaxUpgradesAll.innerHTML = "Processing...";


                window.__bm_timer = setInterval(async () => {
                    try {
                        const { data } = await axios.get('/users/buy-max-upgrades/progress');
                        const total = data?.total || 0;
                        const completed = data?.completed || 0;
                        if (data?.active && total > 0) {
                            buyMaxUpgradesAll.innerHTML = `Processing... ${completed}/${total}`;
                        }
                    } catch (_) { }
                }, 500);

                const { data } = await axios.post("/users/buy-max-upgrades", {});
                const rep = data?.report || [];

                const ok = rep.filter(r => r.amount > 0).length;
                const skippedBusy = rep.filter(r => r.skipped && r.reason === "busy").length;
                const skippedNoFunds = rep.filter(r => r.skipped && r.reason === "insufficient_droplets_or_reserve").length;
                const failed = rep.filter(r => r.error).length;

                let html = `<b>Cooldown:</b> ${Math.round((data.cooldownMs || 0) / 1000)}s<br>
                            <b>Reserve:</b> ${data.reserve || 0} droplets<br><br>
                            <b>Purchased on:</b> ${ok}<br>
                            <b>Skipped (busy):</b> ${skippedBusy}<br>
                            <b>Skipped (no funds):</b> ${skippedNoFunds}<br>
                            <b>Failed:</b> ${failed}<br><br>`;

                const lines = rep.slice(0, 10).map(r => {
                    if (r.error) return `❌ ${r.name} (#${r.userId}): ${r.error}`;
                    if (r.skipped) return `⏭️ ${r.name} (#${r.userId}): ${r.reason}`;
                    return `✅ ${r.name} (#${r.userId}): +${r.amount} (droplets ${r.beforeDroplets} → ${r.afterDroplets})`;
                }).join("<br>");

                html += lines;
                if (rep.length > 10) html += `<br>...and ${rep.length - 10} more`;

                showMessage("Bulk purchase finished", html);
            } catch (error) {
                handleError(error);
            } finally {
                buyMaxUpgradesAll.disabled = false;
                buyMaxUpgradesAll.innerHTML = '<img src="icons/playAll.svg" alt=""/> Buy Max Charge Upgrades (All)';
                try { const t = window.__bm_timer; if (t) clearInterval(t); window.__bm_timer = null; } catch (_) { }
            }
        }
    );
});


buyChargesAll?.addEventListener("click", () => {
    showConfirmation(
        "Buy paint charges (all)",
        `Buy the maximum number of paint charges for all accounts?
        <br><br><b>Note: </b>Uses <i>Droplet reserve</i> from Settings and <i>Purchase Cooldown</i>.`,
        async () => {
            try {
                buyChargesAll.disabled = true;
                buyChargesAll.innerHTML = "Processing...";

                window.__bc_timer = setInterval(async () => {
                    try {
                        const { data } = await axios.get('/users/buy-charges/progress');
                        const total = data?.total || 0;
                        const completed = data?.completed || 0;
                        if (data?.active && total > 0) {
                            buyChargesAll.innerHTML = `Processing... ${completed}/${total}`;
                        }
                    } catch (_) { }
                }, 500);

                const { data } = await axios.post("/users/buy-charges", {});
                const rep = data?.report || [];

                const ok = rep.filter(r => r.amount > 0).length;
                const skippedBusy = rep.filter(r => r.skipped && r.reason === "busy").length;
                const skippedNoFunds = rep.filter(r => r.skipped && r.reason === "insufficient_droplets_or_reserve").length;
                const failed = rep.filter(r => r.error).length;

                let html = `<b>Cooldown:</b> ${Math.round((data.cooldownMs || 0) / 1000)}s<br>
                            <b>Reserve:</b> ${data.reserve || 0} droplets<br><br>
                            <b>Purchased on:</b> ${ok}<br>
                            <b>Skipped (busy):</b> ${skippedBusy}<br>
                            <b>Skipped (no funds):</b> ${skippedNoFunds}<br>
                            <b>Failed:</b> ${failed}<br><br>`;

                const lines = rep.slice(0, 10).map(r => {
                    if (r.error) return `❌ ${r.name} (#${r.userId}): ${r.error}`;
                    if (r.skipped) return `⏭️ ${r.name} (#${r.userId}): ${r.reason}`;
                    return `✅ ${r.name} (#${r.userId}): +${r.amount} (droplets ${r.beforeDroplets} → ${r.afterDroplets})`;
                }).join("<br>");

                html += lines;
                if (rep.length > 10) html += `<br>...and ${rep.length - 10} more`;

                showMessage("Bulk charge purchase finished", html);
            } catch (error) {
                handleError(error);
            } finally {
                buyChargesAll.disabled = false;
                buyChargesAll.innerHTML = '<img src="icons/playAll.svg" alt=""/> Buy paint charges (All)';
                try { const t = window.__bc_timer; if (t) clearInterval(t); window.__bc_timer = null; } catch (_) { }
            }
        }
    );
});


showLatestInfo.addEventListener("click", () => {
    const hasAny = LAST_USER_STATUS && Object.keys(LAST_USER_STATUS).length > 0;
    if (!hasAny) {
        showMessage("Latest Info", "Nothing to show. Press «Check Account Status».");
        return;
    }


    const userElements = Array.from(document.querySelectorAll('.user'));

    let sumCharges = 0;
    let sumMax = 0;
    let sumDroplets = 0;
    let touched = false;

    userElements.forEach(userEl => {
        const id = userEl.id.split('-')[1];
        const s = LAST_USER_STATUS[id];
        if (!s) return;

        const currentChargesEl = userEl.querySelector('.user-stats b:nth-of-type(1)');
        const maxChargesEl = userEl.querySelector('.user-stats b:nth-of-type(2)');
        const currentLevelEl = userEl.querySelector('.user-stats b:nth-of-type(3)');
        const levelProgressEl = userEl.querySelector('.level-progress');
        const currentDroplets = userEl.querySelector('.user-stats b:nth-of-type(4)');

        if (currentChargesEl) currentChargesEl.textContent = s.charges;
        if (maxChargesEl) maxChargesEl.textContent = s.max;
        if (currentLevelEl) currentLevelEl.textContent = s.level;
        if (levelProgressEl) levelProgressEl.textContent = `(${s.progress}%)`;
        if (currentDroplets) currentDroplets.textContent = formatSpaces(s.droplets);

        sumCharges += Math.floor(s.charges);
        sumMax += Math.floor(s.max);
        sumDroplets += Number(s.droplets) || 0;
        touched = true;
    });

    if (touched) {
        if (totalCharges) totalCharges.textContent = formatSpaces(sumCharges);
        if (totalMaxCharges) totalMaxCharges.textContent = formatSpaces(sumMax);
        if (totalDropletsEl) totalDropletsEl.textContent = formatSpaces(sumDroplets);
        if (regenPphEl) {
            let regen = 0;
            Object.values(LAST_USER_STATUS || {}).forEach(s => {
                const max = Math.floor(s.max || 0);
                regen += Math.min(120, max);
            });
            regenPphEl.textContent = formatSpaces(regen);
            saveLatestTotals({ charges: sumCharges, max: sumMax, droplets: sumDroplets, regen });
        }

        try {
            if (usersColorsLastCheckLabel) {
                const ts = (typeof COLORS_CACHE?.ts === 'number') ? COLORS_CACHE.ts : Date.now();
                usersColorsLastCheckLabel.textContent = new Date(ts).toLocaleString();
            }
        } catch (_) { }
    } else {
        showMessage("Latest Info", "There is no saved data for current accounts..");
    }
});


openAddTemplate.addEventListener("click", () => {
    resetTemplateForm();
    userSelectList.innerHTML = "";

    const toolbarId = 'userSelectToolbar';
    let toolbar = document.getElementById(toolbarId);
    if (!toolbar) {
        toolbar = document.createElement('div');
        toolbar.id = toolbarId;
        toolbar.style.cssText = 'display:flex; align-items:center; gap:6px;';
        const right = document.createElement('div');
        right.style.cssText = 'display:flex; align-items:center; gap:6px;';
        const select = document.createElement('select');
        select.id = 'userSortMode';
        select.innerHTML = '<option value="priority">Priority (needed colors)</option><option value="droplets">Droplets</option><option value="available">Available charges</option><option value="id">User ID</option>';
        select.value = 'available';
        right.append(select);

        toolbar.append(right);
    }


    const usersLabel = document.querySelector('label[for="userSelectList"]');
    if (usersLabel) {
        let asOf = usersLabel.querySelector('#usersDataAsOfLabel');
        if (!asOf) {
            asOf = document.createElement('span');
            asOf.id = 'usersDataAsOfLabel';
            asOf.className = 'muted';
            usersLabel.appendChild(asOf);
        }
    }


    const parentField = userSelectList.parentElement;
    if (usersLabel && toolbar && parentField) {
        let headerRow = document.getElementById('userUsersHeaderRow');
        if (!headerRow) {
            headerRow = document.createElement('div');
            headerRow.id = 'userUsersHeaderRow';
            headerRow.style.cssText = 'display:flex; align-items:end; justify-content:space-between; gap:8px; margin:6px 0px;';

            parentField.insertBefore(headerRow, usersLabel);
        }
        if (usersLabel.parentElement !== headerRow) headerRow.appendChild(usersLabel);
        if (toolbar.parentElement !== headerRow) headerRow.appendChild(toolbar);
    }

    const readColorsCache = () => {
        try { return JSON.parse(localStorage.getItem('wplacer_colors_cache_v1') || 'null'); } catch { return null; }
    };
    const getAsOf = () => {
        const cc = readColorsCache();
        return cc?.ts ? new Date(cc.ts).toLocaleString() : 'unknown';
    };
    const setAsOfLabel = () => {
        const lbl = document.getElementById('usersDataAsOfLabel');
        if (lbl) lbl.textContent = ` (As of: ${getAsOf()})`;
    };

    const computeRequiredPremiumSet = () => {
        const tpl = currentTemplate;
        const set = new Set();
        try {
            if (!tpl?.data) return set;
            for (let x = 0; x < tpl.width; x++) {
                for (let y = 0; y < tpl.height; y++) {
                    const id = tpl.data?.[x]?.[y] | 0; if (id >= 32 && id <= 63) set.add(id);
                }
            }
        } catch { }
        return set;
    };

    const tinySwatch = (cid) => {
        const meta = (typeof COLORS !== 'undefined') ? COLORS.find(c => c.id === cid) : null;
        const rgb = meta ? `rgb(${meta.rgb[0]},${meta.rgb[1]},${meta.rgb[2]})` : '#333';
        const fg = meta ? getContrastColor(meta.rgb[0], meta.rgb[1], meta.rgb[2]) : '#fff';
        return `<span class="tiny-swatch" title="#${cid}" style="background:${rgb};color:${fg}">${cid}</span>`;
    };

    const getMergedUserInfo = (usersObj) => {
        const cache = readColorsCache();
        const mapById = cache?.report?.reduce((m, r) => { if (r?.userId && !r.error) m[String(r.userId)] = r; return m; }, {}) || {};
        const out = {};
        for (const id of Object.keys(usersObj)) {
            const s = LAST_USER_STATUS[id] || {};
            const c = mapById[id] || {};
            out[id] = {
                id,
                name: usersObj[id].name,
                droplets: (typeof s.droplets === 'number') ? s.droplets : (c.droplets | 0),
                bitmap: (typeof s.extraColorsBitmap === 'number') ? s.extraColorsBitmap : (c.extraColorsBitmap | 0),
                charges: (typeof s.charges === 'number') ? Math.floor(s.charges) : Math.floor(c?.charges?.count || 0),
                max: (typeof s.max === 'number') ? Math.floor(s.max) : Math.floor(c?.charges?.max || 0)
            };
        }
        return out;
    };

    const renderList = (usersObj, sortMode) => {
        const info = getMergedUserInfo(usersObj);
        const req = computeRequiredPremiumSet();
        const entries = Object.keys(usersObj).map(id => {
            const u = info[id];

            let ownedCount = 0; const ownedList = [];
            const bm = u.bitmap | 0;
            for (const cid of req) { if ((bm & (1 << (cid - 32))) !== 0) { ownedCount++; ownedList.push(cid); } }
            return { id, name: u.name, droplets: u.droplets | 0, bitmap: bm, ownedCount, ownedList, charges: u.charges | 0, max: u.max | 0 };
        });

        if (sortMode === 'priority') entries.sort((a, b) => b.ownedCount - a.ownedCount || b.droplets - a.droplets || (Number(b.id) - Number(a.id)));
        else if (sortMode === 'droplets') entries.sort((a, b) => b.droplets - a.droplets || (Number(a.id) - Number(b.id)));
        else if (sortMode === 'available') entries.sort((a, b) => (b.charges - a.charges) || (b.max - a.max) || (Number(a.id) - Number(b.id)));
        else entries.sort((a, b) => (Number(a.id) - Number(b.id)));

        userSelectList.innerHTML = '';
        for (const e of entries) {
            const userDiv = document.createElement('div');
            userDiv.className = 'user-select-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `user_${e.id}`;
            checkbox.name = 'user_checkbox';
            checkbox.value = e.id;
            const keep = (editSelectedUserIds && editSelectedUserIds.has(String(e.id))) || (Array.isArray(pendingUserSelection) && pendingUserSelection.includes(String(e.id)));
            if (keep) checkbox.checked = true;

            const label = document.createElement('label');
            label.className = 'label-margin0';
            label.htmlFor = `user_${e.id}`;
            const swatches = e.ownedList.slice(0, 12).map(tinySwatch).join('');
            const more = e.ownedList.length > 12 ? ` +${e.ownedList.length - 12}` : '';
            const chargesStr = (Number.isFinite(e.charges) && Number.isFinite(e.max)) ? `${e.charges}/${e.max}` : '–/–';
            label.innerHTML = `${e.name} <span class="muted-user-id">(#${e.id})</span> <span class="drops-badge" title="Charges">${chargesStr}</span> <span class="drops-badge" title="Droplets">${e.droplets} drops</span> ${swatches}${more}`;

            userDiv.appendChild(checkbox);
            userDiv.appendChild(label);
            userSelectList.appendChild(userDiv);
        }
    };

    const applySort = (usersObj) => {
        const sel = document.getElementById('userSortMode');
        const mode = sel ? sel.value : 'priority';
        // Capture current checked before rerender (persist selection across sort)
        try {
            const checked = Array.from(document.querySelectorAll('#userSelectList input[name="user_checkbox"]:checked')).map(cb => String(cb.value));
            editSelectedUserIds = new Set(checked);
        } catch { editSelectedUserIds = editSelectedUserIds || null; }
        renderList(usersObj, mode);
    };

    loadUsers(users => {
        if (Object.keys(users).length === 0) {
            userSelectList.innerHTML = "<span>No users added. Please add a user first.</span>";
            return;
        }
        setAsOfLabel();
        const selInit = document.getElementById('userSortMode');
        if (selInit) {
            selInit.value = (Array.isArray(pendingUserSelection) && pendingUserSelection.length)
                ? 'priority'
                : 'available';
        }
        applySort(users);

        const sel = document.getElementById('userSortMode');
        if (sel && !sel._bound) {
            sel.addEventListener('change', () => applySort(users));
            sel._bound = true;
        }
        if (usePaidColors && !usePaidColors._boundForUserSort) {
            usePaidColors.addEventListener('change', () => {
                const sel = document.getElementById('userSortMode');
                if (sel) sel.value = 'priority';
                applySort(users);
            });
            usePaidColors._boundForUserSort = true;
        }
        pendingUserSelection = null;
    });
    changeTab(addTemplate);
});
selectAllUsers.addEventListener('click', () => {
    document.querySelectorAll('#userSelectList input[type="checkbox"]').forEach(cb => cb.checked = true);
    try { editSelectedUserIds = new Set(Array.from(document.querySelectorAll('#userSelectList input[name="user_checkbox"]:checked')).map(cb => String(cb.value))); } catch { }
});
document.getElementById('unselectAllUsers')?.addEventListener('click', () => {
    document.querySelectorAll('#userSelectList input[type="checkbox"]').forEach(cb => cb.checked = false);
    editSelectedUserIds = new Set();
});

document.getElementById("HideSensInfo").addEventListener("click", function () {
    const btn = this;
    const elements = document.querySelectorAll(".user-info-username, .user-actions, .user-info-id");
    const isHidden = btn.dataset.hidden === "true";

    elements.forEach(el => {
        if (!isHidden) {
            el.style.setProperty("display", "none", "important");
        } else {
            el.style.removeProperty("display");
        }
    });

    // Also toggle the "User" column in checkUsersResult table (2nd column)
    try {
        if (checkUsersResult) {
            const headerCells = checkUsersResult.querySelectorAll('table thead tr th:nth-child(2)');
            const bodyCells = checkUsersResult.querySelectorAll('table tbody tr td:nth-child(2)');
            if (!isHidden) {
                headerCells.forEach(el => el.style.setProperty('display', 'none', 'important'));
                bodyCells.forEach(el => el.style.setProperty('display', 'none', 'important'));
            } else {
                headerCells.forEach(el => el.style.removeProperty('display'));
                bodyCells.forEach(el => el.style.removeProperty('display'));
            }
        }
    } catch (_) { }

    btn.textContent = isHidden ? "Hide Sensitive Info" : "Show Sensitive Info";
    btn.dataset.hidden = !isHidden;
});

let createToggleButton = (template, id, buttonsContainer, statusSpan) => {
    const button = document.createElement('button');
    const isRunning = template.running;

    button.className = isRunning ? 'destructive-button button-templates' : 'primary-button button-templates';
    button.innerHTML = `<img src="icons/${isRunning ? 'pause' : 'play'}.svg">${isRunning ? 'Stop' : 'Start'}`;

    button.addEventListener('click', async () => {
        // When starting single template, warn once if Account Turn Cooldown is 0
        if (!isRunning) {
            const bypass = Number(window.__skipAccountTurnCooldownWarningCounter || 0);
            if (bypass === 0) {
                try {
                    const { data: s } = await axios.get('/settings');
                    const ac = s?.accountCooldown || 0;
                    if (ac === 0) {
                        const content = `
                            <div style=\"text-align:left\">\n\
                                <p><b>Heads‑up: Account Turn Cooldown is 0</b></p>
                                <ul>
                                    <li>Setting cooldown to 0 is strongly discouraged: ban risk is higher.</li>
                                    <li>Pixels appear on the canvas very quickly; terminal may show more 401/403 errors.</li>
                                    <li>Use this setting wisely, even with proxy enabled.</li>
                                </ul>
                            </div>`;
                        showConfirmationBig('Before you start', content, () => {
                            window.__skipAccountTurnCooldownWarningCounter = 1;
                            button.click();
                        });
                        if (typeof messageBoxConfirmBig !== 'undefined' && messageBoxConfirmBig) messageBoxConfirmBig.textContent = 'OK, start anyway';
                        if (typeof messageBoxCancelBig !== 'undefined' && messageBoxCancelBig) messageBoxCancelBig.textContent = 'Close';
                        return;
                    }
                } catch (_) { }
            } else {
                window.__skipAccountTurnCooldownWarningCounter = bypass - 1;
            }
        }
        try {
            await axios.put(`/template/${id}`, { running: !isRunning });
            template.running = !isRunning;
            const newButton = createToggleButton(template, id, buttonsContainer, statusSpan);
            button.replaceWith(newButton);

        } catch (error) {
            handleError(error);
        }
    });
    return button;
};


const updateTemplateStatus = async () => {
    try {
        const { data: templates } = await axios.get("/templates");
        for (const id in templates) {
            const t = templates[id];
            const templateElement = $(id);
            if (!templateElement) continue;

            const total = t.totalPixels || (t.template?.width * t.template?.height) || 1;
            const remaining = (typeof t.pixelsRemaining === 'number') ? t.pixelsRemaining : total;
            const completed = Math.max(0, total - remaining);
            const percent = Math.floor((completed / total) * 100);

            const progressBar = templateElement.querySelector('.progress-bar');
            const progressBarText = templateElement.querySelector('.progress-bar-text');
            const pixelCount = templateElement.querySelector('.pixel-count');
            const estimatedTimeLeft = templateElement.querySelector('.estimated-time');

            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressBarText) progressBarText.textContent = `${percent}% | ${t.status}`;
            if (pixelCount) pixelCount.textContent = `${completed} / ${total}`;

            //30 means 30 seconds (for 1 pixel)
            if (estimatedTimeLeft) estimatedTimeLeft.textContent = `~${formatTime((total - completed) / t.userIds.length * 30)}`;

            if (t.status === "Finished." || t.status === "Finished") {
                progressBar.classList.add('finished');
                progressBar.classList.remove('stopped');
            } else if (!t.running) {
                progressBar.classList.add('stopped');
                progressBar.classList.remove('finished');
            } else {
                progressBar.classList.remove('stopped', 'finished');
            }
        }
    } catch (error) {
        console.warn("Failed to update template statuses:", error);
    }
};

openManageTemplates.addEventListener("click", () => {
    templateList.innerHTML = "";
    if (templateUpdateInterval) {
        clearInterval(templateUpdateInterval);
        templateUpdateInterval = null;
    }

    loadUsers(users => {
        loadTemplates(templates => {
            const pinned = new Set(getPinned().map(String));
            const ids = Object.keys(templates);
            const pinnedIds = ids.filter(id => pinned.has(id));
            const otherIds = ids.filter(id => !pinned.has(id));
            const ordered = [...pinnedIds, ...otherIds];
            for (const id of ordered) {
                const t = templates[id];

                const template = document.createElement('div');
                template.id = id;
                template.className = "template";

                const total = t.totalPixels || (t.template?.width * t.template?.height) || 1;
                const remaining = (typeof t.pixelsRemaining === 'number') ? t.pixelsRemaining : total;
                const completed = Math.max(0, total - remaining);
                const percent = Math.floor((completed / total) * 100);

                const infoSpan = document.createElement('span');
                infoSpan.className = 'template-info';

                const accountsRow = document.createElement('div');
                accountsRow.className = 't-accounts-row';
                const accountsLabel = document.createElement('span');
                accountsLabel.className = 't-accounts-label';
                accountsLabel.textContent = 'Accounts:';
                const accountsCount = document.createElement('b');
                accountsCount.className = 't-accounts-count';
                accountsCount.textContent = String(t.userIds.length);
                const showAllBtn = document.createElement('button');
                showAllBtn.type = 'button';
                showAllBtn.className = 'tiny-inline-btn';
                showAllBtn.textContent = 'Show All';
                accountsRow.append(accountsLabel, accountsCount, showAllBtn);

                const accountsExpanded = document.createElement('div');
                accountsExpanded.className = 'accounts-expanded';
                for (const userId of t.userIds) {
                    const u = users[userId];
                    const chip = document.createElement('span');
                    chip.className = 'account-chip';
                    const nm = document.createElement('span');
                    nm.className = 'account-name';
                    nm.textContent = u ? u.name : 'Unknown';
                    const badge = document.createElement('span');
                    badge.className = 'account-id-badge';
                    badge.textContent = `#${userId}`;
                    chip.append(nm, badge);
                    accountsExpanded.appendChild(chip);
                }
                showAllBtn.addEventListener('click', () => {
                    const willShow = !accountsExpanded.classList.contains('show');
                    accountsExpanded.classList.toggle('show', willShow);
                    showAllBtn.textContent = willShow ? 'Hide' : 'Show All';
                });

                const meta = document.createElement('div');
                meta.className = 't-meta';

                const hasPremium = (() => {
                    try {
                        const tpl = t.template; if (!tpl?.data) return false;
                        for (let x = 0; x < tpl.width; x++) {
                            for (let y = 0; y < tpl.height; y++) {
                                const id = tpl.data?.[x]?.[y] | 0; if (id >= 32 && id <= 63) return true;
                            }
                        }
                    } catch (_) { }
                    return false;
                })();
                const paletteLine = `<div><span class="t-templates-enabled">Palette:</span> <span class="${hasPremium ? 'premium' : 'basic'}">${hasPremium ? 'Premium' : 'Basic'}</span></div>`;


                const enabled = [];
                if (t.canBuyCharges) enabled.push('Buy charges');
                if (t.canBuyMaxCharges) enabled.push('Buy max charges');
                if (t.autoBuyNeededColors) enabled.push('Buy premium colors');
                if (t.paintTransparentPixels) enabled.push('Paint transparent pixels');
                if (t.antiGriefMode) enabled.push('Anti‑grief mode');
                if (t.skipPaintedPixels) enabled.push('Skip painted pixels');
                if (t.outlineMode) enabled.push('Outline first');
                const enabledLine = enabled.length ? `<div><span class="t-templates-enabled">Enabled:</span> ${enabled.join(', ')}</div>` : '';

                meta.innerHTML = `
                    ${paletteLine}
                    <div><span class="t-templates-enabled">Coords:</span> ${t.coords.join(", ")}</div>
                    <div><span class="t-templates-enabled">Pixels:</span> <span class="pixel-count">${completed} / ${total}</span></div>
                    <div><span class="t-templates-enabled">Estimated time left:</span> <span class="estimated-time">~${formatTime((total - completed) / t.userIds.length * 30)}</span></div>
                    ${enabledLine}
                `;

                const nameDiv = document.createElement('div');
                nameDiv.className = 't-name';
                nameDiv.innerHTML = `<b>Template name: ${t.name}</b>`;

                infoSpan.appendChild(nameDiv);
                infoSpan.appendChild(accountsRow);
                infoSpan.appendChild(accountsExpanded);
                infoSpan.appendChild(meta);
                template.appendChild(infoSpan);

                const canvas = document.createElement("canvas");
                drawTemplate(t.template, canvas);
                template.appendChild(canvas);

                const actions = document.createElement('div');
                actions.className = "template-actions";

                const progressBarContainer = document.createElement('div');
                progressBarContainer.className = 'progress-bar-container';

                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                progressBar.style.width = `${percent}%`;

                const progressBarText = document.createElement('span');
                progressBarText.className = 'progress-bar-text';
                progressBarText.textContent = `${percent}% | ${t.status}`;

                if (t.status === "Finished." || t.status === "Finished") {
                    progressBar.classList.add('finished');
                } else if (!t.running) {
                    progressBar.classList.add('stopped');
                }

                progressBarContainer.appendChild(progressBar);
                progressBarContainer.appendChild(progressBarText);
                actions.appendChild(progressBarContainer);

                const buttonsRow = document.createElement('div');
                buttonsRow.className = "template-actions-row";

                const pinBtn = document.createElement('button');
                pinBtn.className = 'secondary-button button-templates';
                const pinnedNow = pinned.has(id);
                pinBtn.innerHTML = pinnedNow ? '<img src="icons/pin.svg">Unpin' : '<img src="icons/pin.svg">Pin';
                pinBtn.addEventListener('click', () => {
                    const curr = new Set(getPinned().map(String));
                    if (curr.has(id)) curr.delete(id); else curr.add(id);
                    savePinned(Array.from(curr));
                    openManageTemplates.click();
                });

                const toggleButton = createToggleButton(t, id, buttonsRow, infoSpan.querySelector('.status-text'));
                buttonsRow.appendChild(toggleButton);


                const previewButton = document.createElement('button');
                previewButton.className = 'secondary-button button-templates';
                previewButton.innerHTML = '<img src="icons/eye.svg">Preview';
                previewButton.addEventListener('click', async () => {
                    try {
                        previewButton.disabled = true;
                        previewButton.innerHTML = '<img src="icons/eye.svg">Loading...';
                        await showManageTemplatePreview(t);
                    } finally {
                        previewButton.disabled = false;
                        previewButton.innerHTML = '<img src="icons/eye.svg">Preview';
                    }
                });
                buttonsRow.appendChild(previewButton);

                const editButton = document.createElement('button');
                editButton.className = 'secondary-button button-templates';
                editButton.innerHTML = '<img src="icons/settings.svg">Edit';
                editButton.addEventListener('click', async () => {
                    let T = t;
                    try {
                        const { data } = await axios.get(`/template/${id}`);
                        if (data) T = data;
                    } catch (_) { }

                    pendingUserSelection = Array.isArray(T.userIds) ? T.userIds.map(String) : [];

                    openAddTemplate.click();
                    templateFormTitle.textContent = `Edit Template: ${T.name}`;
                    submitTemplate.innerHTML = '<img src="icons/edit.svg">Save Changes';
                    templateForm.dataset.editId = id;

                    templateName.value = T.name;
                    [tx.value, ty.value, px.value, py.value] = T.coords;
                    canBuyCharges.checked = !!T.canBuyCharges;
                    canBuyMaxCharges.checked = !!T.canBuyMaxCharges;
                    if (autoBuyNeededColors) autoBuyNeededColors.checked = !!T.autoBuyNeededColors;
                    antiGriefMode.checked = !!T.antiGriefMode;
                    skipPaintedPixels.checked = !!T.skipPaintedPixels;
                    outlineMode.checked = !!T.outlineMode;
                    paintTransparent.checked = !!T.paintTransparentPixels;
                    if (typeof T.heatmapEnabled !== 'undefined' && heatmapEnabled) heatmapEnabled.checked = !!T.heatmapEnabled;
                    if (heatmapLimitWrap) heatmapLimitWrap.style.display = heatmapEnabled && heatmapEnabled.checked ? '' : 'none';
                    if (typeof T.heatmapLimit !== 'undefined' && heatmapLimit) heatmapLimit.value = Math.max(1, Number(T.heatmapLimit || 10000));
                    if (typeof T.autoStart !== 'undefined' && autoStart) autoStart.checked = !!T.autoStart;


                    if (autoBuyNeededColors?.checked) { canBuyCharges.checked = false; canBuyMaxCharges.checked = false; }
                    if (canBuyCharges.checked) { canBuyMaxCharges.checked = false; if (autoBuyNeededColors) autoBuyNeededColors.checked = false; }
                    if (canBuyMaxCharges.checked) { canBuyCharges.checked = false; if (autoBuyNeededColors) autoBuyNeededColors.checked = false; }

                    setTimeout(() => {
                        document.querySelectorAll('input[name="user_checkbox"]').forEach(cb => {
                            cb.checked = (T.userIds || []).includes(cb.value);
                        });
                    }, 0);

                    fillEditorFromTemplate(T);

                    // Auto-scroll to autoStart setting if it's enabled
                    if (T.autoStart && autoStart) {
                        setTimeout(() => {
                            autoStart.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                    }
                });

                const delButton = document.createElement('button');
                delButton.className = 'destructive-button button-templates';
                delButton.innerHTML = '<img src="icons/remove.svg">Delete';
                delButton.addEventListener("click", () => {
                    showConfirmation(
                        "Delete Template",
                        `Are you sure you want to delete template "${t.name}"?`,
                        async () => {
                            try {
                                await axios.delete(`/template/${id}`);
                                openManageTemplates.click();
                            } catch (error) {
                                handleError(error);
                            }
                        }
                    );
                });

                buttonsRow.append(pinBtn, editButton, delButton);
                actions.appendChild(buttonsRow);

                infoSpan.appendChild(actions);
                if (pinned.has(id)) templateList.prepend(template); else templateList.append(template);
            }
            templateUpdateInterval = setInterval(updateTemplateStatus, 2000);
        });
    });

    changeTab(manageTemplates);
});




openSettings.addEventListener("click", async () => {
    try {
        const response = await axios.get('/settings');
        const currentSettings = response.data;


        setModeSelectionUI(currentSettings.drawingMethod);

        turnstileNotifications.checked = currentSettings.turnstileNotifications;
        accountCooldown.value = currentSettings.accountCooldown / 1000;
        purchaseCooldown.value = currentSettings.purchaseCooldown / 1000;
        accountCheckCooldown.value = (currentSettings.accountCheckCooldown || 0) / 1000;
        dropletReserve.value = currentSettings.dropletReserve;
        antiGriefStandby.value = currentSettings.antiGriefStandby / 60000;
        chargeThreshold.value = currentSettings.chargeThreshold * 100;
        alwaysDrawOnCharge.checked = !!currentSettings.alwaysDrawOnCharge;
        if (maxPixelsPerPass) {
            const mpp = Number(currentSettings.maxPixelsPerPass);
            maxPixelsPerPass.value = Number.isFinite(mpp) ? String(mpp) : '0';
        }
        seedCountHidden.value = currentSettings.seedCount ?? 2;
        window.BURST_SEED_COUNT = currentSettings.seedCount ?? 2;

        chargeThresholdContainer.style.display = alwaysDrawOnCharge.checked ? 'none' : 'block';

        const speed0 = parseFloat(localStorage.getItem('wplacer_preview_speed') || '1');
        if (previewSpeed) {
            previewSpeed.value = speed0;
            if (previewSpeedLabel) previewSpeedLabel.textContent = `${speed0}×`;
            if (typeof MODE_PREVIEW !== 'undefined' && MODE_PREVIEW.setSpeed) MODE_PREVIEW.setSpeed(speed0, { silent: true });
        }

        proxyEnabled.checked = !!currentSettings.proxyEnabled;
        proxyRotationMode.value = currentSettings.proxyRotationMode || 'sequential';
        logProxyUsage.checked = !!currentSettings.logProxyUsage;
        proxyCount.textContent = String(currentSettings.proxyCount ?? 0);
        proxyFormContainer.style.display = proxyEnabled.checked ? 'block' : 'none';
        if (parallelWorkers) parallelWorkers.value = String(currentSettings.parallelWorkers ?? 4);


        try {
            const cdTurn = parseInt(accountCooldown.value, 10) || 0;
            const cdCheck = parseInt(accountCheckCooldown.value, 10) || 0;
            const cdPurchase = parseInt(purchaseCooldown.value, 10) || 0;
            if (!proxyEnabled.checked && (cdTurn === 0 || cdCheck === 0 || cdPurchase === 0)) {
                showMessage("Warning", "One of cooldowns is 0 while proxies are disabled. This may cause rate limiting or blocks.");
            }
        } catch (_) { }

    } catch (error) {
        handleError(error);
    }
    changeTab(settings);
});
// Mask PII toggle + redact existing logs
document.getElementById('log_maskPii')?.addEventListener('change', async (e) => {
    try {
        await axios.put('/settings', { logMaskPii: e.target.checked });
        showMessage('Success', 'PII masking saved!');
    } catch (err) { handleError(err); }
});


function setModeSelectionUI(method) {
    document.querySelectorAll('.mode-card').forEach(card => {
        const mode = card.dataset.mode;
        if (!mode) return;
        if (mode === method) card.classList.add('selected'); else card.classList.remove('selected');
    });
}


document.addEventListener('click', async (e) => {
    const card = e.target.closest('.mode-card');
    if (!card || !card.dataset.mode) return;
    const mode = card.dataset.mode;

    if (card.classList.contains('selected')) {
        return;
    }
    setModeSelectionUI(mode);
    try {
        await axios.put('/settings', { drawingMethod: mode });
        showMessage("Success", `Drawing mode set to "${mode}".`);
    } catch (error) {
        handleError(error);
    }
});



if (seedCountHidden) {
    seedCountHidden.addEventListener('change', async () => {
        try {
            let n = parseInt(seedCountHidden.value, 10);
            if (!Number.isFinite(n) || n < 1) n = 1;
            if (n > 16) n = 16;
            seedCountHidden.value = n;
            await axios.put('/settings', { seedCount: n });
            window.BURST_SEED_COUNT = n;
            showMessage("Success", `Burst seed count updated to ${n}.`);
            if (typeof MODE_PREVIEW !== 'undefined' && MODE_PREVIEW.stopAll && MODE_PREVIEW.start) {
                MODE_PREVIEW.stopAll();
                document.querySelectorAll('.mode-preview[data-mode]').forEach(cv => MODE_PREVIEW.start(cv));
            }
        } catch (error) {
            handleError(error);
        }
    });
}



turnstileNotifications.addEventListener('change', async () => {
    try {
        await axios.put('/settings', { turnstileNotifications: turnstileNotifications.checked });
        showMessage("Success", "Notification setting saved!");
    } catch (error) {
        handleError(error);
    }
});

// Passive notification if server is currently waiting for a token
try {
    setTimeout(async () => {
        try {
            const { data } = await axios.get('/token-needed');
            if (data?.needed && turnstileNotifications?.checked) {
                showMessage("Turnstile", "Problem obtaining token. Please reload the extension and restart the browser. Possible Cloudflare Turnstile error (300030).");
            }
        } catch (_) { }
    }, 1000);
} catch (_) { }

accountCooldown.addEventListener('change', async () => {
    try {
        const newCooldown = parseInt(accountCooldown.value, 10) * 1000;
        if (isNaN(newCooldown) || newCooldown < 0) {
            showMessage("Error", "Please enter a valid non-negative number.");
            return;
        }
        await axios.put('/settings', { accountCooldown: newCooldown });
        const cdTurn = parseInt(accountCooldown.value, 10) || 0;
        const cdCheck = parseInt(accountCheckCooldown.value, 10) || 0;
        const cdPurchase = parseInt(purchaseCooldown.value, 10) || 0;
        if (!proxyEnabled.checked && (cdTurn === 0 || cdCheck === 0 || cdPurchase === 0)) {
            showMessage("Warning", "One of cooldowns is 0 while proxies are disabled.  This may cause rate limiting or blocks.");
        } else {
            showMessage("Success", "Account check cooldown saved!");
        }
    } catch (error) {
        handleError(error);
    }
});

purchaseCooldown.addEventListener('change', async () => {
    try {
        const newCooldown = parseInt(purchaseCooldown.value, 10) * 1000;
        if (isNaN(newCooldown) || newCooldown < 0) {
            showMessage("Error", "Please enter a valid non-negative number.");
            return;
        }
        await axios.put('/settings', { purchaseCooldown: newCooldown });
        const cdTurn = parseInt(accountCooldown.value, 10) || 0;
        const cdCheck = parseInt(accountCheckCooldown.value, 10) || 0;
        const cdPurchase = parseInt(purchaseCooldown.value, 10) || 0;
        if (!proxyEnabled.checked && (cdTurn === 0 || cdCheck === 0 || cdPurchase === 0)) {
            showMessage("Warning", "One of cooldowns is 0 while proxies are disabled.  This may cause rate limiting or blocks.");
        } else {
            showMessage("Success", "Purchase cooldown saved!");
        }
    } catch (error) {
        handleError(error);
    }
});

accountCheckCooldown.addEventListener('change', async () => {
    try {
        const v = parseInt(accountCheckCooldown.value, 10) * 1000;
        if (isNaN(v) || v < 0) {
            showMessage("Error", "Please enter a valid non-negative number.");
            return;
        }
        await axios.put('/settings', { accountCheckCooldown: v });
        const cdTurn = parseInt(accountCooldown.value, 10) || 0;
        const cdCheck = parseInt(accountCheckCooldown.value, 10) || 0;
        const cdPurchase = parseInt(purchaseCooldown.value, 10) || 0;
        if (!proxyEnabled.checked && (cdTurn === 0 || cdCheck === 0 || cdPurchase === 0)) {
            showMessage("Warning", "One of cooldowns is 0 while proxies are disabled.  This may cause rate limiting or blocks.");
        } else {
            showMessage("Success", "Account check cooldown saved!");
        }
    } catch (error) {
        handleError(error);
    }
});

dropletReserve.addEventListener('change', async () => {
    try {
        const newReserve = parseInt(dropletReserve.value, 10);
        if (isNaN(newReserve) || newReserve < 0) {
            showMessage("Error", "Please enter a valid non-negative number.");
            return;
        }
        await axios.put('/settings', { dropletReserve: newReserve });
        showMessage("Success", "Droplet reserve saved!");
    } catch (error) {
        handleError(error);
    }
});

antiGriefStandby.addEventListener('change', async () => {
    try {
        const newStandby = parseInt(antiGriefStandby.value, 10) * 60000;
        if (isNaN(newStandby) || newStandby < 60000) {
            showMessage("Error", "Please enter a valid number (at least 1 minute).");
            return;
        }
        await axios.put('/settings', { antiGriefStandby: newStandby });
        showMessage("Success", "Anti-grief standby time saved!");
    } catch (error) {
        handleError(error);
    }
});

chargeThreshold.addEventListener('change', async () => {
    try {
        const newThreshold = parseInt(chargeThreshold.value, 10);
        if (isNaN(newThreshold) || newThreshold < 1 || newThreshold > 100) {
            showMessage("Error", "Please enter a valid percentage between 1 and 100.");
            return;
        }
        await axios.put('/settings', { chargeThreshold: newThreshold / 100 });
        showMessage("Success", "Charge threshold saved!");
    } catch (error) {
        handleError(error);
    }
});


alwaysDrawOnCharge.addEventListener('change', async () => {
    try {
        await axios.put('/settings', { alwaysDrawOnCharge: alwaysDrawOnCharge.checked });
        showMessage("Success", "Always-draw-on-charge setting saved!");

        chargeThresholdContainer.style.display = alwaysDrawOnCharge.checked ? 'none' : 'block';
    } catch (error) {
        handleError(error);
    }
});


maxPixelsPerPass?.addEventListener('change', async () => {
    try {
        const raw = parseInt(maxPixelsPerPass.value, 10);
        const val = isNaN(raw) ? 0 : Math.max(0, raw | 0);
        maxPixelsPerPass.value = String(val);
        await axios.put('/settings', { maxPixelsPerPass: val });
        showMessage("Success", "Max pixels per pass saved!");
    } catch (error) {
        handleError(error);
    }
});


const parseTxInput = () => {
    const raw = (tx.value || '').trim();


    const urlMatch = raw.match(/pixel\/(\d+)\/(\d+)\?x=(\d+)&y=(\d+)/i);
    if (urlMatch) {
        tx.value = urlMatch[1];
        ty.value = urlMatch[2];
        px.value = urlMatch[3];
        py.value = urlMatch[4];
        return true;
    }


    const cleaned = raw.replace(/[()]/g, '');
    const labeledMatch = cleaned.match(
        /Tl\s*X\s*:\s*(\d+)\s*,?\s*Tl\s*Y\s*:\s*(\d+)\s*,?\s*Px\s*X\s*:\s*(\d+)\s*,?\s*Px\s*Y\s*:\s*(\d+)/i
    );
    if (labeledMatch) {
        tx.value = labeledMatch[1];
        ty.value = labeledMatch[2];
        px.value = labeledMatch[3];
        py.value = labeledMatch[4];
        return true;
    }


    const nums = cleaned.match(/\d+/g);
    if (nums && nums.length >= 4) {
        [tx.value, ty.value, px.value, py.value] = nums.slice(0, 4);
        return true;
    } else {

        tx.value = raw.replace(/[^0-9]/g, '');
    }
    return false;
};

tx.addEventListener('blur', parseTxInput);
tx.addEventListener('paste', (e) => {

    setTimeout(parseTxInput, 0);
});

[ty, px, py].forEach(input => {
    input.addEventListener('blur', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
    });
});


const activeTemplatesBar = $("activeTemplatesBar");
const activeTemplatesBarContent = $("activeTemplatesBarContent");

const drawTemplatePreview = (t, canvas) => {
    const maxSize = 70;
    const scale = Math.min(maxSize / t.width, maxSize / t.height, 1);
    const w = Math.max(1, Math.round(t.width * scale));
    const h = Math.max(1, Math.round(t.height * scale));
    const temp = document.createElement("canvas");
    temp.width = t.width;
    temp.height = t.height;
    drawTemplate(t, temp);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(temp, 0, 0, w, h);
    temp.remove();
};

async function refreshActiveBar() {
    try {
        const resp = await axios.get("/templates");
        const tpls = resp.data || {};
        const active = Object.entries(tpls).filter(([, t]) => t.running);

        activeTemplatesBarContent.innerHTML = "";
        if (active.length === 0) {
            activeTemplatesBar.classList.add("hidden");
            return;
        }
        activeTemplatesBar.classList.remove("hidden");

        for (const [id, t] of active) {
            const item = document.createElement("div");
            item.className = "active-item";

            const preview = document.createElement("canvas");
            drawTemplatePreview(t.template, preview);

            const meta = document.createElement("div");
            meta.className = "meta";

            const title = document.createElement("div");
            title.className = "title";
            title.textContent = t.name;

            const actions = document.createElement("div");
            actions.className = "actions";

            // progress bar for active item
            const total = t.totalPixels || (t.template?.width * t.template?.height) || 1;
            const remaining = (typeof t.pixelsRemaining === 'number') ? t.pixelsRemaining : total;
            const completed = Math.max(0, total - remaining);
            const percent = Math.floor((completed / total) * 100);
            const pbc = document.createElement('div');
            pbc.className = 'progress-bar-container-mini';
            const pb = document.createElement('div');
            pb.className = 'progress-bar';
            pb.style.width = `${percent}%`;
            if (t.status === "Finished." || t.status === "Finished") pb.classList.add('finished');
            else if (!t.running) pb.classList.add('stopped');
            const pbt = document.createElement('span');
            pbt.className = 'progress-bar-text';
            pbt.textContent = `${percent}%`;
            pbc.append(pb, pbt);

            const stopBtn = document.createElement("button");
            stopBtn.className = "mini-btn destructive";
            stopBtn.innerHTML = '<img src="icons/pause.svg">Stop';
            stopBtn.addEventListener("click", async () => {
                try {
                    await axios.put(`/template/${id}`, { running: false });
                    showMessage("Success", `Template "${t.name}" stopped.`);
                } catch (e) {
                    handleError(e);
                } finally {
                    refreshActiveBar();
                    if (currentTab === manageTemplates) openManageTemplates.click();
                }
            });

            const previewBtn = document.createElement("button");
            previewBtn.className = "mini-btn";
            previewBtn.innerHTML = '<img src="icons/eye.svg">Preview';
            previewBtn.addEventListener('click', async () => {
                try {
                    previewBtn.disabled = true;
                    previewBtn.innerHTML = '<img src="icons/eye.svg">Loading...';
                    await showManageTemplatePreview(t);
                } finally {
                    previewBtn.disabled = false;
                    previewBtn.innerHTML = '<img src="icons/eye.svg">Preview';
                }
            });

            const editBtn = document.createElement("button");
            editBtn.className = "mini-btn";
            editBtn.innerHTML = '<img src="icons/settings.svg">Edit';
            editBtn.addEventListener("click", async () => {
                let T = t;
                try {
                    const { data } = await axios.get(`/template/${id}`);
                    if (data) T = data;
                } catch (_) { }

                pendingUserSelection = Array.isArray(T.userIds) ? T.userIds.map(String) : [];
                editSelectedUserIds = new Set(pendingUserSelection);
                pendingUserSelection = Array.isArray(T.userIds) ? T.userIds.map(String) : [];
                editSelectedUserIds = new Set(pendingUserSelection);

                openAddTemplate.click();
                templateFormTitle.textContent = `Edit Template: ${T.name}`;
                submitTemplate.innerHTML = '<img src="icons/edit.svg">Save Changes';
                templateForm.dataset.editId = id;

                templateName.value = T.name;
                [tx.value, ty.value, px.value, py.value] = T.coords;
                canBuyCharges.checked = !!T.canBuyCharges;
                canBuyMaxCharges.checked = !!T.canBuyMaxCharges;
                antiGriefMode.checked = !!T.antiGriefMode;
                skipPaintedPixels.checked = !!T.skipPaintedPixels;
                outlineMode.checked = !!T.outlineMode;
                paintTransparent.checked = !!T.paintTransparentPixels;
                if (typeof T.heatmapEnabled !== 'undefined' && heatmapEnabled) heatmapEnabled.checked = !!T.heatmapEnabled;
                if (heatmapLimitWrap) heatmapLimitWrap.style.display = heatmapEnabled && heatmapEnabled.checked ? '' : 'none';
                if (typeof T.heatmapLimit !== 'undefined' && heatmapLimit) heatmapLimit.value = Math.max(1, Number(T.heatmapLimit || 10000));
                if (typeof T.autoStart !== 'undefined' && autoStart) autoStart.checked = !!T.autoStart;

                setTimeout(() => {
                    document.querySelectorAll('input[name="user_checkbox"]').forEach(cb => {
                        cb.checked = (T.userIds || []).includes(cb.value);
                    });
                }, 0);

                fillEditorFromTemplate(T);

                // Auto-scroll to autoStart setting if it's enabled
                if (T.autoStart && autoStart) {
                    setTimeout(() => {
                        autoStart.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }
            });

            actions.appendChild(stopBtn);
            actions.appendChild(editBtn);
            actions.appendChild(previewBtn);

            meta.appendChild(title);
            meta.appendChild(pbc);
            meta.appendChild(actions);

            item.appendChild(preview);
            item.appendChild(meta);

            activeTemplatesBarContent.appendChild(item);
        }
    } catch (e) {
        console.warn("Failed to refresh active bar:", e);
    }
}

setInterval(refreshActiveBar, 5000);

const originalCreateToggleButton = createToggleButton;
createToggleButton = function (template, id, buttonsContainer, statusSpan) {
    const btn = originalCreateToggleButton(template, id, buttonsContainer, statusSpan);
    btn.addEventListener('click', () => setTimeout(refreshActiveBar, 300));
    return btn;
};

startAll.addEventListener('click', () => setTimeout(refreshActiveBar, 500));
stopAll.addEventListener('click', () => setTimeout(refreshActiveBar, 500));

openManageTemplates.addEventListener("click", () => setTimeout(refreshActiveBar, 300));
document.addEventListener("DOMContentLoaded", refreshActiveBar);



const MODE_PREVIEW = (() => {
    // ---------- helpers ----------
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // preview speed (0.25–3), persists in localStorage
    let SPEED = parseFloat(localStorage.getItem('wplacer_preview_speed') || '1');

    function setSpeed(v, opts = {}) {
        const clip = (x, a, b) => Math.max(a, Math.min(b, Number(x) || 1));
        SPEED = clip(v, 0.25, 3);
        localStorage.setItem('wplacer_preview_speed', String(SPEED));
        if (!opts.silent) {
            // restart all previews
            document.querySelectorAll('.mode-preview[data-mode]').forEach(cv => { stop(cv); start(cv); });
            const ref = document.getElementById('modeReference');
            if (ref) drawReference(ref);
        }
    }

    // burst: scene -> { seeds: [{x,y}], activeIdx: number }
    const BURST_SEEDS_CACHE = new Map();

    function getBurstSeeds(scene, k, points) {
        let entry = BURST_SEEDS_CACHE.get(scene.id);
        if (!entry || !entry.seeds || entry.seeds.length !== k) {
            // take widely spaced seeds from scene points
            const seeds = pickSeedsFarApart(points, Math.max(1, k)).map(s => ({ x: s.x, y: s.y }));
            entry = {
                seeds,
                activeIdx: Math.floor(Math.random() * Math.max(1, seeds.length))
            };
            BURST_SEEDS_CACHE.set(scene.id, entry);
        }
        return entry;
    }

    // tiny pixel "painter"
    class Painter {
        constructor(w, h) { this.w = w; this.h = h; this.m = new Map(); }
        put(x, y, c) {
            if (x >= 0 && x < this.w && y >= 0 && y < this.h) this.m.set(`${x},${y}`, { x, y, colorIdx: c });
        }
        rect(x0, y0, x1, y1, c) {
            for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) this.put(x, y, c);
        }
        circle(cx, cy, r, c) {
            for (let y = cy - r; y <= cy + r; y++)for (let x = cx - r; x <= cx + r; x++) {
                const dx = x - cx, dy = y - cy; if (dx * dx + dy * dy <= r * r) this.put(x, y, c);
            }
        }
        ellipse(cx, cy, rx, ry, c) {
            for (let y = cy - ry; y <= cy + ry; y++)for (let x = cx - rx; x <= cx + rx; x++) {
                const dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1) this.put(x, y, c);
            }
        }
        tri(ax, ay, bx, by, cx, cy, col) {
            // bbox + barycentric fill
            const minx = Math.floor(Math.min(ax, bx, cx)), maxx = Math.ceil(Math.max(ax, bx, cx));
            const miny = Math.floor(Math.min(ay, by, cy)), maxy = Math.ceil(Math.max(ay, by, cy));
            const area = (x1, y1, x2, y2, x3, y3) => (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);
            const A = area(ax, ay, bx, by, cx, cy);
            for (let y = miny; y <= maxy; y++)for (let x = minx; x <= maxx; x++) {
                const a1 = area(x, y, bx, by, cx, cy) / A;
                const a2 = area(ax, ay, x, y, cx, cy) / A;
                const a3 = area(ax, ay, bx, by, x, y) / A;
                if (a1 >= 0 && a2 >= 0 && a3 >= 0) this.put(x, y, col);
            }
        }
        text(x, y, str, col, scale = 1) {
            const glyph = (ch) => FONT5x7[ch] || FONT5x7['?'];
            let cx = x;
            for (const ch of str.toUpperCase()) {
                const g = glyph(ch);
                for (let gy = 0; gy < g.length; gy++) {
                    for (let gx = 0; gx < g[gy].length; gx++) {
                        if (g[gy][gx] === '1') {
                            for (let sy = 0; sy < scale; sy++)for (let sx = 0; sx < scale; sx++)
                                this.put(cx + gx * scale + sx, y + gy * scale + sy, col);
                        }
                    }
                }
                cx += (5 * scale + 1); // width + 1px spacing
            }
        }
        toArray() { return Array.from(this.m.values()); }
    }

    // Minimal 5x7 glyphs (only what we need)
    const FONT5x7 = {
        'A': ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
        'C': ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
        'D': ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
        'E': ["11111", "10000", "11110", "10000", "10000", "10000", "11111"],
        'I': ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
        'L': ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
        'M': ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
        'O': ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
        'P': ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
        'R': ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
        'V': ["10001", "10001", "10001", "10001", "01010", "01010", "00100"],
        'W': ["10001", "10001", "10101", "10101", "10101", "11011", "10001"],
        'X': ["10001", "01010", "00100", "00100", "00100", "01010", "10001"],
        'Z': ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
        ' ': ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
        '?': ["01110", "10001", "00010", "00100", "00100", "00000", "00100"]
    };

    // ---------- scenes ----------
    // each preset: { id, name, w, h, palette[], build() -> points[] }
    const SCENES = [
        // 1) Space — 30x18, 4 clr
        (() => {
            const pal = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db']; // r,y,g,b
            const w = 30, h = 18;
            const build = () => {
                const p = new Painter(w, h);

                // Planet (blue)
                const pcx = 9, pcy = 9, R = 6; p.circle(pcx, pcy, R, 3);
                // Ring (yellow)
                const a = R + 3, b = R - 1;
                for (let x = pcx - a - 3; x <= pcx + a + 3; x++) {
                    const dx = x - pcx;
                    const y = Math.round(pcy + (dx * 0.3));
                    for (let yy = -b - 2; yy <= b + 2; yy++) {
                        const val = (dx * dx) / (a * a) + (yy * yy) / (b * b);
                        if (val > 0.95 && val < 1.12) p.put(x, y + yy, 1);
                    }
                }
                p.circle(pcx - 2, pcy + 0, 2, 2);
                p.circle(pcx + 2, pcy - 2, 2, 2);

                // Rocket (red)
                const rx = 21, ry = 5;
                for (let i = 0; i < 3; i++) for (let j = 0; j <= i; j++) p.put(rx + j, ry + i, 0);
                for (let yy = 0; yy < 7; yy++) for (let xx = 0; xx < 3; xx++) p.put(rx + 1 + xx, ry + 2 + yy, 0);
                p.put(rx + 2, ry + 4, 3); p.put(rx + 2, ry + 6, 3);
                p.put(rx + 1, ry + 8, 0); p.put(rx + 4, ry + 8, 0); p.put(rx + 0, ry + 9, 0); p.put(rx + 5, ry + 9, 0);
                for (let i = 0; i < 3; i++) for (let j = -i; j <= i; j++) p.put(rx + 3 + j, ry + 9 + i, 1);

                [[2, 2], [5, 14], [14, 2], [27, 14], [24, 3], [18, 15]].forEach(([sx, sy]) => p.put(sx, sy, 1));

                return p.toArray();
            };
            return { id: 1, name: 'Space', w, h, palette: pal, build };
        })(),

        // 2) Portrait 150x90
        (() => {
            const pal = ['#3d2b1f', '#7a5b3a', '#d8b08c', '#5b7f3a']; // hair, dress, skin, bg green
            const w = 150, h = 90;
            const build = () => {
                const p = new Painter(w, h);
                p.rect(6, 6, w - 7, h - 7, 3);

                p.ellipse(80, 75, 45, 18, 1);
                p.rect(40, 62, 120, 88, 1);
                p.ellipse(78, 42, 22, 28, 2);
                p.ellipse(78, 40, 28, 34, 0);
                for (let y = 10; y < 75; y++) {
                    for (let x = 0; x < w; x++) {
                        const dx = (x - 78) / 22, dy = (y - 42) / 28;
                        if (dx * dx + dy * dy <= 1) p.put(x, y, 2);
                    }
                }

                p.rect(70, 42, 71, 43, 0);
                p.rect(85, 42, 86, 43, 0);
                p.rect(76, 51, 80, 52, 0);

                for (let i = 0; i < 6; i++) {
                    p.rect(6 + i, 6 + i, w - 7 - i, 6 + i, 0);
                    p.rect(6 + i, h - 7 - i, w - 7 - i, h - 7 - i, 0);
                    p.rect(6 + i, 6 + i, 6 + i, h - 7 - i, 0);
                    p.rect(w - 7 - i, 6 + i, w - 7 - i, h - 7 - i, 0);
                }
                return p.toArray();
            };
            return { id: 2, name: 'Portrait', w, h, palette: pal, build };
        })(),

        // 3) Typo Art — 84x16
        (() => {
            const pal = ['#ffffff', '#ffcc00', '#00c896', '#333333']; // white, yellow, teal, dark bg
            const w = 84, h = 16;
            const build = () => {
                const p = new Painter(w, h);
                p.rect(0, 0, w - 1, h - 1, 3);
                p.text(2, 3, 'WPLACER', 0, 2);
                for (let x = 2; x < w - 2; x++) if (x % 2 === 0) p.put(x, 14, 1);
                p.rect(w - 9, 2, w - 6, 5, 1);
                p.rect(w - 9, 7, w - 6, 10, 2);
                return p.toArray();
            };
            return { id: 3, name: 'Typo', w, h, palette: pal, build };
        })(),

        // 4) Landscape — 40x24
        (() => {
            const pal = ['#f5d76e', '#7f8fa6', '#273c75', '#4cd7f6']; // sun, mountains, deep, water
            const w = 40, h = 24;
            const build = () => {
                const p = new Painter(w, h);
                p.rect(0, 14, w - 1, h - 1, 3);
                for (let x = 0; x < w; x++) if ((x % 3) === 0) p.put(x, 16, 0);

                p.tri(4, 14, 14, 14, 9, 6, 1);
                p.tri(12, 14, 28, 14, 20, 4, 1);
                p.tri(24, 14, 39, 14, 31, 7, 2);

                p.circle(6, 4, 3, 0);
                return p.toArray();
            };
            return { id: 4, name: 'Landscape', w, h, palette: pal, build };
        })(),

        // 5) Dungeon — 28x28
        (() => {
            const pal = ['#c0392b', '#ecf0f1', '#7f8c8d', '#2c3e50']; // fire, light, stone, dark
            const w = 28, h = 28;
            const build = () => {
                const p = new Painter(w, h);
                p.rect(0, 0, w - 1, 0, 2); p.rect(0, h - 1, w - 1, h - 1, 2);
                p.rect(0, 0, 0, h - 1, 2); p.rect(w - 1, 0, w - 1, h - 1, 2);

                for (let y = 2; y < h - 2; y++) {
                    for (let x = 2; x < w - 2; x++) {
                        if (((x + y) & 1) === 0) p.put(x, y, 3);
                    }
                }

                p.rect(w / 2 - 2, h - 6, w / 2 + 2, h - 2, 2);
                p.rect(w / 2 - 1, h - 5, w / 2 + 1, h - 3, 1);

                p.rect(3, 6, 4, 12, 2); p.rect(w - 6, 6, w - 5, 12, 2);
                p.rect(4, 6, 5, 7, 0); p.rect(w - 6, 6, w - 5, 7, 0);
                p.put(5, 7, 1); p.put(w - 6, 7, 1);
                return p.toArray();
            };
            return { id: 5, name: 'Dungeon', w, h, palette: pal, build };
        })(),

        // 6) Emblem — 64x32
        (() => {
            const pal = ['#2ecc71', '#e74c3c', '#f1c40f', '#34495e']; // green, red, yellow, dark
            const w = 64, h = 32;
            const build = () => {
                const p = new Painter(w, h);
                p.ellipse(w / 2, h / 2 - 2, 20, 12, 3);
                p.ellipse(w / 2, h / 2 - 2, 18, 10, 0);
                for (let i = 0; i < 8; i++) p.tri(w / 2 - 2 - i, h / 2 + 6 + i, w / 2 + 2 + i, h / 2 + 6 + i, w / 2, h / 2 + 12 + i, 0);

                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        if (((x + y) % 7) === 0) p.put(x, y, 1);
                        if (((x + y + 3) % 11) === 0) p.put(x, y, 2);
                    }
                }

                p.ellipse(w / 2, h / 2 - 2, 20, 12, 3);
                return p.toArray();
            };
            return { id: 6, name: 'Emblem', w, h, palette: pal, build };
        })(),
    ];

    // Swap preview scenes #1 and #3 (positions 0 and 2) as requested
    if (SCENES.length >= 3) {
        const tmp = SCENES[0];
        SCENES[0] = SCENES[2];
        SCENES[2] = tmp;
    }

    // ---------- ordering ----------
    function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a; }
    function orderByLinear(target, axis, reversed = false) {
        const arr = target.slice();
        arr.sort((a, b) => {
            if (axis === 'y') { if (a.y !== b.y) return reversed ? b.y - a.y : a.y - b.y; return a.x - b.x; }
            else { if (a.x !== b.x) return reversed ? b.x - a.x : a.x - b.x; return a.y - b.y; }
        });
        return arr;
    }
    function groupByColor(target) { const m = new Map(); for (const p of target) { if (!m.has(p.colorIdx)) m.set(p.colorIdx, []); m.get(p.colorIdx).push(p); } return m; }
    function orderByColor(target, random = false) {
        const g = groupByColor(target), keys = Array.from(g.keys());
        if (random) { keys.sort(); const perm = [2, 0, 3, 1, 4, 5, 6, 7]; const picked = perm.map(i => keys[i]).filter(v => v !== undefined); while (picked.length < keys.length) picked.push(keys[picked.length]); return picked.flatMap(k => orderByLinear(g.get(k), 'y', false)); }
        return keys.sort().flatMap(k => orderByLinear(g.get(k), 'y', false));
    }
    function pickSeedsFarApart(target, k = 2) {
        if (!target.length) return [];
        let bi = 0, bj = 0, best = -1;
        for (let i = 0; i < target.length; i++)for (let j = i + 1; j < target.length; j++) {
            const dx = target[i].x - target[j].x, dy = target[i].y - target[j].y, d2 = dx * dx + dy * dy;
            if (d2 > best) { best = d2; bi = i; bj = j; }
        }
        const seeds = [target[bi]]; if (target.length > 1) seeds.push(target[bj]);
        while (seeds.length < Math.min(k, target.length)) {
            let pick = null, bestMin = -1;
            for (const p of target) {
                const md = Math.min(...seeds.map(s => (s.x - p.x) ** 2 + (s.y - p.y) ** 2));
                if (md > bestMin) { bestMin = md; pick = p; }
            }
            if (!pick) break; seeds.push(pick);
        }
        return seeds.slice(0, k);
    }
    function orderByBurst(target, seedCount = 2) {
        if (!target.length) return [];

        const byKey = new Map(target.map(p => [`${p.x},${p.y}`, p]));

        const seeds = pickSeedsFarApart(target, Math.max(1, seedCount | 0));

        const nearest = (sx, sy) => {
            let best = null, bestD = Infinity;
            for (const p of target) {
                const d2 = (p.x - sx) ** 2 + (p.y - sy) ** 2;
                if (d2 < bestD) { bestD = d2; best = p; }
            }
            return best;
        };

        const starts = seeds.map(s => nearest(s.x, s.y)).filter(Boolean);

        const visited = new Set();
        const queues = [];
        const speeds = [];
        const prefs = [];

        const randDir = () => [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(Math.random() * 4)];

        for (const sp of starts) {
            const k = `${sp.x},${sp.y}`;
            if (!visited.has(k)) {
                visited.add(k);
                queues.push([sp]);
                speeds.push(0.7 + Math.random() * 1.1); // 0.7..1.8
                prefs.push(randDir());
            }
        }

        const pickQueue = () => {
            const w = speeds.map((s, i) => queues[i].length ? s : 0);
            const sum = w.reduce((a, b) => a + b, 0);
            if (!sum) return -1;
            let r = Math.random() * sum;
            for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return i; }
            return w.findIndex(x => x > 0);
        };

        const orderNeighbors = (dir) => {
            const base = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            base.sort((a, b) =>
                (b[0] * dir[0] + b[1] * dir[1] + (Math.random() - 0.5) * 0.2) -
                (a[0] * dir[0] + a[1] * dir[1] + (Math.random() - 0.5) * 0.2)
            );
            return base;
        };

        const dash = (from, qi, dir) => {
            const dashChance = 0.45;
            const maxDash = 1 + Math.floor(Math.random() * 3);
            if (Math.random() > dashChance) return;
            let cx = from.x, cy = from.y;
            for (let step = 0; step < maxDash; step++) {
                const nx = cx + dir[0], ny = cy + dir[1];
                const key = `${nx},${ny}`;
                if (!byKey.has(key) || visited.has(key)) break;
                visited.add(key);
                queues[qi].push(byKey.get(key));
                cx = nx; cy = ny;
            }
        };

        const out = [];

        while (true) {
            const qi = pickQueue();
            if (qi === -1) break;

            const cur = queues[qi].shift();
            out.push(cur);

            const neigh = orderNeighbors(prefs[qi]);
            let firstDir = null, firstPt = null;

            for (const [dx, dy] of neigh) {
                const nx = cur.x + dx, ny = cur.y + dy;
                const k = `${nx},${ny}`;
                if (byKey.has(k) && !visited.has(k)) {
                    visited.add(k);
                    const p = byKey.get(k);
                    queues[qi].push(p);
                    if (!firstDir) { firstDir = [dx, dy]; firstPt = p; }
                }
            }

            if (firstDir) {
                if (Math.random() < 0.85) prefs[qi] = firstDir;
                dash(firstPt, qi, prefs[qi]);
            }
        }

        if (out.length < target.length) {
            for (const p of target) {
                const k = `${p.x},${p.y}`;
                if (!visited.has(k)) {
                    visited.add(k);
                    const q = [p];
                    while (q.length) {
                        const c = q.shift();
                        out.push(c);
                        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]].sort(() => Math.random() - 0.5)) {
                            const nx = c.x + dx, ny = c.y + dy, kk = `${nx},${ny}`;
                            if (byKey.has(kk) && !visited.has(kk)) { visited.add(kk); q.push(byKey.get(kk)); }
                        }
                    }
                }
            }
        }

        return out;
    }


    function orderByRadialInward(target, w, h) {
        const cx = Math.floor(w / 2), cy = Math.floor(h / 2);
        const r2 = (p) => (p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy);
        const ang = (p) => Math.atan2(p.y - cy, p.x - cx);
        const arr = target.slice();
        arr.sort((a, b) => { const d = r2(b) - r2(a); return d !== 0 ? d : (ang(a) - ang(b)); });
        return arr;
    }
    function orderByRadialOutward(target, w, h) {
        const cx = Math.floor(w / 2), cy = Math.floor(h / 2);
        const r2 = (p) => (p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy);
        const ang = (p) => Math.atan2(p.y - cy, p.x - cx);
        const arr = target.slice();
        arr.sort((a, b) => { const d = r2(a) - r2(b); return d !== 0 ? d : (ang(a) - ang(b)); });
        return arr;
    }
    function orderByColorsBurstRare(target, seedCount) {
        const g = groupByColor(target);
        const colorsAsc = Array.from(g.keys()).sort((a, b) => g.get(a).length - g.get(b).length);
        const out = []; for (const c of colorsAsc) out.push(...orderByBurst(g.get(c), seedCount));
        return out;
    }

    function orderByOutlineThenBurst(target, seedCount) {
        const cmap = new Map(target.map(p => [`${p.x},${p.y}`, p.colorIdx]));
        const isOutline = (p) => {
            const neigh = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            for (const [dx, dy] of neigh) {
                const nx = p.x + dx, ny = p.y + dy;
                const key = `${nx},${ny}`;
                if (!cmap.has(key) || cmap.get(key) !== p.colorIdx) return true;
            }
            return false;
        };

        const outline = [], inside = [];
        for (const p of target) (isOutline(p) ? outline : inside).push(p);

        return [...orderByBurst(outline, seedCount), ...orderByBurst(inside, seedCount)];
    }

    function baseOrderForMode(mode, target, scene) {
        switch (mode) {
            case 'linear': return orderByLinear(target, 'y', false);
            case 'linear-reversed': return orderByLinear(target, 'y', true);
            case 'linear-ltr': return orderByLinear(target, 'x', false);
            case 'linear-rtl': return orderByLinear(target, 'x', true);
            case 'singleColorRandom': return orderByColor(target, true);
            case 'colorByColor': return orderByColor(target, false);
            case 'random': return shuffle(target);
            case 'burst':
                return orderByBurst(target, window.BURST_SEED_COUNT || 2);
            case 'radial-inward':
                return orderByRadialInward(target, scene.w, scene.h);
            case 'radial-outward':
                return orderByRadialOutward(target, scene.w, scene.h);
            case 'colors-burst-rare':
                return orderByColorsBurstRare(target, window.BURST_SEED_COUNT || 2);
            case 'outline-then-burst':
                return orderByOutlineThenBurst(target, window.BURST_SEED_COUNT || 2);
            default:
                return shuffle(target);
        }
    }

    function orderForMode(mode, target, scene) {
        // for regular modes — same as before
        if (mode !== 'burst-mixed') return baseOrderForMode(mode, target, scene);

        // for burst-mixed: split into segments; each segment — a random submode
        const pool = ['outline-then-burst', 'burst', 'colors-burst-rare'];

        // keep remaining points to avoid repainting the same
        const remaining = new Map(target.map(p => [`${p.x},${p.y}`, p]));
        const out = [];

        // segment size ~10% of frame, min 40 px
        const segSize = Math.max(40, Math.floor(target.length * 0.10));

        while (remaining.size) {
            const pick = pool[Math.floor(Math.random() * pool.length)];
            // build order for remaining points by chosen submode
            const ordered = baseOrderForMode(pick, Array.from(remaining.values()), scene);

            const take = Math.min(segSize, ordered.length);
            for (let i = 0; i < take; i++) {
                const p = ordered[i];
                const key = `${p.x},${p.y}`;
                if (remaining.has(key)) { // in case of duplicates
                    out.push(p);
                    remaining.delete(key);
                }
            }
        }
        return out;
    }


    // ---------- drawing ----------
    let currentIndex = clamp(parseInt(localStorage.getItem('wplacer_preview_scene') || '1', 10) - 1, 0, SCENES.length - 1);
    let currentScene = null;
    const sceneCache = new Map(); // id -> {points, palette}

    function getScene(i) {
        const sc = SCENES[i];
        if (!sceneCache.has(sc.id)) {
            sceneCache.set(sc.id, { points: sc.build(), palette: sc.palette, w: sc.w, h: sc.h });
        }
        const entry = sceneCache.get(sc.id);
        return { ...sc, points: entry.points, palette: entry.palette };
    }

    function fillPoints(ctx, cell, scene, points) {
        for (const p of points) {
            ctx.fillStyle = scene.palette[p.colorIdx % scene.palette.length];
            ctx.fillRect(p.x * cell, p.y * cell, cell, cell);
        }
    }

    function drawThumb(canvas, scene) {
        const ctx = canvas.getContext('2d');

        const cssW = canvas.clientWidth || 38;
        const cssH = canvas.clientHeight || 26;
        canvas.width = cssW;
        canvas.height = cssH;

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, cssW, cssH);

        const cell = Math.max(1, Math.floor(Math.min(cssW / scene.w, cssH / scene.h)));
        const w = cell * scene.w;
        const h = cell * scene.h;
        const offx = Math.floor((cssW - w) / 2);
        const offy = Math.floor((cssH - h) / 2);

        const tmp = document.createElement('canvas');
        tmp.width = w; tmp.height = h;
        const tctx = tmp.getContext('2d'); tctx.imageSmoothingEnabled = false;

        fillPoints(tctx, cell, scene, scene.points);
        ctx.drawImage(tmp, offx, offy);
    }

    function redrawThumbs() {
        const wrap = document.getElementById('presetSwitcher');
        if (!wrap) return;
        wrap.querySelectorAll('.preset-btn').forEach(btn => {
            const idx = parseInt(btn.dataset.index, 10);
            const cv = btn.querySelector('canvas');
            if (cv) drawThumb(cv, getScene(idx));
        });
    }
    window.addEventListener('resize', redrawThumbs);

    function drawReference(canvas) {
        ensureUI();
        currentScene = getScene(currentIndex);
        const ctx = canvas.getContext('2d');
        const cell = Math.max(1, Math.floor(Math.min(canvas.width / currentScene.w, canvas.height / currentScene.h)));
        const w = cell * currentScene.w, h = cell * currentScene.h;
        canvas.width = w; canvas.height = h;
        ctx.fillStyle = '#111'; ctx.fillRect(0, 0, w, h);
        fillPoints(ctx, cell, currentScene, currentScene.points);
    }

    const previews = new Map(); // canvas -> timers

    function stop(canvas) {
        const st = previews.get(canvas);
        if (!st) return;
        if (st.intervalId) clearInterval(st.intervalId);
        if (st.restartTimeoutId) clearTimeout(st.restartTimeoutId);
        previews.delete(canvas);
    }
    function stopAll() {
        for (const [, st] of previews) {
            if (st.intervalId) clearInterval(st.intervalId);
            if (st.restartTimeoutId) clearTimeout(st.restartTimeoutId);
        }
        previews.clear();
    }
    function start(canvas) {
        stop(canvas);
        if (!currentScene) currentScene = getScene(currentIndex);
        const scene = currentScene;

        const ctx = canvas.getContext('2d');
        const baseW = canvas.width, baseH = canvas.height;
        const cell = Math.max(1, Math.floor(Math.min(baseW / scene.w, baseH / scene.h)));
        const w = cell * scene.w, h = cell * scene.h;
        canvas.width = w; canvas.height = h;
        ctx.fillStyle = '#111'; ctx.fillRect(0, 0, w, h);

        const mode = canvas.dataset.mode;
        const ordered = orderForMode(mode, scene.points, scene);

        const baseStep = Math.max(4, Math.floor((scene.w * scene.h) / 400));
        const stepPerTick = Math.max(1, Math.floor(baseStep * SPEED));
        const intervalMs = Math.max(16, Math.floor(60 / SPEED));

        let i = 0;
        const intervalId = setInterval(() => {
            for (let s = 0; s < stepPerTick && i < ordered.length; s++, i++) {
                const p = ordered[i];
                ctx.fillStyle = scene.palette[p.colorIdx % scene.palette.length];
                ctx.fillRect(p.x * cell, p.y * cell, cell, cell);
            }
            if (i >= ordered.length) {
                clearInterval(intervalId);

                if (mode === 'burst') {
                    const desired = window.BURST_SEED_COUNT || 2;
                    const entry = getBurstSeeds(scene, desired, scene.points);
                    entry.activeIdx = (entry.activeIdx + 1) % Math.max(1, entry.seeds.length);
                    BURST_SEEDS_CACHE.set(scene.id, entry);
                }

                const restartTimeoutId = setTimeout(() => start(canvas), 700);
                previews.set(canvas, { intervalId: null, restartTimeoutId });
            }
        }, intervalMs);

        previews.set(canvas, { intervalId, restartTimeoutId: null });
    }


    function updateSelectedBtn() {
        const wrap = document.getElementById('presetSwitcher');
        if (!wrap) return;
        wrap.querySelectorAll('.preset-btn').forEach((btn, idx) => {
            if (idx === currentIndex) btn.classList.add('selected'); else btn.classList.remove('selected');
        });
    }
    function ensureUI() {
        const wrap = document.getElementById('presetSwitcher');
        if (!wrap || wrap.dataset.ready === '1') return;

        SCENES.forEach((sc, idx) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'preset-btn';
            btn.dataset.index = String(idx);

            const thumb = document.createElement('canvas');
            thumb.className = 'preset-thumb';
            thumb.width = thumb.clientWidth || 38; thumb.height = thumb.clientHeight || 26;

            const label = document.createElement('span');
            label.className = 'preset-label';
            label.textContent = String(idx + 1);

            btn.appendChild(thumb);
            btn.appendChild(label);
            btn.addEventListener('click', () => {
                setScene(idx);
            });
            wrap.appendChild(btn);

            drawThumb(thumb, getScene(idx));
        });

        wrap.dataset.ready = '1';
        updateSelectedBtn();
    }

    function setScene(idx) {
        currentIndex = clamp(idx, 0, SCENES.length - 1);
        localStorage.setItem('wplacer_preview_scene', String(currentIndex + 1));
        currentScene = getScene(currentIndex);
        updateSelectedBtn();

        const ref = document.getElementById('modeReference');
        if (ref) drawReference(ref);

        document.querySelectorAll('.mode-preview[data-mode]').forEach(cv => {
            stop(cv); start(cv);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        ensureUI();
        const ref = document.getElementById('modeReference');
        if (ref) drawReference(ref);
    });

    return { start, stopAll, drawReference, setScene, ensureUI, drawThumb, redrawThumbs, setSpeed };
})();

// Open changelog on demand
openChangelog?.addEventListener('click', async () => {
    try {
        const [{ data: vers }, ch] = await Promise.all([
            axios.get('/version'),
            axios.get('/changelog')
        ]);
        let changelog = '';
        try {
            const content = (ch.data?.local || '').trim();
            if (content) {
                const mdHtml = renderMarkdown(content);
                changelog = `<div style="max-height:60vh; overflow:auto; border:1px solid var(--border); padding:8px; border-radius:6px; background: rgba(255,255,255,.04); text-align: left;">${mdHtml}</div>`;
            }
        } catch (_) { }
        const html = `<b>Current version</b> ${vers?.local || '?'}<br><br>${changelog || 'No changelog available.'}`;
        showMessageBig('Changelog', html);
    } catch (error) {
        handleError(error);
    }
});

// --- Proxy toggles & actions ---
proxyEnabled?.addEventListener('change', async () => {
    try {
        await axios.put('/settings', { proxyEnabled: proxyEnabled.checked });
        proxyFormContainer.style.display = proxyEnabled.checked ? 'block' : 'none';
        const cdSec = parseInt(accountCooldown.value, 10) || 0;
        if (!proxyEnabled.checked && cdSec === 0) {
            showMessage("Warning", "Account cooldown is 0 while proxies are disabled. This may cause rate limiting or blocks.");
        } else {
            showMessage("Success", "Proxy setting saved!");
        }
    } catch (error) { handleError(error); }
});

proxyRotationMode?.addEventListener('change', async () => {
    try {
        await axios.put('/settings', { proxyRotationMode: proxyRotationMode.value });
        showMessage("Success", "Proxy rotation mode saved!");
    } catch (error) { handleError(error); }
});

logProxyUsage?.addEventListener('change', async () => {
    try {
        await axios.put('/settings', { logProxyUsage: logProxyUsage.checked });
        showMessage("Success", "Proxy logging setting saved!");
    } catch (error) { handleError(error); }
});

reloadProxiesBtn?.addEventListener('click', async () => {
    try {
        reloadProxiesBtn.disabled = true;
        reloadProxiesBtn.textContent = "Reloading...";
        const { data } = await axios.post('/reload-proxies', {});
        if (data && typeof data.count === 'number') {
            proxyCount.textContent = String(data.count);
        }
        showMessage("Success", "Proxies reloaded successfully!");
    } catch (error) {
        handleError(error);
    } finally {
        reloadProxiesBtn.disabled = false;
        reloadProxiesBtn.textContent = "Reload proxies.txt";
    }
});

// Test proxies
const testProxiesBtn = $("testProxiesBtn");
const testProxiesResult = $("testProxiesResult");
const testProxiesProgress = $("testProxiesProgress");
const cleanupBlockedBtn = $("cleanupBlockedBtn");
const cleanupBlockedWrap = $("cleanupBlockedWrap");
testProxiesBtn?.addEventListener('click', async () => {
    if (!testProxiesBtn || !testProxiesResult) return;
    try {
        testProxiesBtn.disabled = true;
        testProxiesBtn.textContent = "Testing...";
        testProxiesResult.style.display = 'none';
        testProxiesProgress.style.display = 'block';
        testProxiesProgress.textContent = 'Progress: 0% (0 tested)';
        testProxiesResult.innerHTML = '';

        // Live per-proxy test (target=/me), with controlled concurrency
        const settingsResp = await axios.get('/settings');
        const total = Number(settingsResp?.data?.proxyCount || 0);
        if (!Number.isFinite(total) || total <= 0) {
            showMessage('Error', 'No proxies loaded.');
            testProxiesProgress.style.display = 'none';
            return;
        }
        const idxs = Array.from({ length: total }, (_, i) => i + 1);
        const results = new Array(total);
        let tested = 0, ok = 0, blocked = 0;
        const concurrency = 8;
        let cursor = 0;
        const worker = async () => {
            while (true) {
                const my = cursor++;
                if (my >= total) return;
                const idx = idxs[my];
                const one = await axios.get('/test-proxy', { params: { idx, target: 'me' } }).then(x => x.data).catch(() => null);
                const row = one || { idx, proxy: '?', ok: false, status: 0, reason: 'error', elapsedMs: 0 };
                results[my] = row;
                tested++;
                if (row.ok) ok++; else blocked++;
                const pct = Math.round(tested / total * 100);
                testProxiesProgress.textContent = `Progress: ${pct}% (${tested} tested)`;
            }
        };
        await Promise.all(Array.from({ length: Math.min(concurrency, total) }, () => worker()));

        const rows = results
            .map(r => {
                const status = r.ok ? '<span style="color:#22c55e">OK</span>' : '<span style="color:#ef4444">BLOCKED</span>';
                const reason = r.ok ? (r.reason || 'ok') : (r.reason || 'unknown');
                return `<tr>
                    <td style="padding:4px 8px;">#${r.idx}</td>
                    <td style="padding:4px 8px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;">${r.proxy}</td>
                    <td style="padding:4px 8px;">${status}</td>
                    <td style="padding:4px 8px;">${reason}</td>
                    <td style="padding:4px 8px;">${r.elapsedMs | 0} ms</td>
                </tr>`;
            })
            .join('');
        const summary = `<div><b>Total:</b> ${total} • <b>OK:</b> ${ok} • <b>Blocked:</b> ${blocked} <span class=\"muted\">(target: /me)</span></div>`;
        testProxiesResult.innerHTML = `${summary}
            <div style="max-height:220px; overflow:auto; border:1px solid var(--border); border-radius:6px; margin-top:6px;">
                <table style="width:100%; border-collapse: collapse; font-size: 12px;">
                    <thead>
                        <tr style="background: rgba(255,255,255,.04)">
                            <th style="text-align:left; padding:6px 8px;">#</th>
                            <th style="text-align:left; padding:6px 8px;">Proxy</th>
                            <th style="text-align:left; padding:6px 8px;">Status</th>
                            <th style="text-align:left; padding:6px 8px;">Reason</th>
                            <th style="text-align:left; padding:6px 8px;">Latency</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <div style="margin-top:6px; font-size:12px; opacity:.85;">
                Tip: Consider removing proxies marked as "BLOCKED" from <code>data/proxies.txt</code> to avoid degraded performance and Cloudflare challenges. However, keep in mind that sometimes a proxy may work inconsistently (e.g., blocked at one moment but available later), so you may not always want to remove it permanently.
            </div>`;
        testProxiesResult.style.display = 'block';
        testProxiesProgress.style.display = 'none';
        // Show cleanup button if there are blocked ones
        if (blocked > 0) {
            cleanupBlockedWrap.style.display = 'block';
            cleanupBlockedBtn.dataset.blockedIdx = JSON.stringify(
                results.filter(r => !r.ok).map(r => r.idx)
            );
        } else {
            cleanupBlockedWrap.style.display = 'none';
            cleanupBlockedBtn.dataset.blockedIdx = '[]';
        }
        showMessage('Success', 'Proxy test finished.');
    } catch (error) {
        handleError(error);
    } finally {
        testProxiesBtn.disabled = false;
        testProxiesBtn.textContent = 'Test proxies';
    }
});

// --- Logs toggles ---
['tokenManager', 'cache', 'queuePreview', 'painting', 'startTurn', 'mismatches', 'estimatedTime'].forEach(key => {
    const el = document.getElementById('log_' + key);
    el?.addEventListener('change', async () => {
        try {
            const lc = {}; lc[key] = el.checked;
            await axios.put('/settings', { logCategories: lc });
            showMessage('Success', 'Log category saved!');
        } catch (e) { handleError(e); }
    });
});

// Cleanup blocked proxies with confirmation
cleanupBlockedBtn?.addEventListener('click', async () => {
    try {
        const raw = cleanupBlockedBtn.dataset.blockedIdx || '[]';
        const toRemove = JSON.parse(raw || '[]');
        if (!Array.isArray(toRemove) || toRemove.length === 0) {
            showMessage('Info', 'No BLOCKED proxies to remove.');
            return;
        }
        showConfirmation('Remove BLOCKED proxies', `Are you sure you want to remove ${toRemove.length} blocked proxies? A backup will be created.`, async () => {
            try {
                const resp = await axios.post('/proxies/cleanup', { removeIdx: toRemove });
                if (resp?.data?.success) {
                    showMessage('Success', `Removed ${resp.data.removed} proxies. Kept: ${resp.data.kept}. Backup: ${resp.data.backup}`);
                    // Refresh count in UI
                    try {
                        const { data } = await axios.post('/reload-proxies', {});
                        if (data && typeof data.count === 'number') proxyCount.textContent = String(data.count);
                    } catch (_) { }
                    cleanupBlockedWrap.style.display = 'none';
                } else {
                    showMessage('Error', 'Cleanup failed.');
                }
            } catch (error) {
                handleError(error);
            }
        });
    } catch (error) { handleError(error); }
});

parallelWorkers?.addEventListener('change', async () => {
    try {
        const v = Math.max(1, Math.min(32, parseInt(parallelWorkers.value, 10) || 4));
        parallelWorkers.value = String(v);
        await axios.put('/settings', { parallelWorkers: v });
        showMessage('Success', 'Concurrent workers saved!');
    } catch (e) {
        handleError(e);
    }
});

// Palette
const COLORS = [
    { id: 0, name: "Transparent", rgb: [0, 0, 0] },
    { id: 1, name: "Black", rgb: [0, 0, 0] },
    { id: 2, name: "Dark Gray", rgb: [60, 60, 60] },
    { id: 3, name: "Gray", rgb: [120, 120, 120] },
    { id: 4, name: "Light Gray", rgb: [210, 210, 210] },
    { id: 5, name: "White", rgb: [255, 255, 255] },
    { id: 6, name: "Deep Red", rgb: [96, 0, 24] },
    { id: 7, name: "Red", rgb: [237, 28, 36] },
    { id: 8, name: "Orange", rgb: [255, 127, 39] },
    { id: 9, name: "Gold", rgb: [246, 170, 9] },
    { id: 10, name: "Yellow", rgb: [249, 221, 59] },
    { id: 11, name: "Light Yellow", rgb: [255, 250, 188] },
    { id: 12, name: "Dark Green", rgb: [14, 185, 104] },
    { id: 13, name: "Green", rgb: [19, 230, 123] },
    { id: 14, name: "Light Green", rgb: [135, 255, 94] },
    { id: 15, name: "Dark Teal", rgb: [12, 129, 110] },
    { id: 16, name: "Teal", rgb: [16, 174, 166] },
    { id: 17, name: "Light Teal", rgb: [19, 225, 190] },
    { id: 18, name: "Dark Blue", rgb: [40, 80, 158] },
    { id: 19, name: "Blue", rgb: [64, 147, 228] },
    { id: 20, name: "Cyan", rgb: [96, 247, 242] },
    { id: 21, name: "Indigo", rgb: [107, 80, 246] },
    { id: 22, name: "Light Indigo", rgb: [153, 177, 251] },
    { id: 23, name: "Dark Purple", rgb: [120, 12, 153] },
    { id: 24, name: "Purple", rgb: [170, 56, 185] },
    { id: 25, name: "Light Purple", rgb: [224, 159, 249] },
    { id: 26, name: "Dark Pink", rgb: [203, 0, 122] },
    { id: 27, name: "Pink", rgb: [236, 31, 128] },
    { id: 28, name: "Light Pink", rgb: [243, 141, 169] },
    { id: 29, name: "Dark Brown", rgb: [104, 70, 52] },
    { id: 30, name: "Brown", rgb: [149, 104, 42] },
    { id: 31, name: "Beige", rgb: [248, 178, 119] },
    { id: 32, name: "Medium Gray", rgb: [170, 170, 170] },
    { id: 33, name: "Dark Red", rgb: [165, 14, 30] },
    { id: 34, name: "Light Red", rgb: [250, 128, 114] },
    { id: 35, name: "Dark Orange", rgb: [228, 92, 26] },
    { id: 36, name: "Light Tan", rgb: [214, 181, 148] },
    { id: 37, name: "Dark Goldenrod", rgb: [156, 132, 49] },
    { id: 38, name: "Goldenrod", rgb: [197, 173, 49] },
    { id: 39, name: "Light Goldenrod", rgb: [232, 212, 95] },
    { id: 40, name: "Dark Olive", rgb: [74, 107, 58] },
    { id: 41, name: "Olive", rgb: [90, 148, 74] },
    { id: 42, name: "Light Olive", rgb: [132, 197, 115] },
    { id: 43, name: "Dark Cyan", rgb: [15, 121, 159] },
    { id: 44, name: "Light Cyan", rgb: [187, 250, 242] },
    { id: 45, name: "Light Blue", rgb: [125, 199, 255] },
    { id: 46, name: "Dark Indigo", rgb: [77, 49, 184] },
    { id: 47, name: "Dark Slate Blue", rgb: [74, 66, 132] },
    { id: 48, name: "Slate Blue", rgb: [122, 113, 196] },
    { id: 49, name: "Light Slate Blue", rgb: [181, 174, 241] },
    { id: 50, name: "Light Brown", rgb: [219, 164, 99] },
    { id: 51, name: "Dark Beige", rgb: [209, 128, 81] },
    { id: 52, name: "Light Beige", rgb: [255, 197, 165] },
    { id: 53, name: "Dark Peach", rgb: [155, 82, 73] },
    { id: 54, name: "Peach", rgb: [209, 128, 120] },
    { id: 55, name: "Light Peach", rgb: [250, 182, 164] },
    { id: 56, name: "Dark Tan", rgb: [123, 99, 82] },
    { id: 57, name: "Tan", rgb: [156, 132, 107] },
    { id: 58, name: "Dark Slate", rgb: [51, 57, 65] },
    { id: 59, name: "Slate", rgb: [109, 117, 141] },
    { id: 60, name: "Light Slate", rgb: [179, 185, 209] },
    { id: 61, name: "Dark Stone", rgb: [109, 100, 63] },
    { id: 62, name: "Stone", rgb: [148, 140, 107] },
    { id: 63, name: "Light Stone", rgb: [205, 197, 158] }
];

function getContrastColor(r, g, b) {
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    return luma > 186 ? "#000" : "#fff";
}

function computePalette(template) {
    const counts = new Map();
    const { width, height, data } = template || {};
    if (!width || !height || !data) return [];
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const id = data[x][y] | 0;
            if (id <= 0) continue;
            counts.set(id, (counts.get(id) || 0) + 1);
        }
    }
    const items = [];
    for (const [id, count] of counts.entries()) {
        const rgbStr = colorById(id);
        if (!rgbStr) continue;
        const isPremium = id >= 32 && id <= 63;
        items.push({ id, rgb: rgbStr, count, isPremium });
    }
    items.sort((a, b) => (b.count - a.count) || (a.id - b.id));
    return items;
}

function renderPalette(template) {
    const list = document.getElementById('paletteList');
    const uniqueEl = document.getElementById('paletteUnique');
    const totalEl = document.getElementById('paletteTotal');
    if (!list || !uniqueEl || !totalEl) return;

    const items = computePalette(template);
    uniqueEl.textContent = String(items.length);
    const totalPainted = items.reduce((acc, it) => acc + it.count, 0);
    totalEl.textContent = String(totalPainted);

    list.innerHTML = items.map(it => {
        const meta = COLORS.find(c => c.id === it.id);
        const name = meta ? meta.name : 'Unknown';
        const [r, g, b] = meta ? meta.rgb : it.rgb.split(',').map(Number);
        const textColor = getContrastColor(r, g, b);
        const kind = it.isPremium ? 'Premium' : 'Basic';

        return `
      <article class="palette-item" data-id="${it.id}" data-kind="${kind.toLowerCase()}" title="ID ${it.id}">
        <div class="swatch" style="background: rgb(${r}, ${g}, ${b}); color: ${textColor}; font-size: 10px;">#${it.id}</div>
        <div class="palette-meta">
            <span class="name">${name}</span>
            <span class="type ${kind.toLowerCase()}">${kind} (${it.count} px)</span>
        </div>
      </article>
    `;
    }).join('');
}

function killPreviewPipelines() {
    // invalidate async fetches/previews
    if (typeof previewRenderId !== 'undefined') previewRenderId++;
    if (typeof MT_PREVIEW_RENDER_ID !== 'undefined') MT_PREVIEW_RENDER_ID++;

    // fade-out visible canvases
    if (previewCanvas) {
        const c = previewCanvas.getContext('2d');
        if (c) c.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCanvas.width = 0;
        previewCanvas.height = 0;
        previewCanvas.style.display = 'none';
    }
    if (templateCanvas) {
        const c2 = templateCanvas.getContext('2d');
        if (c2) c2.clearRect(0, 0, templateCanvas.width, templateCanvas.height);
        templateCanvas.width = 0;
        templateCanvas.height = 0;
    }

    // hide fullscreen preview just in case
    const ov = document.getElementById('mtPreviewOverlay');
    if (ov) ov.style.display = 'none';
}

function fillEditorFromTemplate(t) {
    killPreviewPipelines();
    if (convertInput) convertInput.value = '';
    // === 1) Full reset of previous state ===
    try {
        // hide/clear preview
        if (previewCanvas) { previewCanvas.width = 0; previewCanvas.height = 0; previewCanvas.style.display = "none"; }
        // clear working canvas
        if (templateCanvas) {
            const ctx = templateCanvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, templateCanvas.width, templateCanvas.height);
            templateCanvas.width = 0;
            templateCanvas.height = 0;
        }
        // reset palette panel
        const list = document.getElementById('paletteList');
        const uniqueEl = document.getElementById('paletteUnique');
        const totalEl = document.getElementById('paletteTotal');
        if (list) list.innerHTML = '';
        if (uniqueEl) uniqueEl.textContent = '0';
        if (totalEl) totalEl.textContent = '0';
        // clear current template state
        currentTemplate = { width: 0, height: 0, data: [] };
        // remove previous toggle handler if any
        if (usePaidColors && usePaidColors.__editHandler) {
            usePaidColors.removeEventListener('change', usePaidColors.__editHandler);
            usePaidColors.__editHandler = null;
        }
    } catch (_) { }

    // === 2) Template from the card ===
    const tpl = t?.template;
    if (!tpl || !tpl.width || !tpl.height) return;

    // helper mini-functions
    const recalcInk = (template) => {
        let cnt = 0;
        const { width, height, data } = template;
        for (let x = 0; x < width; x++) for (let y = 0; y < height; y++) if ((data[x][y] | 0) > 0) cnt++;
        return cnt;
    };
    const hasAnyPremium = (template) => {
        const { width, height, data } = template;
        for (let x = 0; x < width; x++) for (let y = 0; y < height; y++) if ((data[x][y] | 0) >= 32) return true;
        return false;
    };
    // premium → nearest basic using colorById/closest/basic_colors
    const projectToBasicPalette = (src) => {
        const { width, height, data } = src;
        const m = Array.from({ length: width }, () => Array(height).fill(0));
        let inkCount = 0;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let id = data[x][y] | 0;
                if (id <= 0) { m[x][y] = 0; continue; }
                if (id >= 32) { // premium — map to basic
                    const rgb = colorById(id);               // "r,g,b"
                    id = (rgb && basic_colors[rgb]) ? basic_colors[rgb] : closest(rgb);
                }
                m[x][y] = id;
                inkCount++;
            }
        }
        return { width, height, data: m, ink: inkCount };
    };

    // === 3) Prepare two variants and the toggle ===
    const paidVariant = {
        width: tpl.width,
        height: tpl.height,
        data: tpl.data.map(col => col.slice()),
        ink: (typeof tpl.ink === 'number') ? tpl.ink : recalcInk(tpl)
    };
    const basicVariant = projectToBasicPalette(paidVariant);

    // toggle Use premium (paid) colors — enable/disable by template content
    if (usePaidColors) usePaidColors.checked = hasAnyPremium(paidVariant);

    // === 4) Apply variant + simple UI update via existing functions ===
    const apply = (variant) => {
        currentTemplate = variant;
        // no canvas size reset — just redraw to avoid flicker
        drawTemplate(currentTemplate, templateCanvas);
        details.style.display = "block";
        // do not hide details on toggle to avoid flicker
        size.textContent = `${currentTemplate.width}x${currentTemplate.height}px`;
        ink.textContent = String(typeof currentTemplate.ink === 'number' ? currentTemplate.ink : recalcInk(currentTemplate));
        renderPalette(currentTemplate);
        if (editTmpltMsg) editTmpltMsg.style.display = "block";
    };

    apply(usePaidColors && usePaidColors.checked ? paidVariant : basicVariant);
    resortUsersAfterPalette();

    const selInit = document.getElementById('userSortMode');
    if (selInit) {
        selInit.value = 'priority';
        selInit.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // === 5) Toggle while editing — just apply needed variant ===
    if (usePaidColors) {
        usePaidColors.__editHandler = () => {
            apply(usePaidColors.checked ? paidVariant : basicVariant);
            requestAnimationFrame(() => {
                const sel = document.getElementById('userSortMode');
                if (sel) { sel.value = 'priority'; sel.dispatchEvent(new Event('change', { bubbles: true })); }
            });
        };
        usePaidColors.addEventListener('change', usePaidColors.__editHandler);
    }

}

function resortUsersAfterPalette(maxTries = 40, delay = 50) {
    let tries = 0;
    (function tick() {
        const sel = document.getElementById('userSortMode');
        if (sel && sel._bound) {
            sel.value = 'priority';
            sel.dispatchEvent(new Event('change', { bubbles: true }));
            return;
        }
        if (++tries < maxTries) setTimeout(tick, delay);
    })();
}


// colorsManager
const colorsManager = $("colorsManager");
const paletteAllColors = $("paletteAllColors");
const colorDetailsCard = $("colorDetailsCard");
const selectedColorTitle = $("selectedColorTitle");
const selectedColorKind = $("selectedColorKind");
const selectedColorId = $("selectedColorId");
const selectedColorSwatch = $("selectedColorSwatch");
const usersHaveColor = $("usersHaveColor");
const usersNoColor = $("usersNoColor");
const selectAllNoColor = $("selectAllNoColor");
const UnselectAllNoColor = $("UnselectAllNoColor");
const purchaseColorBtn = $("purchaseColorBtn");
const purchaseReport = $("purchaseReport");
const editTmpltMsg = $("editTmpltMsg");

let COLORS_INIT = false;
let CURRENT_SELECTED_COLOR = null;

// USERS_COLOR_STATE[userId] = { name, extraColorsBitmap, droplets }
const USERS_COLOR_STATE = {};

// Colors cache in localStorage
const COLORS_CACHE_KEY = 'wplacer_colors_cache_v1';
let COLORS_CACHE = null;
try { COLORS_CACHE = JSON.parse(localStorage.getItem(COLORS_CACHE_KEY) || 'null'); } catch (_) { COLORS_CACHE = null; }
const saveColorsCache = () => { try { localStorage.setItem(COLORS_CACHE_KEY, JSON.stringify(COLORS_CACHE)); } catch (_) { } };
const colorsLastCheckLabel = $("colorsLastCheckLabel");
const usersColorsLastCheckLabel = $("usersColorsLastCheckLabel");
const checkColorsAll = $("checkColorsAll");
const loadColorsCacheBtn = $("loadColorsCache");

function buildAllColorsPalette() {
    if (!paletteAllColors) return;
    const items = COLORS.filter(c => c.id !== 0);
    // prepare owners count map per color
    const countByColor = new Map();
    try {
        const mapById = COLORS_CACHE?.report?.reduce((m, r) => { if (r && r.userId && !r.error) m[r.userId] = r; return m; }, {}) || {};
        for (const uid of Object.keys(mapById)) {
            const bitmap = mapById[uid].extraColorsBitmap | 0;
            for (let cid = 1; cid <= 63; cid++) {
                const has = cid < 32 ? true : ((bitmap & (1 << (cid - 32))) !== 0);
                if (has) countByColor.set(cid, (countByColor.get(cid) || 0) + 1);
            }
        }
    } catch (_) { }

    paletteAllColors.innerHTML = items.map(it => {
        const [r, g, b] = it.rgb;
        const textColor = getContrastColor(r, g, b);
        const kind = it.id >= 32 ? 'Premium' : 'Basic';
        const cnt = countByColor.get(it.id) || 0;
        const badge = (it.id >= 32 && cnt > 0) ? `<span class="count-badge" title="Users with this color">${cnt}</span>` : '';
        return `
      <article class="palette-item color-tile" data-color-id="${it.id}" data-kind="${kind.toLowerCase()}" title="ID ${it.id}">
        <div class="swatch" style="background: rgb(${r}, ${g}, ${b}); color: ${textColor}">#${it.id}</div>
        <div class="palette-meta">
          <span class="name">${it.name}</span>
          <span class="type ${kind.toLowerCase()}">${kind}</span>
        </div>
        ${badge}
      </article>
    `;
    }).join('');
}

function hasPremiumColor(extraColorsBitmap, colorId) {
    // premium: 32..63
    if (colorId < 32) return true;
    const bit = (colorId - 32);
    return (extraColorsBitmap & (1 << bit)) !== 0;
}

async function loadUsersColorState(fromCacheOnly = false) {
    const { data: users } = await axios.get("/users");
    if (fromCacheOnly) {
        const mapById = COLORS_CACHE?.report?.reduce((m, r) => { if (r && r.userId && !r.error) m[r.userId] = r; return m; }, {}) || {};
        for (const id of Object.keys(users)) {
            const r = mapById[id];
            if (!r) continue;
            USERS_COLOR_STATE[id] = {
                name: users[id]?.name || `#${id}`,
                extraColorsBitmap: r.extraColorsBitmap | 0,
                droplets: r.droplets | 0
            };
            LAST_USER_STATUS[id] = {
                ...(LAST_USER_STATUS[id] || {}),
                droplets: r.droplets | 0,
                max: r.charges?.max ?? (LAST_USER_STATUS[id]?.max ?? 0),
                charges: Math.floor(r.charges?.count ?? (LAST_USER_STATUS[id]?.charges ?? 0)),
                level: Math.floor(r.level ?? (LAST_USER_STATUS[id]?.level ?? 0)),
                progress: Math.round((r.progress ?? 0) | 0),
                extraColorsBitmap: r.extraColorsBitmap | 0,
            };
        }
        saveLastStatus();
        return;
    }

    const { data } = await axios.post('/users/colors-check', {});
    COLORS_CACHE = { ts: data?.ts || Date.now(), report: data?.report || [] };
    saveColorsCache();
    // Rebuild palette to refresh badges without page reload
    try { buildAllColorsPalette(); } catch (_) { }
    if (colorsLastCheckLabel) colorsLastCheckLabel.textContent = new Date(COLORS_CACHE.ts).toLocaleString();
    if (usersColorsLastCheckLabel) usersColorsLastCheckLabel.textContent = new Date(COLORS_CACHE.ts).toLocaleString();

    const mapById = COLORS_CACHE.report.reduce((m, r) => { if (r && r.userId && !r.error) m[r.userId] = r; return m; }, {});
    for (const [id, u] of Object.entries(users)) {
        const r = mapById[id];
        if (!r) continue;
        USERS_COLOR_STATE[id] = {
            name: u?.name || `#${id}`,
            extraColorsBitmap: r.extraColorsBitmap | 0,
            droplets: r.droplets | 0
        };
        LAST_USER_STATUS[id] = {
            ...(LAST_USER_STATUS[id] || {}),
            droplets: r.droplets | 0,
            max: r.charges?.max ?? (LAST_USER_STATUS[id]?.max ?? 0),
            charges: Math.floor(r.charges?.count ?? (LAST_USER_STATUS[id]?.charges ?? 0)),
            level: Math.floor(r.level ?? (LAST_USER_STATUS[id]?.level ?? 0)),
            progress: Math.round((r.progress ?? 0) | 0),
            extraColorsBitmap: r.extraColorsBitmap | 0,
        };
    }
    saveLastStatus();
    // Refresh current color details and palette badges
    try { buildAllColorsPalette(); } catch (_) { }
}

function showColorDetails(colorId) {
    CURRENT_SELECTED_COLOR = colorId;
    const meta = COLORS.find(c => c.id === colorId);
    if (!meta) return;
    const [r, g, b] = meta.rgb;
    selectedColorTitle.textContent = meta.name;
    selectedColorKind.textContent = colorId >= 32 ? "Premium" : "Basic";
    selectedColorKind.classList.toggle('premium', colorId >= 32);
    selectedColorId.textContent = String(colorId);
    selectedColorSwatch.style.background = `rgb(${r}, ${g}, ${b})`;
    selectedColorSwatch.style.color = getContrastColor(r, g, b);
    selectedColorSwatch.textContent = `#${colorId}`;

    const have = [];
    const notHave = [];
    for (const uid of Object.keys(USERS_COLOR_STATE)) {
        const u = USERS_COLOR_STATE[uid];
        if (hasPremiumColor(u.extraColorsBitmap, colorId)) have.push({ id: uid, name: u.name });
        else notHave.push({ id: uid, name: u.name });
    }

    usersHaveColor.classList.add('chips');
    usersHaveColor.innerHTML = have.length
        ? have.map(u => `
        <span class="account-chip" title="#${u.id}">
          <span class="account-name">${u.name}</span>
          <span class="account-id-badge">#${u.id}</span>
        </span>`).join('')
        : `<span class="muted">Nobody has this color yet.</span>`;

    usersNoColor.innerHTML = notHave.length
        ? notHave.map(u => {
            const last = (LAST_USER_STATUS?.[u.id] || {});
            const drops = (typeof last.droplets === 'number') ? last.droplets : '-';
            return `
        <div class="user-select-item">
          <input type="checkbox" id="color_user_${u.id}" value="${u.id}">
          <label class="label-margin0" for="color_user_${u.id}">
            ${u.name} <span class="muted">(#${u.id})</span>
          </label>
          <span class="drops-badge" title="Droplets at last check">${drops} drops</span>
        </div>`;
        }).join('')
        : `<span class="muted">Everyone already has this color.</span>`;

    const premium = colorId >= 32;
    purchaseColorBtn.style.display = premium ? 'inline-flex' : 'none';
    selectAllNoColor?.parentElement?.classList?.toggle('hidden', !premium);
    if (premium && notHave.length === 0) purchaseColorBtn.style.display = 'none';

    colorDetailsCard.style.display = 'block';
}

async function initColorsManager() {
    if (!COLORS_INIT) {
        buildAllColorsPalette();
        COLORS_INIT = true;
    }
    // show date if cache exists
    if (COLORS_CACHE?.ts && colorsLastCheckLabel) colorsLastCheckLabel.textContent = new Date(COLORS_CACHE.ts).toLocaleString();
    if (COLORS_CACHE?.ts && usersColorsLastCheckLabel) usersColorsLastCheckLabel.textContent = new Date(COLORS_CACHE.ts).toLocaleString();
    // by default, load from cache only, no server trigger
    if (COLORS_CACHE) await loadUsersColorState(true);
    if (CURRENT_SELECTED_COLOR == null) {
        const firstPremium = COLORS.find(c => c.id >= 32)?.id ?? 32;
        showColorDetails(firstPremium);
    } else {
        showColorDetails(CURRENT_SELECTED_COLOR);
    }
}

paletteAllColors?.addEventListener('click', (e) => {
    const tile = e.target.closest('.color-tile');
    if (!tile) return;
    const cid = parseInt(tile.dataset.colorId, 10);
    if (!Number.isFinite(cid)) return;
    // visually mark selected
    paletteAllColors.querySelectorAll('.color-tile.selected').forEach(el => el.classList.remove('selected'));
    tile.classList.add('selected');
    showColorDetails(cid);
});

selectAllNoColor?.addEventListener('click', () => {
    usersNoColor.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
});
UnselectAllNoColor?.addEventListener('click', () => {
    usersNoColor.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
});

purchaseColorBtn?.addEventListener('click', async () => {
    if (CURRENT_SELECTED_COLOR == null) {
        showMessage("Error", "Select a color first.");
        return;
    }
    const colorId = CURRENT_SELECTED_COLOR;
    if (colorId < 32) {
        showMessage("Info", "Basic colors are available for everyone. No purchase required.");
        return;
    }
    const selectedUserIds = Array.from(usersNoColor.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    if (!selectedUserIds.length) {
        showMessage("Error", "Select at least one user without this color.");
        return;
    }

    const COUNT = selectedUserIds.length;
    const COST_PER = 2000;
    const totalCost = COUNT * COST_PER;
    const confirmHtml = `
      <div style="text-align:left; line-height:1.45">
        <b>Color:</b> #${colorId}<br>
        <b>Users:</b> ${COUNT}<br>
        <b>Cost per user:</b> ${COST_PER} droplets<br>
        <b>Total cost (max):</b> ${totalCost} droplets
      </div>`;

    showConfirmation('Confirm purchase', confirmHtml, async () => {
        let timer = null;
        try {
            purchaseColorBtn.disabled = true;
            purchaseColorBtn.textContent = "Processing...";

            // progress polling like in Colors Check (All)
            const updateProgress = async () => {
                try {
                    const { data } = await axios.get('/users/purchase-color/progress');
                    const total = data?.total || 0;
                    const completed = data?.completed || 0;
                    if (data?.active && total > 0) {
                        purchaseColorBtn.textContent = `Processing... ${completed}/${total}`;
                    }
                } catch (_) { /* ignore */ }
            };
            timer = setInterval(updateProgress, 500);
            updateProgress().catch(() => { });

            const { data } = await axios.post('/users/purchase-color', {
                colorId,
                userIds: selectedUserIds
            });

            const report = data?.report || [];
            let ok = 0, skipped = 0, failed = 0;
            const lines = report.map(r => {
                if (r.error) { failed++; return `❌ ${r.name} (#${r.userId}): ${r.error}`; }
                if (r.skipped) { skipped++; return `⏭️ ${r.name} (#${r.userId}): ${r.reason || 'skipped'}`; }
                if (r.ok || r.success) { ok++; }
                const before = (r.beforeDroplets ?? '-'), after = (r.afterDroplets ?? '-');
                return `✅ ${r.name} (#${r.userId}) — purchased. Droplets ${before} → ${after}`;
            });

            const html = `
      <b>Color:</b> #${colorId}<br>
      <b>Purchased:</b> ${ok}<br>
      <b>Skipped:</b> ${skipped}<br>
      <b>Failed:</b> ${failed}<br><br>
      ${lines.slice(0, 20).join('<br>')}
      ${lines.length > 20 ? `<br>...and ${lines.length - 20} more` : ''}
    `;
            showMessage("Purchase Report", html);

            // locally update cache only for users with ok/updated
            try {
                const nowTs = Date.now();
                const byId = new Map((COLORS_CACHE?.report || []).map(r => [String(r.userId), r]));
                for (const r of report) {
                    if (r && !r.error && !r.skipped) {
                        const prev = byId.get(String(r.userId));
                        byId.set(String(r.userId), {
                            userId: String(r.userId),
                            name: r.name,
                            extraColorsBitmap: (prev?.extraColorsBitmap ?? 0) | (1 << (colorId - 32)),
                            droplets: r.afterDroplets ?? prev?.droplets ?? 0,
                            charges: prev?.charges ?? { count: 0, max: 0 },
                            level: prev?.level ?? 0,
                            progress: prev?.progress ?? 0
                        });
                    }
                }
                COLORS_CACHE = { ts: nowTs, report: Array.from(byId.values()) };
                saveColorsCache();
                if (colorsLastCheckLabel) colorsLastCheckLabel.textContent = new Date(nowTs).toLocaleString();
                if (usersColorsLastCheckLabel) usersColorsLastCheckLabel.textContent = new Date(nowTs).toLocaleString();
            } catch (_) { }
            await loadUsersColorState(true);
            // Rebuild palette to update badges immediately and keep current selection
            try { buildAllColorsPalette(); } catch (_) { }
            showColorDetails(colorId);
        } catch (error) {
            handleError(error);
        } finally {
            if (timer) clearInterval(timer);
            purchaseColorBtn.disabled = false;
            purchaseColorBtn.textContent = "Attempt to Buy for Selected";
        }
    });
});

// Buttons in Colors tab
checkColorsAll?.addEventListener('click', async () => {
    let timer = null;
    try {
        checkColorsAll.disabled = true;
        checkColorsAll.textContent = 'Checking...';

        // progress polling
        const updateProgress = async () => {
            try {
                const { data } = await axios.get('/users/colors-check/progress');
                const total = data?.total || 0;
                const completed = data?.completed || 0;
                if (data?.active && total > 0) {
                    checkColorsAll.textContent = `Checking... ${completed}/${total}`;
                }
            } catch (_) { /* ignore */ }
        };
        timer = setInterval(updateProgress, 500);
        // kick first read
        updateProgress().catch(() => { });

        await loadUsersColorState(false);
        try { buildAllColorsPalette(); } catch (_) { }
        const id = CURRENT_SELECTED_COLOR ?? (COLORS.find(c => c.id >= 32)?.id ?? 32);
        showColorDetails(id);
    } catch (e) { handleError(e); }
    finally {
        if (timer) clearInterval(timer);
        checkColorsAll.disabled = false;
        checkColorsAll.innerHTML = '<img src="icons/check.svg" alt="" />Check Colors (All)';
    }
});

loadColorsCacheBtn?.addEventListener('click', async () => {
    if (!COLORS_CACHE) {
        showMessage('Info', 'No cached data yet. Press "Check Colors (All)" first.');
        return;
    }
    if (colorsLastCheckLabel && COLORS_CACHE.ts) colorsLastCheckLabel.textContent = new Date(COLORS_CACHE.ts).toLocaleString();
    if (usersColorsLastCheckLabel && COLORS_CACHE.ts) usersColorsLastCheckLabel.textContent = new Date(COLORS_CACHE.ts).toLocaleString();
    await loadUsersColorState(true);
    try { buildAllColorsPalette(); } catch (_) { }
    const id = CURRENT_SELECTED_COLOR ?? (COLORS.find(c => c.id >= 32)?.id ?? 32);
    showColorDetails(id);
});

// --- Import JWT tokens from file ---
if (typeof importJwtBtn !== 'undefined' && importJwtBtn && typeof importJwtFile !== 'undefined' && importJwtFile) {
    const CONCURRENCY = 6; // tune this (requests at once)
    const short = (s, n = 8) => (typeof s === 'string' ? `${s.slice(0, n)}…` : '');

    importJwtBtn.addEventListener('click', () => importJwtFile.click());

    importJwtFile.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const originalHtml = importJwtBtn.innerHTML;
        const showBusy = (done, total) => {
            importJwtBtn.disabled = true;
            importJwtBtn.innerHTML = total ? `Importing (${done}/${total})` : 'Importing…';
        };
        const clearBusy = () => {
            importJwtBtn.disabled = false;
            importJwtBtn.innerHTML = originalHtml;
        };

        try {
            const text = await file.text();

            // Parse lines, trim, ignore comments, strip quotes, remove empties
            const rawLines = text.split(/\r?\n/).map(l => l.trim());
            const parsed = rawLines
                .map(l => {
                    if (!l) return '';
                    // handle "j=..." or cookies style lines gracefully by extracting last token-like chunk
                    // but keep it simple: remove surrounding quotes and whitespace
                    let t = l.replace(/(^["']|["']$)/g, '').trim();
                    return t;
                })
                .filter(l => l && !l.startsWith('#') && !l.startsWith('//'));

            const inputCount = rawLines.length;
            const deduped = Array.from(new Set(parsed)); // de-duplicate within file
            const dedupedCount = deduped.length;

            if (dedupedCount === 0) {
                showMessage('Error', 'No JWT tokens found in the selected file.');
                importJwtFile.value = null;
                return;
            }

            // Try to fetch existing users and filter out tokens that already exist
            let skippedExisting = 0;
            let tokensToProcess = deduped.slice(); // copy
            try {
                const resp = await axios.get('/users');
                const existingUsers = resp?.data ?? {};
                const existingJ = new Set(
                    Object.values(existingUsers || {})
                        .map(u => u?.cookies?.j)
                        .filter(Boolean)
                        .map(String)
                        .map(s => s.trim())
                );

                const before = tokensToProcess.length;
                tokensToProcess = tokensToProcess.filter(t => !existingJ.has(t));
                skippedExisting = before - tokensToProcess.length;
            } catch (fetchErr) {
                // if we fail to fetch, proceed but warn in console (we'll attempt to import everything)
                console.warn('Could not fetch existing users; proceeding without server-side dedupe:', fetchErr?.message ?? fetchErr);
            }

            // Nothing left to import
            if (tokensToProcess.length === 0) {
                showMessage('Import Summary', `All provided tokens already exist.<br>Input lines: ${inputCount}<br>Unique tokens in file: ${dedupedCount}<br>Skipped existing: ${skippedExisting}`);
                importJwtFile.value = null;
                return;
            }

            // Helper: run a function over items with limited concurrency
            async function runWithConcurrency(items, fn, concurrency = 6) {
                let i = 0;
                let running = 0;
                const results = [];
                return new Promise((resolve) => {
                    const next = async () => {
                        if (i >= items.length && running === 0) return resolve(results);
                        while (running < concurrency && i < items.length) {
                            const idx = i++;
                            running++;
                            Promise.resolve(fn(items[idx], idx))
                                .then(r => results[idx] = { status: 'fulfilled', value: r })
                                .catch(err => results[idx] = { status: 'rejected', reason: err })
                                .finally(() => {
                                    running--;
                                    // schedule next; microtask to avoid deep recursion
                                    setTimeout(next, 0);
                                });
                        }
                    };
                    next();
                });
            }

            const total = tokensToProcess.length;
            let success = 0;
            let failed = 0;
            const errors = [];
            const addedUsers = [];

            showBusy(0, total);

            // worker function for each token
            const worker = async (token, idx) => {
                try {
                    const resp = await axios.post('/user', { cookies: { j: token } });
                    success++;
                    const name = resp?.data?.name;
                    const id = resp?.data?.id;
                    if (name && id) {
                        const line = `${name} (#${id})`;
                        addedUsers.push(line);
                        try { console.log(`[Import] Added user ${line}`); } catch { }
                    } else {
                        // if no nice response body, still count as success
                        addedUsers.push(`Imported ${short(token)}`);
                    }
                    showBusy(success + failed, total);
                    return { ok: true };
                } catch (err) {
                    failed++;
                    const msg = err?.response?.data?.error || err?.message || 'Unknown error';
                    errors.push({ token: short(token), message: msg });
                    console.error('Import token failed:', short(token), msg);
                    showBusy(success + failed, total);
                    return { ok: false, error: msg };
                }
            };

            // run imports with controlled concurrency
            await runWithConcurrency(tokensToProcess, worker, CONCURRENCY);

            clearBusy();
            importJwtFile.value = null;

            // Build summary
            const processed = total;
            const summaryLines = [
                `Input lines: ${inputCount}`,
                `Unique tokens in file: ${dedupedCount}`,
                `Processed: ${processed}`,
                `Success: ${success}`,
                `Failed: ${failed}`,
                `Skipped existing: ${skippedExisting}`
            ];
            if (addedUsers.length) summaryLines.push(`Added: ${addedUsers.join(', ')}`);
            if (errors.length) summaryLines.push(`Errors: ${errors.map(e => `${e.token} → ${e.message}`).join('; ')}`);

            showMessage('Import Summary', summaryLines.join('<br>'));
            // Refresh Manage Users view
            try { openManageUsers.click(); } catch (e) { }

        } catch (readErr) {
            clearBusy();
            importJwtFile.value = null;
            handleError(readErr);
        }
    });
}

// -- EXPORT JWT TOKENS -- //
const exportJwtBtn = document.getElementById('exportJwtBtn');

if (exportJwtBtn) {
    exportJwtBtn.addEventListener('click', async () => {
        exportJwtBtn.disabled = true;
        exportJwtBtn.innerText = 'Exporting…';

        try {
            // Call backend route that generates file.txt
            const resp = await fetch('/export-tokens');

            if (!resp.ok) {
                throw new Error(`Failed to export tokens. Status: ${resp.status}`);
            }

            // Receive blob content
            const blob = await resp.blob();
            const url = URL.createObjectURL(blob);

            // Create <a> temporary element for download
            const a = document.createElement('a');
            a.href = url;
            a.download = 'jwt_tokens.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (err) {
            console.error('Error exporting JWT tokens:', err);
            alert('An error occurred while exporting JWT tokens.');
        } finally {
            exportJwtBtn.disabled = false;
            exportJwtBtn.innerText = 'Export JWT Tokens (.txt)';
        }
    });
}

//Used for time estimation, converting seconds value to more readable format
function formatTime(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    let parts = [];
    if (d > 0) parts.push(d + "d");
    if (h > 0) parts.push(h + "h");
    if (m > 0) parts.push(m + "m");
    if (s > 0 || parts.length === 0) parts.push(s + "s");

    return parts.join(" ");
}

// ====== QUEUE PREVIEW LOGIC ======
function startQueueAutoRefresh() {
    if (queueRefreshInterval) {
        clearInterval(queueRefreshInterval);
    }

    if (autoRefreshQueue.checked) {
        const interval = Math.max(1000, (queueRefreshIntervalInput.value || 5) * 1000);
        queueRefreshInterval = setInterval(() => {
            loadQueuePreview();
        }, interval);
    }
    toggleRefreshIntervalInput();
}

function toggleRefreshIntervalInput() {
    if (autoRefreshQueue.checked) {
        queueRefreshIntervalInput.style.display = 'inline-block';
        intervalLabel.style.display = 'inline';
    } else {
        queueRefreshIntervalInput.style.display = 'none';
        intervalLabel.style.display = 'none';
    }
}

function stopQueueAutoRefresh() {
    if (queueRefreshInterval) {
        clearInterval(queueRefreshInterval);
        queueRefreshInterval = null;
    }
}

async function loadQueuePreview() {
    try {
        const response = await axios.get('/queue');
        const data = response.data;

        if (data.success) {
            currentQueueData = data.data;
            updateQueueSummary(data.data.summary);
            updateQueueUserList(data.data.users);
            updateQueueLastUpdate(data.data.lastUpdate);
            isFirstLoad = false;
        } else {
            console.error('Failed to load queue preview:', data.error);
            showQueueError('Failed to load queue data');
        }
    } catch (error) {
        console.error('Error loading queue preview:', error);
        showQueueError('Error loading queue data');
    }
}

function updateQueueSummary(summary) {
    queueTotalUsers.textContent = summary.total;
    queueReadyUsers.textContent = summary.ready;
    
    const queueChargeThreshold = document.getElementById('queueChargeThreshold');
    
    const chargeThresholdValue = document.getElementById('chargeThreshold');
    const thresholdPercent = chargeThresholdValue ? Number(chargeThresholdValue.value) || 50 : 50;
    if (queueChargeThreshold) queueChargeThreshold.textContent = thresholdPercent;
}

function updateQueueUserList(users) {
    const totalCharges = users.reduce((sum, user) => sum + (user.charges?.current || 0), 0);
    const totalMaxCharges = users.reduce((sum, user) => sum + (user.charges?.max || 0), 0);
    
    const queueTotalCharges = document.getElementById('queueTotalCharges');
    const queueTotalMaxCharges = document.getElementById('queueTotalMaxCharges');
    
    if (queueTotalCharges) queueTotalCharges.textContent = totalCharges;
    if (queueTotalMaxCharges) queueTotalMaxCharges.textContent = totalMaxCharges;

    if (users.length === 0) {
        queueUserList.innerHTML = `
            <div class="queue-empty">
                <img src="icons/manageUsers.svg" alt="" />
                <p>No users in queue</p>
            </div>
        `;
        return;
    }

    const hideSensitive = hideSensitiveInfoQueue.checked;

    const html = users.map(user => {
        let statusClass = getStatusClass(user.status);
        let statusText = getStatusText(user.status);
        if (!user.charges && user.status === 'active') {
            statusText = 'SYNC'
        }

        const cooldownText = user.cooldownTime ? formatTime(user.cooldownTime) : '';
        const displayName = hideSensitive ? `User #${user.id.slice(-4)}` : user.name;
        const displayId = hideSensitive ? `#${user.id.slice(-4)}` : `#${user.id}`;

        const animateClass = isFirstLoad ? 'animate-in' : '';
        const barWidth = user.charges ? user.charges.percentage : 0;

        return `
            <div class="queue-user-item ${animateClass}">
                <div class="queue-user-name">${displayName} <span class="queue-user-id">${displayId}</span> <span class="queue-charges-current">${user.charges ? user.charges.current : '--'}</span>/${user.charges ? user.charges.max : '--'} <span class="queue-charges-percentage">(${barWidth + '%'})</span></div>
                <div class="queue-progress-bar">
                    <div class="queue-progress-fill" style="width: ${barWidth}%"></div>
                </div>
                <div class="queue-status-badge ${statusClass}">${statusText} ${cooldownText ? cooldownText : ''}</div>

            </div>
        `;
    }).join('');

    queueUserList.innerHTML = html;
}

function getStatusClass(status) {
    switch (status) {
        case 'ready': return 'queue-status-ready';
        case 'waiting': return 'queue-status-waiting';
        case 'cooldown': return 'queue-status-cooldown';
        case 'suspended': return 'queue-status-suspended';
        case 'active': return 'queue-status-ready';
        case 'no-data': return 'queue-status-cooldown';
        default: return 'queue-status-waiting';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'ready': return 'Ready';
        case 'waiting': return '⌛';
        case 'cooldown': return '🔋';
        case 'suspended': return '‼️';
        case 'active': return 'Active';
        case 'no-data': return 'No Data';
        default: return 'Unknown';
    }
}

function formatCooldownTime(seconds) {
    if (seconds < 60) {
        return `${Math.ceil(seconds)}s`;
    } else if (seconds < 3600) {
        return `${Math.ceil(seconds / 60)}m`;
    } else {
        return `${Math.ceil(seconds / 3600)}h`;
    }
}

function updateQueueLastUpdate(timestamp) {
    const date = new Date(timestamp);
    queueLastUpdate.textContent = date.toLocaleTimeString();
}

function showQueueError(message) {
    queueUserList.innerHTML = `
        <div class="queue-empty">
            <img src="icons/error.svg" alt="" />
            <p>${message}</p>
        </div>
    `;
}

function saveQueueSettings() {
    const settings = {
        autoRefresh: autoRefreshQueue.checked,
        hideSensitive: hideSensitiveInfoQueue.checked,
        refreshInterval: queueRefreshIntervalInput.value || 5
    };
    localStorage.setItem('queuePreviewSettings', JSON.stringify(settings));
}

function loadQueueSettings() {
    try {
        const saved = localStorage.getItem('queuePreviewSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            autoRefreshQueue.checked = settings.autoRefresh !== false;
            hideSensitiveInfoQueue.checked = settings.hideSensitive === true;
            queueRefreshIntervalInput.value = settings.refreshInterval || 5;
        }
    } catch (error) {
        console.error('Error loading queue settings:', error);
    }
}

// Event listeners for queue preview
refreshQueuePreview.addEventListener('click', () => {
    loadQueuePreview();
});

autoRefreshQueue.addEventListener('change', () => {
    saveQueueSettings();
    toggleRefreshIntervalInput();
    if (autoRefreshQueue.checked) {
        startQueueAutoRefresh();
    } else {
        stopQueueAutoRefresh();
    }
});

queueRefreshIntervalInput.addEventListener('change', () => {
    saveQueueSettings();
    if (autoRefreshQueue.checked) {
        startQueueAutoRefresh();
    }
});

hideSensitiveInfoQueue.addEventListener('change', () => {
    saveQueueSettings();
    if (currentQueueData && currentQueueData.users) {
        updateQueueUserList(currentQueueData.users);
    }
});
