/// <reference types="@cloudflare/workers-types" />

/**
 * Shared password gate for the Lyka Audience Accelerator.
 *
 * Behaves like Netlify's site password protection: one secret, forwardable to
 * anyone, no per person allow list and no email round trip.
 *
 * `run_worker_first` is true in wrangler.jsonc, so this Worker sees every
 * request before the static asset layer. Without that, Cloudflare would serve
 * matching assets directly and the gate would only cover unmatched paths.
 *
 * NOTE on the login page: because `run_worker_first` routes every asset through
 * here, and non-HTML requests get a bare 401 (see the bottom of this file), an
 * <img src="..."> on the pre-auth page would 401 and render broken. The gate is
 * deliberately the SPEED wordmark in text only. To brand it with the Lyka mark,
 * inline the PNG as a base64 data: URI rather than allow-listing a public path.
 */
import { LYKA } from '../data/brand';

export interface Env {
	ASSETS: Fetcher;
	/** Shared password. Set with: wrangler secret put SITE_PASSWORD */
	SITE_PASSWORD: string;
	/** HMAC key for signing session cookies. Set with: wrangler secret put SESSION_SECRET */
	SESSION_SECRET: string;
}

const COOKIE_NAME = 'lyka_accelerator_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours
const LOGIN_PATH = '/__auth/login';
const LOGOUT_PATH = '/__auth/logout';

const encoder = new TextEncoder();

async function hmac(secret: string, message: string): Promise<Uint8Array> {
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign'],
	);
	return new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

/** Length independent comparison, so we never leak match position via timing. */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
	return diff === 0;
}

function toHex(bytes: Uint8Array): string {
	let out = '';
	for (const b of bytes) out += b.toString(16).padStart(2, '0');
	return out;
}

function fromHex(hex: string): Uint8Array | null {
	if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) return null;
	const out = new Uint8Array(hex.length / 2);
	for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
	return out;
}

/**
 * Session cookie is `<expiry>.<hmac>`. The signature covers the expiry, so a
 * visitor cannot forge a cookie or extend their own session by editing it.
 */
async function issueSession(env: Env): Promise<string> {
	const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
	return `${exp}.${toHex(await hmac(env.SESSION_SECRET, `session:v1:${exp}`))}`;
}

async function verifySession(env: Env, token: string | null): Promise<boolean> {
	if (!token) return false;
	const dot = token.indexOf('.');
	if (dot < 1) return false;

	const exp = Number(token.slice(0, dot));
	if (!Number.isSafeInteger(exp) || exp <= Math.floor(Date.now() / 1000)) return false;

	const provided = fromHex(token.slice(dot + 1));
	if (!provided) return false;

	return constantTimeEqual(provided, await hmac(env.SESSION_SECRET, `session:v1:${exp}`));
}

/** Compare HMACs rather than raw strings so length differences leak nothing. */
async function passwordMatches(env: Env, candidate: string): Promise<boolean> {
	const [got, want] = await Promise.all([
		hmac(env.SESSION_SECRET, `pw:v1:${candidate}`),
		hmac(env.SESSION_SECRET, `pw:v1:${env.SITE_PASSWORD}`),
	]);
	return constantTimeEqual(got, want);
}

function readCookie(request: Request, name: string): string | null {
	const header = request.headers.get('Cookie');
	if (!header) return null;
	for (const part of header.split(';')) {
		const eq = part.indexOf('=');
		if (eq < 0) continue;
		if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
	}
	return null;
}

/** Only ever redirect to a same origin path, never to an attacker supplied host. */
function safeNext(raw: string | null | undefined): string {
	if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/';
	return raw;
}

function sessionCookie(value: string, maxAge: number): string {
	return `${COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

function escapeHtml(s: string): string {
	return s.replace(/[&<>"']/g, (c) => {
		switch (c) {
			case '&': return '&amp;';
			case '<': return '&lt;';
			case '>': return '&gt;';
			case '"': return '&quot;';
			default: return '&#39;';
		}
	});
}

function loginPage(next: string, failed: boolean): Response {
	const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Lyka Audience Accelerator | SPEED</title>
<link rel="icon" href="data:,">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=DM+Sans:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  /* Tokens interpolated from data/brand.ts so this page cannot drift from the
     app. That import is why brand.ts must stay free of React and DOM types. */
  :root {
    --teal-deep: ${LYKA.tealDeepest};
    --teal: ${LYKA.tealDark};
    --accent: ${LYKA.accent};
    --accent-ink: ${LYKA.accentInk};
    /* Deliberately NOT declaring a pale mint here. The old --mint token was
       LYKA.mintMuted, was referenced nowhere, and its name invited the next
       person to use a 1.88:1 colour as ink on this page. See the FILL ONLY
       comment on mintMuted in brand.ts. (No backticks in this block: the whole
       page is a template literal, so one would terminate it.) */
    --speed-red: ${LYKA.speedRed};
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: var(--teal-deep);
    color: #fff;
    font-family: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .card {
    width: 100%;
    max-width: 420px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 18px;
    padding: 40px 36px 32px;
    box-shadow: 0 24px 60px rgba(0,61,51,0.45);
  }
  .wordmark {
    font-size: 13px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 28px;
  }
  .wordmark .speed { color: var(--speed-red); }
  .wordmark .accel { color: rgba(255,255,255,0.55); }
  h1 {
    margin: 0 0 8px;
    font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 24px;
    line-height: 1.25;
    letter-spacing: -0.015em;
    font-weight: 700;
    color: #fff;
  }
  p.sub {
    margin: 0 0 28px;
    font-size: 14px;
    line-height: 1.55;
    color: rgba(255,255,255,0.55);
  }
  label {
    display: block;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    margin-bottom: 8px;
  }
  input[type="password"] {
    width: 100%;
    padding: 13px 14px;
    font-size: 15px;
    color: #fff;
    background: rgba(0,0,0,0.22);
    border: 1px solid rgba(255,255,255,0.16);
    border-radius: 10px;
    outline: none;
    transition: border-color .2s cubic-bezier(0.4,0,0.2,1), box-shadow .2s cubic-bezier(0.4,0,0.2,1);
  }
  input[type="password"]:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(16,177,147,0.24);
  }
  button {
    width: 100%;
    margin-top: 18px;
    padding: 13px 16px;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #fff;
    background: var(--accent-ink);
    border: 0;
    border-radius: 999px;
    cursor: pointer;
    transition: background .2s cubic-bezier(0.4,0,0.2,1), transform .12s cubic-bezier(0.4,0,0.2,1);
  }
  button:hover { background: var(--accent); }
  button:active { transform: translateY(1px); }
  .error {
    margin: 0 0 18px;
    padding: 11px 13px;
    font-size: 13.5px;
    color: #ffb3b5;
    background: rgba(232,21,27,0.11);
    border: 1px solid rgba(232,21,27,0.34);
    border-radius: 8px;
  }
  .foot {
    margin: 26px 0 0;
    padding-top: 18px;
    border-top: 1px solid rgba(255,255,255,0.08);
    font-size: 12px;
    line-height: 1.6;
    color: rgba(255,255,255,0.38);
  }
</style>
</head>
<body>
  <main class="card">
    <div class="wordmark"><span class="speed">SPEED</span> <span class="accel">Accelerator</span></div>
    <h1>Lyka Audience Accelerator</h1>
    <p class="sub">This deck is confidential. Enter the access password to continue.</p>
    ${failed ? '<p class="error">That password is not correct. Please try again.</p>' : ''}
    <form method="POST" action="${LOGIN_PATH}" autocomplete="off">
      <input type="hidden" name="next" value="${escapeHtml(next)}">
      <label for="password">Access password</label>
      <input id="password" name="password" type="password" required autofocus autocomplete="current-password">
      <button type="submit">View the deck</button>
    </form>
    <p class="foot">Prepared by SPEED for Lyka. If you need the password, contact your SPEED account lead.</p>
  </main>
</body>
</html>`;

	return new Response(html, {
		status: failed ? 401 : 401,
		headers: {
			'Content-Type': 'text/html; charset=utf-8',
			'Cache-Control': 'no-store, must-revalidate',
			'X-Robots-Tag': 'noindex, nofollow',
		},
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// PUBLIC ACCESS ENABLED 2026-08-10 on client instruction ("all access").
		// While this is true the password gate below is bypassed and every request
		// is served straight from the asset layer with no login. The full gate is
		// left intact below; flip PUBLIC_ACCESS back to false and redeploy to
		// re-gate. Typed `: boolean` (not an inferred literal) so tsc keeps the
		// gate code below reachable and does not flag it as dead.
		const PUBLIC_ACCESS: boolean = true;
		if (PUBLIC_ACCESS) {
			return env.ASSETS.fetch(request);
		}

		// Fail closed. A missing secret must never mean an open site.
		if (!env.SITE_PASSWORD || !env.SESSION_SECRET) {
			return new Response('Access is not configured for this deployment.', {
				status: 503,
				headers: { 'Cache-Control': 'no-store' },
			});
		}

		const url = new URL(request.url);

		if (url.pathname === LOGOUT_PATH) {
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/',
					'Set-Cookie': sessionCookie('', 0),
					'Cache-Control': 'no-store',
				},
			});
		}

		if (url.pathname === LOGIN_PATH) {
			if (request.method !== 'POST') {
				return new Response(null, { status: 302, headers: { Location: '/', 'Cache-Control': 'no-store' } });
			}
			const form = await request.formData();
			const next = safeNext(String(form.get('next') ?? '/'));

			if (await passwordMatches(env, String(form.get('password') ?? ''))) {
				return new Response(null, {
					status: 303,
					headers: {
						Location: next,
						'Set-Cookie': sessionCookie(await issueSession(env), SESSION_TTL_SECONDS),
						'Cache-Control': 'no-store',
					},
				});
			}
			return loginPage(next, true);
		}

		if (await verifySession(env, readCookie(request, COOKIE_NAME))) {
			return env.ASSETS.fetch(request);
		}

		// Only serve the login form to navigations. Images, video and JS get a
		// bare 401 so we never return HTML where the browser expects an asset.
		if (!(request.headers.get('Accept') ?? '').includes('text/html')) {
			return new Response('Unauthorized', {
				status: 401,
				headers: { 'Cache-Control': 'no-store' },
			});
		}

		return loginPage(safeNext(url.pathname + url.search), false);
	},
} satisfies ExportedHandler<Env>;
