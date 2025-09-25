import { webcrypto as crypto } from 'crypto';
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


globalThis.window = globalThis;
globalThis.self = globalThis;
Object.defineProperty(globalThis, "crypto", {
  value: crypto,
  configurable: true,
  writable: true,
});
  
Object.defineProperty(globalThis, "navigator", {
  value: {
    languages: ["en"],
    language: "en",
    userLanguage: "en",
    browserLanguage: "en",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
  },
  configurable: true,
  writable: true,
});

if (typeof atob === 'undefined') {
  globalThis.atob = (b) => Buffer.from(b, 'base64').toString('binary');
}
if (typeof btoa === 'undefined') {
  globalThis.btoa = (s) => Buffer.from(s, 'binary').toString('base64');
}

if (typeof BroadcastChannel === 'undefined') {
  globalThis.BroadcastChannel = class { constructor() {} postMessage() {} close() {} onmessage = null; };
}

function makeStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? String(store.get(k)) : null),
    setItem: (k, v) => { store.set(String(k), String(v)); },
    removeItem: (k) => { store.delete(String(k)); },
    clear: () => { store.clear(); },
    key: (i) => Array.from(store.keys())[i ?? null],
    get length() { return store.size; }
  };
}
globalThis.localStorage = makeStorage();
globalThis.sessionStorage = makeStorage();

globalThis.WebAssembly = Object.assign({}, WebAssembly);
globalThis.WebAssembly.instantiateStreaming = async (source, imports) => {
  const res = await source;
  const buf = await res.arrayBuffer();
  return WebAssembly.instantiate(buf, imports);
};
globalThis.setInterval = () => 0;
globalThis.clearInterval = () => {};

var f2;

function P(n) {
  const e = f2.__externref_table_alloc();
  return f2.__wbindgen_export_2.set(e, n), e;
}

function A2(n, e) {
  try {
    return n.apply(this, e);
  } catch (t) {
    const a = P(t);
    f2.__wbindgen_exn_store(a);
  }
}

function C2(n, e) {
  const ie2 = typeof TextDecoder < "u" ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }) : { decode: () => {
    throw Error("TextDecoder not available");
  } };
  return n = n >>> 0, ie2.decode(f2.memory.buffer.slice(n, n + e));
}

function V2(n) {
  return n == null;
}

export async function initPawtect() {
  const wasmPath = join(__dirname, "pawtect_wasm_bg.wasm");
  const wasmBytes = await readFile(wasmPath);

  const imports = {
    wbg: {
      __wbg_buffer_609cc3eee51ed158: (e) => e.buffer,
      __wbg_call_672a4d21634d4a24: function() {
        return A2(function(e, t) {
          return e.call(t);
        }, arguments);
      },
      __wbg_call_7cccdd69e0791ae2: function() {
        return A2(function(e, t, a) {
          return e.call(t, a);
        }, arguments);
      },
      __wbg_crypto_574e78ad8b13b65f: (e) => e.crypto,
      __wbg_getRandomValues_b8f5dbd5f3995a9e: function() {
        return A2(function(e, t) {
          e.getRandomValues(t);
        }, arguments);
      },
      __wbg_msCrypto_a61aeb35a24c1329: (e) => e.msCrypto,
      __wbg_new_a12002a7f91c75be: (e) => new Uint8Array(e),
      __wbg_newnoargs_105ed471475aaf50: function(e, t) {
        return new Function(C2(e, t));
      },
      __wbg_newwithbyteoffsetandlength_d97e637ebe145a9a: (e, t, a) => new Uint8Array(e, t >>> 0, a >>> 0),
      __wbg_newwithlength_a381634e90c276d4: (e) => new Uint8Array(e >>> 0),
      __wbg_node_905d3e251edff8a2: (e) => e.node,
      __wbg_process_dc0fbacc7c1c06f7: (e) => e.process,
      __wbg_randomFillSync_ac0988aba3254290: function() {
        return A2(function(e, t) {
          e.randomFillSync(t);
        }, arguments);
      },
      __wbg_require_60cc747a6bc5215a: function() {
        return A2(function() {
          return module.require;
        }, arguments);
      },
      __wbg_set_65595bdd868b3009: (e, t, a) => e.set(t, a >>> 0),
      __wbg_static_accessor_GLOBAL_88a902d13a557d07: function() {
        const e = typeof global > "u" ? null : global;
        return V2(e) ? 0 : P(e);
      },
      __wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0: function() {
        const e = typeof globalThis > "u" ? null : globalThis;
        return V2(e) ? 0 : P(e);
      },
      __wbg_static_accessor_SELF_37c5d418e4bf5819: function() {
        const e = typeof self > "u" ? null : self;
        return V2(e) ? 0 : P(e);
      },
      __wbg_static_accessor_WINDOW_5de37043a91a9c40: function() {
        const e = typeof window > "u" ? null : window;
        return V2(e) ? 0 : P(e);
      },
      __wbg_subarray_aa9065fa9dc5df96: (e, t, a) => e.subarray(t >>> 0, a >>> 0),
      __wbg_versions_c01dfd4722a88165: (e) => e.versions,
      __wbindgen_init_externref_table: function() {
        const e = f2.__wbindgen_export_2, t = e.grow(4);
        e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, true), e.set(t + 3, false);
      },
      __wbindgen_is_function: (e) => typeof e == "function",
      __wbindgen_is_object: (e) => typeof e == "object" && e !== null,
      __wbindgen_is_string: (e) => typeof e == "string",
      __wbindgen_is_undefined: (e) => e === void 0,
      __wbindgen_memory: () => f2.memory,
      __wbindgen_string_new: (e, t) => C2(e, t),
      __wbindgen_throw: (e, t) => { throw new Error(C2(e, t)); }
    }
  };

  const { instance } = await WebAssembly.instantiate(wasmBytes, imports);
  f2 = instance.exports;
  f2.__wbindgen_start();
  return f2;
}

export function setUserId(wasm, userId) {
  wasm.set_user_id(userId);
}

export function requestUrl(wasm, url) {
  const enc = new TextEncoder();
  const bytes = enc.encode(url);
  const inPtr = wasm.__wbindgen_malloc(bytes.length, 1);
  new Uint8Array(wasm.memory.buffer, inPtr, bytes.length).set(bytes);
  wasm.request_url(inPtr, bytes.length);
  try { wasm.__wbindgen_free(inPtr, bytes.length, 1); } catch {}
}

export function getPawtectedEndpointPayload(wasm, payload) {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const bytes = enc.encode(payload);
  const inPtr = wasm.__wbindgen_malloc(bytes.length, 1);
  new Uint8Array(wasm.memory.buffer, inPtr, bytes.length).set(bytes);

  const out = wasm.get_pawtected_endpoint_payload(inPtr, bytes.length);

  if (Array.isArray(out)) {
    const [ptr, len] = out;
    const token = dec.decode(new Uint8Array(wasm.memory.buffer, ptr, len));
    try { wasm.__wbindgen_free(ptr, len, 1); } catch {}
    return token;
  } else if (typeof out === 'string') {
    return out;
  } else if (out && typeof out.ptr === 'number' && typeof out.len === 'number') {
    const token = dec.decode(new Uint8Array(wasm.memory.buffer, out.ptr, out.len));
    try { wasm.__wbindgen_free(out.ptr, out.len, 1); } catch {}
    return token;
  }
  throw new Error('Unexpected WASM return');
}
