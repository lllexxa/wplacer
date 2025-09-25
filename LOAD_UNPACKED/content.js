const RELOAD_FLAG = 'wplacer_reload_in_progress';

// Ensure any leftover pawtect chunk cache is cleared on page load
try { localStorage.removeItem('wplacerPawtectChunk'); } catch {}

console.log("✅ wplacer: Content script loaded.");

if (sessionStorage.getItem(RELOAD_FLAG)) {
    sessionStorage.removeItem(RELOAD_FLAG);
    console.log("wplacer: Page reloaded to capture a new token.");
}

const sentTokens = new Set();
const pending = { turnstile: null, pawtect: null };
let SERVER_PAWTECT = false;
try { chrome.storage.local.get(['wplacerServerPawtect'], r => { SERVER_PAWTECT = !!r.wplacerServerPawtect; }); } catch {}

const trySendPair = () => {
    if (!pending.turnstile) return;
    if (SERVER_PAWTECT) {
        const t = pending.turnstile;
        postToken(t, null);
        pending.turnstile = null;
        pending.pawtect = null;
        return;
    }
    if (!pending.pawtect) return;
    const t = pending.turnstile;
    const p = pending.pawtect || null;
    postToken(t, p);
    pending.turnstile = null;
    pending.pawtect = null;
};

const generateRandomHex = (length = 32) => {
    const bytes = new Uint8Array(Math.ceil(length / 2));
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, length);
};

const randomInt = (max) => Math.floor(Math.random() * Math.max(1, Number(max) || 1));

try {
    const fp = generateRandomHex(32);
    window.wplacerFP = fp;
    sessionStorage.setItem('wplacer_fp', fp);
    console.log('wplacer: fingerprint generated:', fp);
} catch {}

const postToken = (token, pawtectToken) => {
    if (!token || typeof token !== 'string' || sentTokens.has(token)) {
        return;
    }
    sentTokens.add(token);
    console.log(`✅ wplacer: CAPTCHA Token Captured. Sending to server.`);
    const fp = window.wplacerFP || sessionStorage.getItem('wplacer_fp') || generateRandomHex(32);
    chrome.runtime.sendMessage({
        type: "SEND_TOKEN",
        token: token,
        pawtect: pawtectToken,
        fp
    });
};

window.addEventListener('message', (event) => {
    if (event.origin !== "https://challenges.cloudflare.com" || !event.data) {
        return;
    }
    try {
        const token = event.data.token || event.data.response || event.data['cf-turnstile-response'];
        if (token) {
            pending.turnstile = token;
            if (!SERVER_PAWTECT) {
                const fp = window.wplacerFP || sessionStorage.getItem('wplacer_fp') || generateRandomHex(32);
                const body = { colors: [0], coords: [1, 1], fp, t: token };
                try {
                    chrome.runtime.sendMessage({ action: 'computePawtectForT', url: 'https://backend.wplace.live/s0/pixel/1/1', bodyStr: JSON.stringify(body) });
                } catch {}
                if (window.wplacerPawtectToken) {
                    pending.pawtect = window.wplacerPawtectToken;
                    try { delete window.wplacerPawtectToken; } catch {}
                }
            }
            trySendPair();
        }
    } catch {
    }
}, true);

window.addEventListener('message', (event) => {
    try {
        if (event.source !== window) return;
        const data = event.data;
        if (data && data.type === 'WPLACER_PAWTECT_TOKEN' && typeof data.token === 'string') {
            pending.pawtect = data.token;
            window.wplacerPawtectToken = data.token;
            console.log('✅ wplacer: Pawtect token captured from', data.origin || 'unknown', 'waiting/pairing...');
            trySendPair();
        }
    } catch {}
}, true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "reloadForToken") {
        console.log("wplacer: Received reload command from background script. Reloading now...");
        sessionStorage.setItem(RELOAD_FLAG, 'true');
        location.reload();
    }
});