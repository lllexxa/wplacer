document.addEventListener('DOMContentLoaded', () => {
    const statusEl = document.getElementById('status');
    const portInput = document.getElementById('port');
    const autoReloadInput = document.getElementById('autoReloadInterval');
    const saveBtn = document.getElementById('saveSettingsBtn');
    const serverPawtectToggle = document.getElementById('serverPawtectToggle');
    const sendCookieBtn = document.getElementById('sendCookieBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    let initialPort = 80;
    let initialAutoReload = 0;

    // Load current settings
    chrome.storage.local.get(['wplacerPort', 'wplacerAutoReload', 'wplacerServerPawtect'], (result) => {
        initialPort = result.wplacerPort || 80;
        initialAutoReload = result.wplacerAutoReload || 0;
        portInput.value = initialPort;
        autoReloadInput.value = initialAutoReload;
        serverPawtectToggle.checked = !!result.wplacerServerPawtect;
    });

    // Save settings
    saveBtn.addEventListener('click', () => {
        const port = parseInt(portInput.value, 10);
        const autoReload = parseInt(autoReloadInput.value, 10);
        
        if (isNaN(port) || port < 1 || port > 65535) {
            statusEl.textContent = 'Error: Invalid port number.';
            return;
        }
        
        if (isNaN(autoReload) || autoReload < 0 || autoReload > 3600) {
            statusEl.textContent = 'Error: Invalid auto-reload interval (0-3600 seconds).';
            return;
        }

        chrome.storage.local.set({ 
            wplacerPort: port,
            wplacerAutoReload: autoReload,
            wplacerServerPawtect: !!serverPawtectToggle.checked
        }, () => {
            const reloadText = autoReload > 0 ? ` Auto-reload: ${autoReload}s.` : ' Auto-reload: disabled.';
            statusEl.textContent = `Settings saved. Server on port ${port}.${reloadText}`;
            
            // Inform background script if settings changed
            if (port !== initialPort || autoReload !== initialAutoReload) {
                chrome.runtime.sendMessage({ action: "settingsUpdated" });
                initialPort = port;
                initialAutoReload = autoReload;
            }
        });
    });

    // Manually send cookie
    sendCookieBtn.addEventListener('click', () => {
        statusEl.textContent = 'Sending cookie to server...';
        chrome.runtime.sendMessage({ action: "sendCookie" }, (response) => {
            if (chrome.runtime.lastError) {
                statusEl.textContent = `Error: ${chrome.runtime.lastError.message}`;
                return;
            }
            if (response.success) {
                statusEl.textContent = `Success! User: ${response.name}.`;
            } else {
                statusEl.textContent = `Error: ${response.error}`;
            }
        });
    });

    // Quick logout
    logoutBtn.addEventListener('click', () => {
        statusEl.textContent = 'Logging out...';
        chrome.runtime.sendMessage({ action: "quickLogout" }, (response) => {
            if (chrome.runtime.lastError) {
                statusEl.textContent = `Error: ${chrome.runtime.lastError.message}`;
                return;
            }
            if (response.success) {
                statusEl.textContent = 'Logout successful. Site data cleared.';
            } else {
                statusEl.textContent = `Error: ${response.error}`;
            }
        });
    });
});