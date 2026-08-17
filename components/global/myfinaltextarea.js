"use client";
import { useEffect, useRef, useState } from "react";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { unfurlUrl } from "@/helpers/unfurl";

const escapeHtml = (s) => {
	return String(s).replace(/[&<>"']/g, (c) => {
		return {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
		}[c];
	});
};

const guessKind = (url, mime) => {
	const u = (url || "").toLowerCase();
	if (mime) {
		if (mime.indexOf("image") === 0) {
			return "image";
		}
		if (mime.indexOf("video") === 0) {
			return "video";
		}
		if (mime.indexOf("audio") === 0) {
			return "audio";
		}
	}
	if (/\.(png|jpe?g|gif|webp|svg|bmp)(\?|$)/.test(u)) {
		return "image";
	}
	if (/\.(mp4|webm|ogg|mov)(\?|$)/.test(u)) {
		return "video";
	}
	if (/\.(mp3|wav|m4a|aac|flac)(\?|$)/.test(u)) {
		return "audio";
	}
	return "file";
};

const extractUploadUrl = (data) => {
	if (!data || typeof data !== "object") {
		return null;
	}
	const candidates = [
		data.url,
		data.secure_url,
		data.location,
		data.secure_location,
		data.data && data.data.url,
		data.data && data.data.secure_location,
		data.data && data.data.location && data.data.location.secure_location,
		data.file && data.file.url,
	];
	for (let i = 0; i < candidates.length; i++) {
		if (typeof candidates[i] === "string" && candidates[i])
			return candidates[i];
	}
	return null;
};

// XHR-based upload with per-file progress reporting.
// Ported from chaptersmediamanager.js (uploadFileToServer), minus the
// Playlist-specific /noadmin/videos POST — this editor only needs the
// uploaded file's URL back so it can embed it.
const uploadFileToServer = (
	file,
	filename,
	onProgress,
	auth = {},
	token = {},
	onModel = "Blog",
) => {
	const xhr = new XMLHttpRequest();
	const res = new Promise((resolve, reject) => {
		const formData = new FormData();
		formData.append("userId", auth?.userId);
		formData.append("username", auth?.username);
		formData.append("userEmail", auth?.email);
		formData.append("onModel", onModel);
		formData.append("file", file, filename);
		formData.append("album", "posts");

		xhr.upload.addEventListener("progress", (event) => {
			if (event.lengthComputable) {
				onProgress(Math.round((event.loaded * 100) / event.total));
			}
		});

		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				try {
					resolve(JSON.parse(xhr.responseText));
				} catch (_) {
					reject(
						new Error("Upload succeeded but the response was not valid JSON"),
					);
				}
			} else {
				reject(
					new Error(
						`Upload failed with status ${xhr.status}: ${xhr.statusText}`,
					),
				);
			}
		});

		xhr.addEventListener("error", () =>
			reject(new Error("Network error during upload")),
		);
		xhr.addEventListener("abort", () =>
			reject(
				Object.assign(new Error("Upload aborted"), { name: "AbortError" }),
			),
		);
		xhr.addEventListener("timeout", () =>
			reject(new Error("Upload timed out")),
		);

		xhr.open(
			"PUT",
			`${process.env.NEXT_PUBLIC_FILE_UPLOADER_URL}/uploads/uploadobject`,
		);
		xhr.setRequestHeader("Authorization", `Bearer ${token?.value}`);
		xhr.send(formData);
	});

	return { res, xhr };
};

const generateUploadId = () => Math.random().toString(36).slice(2, 9);

const fileUrlOf = (item) => {
	const loc = item.location || {};
	return loc.secure_location || loc.insecure_location || loc.aws_location || "";
};

const fileNameOf = (item) => {
	const loc = item.location || {};
	return loc.filename || (item.resourceId && item.resourceId.title) || "file";
};

const userAvatarOf = (user) => {
	try {
		return user.files.avatar.location.secure_location || "";
	} catch (_) {
		return "";
	}
};

const BLOCK_TAGS = [
	"P",
	"H1",
	"H2",
	"H3",
	"H4",
	"H5",
	"H6",
	"BLOCKQUOTE",
	"PRE",
	"DIV",
	"LI",
];

const BLOCK_MENU_ITEMS = [
	{ tag: "p", label: "Paragraph", icon: "fa-paragraph", hint: "Default" },
	{ tag: "h1", label: "Heading 1", icon: "fa-heading" },
	{ tag: "h2", label: "Heading 2", icon: "fa-heading" },
	{ tag: "h3", label: "Heading 3", icon: "fa-heading" },
	{ tag: "h4", label: "Heading 4", icon: "fa-heading" },
	{ tag: "h5", label: "Heading 5", icon: "fa-heading" },
	{ tag: "h6", label: "Heading 6", icon: "fa-heading" },
	{ tag: "ul", label: "Bulleted list", icon: "fa-list-ul" },
	{ tag: "ol", label: "Numbered list", icon: "fa-list-ol" },
	{ tag: "blockquote", label: "Quote", icon: "fa-quote-left" },
	{ tag: "pre", label: "Code block", icon: "fa-code" },
];

const MyTextArea = ({
	auth = {},
	token = {},
	id = "",
	name = "",
	initialContent,
	defaultValue = "",
	value,
	onChange,
	onModel = "Blog",
	advancedTextEditor = true,
	customPlaceholder = "Share something new. Now with #hashtags support, YAY!!!",
	charactersLimit = 99999,
	isRequired = false,
}) => {
	const editorRef = useRef(null);
	const wrapperRef = useRef(null);
	const fileInputRef = useRef(null);
	const savedRangeRef = useRef(null);
	const newBlockRef = useRef(null);
	const hiddenFieldRef = useRef(null);
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	// JSON copies of the extracted entities, rendered into controlled hidden
	// inputs (a hidden input's value attribute IS its value, so React would
	// reset an uncontrolled one on every re-render).
	const [entityJson, setEntityJson] = useState({ users: "[]", hashtags: "[]" });

	const startingHtml = initialContent ?? defaultValue ?? "<p><br></p>";

	const [status, setStatus] = useState("Ready");

	const [toast, setToast] = useState(null); // { kind: 'primary'|'success'|'danger', msg }

	// In-flight device uploads: [{ id, name, progress }] — each renders a toast
	// with a live percentage.
	const [uploads, setUploads] = useState([]);
	const uploadXhrsRef = useRef(new Map());

	const [showLink, setShowLink] = useState(false);
	const [linkText, setLinkText] = useState("");
	const [linkUrl, setLinkUrl] = useState("");
	const [linkTarget, setLinkTarget] = useState("_blank");

	// Formatting commands whose on/off state is reflected on the toolbar buttons.
	const [activeFormats, setActiveFormats] = useState({});

	const [showPreview, setShowPreview] = useState(false);
	const [previewHtml, setPreviewHtml] = useState("");

	const [showFiles, setShowFiles] = useState(false);
	const [fileState, setFileState] = useState({
		items: [],
		page: 1,
		totalPages: 1,
		loading: false,
		error: "",
	});
	const [fileSearch, setFileSearch] = useState("");
	// Multi-select: array of { url, name, kind } picked in the File Manager.
	const [fileSelection, setFileSelection] = useState([]);
	// How multiple images get inserted: "stacked" | "gallery" | "carousel"
	const [imageLayout, setImageLayout] = useState("stacked");

	const [showUsers, setShowUsers] = useState(false);
	const [userState, setUserState] = useState({
		items: [],
		page: 1,
		totalPages: 1,
		loading: false,
		error: "",
	});
	const [userSearch, setUserSearch] = useState("");

	const [blockMenu, setBlockMenu] = useState(null); // { top, left }

	// @mention autocomplete: { top, left, query } while the user types "@..."
	const [mention, setMention] = useState(null);
	const [mentionIndex, setMentionIndex] = useState(0);

	// Live code snippet modal (HTML + CSS + JS -> sandboxed iframe)
	const [showSnippet, setShowSnippet] = useState(false);
	const [snippet, setSnippet] = useState({
		html: "",
		css: "",
		js: "",
		head: "",
		cssUrls: "",
		jsUrls: "",
	});

	// Abort any in-flight uploads when the editor unmounts.
	useEffect(() => {
		const xhrs = uploadXhrsRef.current;
		return () => {
			xhrs.forEach((xhr) => xhr.abort());
			xhrs.clear();
		};
	}, []);

	// ---- Selection handling ---------------------------------------------------

	useEffect(() => {
		const editor = editorRef.current;
		if (!editor) {
			return;
		}

		// Set the initial content ONCE, imperatively. React must never manage the
		// children of a contentEditable element: re-renders would wipe out
		// everything the user typed (and any nodes we inserted).
		if (!editor.innerHTML.trim()) {
			editor.innerHTML = startingHtml;
		}
		highlightHashtags();
		syncContent();

		try {
			document.execCommand("defaultParagraphSeparator", false, "p");
		} catch (_) {
			/* not supported everywhere; harmless */
		}

		// Bootstrap's JS enables the inserted carousels (prev/next, indicators)
		// right inside the editor. Loaded dynamically because it's browser-only.
		import("bootstrap/dist/js/bootstrap.bundle.min.js").catch(() => {});

		// A MutationObserver catches EVERY content change regardless of source:
		// typing, execCommand, undo/redo, node insertion from the file manager...
		// This is what keeps the hidden form field and onChange in sync.
		const observer = new MutationObserver(() => syncContent());
		observer.observe(editor, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
		});

		function onSelectionChange() {
			if (document.activeElement === editor) {
				saveSelection();
				updateActiveFormats();
			}
		}
		document.addEventListener("selectionchange", onSelectionChange);
		return () => {
			observer.disconnect();
			document.removeEventListener("selectionchange", onSelectionChange);
		};
	}, []);

	// DB-driven updates: replace the editor content when the `value` prop
	// changes to something different from what the editor currently holds.
	// Skipped while the user is typing in it, so a slow refetch can't stomp
	// on their in-progress edits.
	useEffect(() => {
		const editor = editorRef.current;
		if (!editor || typeof value !== "string") {
			return;
		}
		if (document.activeElement === editor) {
			return;
		}
		if (editor.innerHTML !== value) {
			editor.innerHTML = value || "<p><br></p>";
			highlightHashtags();
			syncContent();
		}
	}, [value]);

	// Push the current HTML into the hidden form fields and notify onChange
	// with the three objects: { html, users, hashtags }.
	const syncContent = () => {
		const editor = editorRef.current;
		if (!editor) {
			return;
		}
		// Treat "no text and no embedded media" as empty so `required` works:
		// an untouched editor still contains markup like <p><br></p>.
		const hasContent =
			editor.textContent.trim() !== "" ||
			!!editor.querySelector("img, video, audio, iframe");
		const html = hasContent ? editor.innerHTML : "";
		const { users, hashtags } = extractEntities(editor);
		if (hiddenFieldRef.current && hiddenFieldRef.current.value !== html) {
			hiddenFieldRef.current.value = html;
		}
		const usersJson = JSON.stringify(users);
		const hashtagsJson = JSON.stringify(hashtags);
		setEntityJson((prev) =>
			prev.users === usersJson && prev.hashtags === hashtagsJson
				? prev
				: { users: usersJson, hashtags: hashtagsJson },
		);
		if (onChangeRef.current) {
			onChangeRef.current({ html, users, hashtags });
		}
	};

	// Pulls the embedded users (from their chips) and the hashtags out of the
	// editor content, deduplicated, so they can be stored separately in the DB.
	const extractEntities = (editor) => {
		const users = [];
		const seenUsers = new Set();
		editor.querySelectorAll(".user-chip").forEach((chip) => {
			const id = chip.getAttribute("data-user-id") || "";
			const username = (chip.textContent || "").trim().replace(/^@/, "");
			const key = id || username;
			if (!key || seenUsers.has(key)) {
				return;
			}
			seenUsers.add(key);
			users.push({ id, username });
		});

		const hashtags = [];
		const seenTags = new Set();
		const addTag = (tag) => {
			const key = tag.toLowerCase();
			if (!key || seenTags.has(key)) {
				return;
			}
			seenTags.add(key);
			hashtags.push(tag);
		};
		// Styled hashtag spans first (keeps their original casing/order)...
		editor.querySelectorAll("span.hashtag").forEach((sp) => {
			addTag(
				sp.getAttribute("data-hashtag") || sp.textContent.replace(/^#/, ""),
			);
		});
		// ...then a text scan to catch any not-yet-wrapped one (e.g. mid-typing).
		const re = /(^|[^\p{L}\p{N}_#])#([\p{L}\p{N}_]+)/gu;
		let m;
		while ((m = re.exec(editor.textContent))) addTag(m[2]);

		return { users, hashtags };
	};

	// ---- Hashtag highlighting -----------------------------------------------

	const HASHTAG_RE = /^#[\p{L}\p{N}_]+$/u;

	// Wraps completed #hashtags in <span class="hashtag"> and unwraps spans the
	// user has broken (deleted the #, added invalid chars...). The token the
	// caret is currently inside is left alone so typing is never interrupted.
	const highlightHashtags = () => {
		const editor = editorRef.current;
		if (!editor) {
			return;
		}
		const sel = window.getSelection();
		const caretNode = sel && sel.rangeCount > 0 ? sel.anchorNode : null;
		const caretOffset = sel && sel.rangeCount > 0 ? sel.anchorOffset : 0;

		// 1. Unwrap spans that no longer hold a valid hashtag.
		editor.querySelectorAll("span.hashtag").forEach((sp) => {
			if (HASHTAG_RE.test(sp.textContent)) {
				sp.setAttribute("data-hashtag", sp.textContent.slice(1));
				return;
			}
			const parent = sp.parentNode;
			let restoreOffset = -1;
			if (caretNode && sp.contains(caretNode)) restoreOffset = caretOffset;
			const first = sp.firstChild;
			while (sp.firstChild) parent.insertBefore(sp.firstChild, sp);
			parent.removeChild(sp);
			if (restoreOffset >= 0 && first && sel) {
				const r = document.createRange();
				r.setStart(
					first,
					Math.min(restoreOffset, first.nodeValue ? first.nodeValue.length : 0),
				);
				r.collapse(true);
				sel.removeAllRanges();
				sel.addRange(r);
			}
		});

		// 2. Wrap hashtags found in plain text nodes.
		const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, {
			acceptNode(node) {
				let el = node.parentNode;
				while (el && el !== editor) {
					const tag = el.tagName;
					if (tag === "CODE" || tag === "PRE" || tag === "A")
						return NodeFilter.FILTER_REJECT;
					if (
						el.classList &&
						(el.classList.contains("hashtag") ||
							el.classList.contains("user-chip"))
					)
						return NodeFilter.FILTER_REJECT;
					el = el.parentNode;
				}
				return NodeFilter.FILTER_ACCEPT;
			},
		});
		const textNodes = [];
		while (walker.nextNode()) textNodes.push(walker.currentNode);

		const scanRe = /#[\p{L}\p{N}_]+/gu;
		for (const node of textNodes) {
			const text = node.nodeValue;
			if (!text || text.indexOf("#") === -1) continue;
			scanRe.lastIndex = 0;
			const matches = [];
			let m;
			while ((m = scanRe.exec(text))) {
				const before = m.index === 0 ? "" : text[m.index - 1];
				// # must start a token, not sit inside a word or another hashtag.
				if (before && /[\p{L}\p{N}_#]/u.test(before)) continue;
				const end = m.index + m[0].length;
				// Never wrap the token the caret is inside (still being typed).
				if (node === caretNode && caretOffset >= m.index && caretOffset <= end)
					continue;
				matches.push({ start: m.index, end });
			}
			if (!matches.length) continue;

			const inThisNode = node === caretNode;
			const frag = document.createDocumentFragment();
			let caretTarget = null;
			let caretTargetOffset = 0;
			let last = 0;
			const addText = (from, to) => {
				if (to <= from) return;
				const t = document.createTextNode(text.slice(from, to));
				frag.appendChild(t);
				if (inThisNode && caretOffset >= from && caretOffset <= to) {
					caretTarget = t;
					caretTargetOffset = caretOffset - from;
				}
			};
			for (const { start, end } of matches) {
				addText(last, start);
				const span = document.createElement("span");
				span.className = "hashtag";
				span.setAttribute("data-hashtag", text.slice(start + 1, end));
				span.textContent = text.slice(start, end);
				frag.appendChild(span);
				last = end;
			}
			addText(last, text.length);
			node.parentNode.replaceChild(frag, node);
			if (caretTarget && sel) {
				const r = document.createRange();
				r.setStart(
					caretTarget,
					Math.min(caretTargetOffset, caretTarget.nodeValue.length),
				);
				r.collapse(true);
				sel.removeAllRanges();
				sel.addRange(r);
			}
		}
	};

	const TRACKED_COMMANDS = [
		"bold",
		"italic",
		"underline",
		"strikeThrough",
		"insertUnorderedList",
		"insertOrderedList",
		"justifyLeft",
		"justifyCenter",
		"justifyRight",
	];

	const updateActiveFormats = () => {
		const next = {};
		for (const cmd of TRACKED_COMMANDS) {
			try {
				next[cmd] = document.queryCommandState(cmd);
			} catch (_) {
				next[cmd] = false;
			}
		}
		// Inline code has no execCommand, so its state comes from the DOM.
		next.inlineCode = !!findInlineCodeAncestor();
		setActiveFormats((prev) => {
			// Avoid a re-render when nothing changed (selectionchange fires often).
			for (const key of Object.keys(next)) {
				if (prev[key] !== next[key]) {
					return next;
				}
			}
			return prev;
		});
	};

	// Returns the <code> element the caret/selection sits in, unless it belongs
	// to a <pre> code block (that one is handled by the paragraph-format select).
	const findInlineCodeAncestor = () => {
		const editor = editorRef.current;
		const sel = window.getSelection();
		if (!editor || !sel || sel.rangeCount === 0) {
			return null;
		}
		let node = sel.anchorNode;
		if (!node || !editor.contains(node)) {
			return null;
		}
		if (node.nodeType === 3) {
			node = node.parentNode;
		}
		let codeEl = null;
		while (node && node !== editor) {
			if (node.tagName === "PRE") {
				return null;
			}
			if (node.tagName === "CODE" && !codeEl) {
				codeEl = node;
			}
			node = node.parentNode;
		}
		return codeEl;
	};

	const saveSelection = () => {
		const editor = editorRef.current;
		const sel = window.getSelection();
		if (
			sel &&
			sel.rangeCount > 0 &&
			editor &&
			editor.contains(sel.anchorNode)
		) {
			savedRangeRef.current = sel.getRangeAt(0);
		}
	};

	const restoreSelection = () => {
		const editor = editorRef.current;
		if (!editor) {
			return;
		}
		editor.focus();
		if (savedRangeRef.current) {
			const sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(savedRangeRef.current);
		}
	};

	const insertNodeAtCursor = (node) => {
		const editor = editorRef.current;
		restoreSelection();
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) {
			editor.appendChild(node);
			return;
		}
		const range = sel.getRangeAt(0);
		range.deleteContents();
		range.insertNode(node);
		range.setStartAfter(node);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		saveSelection();
	};

	// Inserts a BLOCK-level node (figure, gallery row, carousel, embed card...)
	// as a direct child of the editor, never inside a paragraph. Splits the
	// block the caret is in when needed and always leaves the caret in a
	// paragraph right below, so subsequent typing goes on a new line instead
	// of wrapping beside/behind the inserted block.
	const insertBlockAtCursor = (node) => {
		const editor = editorRef.current;
		if (!editor) {
			return;
		}
		restoreSelection();
		const sel = window.getSelection();

		const isEmptyBlock = (el) =>
			el.nodeType === 1 &&
			el.textContent.trim() === "" &&
			!el.querySelector("img, video, audio, iframe");

		const finish = () => {
			// Guarantee an editable paragraph right after the block for the caret.
			let after = node.nextSibling;
			const afterIsUsable =
				after &&
				((after.nodeType === 3 && after.nodeValue.trim() !== "") ||
					(after.nodeType === 1 &&
						after.getAttribute("contenteditable") !== "false"));
			if (!afterIsUsable) {
				const p = document.createElement("p");
				p.appendChild(document.createElement("br"));
				node.parentNode.insertBefore(p, node.nextSibling);
				after = p;
			}
			if (sel) {
				const r = document.createRange();
				r.setStart(after, 0);
				r.collapse(true);
				sel.removeAllRanges();
				sel.addRange(r);
			}
			saveSelection();
		};

		let anchor = sel && sel.rangeCount > 0 ? sel.anchorNode : null;
		if (!anchor || !editor.contains(anchor)) {
			editor.appendChild(node);
			finish();
			return;
		}

		// Caret directly on the editor element: insert at that child index.
		if (anchor === editor) {
			editor.insertBefore(node, editor.childNodes[sel.anchorOffset] || null);
			finish();
			return;
		}

		// Find the top-level child of the editor that contains the caret.
		let block = anchor;
		while (block.parentNode !== editor) block = block.parentNode;

		// Bare text node sitting directly under the editor: split it in two.
		if (block.nodeType === 3) {
			const off = anchor === block ? sel.anchorOffset : 0;
			const tailText = block.splitText(off);
			editor.insertBefore(node, tailText);
			finish();
			return;
		}

		// Atomic block (carousel, embed card...): insert right after it.
		if (
			block.nodeType === 1 &&
			block.getAttribute("contenteditable") === "false"
		) {
			editor.insertBefore(node, block.nextSibling);
			finish();
			return;
		}

		const range = sel.getRangeAt(0);
		range.deleteContents();

		// Empty paragraph: place the block before it and reuse it for the caret.
		if (isEmptyBlock(block)) {
			editor.insertBefore(node, block);
			finish();
			return;
		}

		// Split the block at the caret: content after the caret moves into a
		// clone that lands below the inserted node.
		const afterRange = document.createRange();
		afterRange.selectNodeContents(block);
		afterRange.setStart(range.endContainer, range.endOffset);
		const tailFrag = afterRange.extractContents();
		const tail = block.cloneNode(false);
		tail.appendChild(tailFrag);

		editor.insertBefore(node, block.nextSibling);
		if (!isEmptyBlock(tail)) {
			editor.insertBefore(tail, node.nextSibling);
		}
		if (isEmptyBlock(block)) {
			block.remove();
		}
		finish();
	};

	// ---- External URL embedding (paste-to-embed) --------------------------------

	// A paste is treated as "embed this URL" only when the clipboard contains
	// nothing but a single http(s) URL.
	const extractLoneUrl = (text) => {
		const t = (text || "").trim();
		if (!t || /\s/.test(t)) {
			return null;
		}
		if (!/^https?:\/\/[^\s]+$/i.test(t)) {
			return null;
		}
		try {
			new URL(t);
			return t;
		} catch (_) {
			return null;
		}
	};

	const handlePaste = (e) => {
		const text = e.clipboardData && e.clipboardData.getData("text/plain");
		const url = extractLoneUrl(text);
		if (!url) {
			return;
		} // normal paste: let the browser handle it

		e.preventDefault();

		// Insert a placeholder immediately so the user sees feedback while the
		// server unfurls the URL.
		const placeholder = document.createElement("div");
		placeholder.className =
			"card my-2 p-3 d-flex flex-row align-items-center gap-2 text-body-secondary";
		placeholder.setAttribute("contenteditable", "false");
		placeholder.innerHTML =
			'<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span class="small">Embedding ' +
			escapeHtml(url) +
			"…</span>";
		// Block-level insert: the placeholder (and whatever replaces it) must be
		// a direct editor child, never nested inside a paragraph. This also
		// leaves a caret-ready paragraph right below it.
		insertBlockAtCursor(placeholder);
		setStatus("Unfurling link…");

		// Plain links are inline, so give them a paragraph of their own when
		// they replace the block placeholder.
		const linkParagraph = (u) => {
			const p = document.createElement("p");
			p.appendChild(buildPlainLink(u));
			return p;
		};

		unfurlUrl(url)
			.then((data) => {
				if (!data || !data.ok)
					throw new Error((data && data.error) || "Unfurl failed");
				let node;
				if (data.type === "embed") {
					node = buildWordPressEmbed(data);
				} else if (data.type === "card") {
					node = buildOgCard(data);
				} else {
					node = linkParagraph(data.url);
				}
				placeholder.replaceWith(node);
				setStatus(
					data.type === "embed"
						? "WordPress post embedded"
						: data.type === "card"
							? "Link preview added"
							: "Link added",
				);
			})
			.catch(() => {
				placeholder.replaceWith(linkParagraph(url));
				setStatus("Link added");
			});
	};

	// WordPress serves every post at <post-url>/embed/ with its own custom CSS.
	const buildWordPressEmbed = (data) => {
		const fig = document.createElement("figure");
		fig.className = "my-3";
		fig.setAttribute("contenteditable", "false");
		const iframe = document.createElement("iframe");
		iframe.src = data.embedSrc;
		iframe.title = data.title || "Embedded WordPress post";
		iframe.className = "w-100 border rounded";
		iframe.style.height = "360px";
		iframe.setAttribute("loading", "lazy");
		iframe.setAttribute(
			"sandbox",
			"allow-scripts allow-same-origin allow-popups",
		);
		iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
		fig.appendChild(iframe);
		return fig;
	};

	// OpenGraph object: a clickable Bootstrap card with image, title,
	// description and site name.
	const buildOgCard = (data) => {
		const a = document.createElement("a");
		a.href = data.url;
		a.target = "_blank";
		a.rel = "noopener noreferrer";
		a.className =
			"card og-card my-3 text-decoration-none text-body d-block overflow-hidden";
		a.setAttribute("contenteditable", "false");

		const media = data.image
			? '<div class="col-4 col-md-3"><img src="' +
				escapeHtml(data.image) +
				'" alt="" class="w-100 h-100 object-fit-cover" /></div>'
			: "";
		const favicon = data.favicon
			? '<img src="' +
				escapeHtml(data.favicon) +
				'" alt="" width="16" height="16" class="me-1 align-text-bottom" />'
			: "";

		a.innerHTML =
			'<div class="row g-0 flex-row-reverse">' +
			media +
			'<div class="col"><div class="card-body py-2 px-3">' +
			'<p class="fw-semibold mb-1 text-truncate-2">' +
			escapeHtml(data.title || data.url) +
			"</p>" +
			(data.description
				? '<p class="small text-body-secondary mb-1 text-truncate-2">' +
					escapeHtml(data.description) +
					"</p>"
				: "") +
			'<p class="small text-body-secondary mb-0">' +
			favicon +
			escapeHtml(data.siteName || "") +
			"</p>" +
			"</div></div></div>";
		return a;
	};

	const buildPlainLink = (url) => {
		const a = document.createElement("a");
		a.href = url;
		a.target = "_blank";
		a.rel = "noopener noreferrer";
		a.textContent = url;
		return a;
	};

	// ---- Toolbar commands -----------------------------------------------------

	const exec = (cmd, value = null) => {
		restoreSelection();
		document.execCommand(cmd, false, value);
		saveSelection();
		updateActiveFormats();
		editorRef.current && editorRef.current.focus();
	};

	// Bootstrap button class helper: adds .active while the format is on.
	const tbtn = (cmd, base = "btn btn-outline-secondary btn-sm") => {
		return activeFormats[cmd] ? base + " active" : base;
	};

	// ---- Inline code -----------------------------------------------------------

	const toggleInlineCode = () => {
		restoreSelection();
		const editor = editorRef.current;
		const sel = window.getSelection();
		if (!editor || !sel || sel.rangeCount === 0) return;

		const codeEl = findInlineCodeAncestor();
		if (codeEl) {
			// Deactivate: unwrap the <code> element but keep its contents.
			const parent = codeEl.parentNode;
			const range = document.createRange();
			let first = null;
			let last = null;
			while (codeEl.firstChild) {
				const child = codeEl.firstChild;
				parent.insertBefore(child, codeEl);
				if (!first) first = child;
				last = child;
			}
			parent.removeChild(codeEl);
			if (first && last) {
				range.setStartBefore(first);
				range.setEndAfter(last);
				sel.removeAllRanges();
				sel.addRange(range);
			}
		} else {
			const range = sel.getRangeAt(0);
			const code = document.createElement("code");
			if (range.collapsed) {
				// No selection: create an empty inline code and put the caret inside.
				code.appendChild(document.createTextNode("\u200B"));
				range.insertNode(code);
				const inner = document.createRange();
				inner.selectNodeContents(code);
				inner.collapse(false);
				sel.removeAllRanges();
				sel.addRange(inner);
			} else {
				// Wrap the selected text in <code>. extractContents keeps the
				// selection's inline formatting (bold, links, etc.) intact.
				code.appendChild(range.extractContents());
				range.insertNode(code);
				const wrap = document.createRange();
				wrap.selectNodeContents(code);
				sel.removeAllRanges();
				sel.addRange(wrap);
			}
		}
		saveSelection();
		updateActiveFormats();
		editor.focus();
		setStatus(codeEl ? "Inline code removed" : "Inline code applied");
	};

	// ---- Enter-twice: fresh paragraph + block menu -----------------------------

	const currentBlock = () => {
		const editor = editorRef.current;
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) return null;
		let node = sel.anchorNode;
		if (!node || !editor.contains(node)) return null;
		// When the caret sits directly on the editor element, resolve to the
		// child block at the caret offset.
		if (node === editor) {
			const idx = Math.min(sel.anchorOffset, editor.childNodes.length - 1);
			node = editor.childNodes[idx] || null;
			if (!node) return null;
		}
		if (node.nodeType === 3) node = node.parentNode;
		while (node && node !== editor) {
			if (BLOCK_TAGS.indexOf(node.tagName) !== -1) return node;
			node = node.parentNode;
		}
		return null;
	};

	const topLevelBlockOf = (node) => {
		const editor = editorRef.current;
		let top = node;
		while (top.parentNode && top.parentNode !== editor) top = top.parentNode;
		return top;
	};

	const isEmptyBlock = (el) => {
		if (!el) return false;
		const text = (el.textContent || "").replace(/\u00A0/g, " ").trim();
		if (text) return false;
		// Blocks containing media or chips are not empty
		return !el.querySelector("img,video,audio,iframe,.user-chip,figure");
	};

	const placeCaretIn = (el) => {
		const sel = window.getSelection();
		const range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		saveSelection();
	};

	const showBlockMenuAt = (el) => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return;
		const rect = el.getBoundingClientRect();
		const wrapRect = wrapper.getBoundingClientRect();
		setBlockMenu({
			top: rect.bottom - wrapRect.top + 4,
			left: Math.min(rect.left - wrapRect.left, wrapper.clientWidth - 240),
		});
	};

	const handleKeyDown = (e) => {
		// @mention dropdown captures navigation keys while open.
		if (mention) {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setMentionIndex((i) =>
					Math.min(i + 1, Math.max(mentionMatches.length - 1, 0)),
				);
				return;
			}
			if (e.key === "ArrowUp") {
				e.preventDefault();
				setMentionIndex((i) => Math.max(i - 1, 0));
				return;
			}
			if ((e.key === "Enter" || e.key === "Tab") && mentionMatches.length) {
				if (e.nativeEvent.isComposing || e.keyCode === 229) return;
				e.preventDefault();
				applyMention(mentionMatches[mentionIndex] || mentionMatches[0]);
				return;
			}
			if (e.key === "Escape") {
				e.preventDefault();
				setMention(null);
				return;
			}
		}

		// Any key other than Enter dismisses the block menu.
		if (blockMenu && e.key !== "Enter") {
			setBlockMenu(null);
		}

		if (e.key !== "Enter") {
			return;
		}
		// Respect CJK IME composition.
		if (e.nativeEvent.isComposing || e.keyCode === 229) {
			return;
		}
		if (e.shiftKey) {
			return;
		} // Shift+Enter = soft line break, browser default

		const block = currentBlock();
		if (!block) {
			return;
		}
		// Let the browser handle list items natively (Enter on an empty <li>
		// already exits the list into a paragraph).
		if (block.tagName === "LI") {
			return;
		}

		// First Enter creates a new (empty) block of the same type — browser
		// default. The SECOND Enter lands here with an empty block: break out
		// into a fresh paragraph (the default) and offer the block-type menu.
		if (!isEmptyBlock(block)) {
			return;
		}

		e.preventDefault();

		const top = topLevelBlockOf(block);
		const p = document.createElement("p");
		p.innerHTML = "<br>";

		if (top === block) {
			if (block.tagName === "P") {
				// Empty paragraph: add a new line below it.
				top.after(p);
			} else {
				// Empty heading / quote / code block: convert it into a paragraph.
				top.replaceWith(p);
			}
		} else {
			// Empty block nested inside blockquote/pre wrapper: exit the wrapper.
			top.after(p);
			block.remove();
			if (isEmptyBlock(top) && !top.textContent.trim()) {
				top.remove();
			}
		}

		newBlockRef.current = p;
		placeCaretIn(p);
		showBlockMenuAt(p);
		setStatus(
			"New line — paragraph by default. Pick a block type or keep typing.",
		);
	};

	const applyBlockChoice = (tag) => {
		const p = newBlockRef.current;
		setBlockMenu(null);
		if (!p || !editorRef.current || !editorRef.current.contains(p)) {
			return;
		}
		placeCaretIn(p);
		if (tag === "p") {
			// already a paragraph — the default
		} else if (tag === "ul") {
			document.execCommand("insertUnorderedList", false, null);
		} else if (tag === "ol") {
			document.execCommand("insertOrderedList", false, null);
		} else {
			document.execCommand("formatBlock", false, tag);
		}
		saveSelection();
		editorRef.current.focus();
	};

	// ---- Link ------------------------------------------------------------------

	const openLinkModal = () => {
		saveSelection();
		const sel = window.getSelection();
		setLinkText(sel ? sel.toString() : "");
		setLinkUrl("");
		setLinkTarget("_blank");
		setShowLink(true);
	};

	const insertLink = () => {
		const url = linkUrl.trim();
		if (!url) {
			return;
		}
		const text = linkText.trim() || url;
		const a = document.createElement("a");
		a.href = url;
		a.textContent = text;
		if (linkTarget && linkTarget !== "_self") {
			a.target = linkTarget;
			// Prevent reverse tabnabbing whenever the link opens a new browsing context.
			a.rel = "noopener noreferrer";
		}
		insertNodeAtCursor(a);
		setShowLink(false);
		setStatus("Link inserted");
	};

	// ---- Device upload ----------------------------------------------------------

	const onPickFiles = (e) => {
		const files = Array.prototype.slice.call(e.target.files || []);
		e.target.value = "";
		files.forEach(uploadOne);
	};

	const uploadOne = async (file) => {
		const uploadId = generateUploadId();

		// Add this file to the visible upload list at 0%.
		setUploads((prev) => [
			...prev,
			{ id: uploadId, name: file.name, progress: 0 },
		]);

		setStatus("Uploading " + file.name + "...");

		const { res, xhr } = uploadFileToServer(
			file,
			file.name,
			(progress) => {
				setUploads((prev) =>
					prev.map((u) => (u.id === uploadId ? { ...u, progress } : u)),
				);
			},
			auth,
			token,
			onModel,
		);

		uploadXhrsRef.current.set(uploadId, xhr);

		res
			.then((data) => {
				const url = extractUploadUrl(data);
				if (!url)
					throw new Error(
						(data && data.message) ||
							"Upload succeeded but no URL was returned.",
					);
				embedByUrl(url, file.name, file.type);
				setToast({ kind: "success", msg: "Uploaded " + file.name });
				setStatus("Uploaded " + file.name);
				setTimeout(() => setToast(null), 2500);
			})
			.catch((err) => {
				if (err?.name === "AbortError") {
					setStatus("Upload cancelled");
					return;
				}
				setToast({ kind: "danger", msg: "Error: " + err.message });
				setStatus("Upload error");
			})
			.finally(() => {
				uploadXhrsRef.current.delete(uploadId);
				setUploads((prev) => prev.filter((u) => u.id !== uploadId));
			});

		// setToast({ kind: "primary", msg: "Uploading " + file.name + "..." });

		// const form = new FormData();

		// form.append("userId", auth?.userId);
		// form.append("username", auth?.username);
		// form.append("userEmail", auth?.email);
		// form.append("onModel", onModel);
		// form.append("file", file, file.name);
		// form.append("album", "posts");

		// try {
		// 	// fetchurl(url, method, cache, bodyData, signal, multipart, isRemote)
		// 	const data = await fetchurl(
		// 		`${process.env.NEXT_PUBLIC_FILE_UPLOADER_URL}/uploads/uploadobject`,
		// 		"PUT",
		// 		"no-cache",
		// 		form,
		// 		null,
		// 		true,
		// 		true,
		// 	);
		// 	const url = extractUploadUrl(data);
		// 	if (!url)
		// 		throw new Error(
		// 			(data && data.message) || "Upload succeeded but no URL was returned.",
		// 		);
		// 	embedByUrl(url, file.name, file.type);
		// 	setToast({ kind: "success", msg: "Uploaded " + file.name });
		// 	setStatus("Uploaded " + file.name);
		// 	setTimeout(() => setToast(null), 2500);
		// } catch (err) {
		// 	setToast({ kind: "danger", msg: "Error: " + err.message });
		// 	setStatus("Upload error");
		// }
	};

	// Cancel an in-flight upload from its toast's close button.
	const cancelUpload = (uploadId) => {
		const xhr = uploadXhrsRef.current.get(uploadId);
		if (xhr) {
			xhr.abort();
			uploadXhrsRef.current.delete(uploadId);
		}
		setUploads((prev) => prev.filter((u) => u.id !== uploadId));
	};

	// ---- Embedding ----------------------------------------------------------------

	const embedByUrl = (url, name, mime) => {
		const kind = guessKind(url, mime);
		let node;
		if (kind === "image") {
			node = document.createElement("img");
			node.src = url;
			node.alt = name || "Uploaded image";
			node.className = "img-fluid rounded my-2";
		} else if (kind === "video") {
			node = document.createElement("video");
			node.src = url;
			node.controls = true;
			node.className = "w-100 rounded my-2";
		} else if (kind === "audio") {
			node = document.createElement("audio");
			node.src = url;
			node.controls = true;
			node.className = "w-100 my-2";
		} else {
			node = document.createElement("a");
			node.href = url;
			node.target = "_blank";
			node.rel = "noopener noreferrer";
			node.className =
				"d-inline-flex align-items-center gap-2 my-2 text-decoration-none";
			node.innerHTML =
				'<i class="fa-solid fa-paperclip"></i>' + escapeHtml(name || url);
		}
		if (kind === "image" || kind === "video" || kind === "audio") {
			const fig = document.createElement("figure");
			fig.className = "my-2";
			fig.appendChild(node);
			insertBlockAtCursor(fig);
		} else {
			insertNodeAtCursor(node);
		}
	};

	// ---- Multi-file insertion ---------------------------------------------------

	const toggleFileSelection = (item) => {
		const url = fileUrlOf(item);
		if (!url) {
			return;
		}
		setFileSelection((prev) => {
			const exists = prev.some((f) => f.url === url);
			if (exists) {
				return prev.filter((f) => f.url !== url);
			}
			return [...prev, { url, name: fileNameOf(item), kind: guessKind(url) }];
		});
	};

	const insertSelectedFiles = () => {
		const files = fileSelection;
		if (!files.length) {
			return;
		}
		restoreSelection();

		const allImages = files.every((f) => f.kind === "image");
		if (files.length === 1 || !allImages || imageLayout === "stacked") {
			// One below the other; non-images embed with their own element type.
			for (const f of files) {
				embedByUrl(f.url, f.name);
			}
		} else if (imageLayout === "gallery") {
			insertImageGallery(files);
		} else if (imageLayout === "carousel") {
			insertImageCarousel(files);
		}

		setShowFiles(false);
		setFileSelection([]);
		setStatus(
			"Inserted " + files.length + " file" + (files.length > 1 ? "s" : ""),
		);
	};

	const insertImageGallery = (files) => {
		const row = document.createElement("div");
		row.className = "row g-2 my-2";
		const col = files.length >= 3 ? "col-6 col-md-4" : "col-6";
		for (const f of files) {
			const div = document.createElement("div");
			div.className = col;
			const img = document.createElement("img");
			img.src = f.url;
			img.alt = f.name || "Gallery image";
			img.className = "img-fluid rounded w-100 h-100 object-fit-cover";
			div.appendChild(img);
			row.appendChild(div);
		}
		insertBlockAtCursor(row);
	};

	const insertImageCarousel = (files) => {
		const id = "carousel-" + Math.random().toString(36).slice(2, 9);
		const carousel = document.createElement("div");
		carousel.id = id;
		carousel.className = "carousel slide my-3";
		carousel.setAttribute("data-bs-ride", "carousel");
		// Keep the carousel atomic inside the editor so clicks hit the controls,
		// not the text caret.
		carousel.setAttribute("contenteditable", "false");

		let indicators = '<div class="carousel-indicators">';
		let inner = '<div class="carousel-inner rounded">';
		files.forEach((f, i) => {
			indicators +=
				'<button type="button" data-bs-target="#' +
				id +
				'" data-bs-slide-to="' +
				i +
				'"' +
				(i === 0 ? ' class="active" aria-current="true"' : "") +
				' aria-label="Slide ' +
				(i + 1) +
				'"></button>';
			inner +=
				'<div class="carousel-item' +
				(i === 0 ? " active" : "") +
				'"><img src="' +
				f.url +
				'" class="d-block w-100" alt="' +
				escapeHtml(f.name || "Slide " + (i + 1)) +
				'" /></div>';
		});
		indicators += "</div>";
		inner += "</div>";

		const controls =
			'<button class="carousel-control-prev" type="button" data-bs-target="#' +
			id +
			'" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button>' +
			'<button class="carousel-control-next" type="button" data-bs-target="#' +
			id +
			'" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button>';

		carousel.innerHTML = indicators + inner + controls;
		// insertBlockAtCursor also creates the paragraph after the carousel so
		// the user can keep typing below it.
		insertBlockAtCursor(carousel);
	};

	const embedUser = (user) => {
		const name = user.name || user.username || "Unknown";
		const username = user.username || "";
		const avatar = userAvatarOf(user);
		const span = document.createElement("span");
		span.className = "user-chip";
		span.setAttribute("contenteditable", "false");
		span.setAttribute("data-user-id", user._id || "");
		let inner = "";
		if (avatar) {
			inner +=
				'<img src="' +
				escapeHtml(avatar) +
				'" alt="" crossorigin="anonymous" />';
		} else {
			inner += '<i class="fa-solid fa-user-circle"></i>';
		}
		inner += "<span>@" + escapeHtml(username || name) + "</span>";
		span.innerHTML = inner;
		insertNodeAtCursor(span);
		insertNodeAtCursor(document.createTextNode("\u00A0"));
	};

	// ---- File manager -----------------------------------------------------------

	const openFileManager = () => {
		saveSelection();
		setFileSelection([]);
		setImageLayout("stacked");
		setShowFiles(true);
		if (!fileState.items.length) {
			loadFiles(1);
		}
	};

	const loadFiles = async (page) => {
		setFileState((s) => ({ ...s, loading: true, error: "" }));
		try {
			// fetchurl(url, method, cache, bodyData, signal, multipart, isRemote)
			const json = await fetchurl(
				`/global/files?page=${page}&limit=28`,
				"GET",
				"no-cache",
				{},
				null,
				false,
				false,
			);
			if (!json || !Array.isArray(json.data)) {
				throw new Error((json && json.message) || "Failed to load files");
			}
			setFileState({
				items: json.data || [],
				page: (json.pagination && json.pagination.current) || page,
				totalPages: (json.pagination && json.pagination.totalpages) || 1,
				loading: false,
				error: "",
			});
		} catch (err) {
			setFileState((s) => ({ ...s, loading: false, error: err.message }));
		}
	};

	// ---- Users --------------------------------------------------------------------

	const openUsers = () => {
		saveSelection();
		setShowUsers(true);
		if (!userState.items.length) {
			loadUsers(1);
		}
	};

	const loadUsers = async (page) => {
		setUserState((s) => ({ ...s, loading: true, error: "" }));
		try {
			// fetchurl(url, method, cache, bodyData, signal, multipart, isRemote)
			const json = await fetchurl(
				`/global/users?page=${page}`,
				"GET",
				"no-cache",
				{},
				null,
				false,
				false,
			);
			if (!json || !Array.isArray(json.data)) {
				throw new Error(
					(json && json.message) ||
						"Failed to load users. Check your xAuthToken cookie.",
				);
			}
			setUserState({
				items: json.data || [],
				page: (json.pagination && json.pagination.current) || page,
				totalPages: (json.pagination && json.pagination.totalpages) || 1,
				loading: false,
				error: "",
			});
		} catch (err) {
			setUserState((s) => ({ ...s, loading: false, error: err.message }));
		}
	};

	// ---- @mention autocomplete ----------------------------------------------------

	// Matches an "@query" token that ends exactly at the caret. Group 1 is the
	// boundary before the @, group 2 the typed query.
	const MENTION_RE = /(^|[\s\u00A0(>])@([\w.-]*)$/;

	// Users filtered by what's typed after the @.
	const mentionMatches = mention
		? userState.items
				.filter((u) => {
					const q = mention.query.toLowerCase();
					if (!q) {
						return true;
					}
					return (
						(u.username || "").toLowerCase().includes(q) ||
						(u.name || "").toLowerCase().includes(q) ||
						(u.email || "").toLowerCase().includes(q)
					);
				})
				.slice(0, 6)
		: [];

	// Runs on keyup/mouseup: shows the user dropdown while the caret sits at
	// the end of an "@..." token, hides it otherwise.
	const detectMention = () => {
		const editor = editorRef.current;
		const wrapper = wrapperRef.current;
		const sel = window.getSelection();
		if (
			!editor ||
			!wrapper ||
			!sel ||
			sel.rangeCount === 0 ||
			!sel.isCollapsed
		) {
			setMention(null);
			return;
		}
		const node = sel.anchorNode;
		if (!node || node.nodeType !== 3 || !editor.contains(node)) {
			setMention(null);
			return;
		}
		// Never trigger inside code, links, or an existing user chip.
		let el = node.parentNode;
		while (el && el !== editor) {
			const tag = el.tagName;
			if (
				tag === "CODE" ||
				tag === "PRE" ||
				tag === "A" ||
				(el.classList && el.classList.contains("user-chip"))
			) {
				setMention(null);
				return;
			}
			el = el.parentNode;
		}
		const m = MENTION_RE.exec(node.nodeValue.slice(0, sel.anchorOffset));
		if (!m) {
			setMention(null);
			return;
		}
		const rect = sel.getRangeAt(0).cloneRange().getBoundingClientRect();
		const wrapRect = wrapper.getBoundingClientRect();
		setMention({
			top: rect.bottom - wrapRect.top + 4,
			left: Math.min(rect.left - wrapRect.left, wrapper.clientWidth - 280),
			query: m[2],
		});
		setMentionIndex(0);
		// Fetch the users from the DB the first time an @ is typed.
		if (!userState.items.length && !userState.loading) loadUsers(1);
	};

	// Replaces the typed "@query" with the chosen user's chip.
	const applyMention = (user) => {
		const sel = window.getSelection();
		if (sel && sel.rangeCount > 0) {
			const node = sel.anchorNode;
			if (node && node.nodeType === 3) {
				const m = MENTION_RE.exec(node.nodeValue.slice(0, sel.anchorOffset));
				if (m) {
					const start = m.index + m[1].length;
					const del = document.createRange();
					del.setStart(node, start);
					del.setEnd(node, sel.anchorOffset);
					del.deleteContents();
					const caret = document.createRange();
					caret.setStart(node, Math.min(start, node.nodeValue.length));
					caret.collapse(true);
					sel.removeAllRanges();
					sel.addRange(caret);
					saveSelection();
				}
			}
		}
		embedUser(user);
		setMention(null);
		setStatus("Mentioned @" + (user.username || user.name || "user"));
		if (editorRef.current) editorRef.current.focus();
	};

	// ---- Live code snippets ---------------------------------------------------------

	const openSnippet = () => {
		saveSelection();
		setSnippet({
			html: "",
			css: "",
			js: "",
			head: "",
			cssUrls: "",
			jsUrls: "",
		});
		setShowSnippet(true);
	};

	// Parses a textarea of URLs (one per line), keeping only valid http(s) ones.
	const parseResourceUrls = (text) => {
		return (text || "")
			.split(/\r?\n/)
			.map((l) => l.trim())
			.filter((l) => {
				if (!/^https?:\/\//i.test(l)) {
					return false;
				}
				try {
					new URL(l);
					return true;
				} catch (_) {
					return false;
				}
			});
	};

	const insertSnippet = () => {
		// Compose a complete standalone document for the iframe. srcdoc +
		// sandbox="allow-scripts" (WITHOUT allow-same-origin) gives it an opaque
		// origin: its HTML/CSS/JS (and any external stylesheet/script it loads)
		// render and run inside the iframe but can never reach the host page.
		const safeJs = (snippet.js || "").replace(/<\/script/gi, "<\\/script");
		const cssLinks = parseResourceUrls(snippet.cssUrls)
			.map((u) => '<link rel="stylesheet" href="' + escapeHtml(u) + '">')
			.join("");
		const jsScripts = parseResourceUrls(snippet.jsUrls)
			.map((u) => '<script src="' + escapeHtml(u) + '"><\/script>')
			.join("");
		const doc =
			'<!doctype html><html><head><meta charset="utf-8">' +
			(snippet.head || "") +
			cssLinks +
			"<style>" +
			(snippet.css || "") +
			"</style></head><body>" +
			(snippet.html || "") +
			jsScripts +
			"<script>" +
			safeJs +
			"<\/script></body></html>";

		const fig = document.createElement("figure");
		fig.className = "code-snippet my-3";
		fig.setAttribute("contenteditable", "false");
		// Keep the raw sources on the element so they survive save/load.
		fig.setAttribute(
			"data-snippet-html",
			encodeURIComponent(snippet.html || ""),
		);
		fig.setAttribute("data-snippet-css", encodeURIComponent(snippet.css || ""));
		fig.setAttribute("data-snippet-js", encodeURIComponent(snippet.js || ""));
		fig.setAttribute(
			"data-snippet-head",
			encodeURIComponent(snippet.head || ""),
		);
		fig.setAttribute(
			"data-snippet-css-urls",
			encodeURIComponent(snippet.cssUrls || ""),
		);
		fig.setAttribute(
			"data-snippet-js-urls",
			encodeURIComponent(snippet.jsUrls || ""),
		);

		const iframe = document.createElement("iframe");
		iframe.className = "w-100 border rounded";
		iframe.style.height = "260px";
		iframe.style.background = "#fff";
		iframe.setAttribute("title", "Live code snippet");
		iframe.setAttribute("loading", "lazy");
		iframe.setAttribute("sandbox", "allow-scripts");
		iframe.setAttribute("srcdoc", doc);
		fig.appendChild(iframe);

		const cap = document.createElement("figcaption");
		cap.className = "small text-body-secondary mt-1";
		const parts = [
			"HTML",
			snippet.css.trim() && "CSS",
			snippet.js.trim() && "JS",
			parseResourceUrls(snippet.cssUrls).length +
				parseResourceUrls(snippet.jsUrls).length >
				0 && "external resources",
		].filter(Boolean);
		cap.innerHTML =
			'<i class="bi bi-braces me-1"></i>Live snippet (' +
			parts.join(" + ") +
			")";
		fig.appendChild(cap);

		insertBlockAtCursor(fig);
		setShowSnippet(false);
		setStatus("Code snippet inserted");
	};

	// ---- Footer actions -------------------------------------------------------------

	const clearEditor = () => {
		if (editorRef.current) {
			editorRef.current.innerHTML = "<p><br></p>";
		}
		savedRangeRef.current = null;
		setBlockMenu(null);
		setMention(null);
		setStatus("Cleared");
	};

	const openPreview = () => {
		setPreviewHtml(editorRef.current ? editorRef.current.innerHTML : "");
		setShowPreview(true);
	};

	const copyHtml = () => {
		navigator.clipboard
			.writeText(previewHtml)
			.then(() => setStatus("HTML copied to clipboard"))
			.catch(() => setStatus("Could not copy — clipboard permission denied"));
	};

	// ---- Derived lists ----------------------------------------------------------------

	const fq = fileSearch.trim().toLowerCase();
	const visibleFiles = fileState.items.filter((item) => {
		const url = fileUrlOf(item);
		if (!url) {
			return false;
		}
		return !fq || fileNameOf(item).toLowerCase().indexOf(fq) !== -1;
	});

	const uq = userSearch.trim().toLowerCase();
	const visibleUsers = userState.items.filter((user) => {
		const name = (user.name || "") + " " + (user.username || "");
		return !uq || name.toLowerCase().indexOf(uq) !== -1;
	});

	return advancedTextEditor ? (
		<>
			<div className="card shadow-sm">
				{/* Toolbar */}
				<div className="card-header bg-body p-2">
					<div
						className="d-flex flex-wrap align-items-center gap-1"
						role="toolbar"
						aria-label="Formatting toolbar"
					>
						<div
							className="btn-group btn-group-sm"
							role="group"
							aria-label="History"
						>
							<button
								type="button"
								className="btn btn-outline-secondary btn-sm"
								onClick={() => exec("undo")}
								title="Undo (Ctrl+Z)"
							>
								<i className="fa-solid fa-rotate-left" />
								<span className="visually-hidden">Undo</span>
							</button>
							<button
								type="button"
								className="btn btn-outline-secondary btn-sm"
								onClick={() => exec("redo")}
								title="Redo (Ctrl+Y)"
							>
								<i className="fa-solid fa-rotate-right" />
								<span className="visually-hidden">Redo</span>
							</button>
						</div>
						<span className="vr mx-1"></span>
						<select
							className="form-select form-select-sm w-auto"
							title="Paragraph format"
							aria-label="Paragraph format"
							defaultValue="p"
							onChange={(e) => exec("formatBlock", e.target.value)}
						>
							<option value="p">Paragraph</option>
							<option value="h1">Heading 1</option>
							<option value="h2">Heading 2</option>
							<option value="h3">Heading 3</option>
							<option value="h4">Heading 4</option>
							<option value="h5">Heading 5</option>
							<option value="h6">Heading 6</option>
							<option value="blockquote">Quote</option>
							<option value="pre">Code block</option>
						</select>
						<span className="vr mx-1"></span>
						<div
							className="btn-group btn-group-sm"
							role="group"
							aria-label="Text style"
						>
							<button
								type="button"
								className={tbtn("bold")}
								aria-pressed={!!activeFormats.bold}
								onClick={() => exec("bold")}
								title="Bold"
							>
								<i className="fa-solid fa-bold" />
							</button>
							<button
								type="button"
								className={tbtn("italic")}
								aria-pressed={!!activeFormats.italic}
								onClick={() => exec("italic")}
								title="Italic"
							>
								<i className="fa-solid fa-italic" />
							</button>
							<button
								type="button"
								className={tbtn("underline")}
								aria-pressed={!!activeFormats.underline}
								onClick={() => exec("underline")}
								title="Underline"
							>
								<i className="fa-solid fa-underline" />
							</button>
							<button
								type="button"
								className={tbtn("strikeThrough")}
								aria-pressed={!!activeFormats.strikeThrough}
								onClick={() => exec("strikeThrough")}
								title="Strikethrough"
							>
								<i className="fa-solid fa-strikethrough" />
							</button>
							<button
								type="button"
								className={tbtn("inlineCode")}
								aria-pressed={!!activeFormats.inlineCode}
								onClick={toggleInlineCode}
								title="Inline code"
							>
								<i className="fa-solid fa-code" />
								<span className="visually-hidden">Inline code</span>
							</button>
						</div>
						<span className="vr mx-1"></span>
						<div
							className="btn-group btn-group-sm"
							role="group"
							aria-label="Lists"
						>
							<button
								type="button"
								className={tbtn("insertUnorderedList")}
								aria-pressed={!!activeFormats.insertUnorderedList}
								onClick={() => exec("insertUnorderedList")}
								title="Bulleted list"
							>
								<i className="fa-solid fa-list-ul" />
							</button>
							<button
								type="button"
								className={tbtn("insertOrderedList")}
								aria-pressed={!!activeFormats.insertOrderedList}
								onClick={() => exec("insertOrderedList")}
								title="Numbered list"
							>
								<i className="fa-solid fa-list-ol" />
							</button>
						</div>
						<span className="vr mx-1"></span>
						<div
							className="btn-group btn-group-sm"
							role="group"
							aria-label="Alignment"
						>
							<button
								type="button"
								className={tbtn("justifyLeft")}
								aria-pressed={!!activeFormats.justifyLeft}
								onClick={() => exec("justifyLeft")}
								title="Align left"
							>
								<i className="fa-solid fa-align-left" />
							</button>
							<button
								type="button"
								className={tbtn("justifyCenter")}
								aria-pressed={!!activeFormats.justifyCenter}
								onClick={() => exec("justifyCenter")}
								title="Align center"
							>
								<i className="fa-solid fa-align-center" />
							</button>
							<button
								type="button"
								className={tbtn("justifyRight")}
								aria-pressed={!!activeFormats.justifyRight}
								onClick={() => exec("justifyRight")}
								title="Align right"
							>
								<i className="fa-solid fa-align-right" />
							</button>
						</div>
						<span className="vr mx-1"></span>
						<button
							type="button"
							className="btn btn-outline-secondary btn-sm"
							onClick={openLinkModal}
							title="Insert link"
						>
							<i className="fa-solid fa-link" />
							<span className="visually-hidden">Insert link</span>
						</button>
						<button
							type="button"
							className="btn btn-outline-secondary btn-sm "
							onClick={() => exec("removeFormat")}
							title="Clear formatting"
						>
							<i className="fa-solid fa-eraser" />
							<span className="visually-hidden">Clear formatting</span>
						</button>
						<span className="vr mx-1"></span>
						<button
							type="button"
							className="btn btn-primary btn-sm"
							onClick={() => {
								saveSelection();
								fileInputRef.current && fileInputRef.current.click();
							}}
							title="Upload from device"
						>
							<i className="fa-solid fa-upload me-1" />
							Upload
						</button>
						<button
							type="button"
							className="btn btn-outline-primary btn-sm"
							onClick={openFileManager}
							title="Insert from file manager"
						>
							<i className="fa-solid fa-folder-open me-1" />
							Files
						</button>
						<button
							type="button"
							className="btn btn-outline-primary btn-sm"
							onClick={openUsers}
							title="Embed a user"
						>
							<i className="fa-solid fa-users me-1" />
							Users
						</button>
						<button
							type="button"
							className="btn btn-outline-primary btn-sm"
							onClick={openSnippet}
							title="Insert a live code snippet"
						>
							<i className="fa-solid fa-code me-1" />
							Snippet
						</button>
						<input
							ref={fileInputRef}
							type="file"
							className="d-none"
							multiple
							onChange={onPickFiles}
						/>
					</div>
				</div>

				{/* Editor surface */}
				<div className="card-body p-0 position-relative" ref={wrapperRef}>
					<div
						ref={editorRef}
						id={id}
						className="editor-surface p-4"
						contentEditable
						suppressContentEditableWarning
						role="textbox"
						aria-multiline="true"
						aria-label="Rich text editor"
						aria-required={isRequired || undefined}
						spellCheck
						onKeyDown={handleKeyDown}
						onKeyUp={(e) => {
							// Wrap/unwrap hashtags as the user types. The token under the
							// caret is skipped, so this is safe to run on every keyup.
							if (!e.nativeEvent.isComposing) {
								highlightHashtags();
								// Navigation keys are handled by keydown; anything else may
								// have changed the "@query" token under the caret.
								if (
									!["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(
										e.key,
									)
								)
									detectMention();
							}
							saveSelection();
						}}
						onMouseUp={() => {
							// Clicking away from a half-typed tag completes it.
							highlightHashtags();
							detectMention();
							saveSelection();
						}}
						onPaste={handlePaste}
					/>

					{/* Hidden form field: mirrors the editor HTML so a plain
              `new FormData(form)` submit picks it up under `name`.
              Kept focusable (not display:none) so native `required`
              validation can still fire; focusing it forwards to the editor. */}
					{name && (
						<>
							<textarea
								ref={hiddenFieldRef}
								name={name}
								defaultValue={startingHtml}
								required={isRequired}
								maxLength={charactersLimit}
								aria-hidden="true"
								tabIndex={-1}
								className="position-absolute opacity-0 pe-none"
								style={{ height: 1, width: 1, bottom: 0, left: 0 }}
								onFocus={() => editorRef.current && editorRef.current.focus()}
								onChange={() => {}}
							/>
							{/* JSON arrays kept in sync, so FormData also carries the
                  embedded users and the hashtags as separate fields. */}
							<input
								type="hidden"
								name={name + "_users"}
								value={entityJson.users}
								readOnly
							/>
							<input
								type="hidden"
								name={name + "_hashtags"}
								value={entityJson.hashtags}
								readOnly
							/>
						</>
					)}
					{/* @mention autocomplete dropdown */}
					{mention && (
						<div
							className="dropdown-menu show shadow block-menu mention-menu"
							style={{ top: mention.top, left: Math.max(8, mention.left) }}
							role="listbox"
							aria-label="Mention a user"
						>
							{userState.loading && (
								<div className="dropdown-item-text small text-body-secondary">
									<span
										className="spinner-border spinner-border-sm me-2"
										aria-hidden="true"
									></span>
									Loading users…
								</div>
							)}
							{!userState.loading && userState.error && (
								<div className="dropdown-item-text small text-danger">
									{userState.error}
								</div>
							)}
							{!userState.loading &&
								!userState.error &&
								mentionMatches.length === 0 && (
									<div className="dropdown-item-text small text-body-secondary">
										{'No users match "@' + mention.query + '"'}
									</div>
								)}
							{mentionMatches.map((u, i) => {
								const avatar = userAvatarOf(u);
								return (
									<button
										key={u._id || i}
										type="button"
										role="option"
										aria-selected={i === mentionIndex}
										className={
											"dropdown-item" + (i === mentionIndex ? " active" : "")
										}
										onMouseDown={(ev) => ev.preventDefault()}
										onMouseEnter={() => setMentionIndex(i)}
										onClick={() => applyMention(u)}
									>
										{avatar ? (
											<img
												src={avatar || "/placeholder.svg"}
												alt=""
												width="24"
												height="24"
												className="rounded-circle"
												crossOrigin="anonymous"
											/>
										) : (
											<i className="fa-solid fa-user-circle fs-5" />
										)}
										<span className="text-truncate">
											{u.name || u.username}
										</span>
										{u.username && (
											<small
												className={
													"ms-auto " +
													(i === mentionIndex ? "" : "text-body-secondary")
												}
											>
												@{u.username}
											</small>
										)}
									</button>
								);
							})}
						</div>
					)}
					{/* Block-type menu (appears after pressing Enter twice) */}
					{blockMenu && (
						<div
							className="dropdown-menu show shadow block-menu"
							style={{
								top: blockMenu.top,
								left: Math.max(8, blockMenu.left),
							}}
							role="menu"
						>
							<h6 className="dropdown-header">Turn new line into...</h6>
							{BLOCK_MENU_ITEMS.map((item) => (
								<button
									key={item.tag}
									type="button"
									className="dropdown-item"
									role="menuitem"
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => applyBlockChoice(item.tag)}
								>
									<i className={"fa-solid " + item.icon} />
									<span>{item.label}</span>
									{item.hint && (
										<span className="badge text-bg-secondary ms-auto">
											{item.hint}
										</span>
									)}
								</button>
							))}
						</div>
					)}
				</div>
				<div className="card-footer bg-body d-flex justify-content-between align-items-center flex-wrap gap-2">
					<small className="text-body-secondary">{status}</small>
					<div className="d-flex gap-2">
						<button
							type="button"
							className="btn btn-outline-secondary btn-sm"
							onClick={clearEditor}
						>
							Clear
						</button>
						<button
							type="button"
							className="btn btn-outline-secondary btn-sm"
							onClick={openPreview}
						>
							<i className="fa-solid fa-eye me-1" />
							Preview HTML
						</button>
					</div>
				</div>
			</div>
			{/* Upload toasts: live per-file progress + result message */}
			{(toast || uploads.length > 0) && (
				<div className="toast-container position-fixed bottom-0 end-0 p-3">
					{uploads.map((u) => (
						<div
							key={u.id}
							className="toast align-items-center border-0 show text-bg-primary mb-2"
							role="status"
							aria-live="polite"
							aria-atomic="true"
						>
							<div className="d-flex">
								<div className="toast-body w-100">
									<div className="d-flex justify-content-between align-items-center gap-3 mb-1">
										<span
											className="text-truncate"
											style={{ maxWidth: "12rem" }}
										>
											<i className="fa-solid fa-upload me-1" />
											{u.name}
										</span>
										<span className="fw-bold">{u.progress}%</span>
									</div>
									<div
										className="progress"
										style={{ height: "4px" }}
										role="progressbar"
										aria-label={"Uploading " + u.name}
										aria-valuenow={u.progress}
										aria-valuemin={0}
										aria-valuemax={100}
									>
										<div
											className="progress-bar bg-light"
											style={{ width: u.progress + "%" }}
										></div>
									</div>
								</div>
								<button
									type="button"
									className="btn-close btn-close-white me-2 m-auto"
									aria-label={"Cancel upload of " + u.name}
									onClick={() => cancelUpload(u.id)}
								></button>
							</div>
						</div>
					))}
					{toast && (
						<div
							className={
								"toast align-items-center border-0 show text-bg-" + toast.kind
							}
							role="alert"
							aria-live="assertive"
							aria-atomic="true"
						>
							<div className="d-flex">
								<div className="toast-body">{toast.msg}</div>
								<button
									type="button"
									className="btn-close btn-close-white me-2 m-auto"
									aria-label="Close"
									onClick={() => setToast(null)}
								></button>
							</div>
						</div>
					)}
				</div>
			)}
			{/* File Manager modal */}
			{showFiles && (
				<BootstrapModal
					title="File Manager"
					icon="folder-open"
					size="modal-xl"
					onClose={() => setShowFiles(false)}
				>
					<div className="modal-body">
						<div className="input-group input-group-sm mb-3">
							<span className="input-group-text">
								<i className="fa-solid fa-magnifying-glass" />
							</span>
							<input
								type="text"
								className="form-control"
								placeholder="Filter loaded files by name..."
								value={fileSearch}
								onChange={(e) => setFileSearch(e.target.value)}
							/>
						</div>
						{fileState.loading && <ModalSpinner label="Loading files..." />}
						{fileState.error && (
							<div className="alert alert-danger" role="alert">
								{fileState.error}
							</div>
						)}
						{!fileState.loading && !fileState.error && (
							<div className="row g-3">
								{visibleFiles.length === 0 && (
									<div className="col-12 text-center text-body-secondary py-4">
										No matching files on this page.
									</div>
								)}
								{visibleFiles.map((item, i) => {
									const url = fileUrlOf(item);
									const name = fileNameOf(item);
									const kind = guessKind(url);
									const selectedIdx = fileSelection.findIndex(
										(f) => f.url === url,
									);
									const isSelected = selectedIdx !== -1;
									return (
										<div
											className="col-6 col-md-4 col-lg-3"
											key={item._id || i}
										>
											<div
												className={
													"card file-card h-100 shadow-sm position-relative" +
													(isSelected ? " border-primary border-2" : "")
												}
												role="checkbox"
												aria-checked={isSelected}
												aria-label={"Select " + name}
												tabIndex={0}
												onClick={() => toggleFileSelection(item)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														toggleFileSelection(item);
													}
												}}
											>
												{isSelected && (
													<span className="badge text-bg-primary position-absolute top-0 end-0 m-2 z-1">
														<i className="fa-solid fa-check me-1" />
														{selectedIdx + 1}
													</span>
												)}
												{kind === "image" ? (
													<img
														src={url || "/placeholder.svg"}
														alt={name}
														className="file-thumb"
														loading="lazy"
														crossOrigin="anonymous"
													/>
												) : (
													<div className="file-thumb d-flex align-items-center justify-content-center bg-body-tertiary">
														<i
															className={
																"fa fs-1 text-body-secondary " +
																(kind === "video"
																	? "fa-film"
																	: kind === "audio"
																		? "fa-music"
																		: "fa-file")
															}
														/>
													</div>
												)}
												<div className="card-body p-2">
													<p className="small text-truncate mb-0" title={name}>
														{name}
													</p>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
					<div className="modal-footer justify-content-between">
						<Pagination
							page={fileState.page}
							totalPages={fileState.totalPages}
							onPage={loadFiles}
							label="File pages"
						/>
						<div className="d-flex align-items-center gap-2">
							{fileSelection.length > 1 &&
								fileSelection.every((f) => f.kind === "image") && (
									<select
										className="form-select form-select-sm w-auto"
										aria-label="Image layout"
										value={imageLayout}
										onChange={(e) => setImageLayout(e.target.value)}
									>
										<option value="stacked">One below the other</option>
										<option value="gallery">Gallery grid</option>
										<option value="carousel">Carousel</option>
									</select>
								)}
							<button
								type="button"
								className="btn btn-primary btn-sm"
								disabled={fileSelection.length === 0}
								onClick={insertSelectedFiles}
							>
								Insert
								{fileSelection.length > 0
									? " (" + fileSelection.length + ")"
									: ""}
							</button>
							<button
								type="button"
								className="btn btn-secondary btn-sm"
								onClick={() => setShowFiles(false)}
							>
								Close
							</button>
						</div>
					</div>
				</BootstrapModal>
			)}
			{/* Users modal */}
			{showUsers && (
				<BootstrapModal
					title="Embed a User"
					icon="users"
					size="modal-lg"
					onClose={() => setShowUsers(false)}
				>
					<div className="modal-body">
						<div className="input-group input-group-sm mb-3">
							<span className="input-group-text">
								<i className="fa-solid fa-magnifying-glass" />
							</span>
							<input
								type="text"
								className="form-control"
								placeholder="Filter loaded users by name or username..."
								value={userSearch}
								onChange={(e) => setUserSearch(e.target.value)}
							/>
						</div>

						{userState.loading && <ModalSpinner label="Loading users..." />}
						{userState.error && (
							<div className="alert alert-danger" role="alert">
								{userState.error}
							</div>
						)}

						{!userState.loading && !userState.error && (
							<div className="list-group">
								{visibleUsers.length === 0 && (
									<div className="text-center text-body-secondary py-4">
										No matching users on this page.
									</div>
								)}
								{visibleUsers.map((user, i) => {
									const name = user.name || user.username || "Unknown";
									const username = user.username || "";
									const avatar = userAvatarOf(user);
									return (
										<button
											key={user._id || i}
											type="button"
											className="list-group-item list-group-item-action d-flex align-items-center"
											onClick={() => {
												embedUser(user);
												setShowUsers(false);
												setStatus("Embedded @" + (username || name));
											}}
										>
											{avatar ? (
												<img
													src={avatar || "/placeholder.svg"}
													alt=""
													className="rounded-circle me-3"
													width={40}
													height={40}
													style={{ objectFit: "cover" }}
													crossOrigin="anonymous"
												/>
											) : (
												<span
													className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle me-3"
													style={{ width: 40, height: 40 }}
												>
													<i className="fa-solid fa-user" />
												</span>
											)}
											<span className="text-start">
												<span className="d-block fw-semibold">{name}</span>
												{username && (
													<small className="text-body-secondary">
														@{username}
													</small>
												)}
											</span>
										</button>
									);
								})}
							</div>
						)}
					</div>
					<div className="modal-footer justify-content-between">
						<Pagination
							page={userState.page}
							totalPages={userState.totalPages}
							onPage={loadUsers}
							label="User pages"
						/>
						<button
							type="button"
							className="btn btn-secondary btn-sm"
							onClick={() => setShowUsers(false)}
						>
							Close
						</button>
					</div>
				</BootstrapModal>
			)}
			{/* Link modal */}
			{showLink && (
				<BootstrapModal
					title="Insert Link"
					icon="link"
					onClose={() => setShowLink(false)}
				>
					<div className="modal-body">
						<div className="mb-3">
							<label htmlFor="linkTextInput" className="form-label">
								Text
							</label>
							<input
								id="linkTextInput"
								type="text"
								className="form-control"
								placeholder="Link text"
								value={linkText}
								onChange={(e) => setLinkText(e.target.value)}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="linkUrlInput" className="form-label">
								URL
							</label>
							<input
								id="linkUrlInput"
								type="url"
								className="form-control"
								placeholder="https://example.com"
								value={linkUrl}
								onChange={(e) => setLinkUrl(e.target.value)}
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="linkTargetSelect" className="form-label">
								Open in
							</label>
							<select
								id="linkTargetSelect"
								className="form-select"
								value={linkTarget}
								onChange={(e) => setLinkTarget(e.target.value)}
							>
								<option value="_blank">New tab (_blank)</option>
								<option value="_self">Same tab (_self)</option>
								<option value="_parent">Parent frame (_parent)</option>
								<option value="_top">Top frame (_top)</option>
							</select>
						</div>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary btn-sm"
							onClick={() => setShowLink(false)}
						>
							Cancel
						</button>
						<button
							type="button"
							className="btn btn-primary btn-sm"
							onClick={insertLink}
						>
							Insert
						</button>
					</div>
				</BootstrapModal>
			)}
			{/* Preview modal */}
			{showPreview && (
				<BootstrapModal
					title="HTML Output"
					icon="code"
					size="modal-lg"
					onClose={() => setShowPreview(false)}
				>
					<div className="modal-body">
						<pre className="bg-body-tertiary p-3 rounded border preview-code">
							<code>{previewHtml}</code>
						</pre>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-outline-secondary btn-sm"
							onClick={copyHtml}
						>
							<i className="fa-solid fa-clipboard me-1" />
							Copy
						</button>
						<button
							type="button"
							className="btn btn-secondary btn-sm"
							onClick={() => setShowPreview(false)}
						>
							Close
						</button>
					</div>
				</BootstrapModal>
			)}
			{/* Code Snippet modal */}
			{showSnippet && (
				<BootstrapModal
					title="Insert Code Snippet"
					icon="bi-braces"
					size="modal-lg"
					onClose={() => setShowSnippet(false)}
				>
					<div className="modal-body">
						<p className="small text-body-secondary mb-3">
							The snippet renders inside a sandboxed iframe: its HTML, CSS and
							JavaScript only affect the iframe content, never the rest of the
							page.
						</p>
						<div className="mb-3">
							<label
								htmlFor="snippet-html"
								className="form-label small fw-semibold"
							>
								HTML
							</label>
							<textarea
								id="snippet-html"
								className="form-control font-monospace"
								rows={4}
								spellCheck={false}
								placeholder="<h1>Hello world</h1>"
								value={snippet.html}
								onChange={(e) =>
									setSnippet((s) => ({ ...s, html: e.target.value }))
								}
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="snippet-css"
								className="form-label small fw-semibold"
							>
								CSS
							</label>
							<textarea
								id="snippet-css"
								className="form-control font-monospace"
								rows={4}
								spellCheck={false}
								placeholder={"h1 { color: rebeccapurple; }"}
								value={snippet.css}
								onChange={(e) =>
									setSnippet((s) => ({ ...s, css: e.target.value }))
								}
							/>
						</div>
						<div className="mb-3">
							<label
								htmlFor="snippet-js"
								className="form-label small fw-semibold"
							>
								JavaScript
							</label>
							<textarea
								id="snippet-js"
								className="form-control font-monospace"
								rows={4}
								spellCheck={false}
								placeholder={
									'document.querySelector("h1").textContent = "Hi from JS"'
								}
								value={snippet.js}
								onChange={(e) =>
									setSnippet((s) => ({ ...s, js: e.target.value }))
								}
							/>
						</div>

						<hr className="my-3" />
						<p className="small fw-semibold mb-2">
							<i className="fa-solid fa-globe me-1" />
							External resources
							<span className="ms-1 fw-normal text-body-secondary">
								(optional)
							</span>
						</p>
						<div className="mb-3">
							<label
								htmlFor="snippet-head"
								className="form-label small fw-semibold"
							>
								{"Extra <head> content"}
							</label>
							<textarea
								id="snippet-head"
								className="form-control font-monospace"
								rows={3}
								spellCheck={false}
								placeholder={
									'<meta name="viewport" content="width=device-width, initial-scale=1">\n<link rel="preconnect" href="https://fonts.googleapis.com">'
								}
								value={snippet.head}
								onChange={(e) =>
									setSnippet((s) => ({ ...s, head: e.target.value }))
								}
							/>
							<div className="form-text">
								Raw HTML placed inside the iframe&apos;s {"<head>"} (meta tags,
								fonts, inline styles...).
							</div>
						</div>
						<div className="row g-3 mb-0">
							<div className="col-12 col-md-6">
								<label
									htmlFor="snippet-css-urls"
									className="form-label small fw-semibold"
								>
									External stylesheets
								</label>
								<textarea
									id="snippet-css-urls"
									className="form-control font-monospace"
									rows={3}
									spellCheck={false}
									placeholder={
										"https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
									}
									value={snippet.cssUrls}
									onChange={(e) =>
										setSnippet((s) => ({ ...s, cssUrls: e.target.value }))
									}
								/>
								<div className="form-text">
									One URL per line, added as {'<link rel="stylesheet">'}.
								</div>
							</div>
							<div className="col-12 col-md-6">
								<label
									htmlFor="snippet-js-urls"
									className="form-label small fw-semibold"
								>
									External scripts
								</label>
								<textarea
									id="snippet-js-urls"
									className="form-control font-monospace"
									rows={3}
									spellCheck={false}
									placeholder={"https://cdn.jsdelivr.net/npm/chart.js"}
									value={snippet.jsUrls}
									onChange={(e) =>
										setSnippet((s) => ({ ...s, jsUrls: e.target.value }))
									}
								/>
								<div className="form-text">
									One URL per line, loaded before your JavaScript runs.
								</div>
							</div>
						</div>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary btn-sm"
							onClick={() => setShowSnippet(false)}
						>
							Cancel
						</button>
						<button
							type="button"
							className="btn btn-primary btn-sm"
							disabled={
								!snippet.html.trim() &&
								!snippet.css.trim() &&
								!snippet.js.trim() &&
								!snippet.cssUrls.trim() &&
								!snippet.jsUrls.trim()
							}
							onClick={insertSnippet}
						>
							<i className="bi bi-braces me-1" />
							Insert snippet
						</button>
					</div>
				</BootstrapModal>
			)}
		</>
	) : (
		<textarea
			id={id}
			name={name}
			defaultValue={defaultValue}
			className="form-control mb-3"
			required={isRequired}
			placeholder={customPlaceholder}
			rows="5"
		/>
	);
};

// ---- Small presentational helpers (Bootstrap markup, React state) -----------

function BootstrapModal({ title, icon, size = "", onClose, children }) {
	useEffect(() => {
		function onKey(e) {
			if (e.key === "Escape") onClose();
		}
		document.addEventListener("keydown", onKey);
		document.body.classList.add("modal-open");
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.classList.remove("modal-open");
		};
	}, [onClose]);

	return (
		<>
			<div
				className="modal fade show d-block"
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-label={title}
			>
				<div className={"modal-dialog modal-dialog-scrollable " + size}>
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">
								<i className={"fa-solid fa-" + icon + " me-2"} />
								{title}
							</h5>
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={onClose}
							></button>
						</div>
						{children}
					</div>
				</div>
			</div>
			<div className="modal-backdrop fade show" onClick={onClose}></div>
		</>
	);
}

function ModalSpinner({ label }) {
	return (
		<div className="text-center py-5 text-body-secondary">
			<div className="spinner-border" role="status">
				<span className="visually-hidden">{label}</span>
			</div>
			<p className="mt-2 mb-0">{label}</p>
		</div>
	);
}

function Pagination({ page, totalPages, onPage, label }) {
	const pages = [];
	for (let p = 1; p <= totalPages; p++) pages.push(p);
	return (
		<nav aria-label={label}>
			<ul className="pagination pagination-sm mb-0">
				{pages.map((p) => (
					<li key={p} className={"page-item" + (p === page ? " active" : "")}>
						<button
							type="button"
							className="page-link"
							onClick={() => onPage(p)}
						>
							{p}
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
}

export default MyTextArea;
