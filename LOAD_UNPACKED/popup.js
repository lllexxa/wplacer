document.addEventListener('DOMContentLoaded', () => {
    const hostRegex = /(^(?=.{1,253}$)((?=.{1,63}\.)(?!-)(?![^x][^n]--)[a-z0-9-]{0,}[a-z0-9]{1}\.){1,}((?=.{2,63}$)(?![0-9-])(?![^x][^n]--)[a-z0-9-]{0,}[a-z0-9]{1}){1}$)|(?<ipv4>^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$)|(?<ipv6>^(((0|0[\da-f]{3}|[1-9a-f][\da-f]{0,3})(:(0|0[\da-f]{3}|[1-9a-f][\da-f]{0,3})){7})|(?!:[^:])(?!.*::.*::)(?!.*(000|:|^)0:0.*::)(?!.*[\da-f]{5,})(?=(:{0,2}(0|0[\da-f]{3}|[1-9a-f][\da-f]{0,3})){0,7}(?!.*[\da-f])).*::($|(.*:)?[^:\n]{1,4}))$)/
    const statusEl = document.getElementById('status');
    const portInput = document.getElementById('port');
    const hostInput = document.getElementById('host');
    const autoReloadInput = document.getElementById('autoReloadInterval');
    const saveBtn = document.getElementById('saveSettingsBtn');
    const settingsForm = document.querySelector('form.settings');
    const sendCookieBtn = document.getElementById('sendCookieBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    let initialPort = 80;
    let initialHost = '127.0.0.1';
    let initialAutoReload = 0;

    // Load current settings
    chrome.storage.local.get(['wplacerPort', 'wplacerHost', 'wplacerAutoReload'], (result) => {
        initialPort = result.wplacerPort || 80;
        initialHost = result.wplacerHost || '127.0.0.1';
        initialAutoReload = result.wplacerAutoReload || 0;
        portInput.value = initialPort;
        hostInput.value = initialHost;
        autoReloadInput.value = initialAutoReload;
    });

    // Save settings on form submit
    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const port = parseInt(portInput.value, 10);
        const host = hostInput.value;
        const autoReload = parseInt(autoReloadInput.value, 10);

        statusEl.textContent = `host: ${host}, port: ${port}, auto-reload: ${autoReload}`;
        
        if (isNaN(port) || port < 1 || port > 65535) {
            statusEl.textContent = 'Error: Invalid port number.';
            return;
        }

        if (!hostRegex.test(host)) {
            statusEl.textContent = 'Error: Invalid host.';
            return;
        }
        
        if (isNaN(autoReload) || autoReload < 0 || autoReload > 3600) {
            statusEl.textContent = 'Error: Invalid auto-reload interval (0-3600 seconds).';
            return;
        }

        chrome.storage.local.set({ 
            wplacerPort: port,
            wplacerAutoReload: autoReload,
            wplacerHost: host
        }, () => {
            const hostText = `host: ${host}:${port}`;
            const reloadText = autoReload > 0 ? ` Auto-reload: ${autoReload}s.` : ' Auto-reload: disabled.';
            statusEl.textContent = `Settings saved. Server on ${hostText}.${reloadText}`;
            
            // Inform background script if settings changed
            if (port !== initialPort || autoReload !== initialAutoReload || host !== initialHost) {
                chrome.runtime.sendMessage({ action: "settingsUpdated" });
                initialPort = port;
                initialAutoReload = autoReload;
                initialHost = host;
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