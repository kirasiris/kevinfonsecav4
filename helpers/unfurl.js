"use server";

// Unfurls an external URL server-side (no CORS restrictions here):
// 1. If the site exposes a WordPress oEmbed endpoint, we return an "embed"
//    result: WordPress serves every post as an embeddable page at
//    `<post-url>/embed/`, with WP's own custom styling inside the iframe.
// 2. Otherwise we scrape OpenGraph/Twitter/meta tags and return a "card"
//    result so the editor can render a clickable OpenGraph object.

const FETCH_TIMEOUT_MS = 8000;
const MAX_HTML_BYTES = 500 * 1024; // metadata lives in <head>; 500KB is plenty

function absolutize(maybeRelative, baseUrl) {
	if (!maybeRelative) return null;
	try {
		return new URL(maybeRelative, baseUrl).href;
	} catch (_) {
		return null;
	}
}

function decodeEntities(s) {
	if (!s) return s;
	return s
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#0?39;/g, "'")
		.replace(/&#x27;/gi, "'")
		.replace(/&nbsp;/g, " ");
}

// Reads content from a meta tag matching property/name, attribute order agnostic.
function metaContent(html, key) {
	const patterns = [
		new RegExp(
			"<meta[^>]+(?:property|name)\\s*=\\s*[\"']" +
				key +
				"[\"'][^>]*\\scontent\\s*=\\s*[\"']([^\"']*)[\"']",
			"i",
		),
		new RegExp(
			"<meta[^>]+content\\s*=\\s*[\"']([^\"']*)[\"'][^>]*\\s(?:property|name)\\s*=\\s*[\"']" +
				key +
				"[\"']",
			"i",
		),
	];
	for (const re of patterns) {
		const m = html.match(re);
		if (m && m[1]) return decodeEntities(m[1].trim());
	}
	return null;
}

async function fetchHtml(url) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
	try {
		const res = await fetch(url, {
			signal: controller.signal,
			redirect: "follow",
			headers: {
				// Some sites gate OG tags behind a browser-looking UA.
				"User-Agent":
					"Mozilla/5.0 (compatible; RichTextEditorBot/1.0; +opengraph)",
				Accept: "text/html,application/xhtml+xml",
			},
		});
		if (!res.ok) return { html: null, finalUrl: url, status: res.status };
		const contentType = res.headers.get("content-type") || "";
		if (
			!contentType.includes("text/html") &&
			!contentType.includes("application/xhtml")
		) {
			return {
				html: null,
				finalUrl: res.url || url,
				status: res.status,
				contentType,
			};
		}
		const reader = res.body.getReader();
		const decoder = new TextDecoder();
		let html = "";
		while (html.length < MAX_HTML_BYTES) {
			const { done, value } = await reader.read();
			if (done) break;
			html += decoder.decode(value, { stream: true });
		}
		reader.cancel().catch(() => {});
		return { html, finalUrl: res.url || url, status: res.status };
	} finally {
		clearTimeout(timer);
	}
}

export async function unfurlUrl(rawUrl) {
	let url;
	try {
		url = new URL(rawUrl);
		if (url.protocol !== "http:" && url.protocol !== "https:")
			throw new Error("bad protocol");
		// SSRF guard: refuse private/loopback hosts.
		const host = url.hostname;
		if (
			host === "localhost" ||
			host === "127.0.0.1" ||
			host === "[::1]" ||
			/^10\./.test(host) ||
			/^192\.168\./.test(host) ||
			/^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
			/^169\.254\./.test(host)
		) {
			throw new Error("blocked host");
		}
	} catch (_) {
		return { ok: false, error: "Invalid URL" };
	}

	try {
		const { html, finalUrl } = await fetchHtml(url.href);
		if (!html) {
			return { ok: true, type: "link", url: url.href };
		}

		// ---- WordPress / oEmbed discovery ------------------------------------
		// WordPress advertises: <link rel="alternate" type="application/json+oembed" href="...wp-json/oembed...">
		const oembedMatch =
			html.match(
				/<link[^>]+type\s*=\s*["']application\/json\+oembed["'][^>]*href\s*=\s*["']([^"']+)["']/i,
			) ||
			html.match(
				/<link[^>]+href\s*=\s*["']([^"']+)["'][^>]*type\s*=\s*["']application\/json\+oembed["']/i,
			);

		const isWordPress = oembedMatch && /wp-json[/%]/i.test(oembedMatch[1]);

		if (isWordPress) {
			// Every WordPress post is embeddable at <post-url>/embed/ with WP's
			// own custom CSS styling inside the iframe.
			const base = finalUrl.split(/[?#]/)[0];
			const embedSrc = base.replace(/\/$/, "") + "/embed/";
			return {
				ok: true,
				type: "embed",
				provider: "wordpress",
				url: finalUrl,
				embedSrc,
				title:
					metaContent(html, "og:title") ||
					decodeEntities(
						(html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || "",
					),
			};
		}

		// ---- OpenGraph / Twitter card fallback --------------------------------
		const title =
			metaContent(html, "og:title") ||
			metaContent(html, "twitter:title") ||
			decodeEntities(
				((html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || "").trim(),
			);
		const description =
			metaContent(html, "og:description") ||
			metaContent(html, "twitter:description") ||
			metaContent(html, "description");
		const image = absolutize(
			metaContent(html, "og:image") || metaContent(html, "twitter:image"),
			finalUrl,
		);
		const siteName =
			metaContent(html, "og:site_name") ||
			new URL(finalUrl).hostname.replace(/^www\./, "");

		const iconMatch =
			html.match(
				/<link[^>]+rel\s*=\s*["'](?:shortcut )?icon["'][^>]*href\s*=\s*["']([^"']+)["']/i,
			) ||
			html.match(
				/<link[^>]+href\s*=\s*["']([^"']+)["'][^>]*rel\s*=\s*["'](?:shortcut )?icon["']/i,
			);
		const favicon = absolutize(
			iconMatch ? iconMatch[1] : "/favicon.ico",
			finalUrl,
		);

		if (!title && !description && !image) {
			return { ok: true, type: "link", url: finalUrl };
		}

		return {
			ok: true,
			type: "card",
			url: finalUrl,
			title: title || finalUrl,
			description: description || "",
			image,
			siteName,
			favicon,
		};
	} catch (_) {
		// Network failure, timeout, non-HTML... degrade to a plain link.
		return { ok: true, type: "link", url: url.href };
	}
}
