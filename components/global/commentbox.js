"use client";

/**
 * A complete comment system in one file: fetching, threading, the composer,
 * inline replies, guest/authenticated modes and pagination.
 *
 * Drop it into any section that owns commentable records:
 *
 *   <CommentBox resourceId={blog._id}    onModel="Blog"    auth={auth} />
 *   <CommentBox resourceId={post._id}    onModel="Post"    auth={auth} />
 *   <CommentBox resourceId={snippet._id} onModel="Snippet" auth={auth} />
 *
 * Requires `react`, `swr`, `he`, Bootstrap 5.3 CSS and Bootstrap Icons.
 *
 * Comment bodies render as trusted HTML. Nothing is filtered client-side, so
 * whatever the API returns reaches the DOM verbatim and the API's own
 * sanitiser is the only thing standing between a commenter and stored XSS.
 *
 * Transport is the app's own `fetchurl`, and paging is the app's own
 * `NumericPagination`. Adjust those two import paths to wherever they live.
 */

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import he from "he";
import useSWR from "swr";
import { fetchurl } from "@/helpers/setTokenOnServer";
import NumericPagination from "@/layout/numericpagination";
import MyTextArea from "@/components/global/myfinaltextarea";

const MAX_NAME = 80;
const MAX_TITLE = 120;
const MAX_WEBSITE = 200;
const MAX_TEXT = 5000;

// The form key MyTextArea publishes the body under, and the key the composer
// reads back out of FormData. One constant so the two cannot drift apart.
const BODY_FIELD = "text";

/*
 * Scoped to `.comment-box` and hoisted by React, which dedupes on `href`, so
 * several instances on one page still emit a single tag. Keeping the rules
 * here is what lets the component be pasted into an app without also copying
 * anything into a global stylesheet.
 */
const STYLES = `
.comment-box .comment-html > :last-child { margin-bottom: 0; }
.comment-box .comment-html p,
.comment-box .comment-html ul,
.comment-box .comment-html ol,
.comment-box .comment-html blockquote,
.comment-box .comment-html pre { margin-bottom: 0.5rem; }
.comment-box .comment-html blockquote {
  border-left: 3px solid var(--bs-border-color);
  padding-left: 0.75rem;
  color: var(--bs-secondary-color);
}
.comment-box .comment-html pre { white-space: pre-wrap; word-break: break-word; }
.comment-box .comment-html img,
.comment-box .comment-html video,
.comment-box .comment-html audio,
.comment-box .comment-html iframe { max-width: 100%; }
.comment-box .comment-html img,
.comment-box .comment-html video { height: auto; }
.comment-box .comment-html audio { width: 100%; }
.comment-box .comment-html figure { margin: 0 0 0.5rem; }
.comment-box .comment-html figcaption {
  font-size: 0.875rem;
  color: var(--bs-secondary-color);
}
/* A wide table scrolls inside the comment rather than stretching the card
   past the page. Blocking the table is what gives it a scroll container
   without needing a wrapper element in the stored markup, and max-content
   keeps a narrow table from being stretched to fill the row. */
.comment-box .comment-html table {
  display: block;
  width: max-content;
  max-width: 100%;
  overflow-x: auto;
  margin-bottom: 0.5rem;
}

/* Reachable only mid-submit, when a card replying from its footer keeps the
   root in a plain body and the arriving reply adds a second one. Without this
   the two bodies stack their padding and a seam opens under the root. */
.comment-box .card-body + .card-body {
  padding-top: 0;
}

/* MyTextArea hardcodes rows="5", which is too tall for a reply tucked into a
   card footer. Reaches only plain mode's real <textarea>; the rich editor's
   body is a contenteditable div and keeps its full height. Delete this rule
   to get the editor's own sizing back. */
.comment-box .comment-reply-form textarea.form-control {
  height: 5.25rem;
}

/* Bootstrap compiles the pagination palette into its own component
   variables, so retinting --bs-primary alone never reaches them. */
.comment-box .pagination {
  --bs-pagination-color: var(--bs-link-color);
  --bs-pagination-hover-color: var(--bs-link-hover-color);
  --bs-pagination-active-bg: var(--bs-primary);
  --bs-pagination-active-border-color: var(--bs-primary);
  --bs-pagination-focus-color: var(--bs-link-hover-color);
  --bs-pagination-focus-box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}
`;

/* ------------------------------------------------------------------ markup */

/**
 * One pass, deliberately. This used to loop until the string stopped changing,
 * which was safe only because an allowlist ran straight afterwards: with the
 * allowlist gone, looping peels `&amp;lt;img onerror=...&amp;gt;` down to a
 * live tag that nothing is left to catch. A backend that encodes once needs
 * exactly one decode, and text the author escaped on purpose stays escaped.
 */
const decodeEntities = (value) => he.decode(String(value ?? ""));

/**
 * Stored bodies come back entity-encoded, so they are decoded into the markup
 * the editor produced and rendered as-is. No allowlist runs afterwards — the
 * API sanitises on write, and filtering a second time here is what used to
 * strip images, video and tables out of rich-editor comments.
 */
const toRenderableHtml = (stored, decode = true) =>
	decode ? decodeEntities(stored) : String(stored ?? "");

const escapeHtml = (value) =>
	String(value).replace(
		/[<>&"]/g,
		(character) =>
			({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[character],
	);

/** Turns the composer's plain text into the paragraph markup the API stores. */
const plainTextToHtml = (text) =>
	String(text ?? "")
		.split(/\n{2,}/)
		.map((block) => block.trim())
		.filter(Boolean)
		.map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`)
		.join("");

/* -------------------------------------------------------------------- urls */

const parseUrl = (value) => {
	if (typeof value !== "string" || !value.trim()) return null;
	try {
		return new URL(value.trim());
	} catch {
		return null;
	}
};

/** An author link is a navigation, so plain http is usable; `javascript:` is not. */
const safeLinkUrl = (value) => {
	const url = parseUrl(value);
	return url && (url.protocol === "https:" || url.protocol === "http:")
		? url.toString()
		: null;
};

/** Avatars are subresources, so a remote http URL would be blocked as mixed
 *  content. Same-origin paths are kept as-is for locally hosted uploads. */
const safeImageUrl = (value) => {
	const raw = String(value ?? "").trim();
	if (!raw) return null;
	if (raw.startsWith("/") && !raw.startsWith("//")) return raw;

	const url = parseUrl(raw);
	return url && url.protocol === "https:" ? url.toString() : null;
};

/**
 * Accepts what people actually type ("example.com") and returns an address a
 * browser can follow, or null. Requiring a dot in the hostname drops bare
 * words like "localhost" that would otherwise pass.
 */
const normalizeWebsite = (value) => {
	const raw = String(value ?? "").trim();
	if (!raw) return null;

	const candidate = /^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`;
	const url = parseUrl(candidate);
	if (!url || !safeLinkUrl(url.toString())) return null;

	return url.hostname.includes(".") ? url.toString() : null;
};

const hostOf = (url) => {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return null;
	}
};

/* -------------------------------------------------------------------- text */

const relativeTime = (iso) => {
	const then = new Date(iso).getTime();
	if (!Number.isFinite(then)) return "";

	const diff = Date.now() - then;
	if (diff < 60000) return "just now";

	const minutes = Math.floor(diff / 60000);
	if (minutes < 60) return `${minutes}m ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;

	return `${Math.floor(hours / 24)}d ago`;
};

/**
 * APIs commonly derive a title from the opening line of the body when the
 * author leaves the field blank, so a title that merely echoes the body is not
 * worth printing twice.
 */
const distinctTitle = (title, html) => {
	const clean = String(title || "").trim();
	if (!clean) return null;

	const body = String(html || "")
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.toLowerCase();

	const echo = clean.replace(/\.{3}$/, "").toLowerCase();
	return body.startsWith(echo) ? null : clean;
};

/* --------------------------------------------------------------------- ids */

/**
 * `parentId` arrives in five shapes: a populated document, an id string, null,
 * '' from an unfilled form field, or missing entirely on rows written while
 * the schema default was `undefined`. All of them have to collapse to the same
 * "no parent" value, otherwise `parentId === null` silently matches nothing.
 */
const normalizeId = (value) => {
	if (value === null || value === undefined || value === "") return null;
	if (typeof value === "object") return value._id ? String(value._id) : null;
	return String(value);
};

/* ------------------------------------------------------------ normalisation */

/** The stored display name, or '' when the session carries only an id. */
const authorHandleOf = (auth) =>
	auth?.username ||
	auth?.name ||
	auth?.user?.username ||
	auth?.user?.name ||
	"";

const authorNameOf = (auth) => authorHandleOf(auth) || "You";

/** Session objects differ between apps, so the common shapes are all tried. */
const authorAvatarOf = (auth) =>
	safeImageUrl(
		auth?.files?.avatar?.location?.secure_location ||
			auth?.user?.files?.avatar?.location?.secure_location ||
			auth?.avatar ||
			auth?.image,
	);

/**
 * Accepts a raw API row or one that a server route has already flattened, so
 * the component works against either without the caller reshaping anything.
 * Emails are deliberately dropped rather than rendered.
 */
const toComment = (raw, decode) => {
	const user = raw?.user && typeof raw.user === "object" ? raw.user : null;

	// A body that arrives as an object is encrypted or password protected
	// upstream; there is nothing to render and nothing to sanitise.
	const body = raw?.html ?? raw?.text;
	const locked =
		body !== null && body !== undefined && typeof body === "object";

	return {
		_id: String(raw?._id ?? ""),
		parentId: normalizeId(raw?.parentId),
		userId: user?._id ? String(user._id) : null,
		username: user?.username || null,
		name: user?.username || raw?.name || "Anonymous",
		isRegistered: raw?.isRegistered ?? Boolean(user),
		avatarUrl: safeImageUrl(
			raw?.avatarUrl || user?.files?.avatar?.location?.secure_location,
		),
		website: safeLinkUrl(raw?.website),
		// Titles are rendered as a React text child rather than as markup, so
		// decoding entities here cannot arm a tag.
		title: raw?.title ? decodeEntities(String(raw.title)) : null,
		html: locked ? null : toRenderableHtml(body, decode),
		locked,
		createdAt: raw?.createdAt || null,
	};
};

/**
 * Groups a flat list into one-level threads. A reply that points at another
 * reply is lifted to the thread root, and an orphan whose parent is not on
 * this page is promoted to a root rather than silently dropped.
 */
const buildCommentTree = (comments = [], newestFirst = true) => {
	const list = Array.isArray(comments) ? comments : [];
	const byId = new Map(list.map((comment) => [String(comment._id), comment]));
	const childrenByParent = new Map();
	const roots = [];

	for (const comment of list) {
		const selfId = String(comment._id);
		let parentId = comment.parentId;

		// Seeding `seen` with the comment's own id catches a self-reference as
		// well as a longer cycle; without the flag the members of a cycle become
		// each other's child and disappear from the output entirely.
		const seen = new Set([selfId]);
		let cyclic = false;

		while (parentId && byId.has(parentId)) {
			if (seen.has(parentId)) {
				cyclic = true;
				break;
			}
			seen.add(parentId);
			const grandParentId = byId.get(parentId).parentId;
			if (!grandParentId) break;
			parentId = grandParentId;
		}

		if (cyclic || !parentId || !byId.has(parentId)) {
			roots.push(comment);
			continue;
		}

		if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
		childrenByParent.get(parentId).push(comment);
	}

	const at = (comment) => new Date(comment.createdAt).getTime() || 0;

	return roots
		.sort((a, b) => (newestFirst ? at(b) - at(a) : at(a) - at(b)))
		.map((root) => ({
			...root,
			// Replies always read oldest first, so a thread is a conversation.
			children: (childrenByParent.get(String(root._id)) || []).sort(
				(a, b) => at(a) - at(b),
			),
		}));
};

/* ------------------------------------------------------------- sub-components */

const PALETTES = [
	"bg-primary-subtle text-primary-emphasis",
	"bg-info-subtle text-info-emphasis",
	"bg-secondary-subtle text-secondary-emphasis",
];

const initials = (name) => {
	const parts = String(name).trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/** Deterministic so server and client agree. */
const paletteFor = (name) => {
	let hash = 0;
	const value = String(name);
	for (let i = 0; i < value.length; i++)
		hash = (hash + value.charCodeAt(i)) % 997;
	return PALETTES[hash % PALETTES.length];
};

const Avatar = ({ name = "", src = null, size = 48 }) => {
	if (src) {
		return (
			<img
				src={src || "/placeholder.svg"}
				alt=""
				width={size}
				height={size}
				loading="lazy"
				decoding="async"
				className="rounded-circle object-fit-cover"
				style={{ width: size, height: size }}
			/>
		);
	}

	return (
		<span
			aria-hidden="true"
			className={`d-inline-flex align-items-center justify-content-center rounded-circle fw-semibold ${paletteFor(name)}`}
			style={{ width: size, height: size, fontSize: size > 40 ? 15 : 13 }}
		>
			{initials(name)}
		</span>
	);
};

/**
 * Same prop shape as a typical ParseHtml helper. The entity decode happens
 * upstream in `toRenderableHtml`; markup arriving here is final and goes
 * straight into the DOM.
 */
const ParseHtml = ({
	text = "",
	classList = "",
	styleList,
	parseAs = "div",
}) => {
	if (!text) return null;

	return React.createElement(parseAs, {
		dangerouslySetInnerHTML: { __html: text },
		className: classList || undefined,
		style: styleList,
	});
};

/**
 * Used for the top-level form and for every inline reply. Guests identify
 * themselves with the name/email/website fields; a signed-in author posts
 * against `auth.userId` and never sees them.
 */
const Composer = ({
	auth = {},
	token = {},
	onModel = "Blog",
	replyingTo = null,
	isSubmitting = false,
	error = null,
	advancedTextEditor = false,
	onSubmit = () => {},
	onCancel = null,
}) => {
	const fieldId = useId();
	const isAuthed = Boolean(auth?.userId);
	const formRef = useRef(null);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [title, setTitle] = useState("");
	const [website, setWebsite] = useState("");

	/*
	 * MyTextArea is uncontrolled in both of its modes — it takes no value and
	 * emits no onChange, publishing only into the DOM under `name`. So the body
	 * lives in the form, not in state, and `bodyMirror` is a read-only shadow of
	 * it that exists to re-render the Post button as you type.
	 */
	const [bodyMirror, setBodyMirror] = useState("");
	// Remount key: the editor seeds itself from `defaultValue`, which React
	// applies only on mount, so a posted comment is cleared by replacing it.
	const [editorNonce, setEditorNonce] = useState(0);

	const readBody = () => {
		const form = formRef.current;
		if (!form) return "";
		const raw = new FormData(form).get(BODY_FIELD);
		return typeof raw === "string" ? raw : "";
	};

	/*
	 * Rich mode publishes mention, hashtag and upload metadata as JSON in three
	 * fields beside the body. They have to travel with the comment: an upload
	 * whose id never reaches the API is stored but attached to nothing.
	 */
	const readJsonField = (suffix) => {
		const form = formRef.current;
		if (!form) return [];
		const raw = new FormData(form).get(`${BODY_FIELD}_${suffix}`);
		try {
			const parsed = JSON.parse(typeof raw === "string" && raw ? raw : "[]");
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	};

	// Rich mode publishes markup, where a visually empty body is still
	// `<p><br></p>`; plain mode publishes exactly what was typed.
	const hasBody = (value) =>
		advancedTextEditor
			? value
					.replace(/<[^>]*>/g, " ")
					.replace(/&nbsp;/gi, " ")
					.trim().length > 0
			: value.trim().length > 0;

	const websiteInvalid =
		website.trim().length > 0 && !normalizeWebsite(website);
	// Plain mode sets no maxLength — the editor's counter turns red past the
	// limit but never stops typing — so the ceiling is enforced here.
	const bodyTooLong = bodyMirror.length > MAX_TEXT;
	const canSubmit =
		hasBody(bodyMirror) &&
		!bodyTooLong &&
		(isAuthed || name.trim().length > 0) &&
		!websiteInvalid &&
		!isSubmitting;

	const submit = async () => {
		// Re-read instead of trusting the mirror: the DOM is what actually holds
		// the body, and a keyboard submit can outrun the input event.
		const text = readBody();
		const ready =
			hasBody(text) &&
			text.length <= MAX_TEXT &&
			(isAuthed || name.trim().length > 0) &&
			!websiteInvalid &&
			!isSubmitting;

		if (!ready) return;

		const posted = await onSubmit({
			text: text.trim(),
			title: title.trim(),
			// Key names match what the API already receives from the blog form.
			mentions: readJsonField("users"),
			hashtags: readJsonField("hashtags"),
			extras: readJsonField("files"),
			// Sent alongside `user` so APIs that denormalise the display name onto
			// the comment still receive one for a signed-in author.
			name: isAuthed ? authorHandleOf(auth) : name.trim(),
			email: isAuthed ? "" : email.trim(),
			website: isAuthed ? "" : normalizeWebsite(website) || "",
		});

		// Name, email and website describe the author and are kept for the next
		// comment; the body and its title belong to this one.
		if (posted) {
			setTitle("");
			setBodyMirror("");
			setEditorNonce((current) => current + 1);
		}
	};

	// Bound to the form rather than to the body field: both events bubble, and
	// in rich mode there is no single input to hang them on.
	const handleKeyDown = (event) => {
		// Enter may be committing an IME composition, which must never submit.
		if (event.nativeEvent.isComposing || event.keyCode === 229) return;
		if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			submit();
		}
	};

	return (
		<form
			ref={formRef}
			className={replyingTo ? "mt-2 comment-reply-form" : ""}
			onSubmit={(event) => {
				event.preventDefault();
				submit();
			}}
			onInput={() => setBodyMirror(readBody())}
			onKeyDown={handleKeyDown}
			aria-label={replyingTo ? "Reply to comment" : "Leave a comment"}
		>
			{replyingTo?.liftsTo && (
				<p className="small text-warning-emphasis mb-2">
					<i className="bi bi-arrow-return-right me-1" aria-hidden="true" />
					{`Posts into ${replyingTo.liftsTo}'s thread — replies only nest one level`}
				</p>
			)}

			<div className="card">
				<div className="card-body">
					{isAuthed && (
						<div className="d-flex align-items-center gap-2 mb-3">
							<Avatar
								name={authorNameOf(auth)}
								src={authorAvatarOf(auth)}
								size={32}
							/>
							<span className="small text-body-secondary">
								Posting as{" "}
								<span className="fw-semibold text-body">
									{authorNameOf(auth)}
								</span>
							</span>
						</div>
					)}

					{!isAuthed && (
						<div className="row g-2 mb-2">
							<div className="col-sm-4">
								<label className="visually-hidden" htmlFor={`${fieldId}-name`}>
									Your name
								</label>
								<input
									id={`${fieldId}-name`}
									name="name"
									type="text"
									className="form-control"
									value={name}
									onChange={(event) => setName(event.target.value)}
									placeholder="Name *"
									maxLength={MAX_NAME}
									autoComplete="name"
									required
								/>
							</div>
							<div className="col-sm-4">
								<label className="visually-hidden" htmlFor={`${fieldId}-email`}>
									Your email (optional)
								</label>
								<input
									id={`${fieldId}-email`}
									name="email"
									type="email"
									className="form-control"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									placeholder="Email (optional)"
									autoComplete="email"
								/>
							</div>
							<div className="col-sm-4">
								<label
									className="visually-hidden"
									htmlFor={`${fieldId}-website`}
								>
									Your website (optional)
								</label>
								<input
									id={`${fieldId}-website`}
									name="website"
									type="text"
									inputMode="url"
									className={`form-control${websiteInvalid ? " is-invalid" : ""}`}
									value={website}
									onChange={(event) => setWebsite(event.target.value)}
									placeholder="Website (optional)"
									maxLength={MAX_WEBSITE}
									autoComplete="url"
									spellCheck="false"
									aria-describedby={
										websiteInvalid ? `${fieldId}-website-error` : undefined
									}
								/>
								{websiteInvalid && (
									<div
										id={`${fieldId}-website-error`}
										className="invalid-feedback"
									>
										Use a full address, like example.com
									</div>
								)}
							</div>
						</div>
					)}

					<label className="visually-hidden" htmlFor={`${fieldId}-title`}>
						Title (optional)
					</label>
					<input
						id={`${fieldId}-title`}
						name="title"
						type="text"
						className="form-control mb-2"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						placeholder="Title (optional)"
						maxLength={MAX_TITLE}
					/>

					<label className="visually-hidden" htmlFor={fieldId}>
						{replyingTo ? "Write a reply" : "Write a comment"}
					</label>
					<MyTextArea
						key={editorNonce}
						auth={auth}
						token={token}
						id={fieldId}
						name={BODY_FIELD}
						onModel={onModel}
						advancedTextEditor={advancedTextEditor}
						customPlaceholder="Tell us what you think!"
						charactersLimit={MAX_TEXT}
						isRequired
					/>
					{bodyTooLong && (
						<div className="alert alert-danger py-2 px-3 small mb-0">
							<i
								className="bi bi-exclamation-triangle-fill me-2"
								aria-hidden="true"
							/>
							{`${bodyMirror.length - MAX_TEXT} characters over the ${MAX_TEXT} limit`}
						</div>
					)}

					{error && (
						<div className="alert alert-danger py-2 px-3 small mt-3 mb-0">
							<i
								className="bi bi-exclamation-triangle-fill me-2"
								aria-hidden="true"
							/>
							{error}
						</div>
					)}
				</div>

				<div className="card-footer d-flex flex-wrap align-items-center justify-content-between gap-2">
					<small className="text-body-secondary">
						{isAuthed
							? "Signed in — your profile is attached to this comment"
							: "Posting as a guest — no account required"}
					</small>

					<div className="d-flex align-items-center gap-2">
						{onCancel && (
							<button
								type="button"
								className="btn btn-sm btn-outline-secondary"
								onClick={onCancel}
								disabled={isSubmitting}
							>
								Cancel
							</button>
						)}
						<button
							type="submit"
							className="btn btn-sm btn-primary"
							disabled={!canSubmit}
						>
							{isSubmitting ? (
								<span
									className="spinner-border spinner-border-sm me-1"
									aria-hidden="true"
								/>
							) : (
								<i className="bi bi-send me-1" aria-hidden="true" />
							)}
							{replyingTo ? "Post reply" : "Post comment"}
						</button>
					</div>
				</div>
			</div>
		</form>
	);
};

/**
 * The reply button and the form it toggles, kept in one component so a card
 * can move both into a footer without the form detaching from its trigger.
 * The `create-child-comment-<id>` wrapper is a stable outside targeting hook.
 */
const ReplyAction = ({
	comment = {},
	isReplying = false,
	isPending = false,
	onReply = () => {},
	replySlot = null,
}) => (
	<div className={`create-child-comment-${comment._id}`}>
		<button
			type="button"
			className="btn btn-link btn-sm p-0"
			onClick={onReply}
			disabled={isPending}
			aria-expanded={isReplying}
			aria-label={
				isReplying
					? `Cancel reply to ${comment.name}`
					: `Reply to ${comment.name}`
			}
		>
			<i className="bi bi-reply me-1" aria-hidden="true" />
			{isReplying ? `Replying to ${comment.name}` : "Reply"}
		</button>

		{replySlot}
	</div>
);

/**
 * Bootstrap media object. `showReply` is false when the card renders the
 * reply control itself — a childless thread puts it in a footer — so the
 * button never appears twice for the same comment.
 */
const Row = ({
	comment = {},
	size = 48,
	isReplying = false,
	isPending = false,
	isAuthor = false,
	profileBasePath = null,
	showReply = true,
	onReply = () => {},
	replySlot = null,
}) => {
	const heading = distinctTitle(comment.title, comment.html);
	const host = comment.website ? hostOf(comment.website) : null;

	const profileHref =
		profileBasePath && comment.userId && comment.username
			? `${profileBasePath}/${comment.userId}/${comment.username}`
			: null;

	const displayName = profileHref ? (
		<Link href={profileHref} className="fw-semibold">
			{comment.name}
		</Link>
	) : (
		<span className="fw-semibold">{comment.name}</span>
	);

	return (
		<div className={`d-flex${isPending ? " opacity-50" : ""}`}>
			<div className="flex-shrink-0">
				<Avatar name={comment.name} src={comment.avatarUrl} size={size} />
			</div>

			<div className="flex-grow-1 ms-3">
				<div className="d-flex flex-wrap align-items-center gap-2">
					{displayName}

					{isAuthor && (
						<span className="badge bg-primary-subtle text-primary-emphasis">
							you
						</span>
					)}

					{!isAuthor && comment.isRegistered && (
						<span className="badge bg-primary-subtle text-primary-emphasis">
							<i className="bi bi-patch-check me-1" aria-hidden="true" />
							registered
						</span>
					)}

					{!isAuthor && !comment.isRegistered && (
						<span className="badge bg-secondary-subtle text-secondary-emphasis">
							guest
						</span>
					)}

					{host && (
						<a
							className="small"
							href={comment.website}
							target="_blank"
							rel="nofollow ugc noopener noreferrer"
						>
							<i className="bi bi-link-45deg" aria-hidden="true" />
							{host}
							<span className="visually-hidden">
								{` (${comment.name}'s website, opens in a new tab)`}
							</span>
						</a>
					)}

					<small className="text-body-secondary">
						{isPending ? "posting…" : relativeTime(comment.createdAt)}
					</small>
				</div>

				<div className="card-text mt-1">
					{heading && <p className="fw-semibold mb-1">{heading}</p>}

					{comment.locked ? (
						<p className="text-body-secondary fst-italic mb-0">
							<i className="bi bi-lock me-1" aria-hidden="true" />
							This comment is encrypted or password protected.
						</p>
					) : (
						<ParseHtml text={comment.html} classList="comment-html" />
					)}

					{showReply && (
						<ReplyAction
							comment={comment}
							isReplying={isReplying}
							isPending={isPending}
							onReply={onReply}
							replySlot={replySlot}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

/* ------------------------------------------------------------------- box */

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/** The address `fetchurl` will actually hit, so failures can name it. */
const resolveUrl = (path, isRemote) =>
	isRemote ? path : `${API_BASE ?? ""}${path}`;

/**
 * `fetchurl` concatenates NEXT_PUBLIC_API_URL onto the path untouched, so a
 * base with no scheme ("api.example.com/api/v1") builds a *relative* URL. The
 * browser resolves it against its own origin, this app answers with its HTML
 * 404 page, and the parse dies on "Unexpected token '<'" — blaming the JSON
 * rather than the missing "https://". Caught here so the message says so.
 */
const assertUsableBase = (path) => {
	if (!API_BASE) {
		throw new Error(
			`NEXT_PUBLIC_API_URL is not set, so this request would go to "undefined${path}". ` +
				"Set it, or pass isRemote for a same-origin route.",
		);
	}

	if (!/^https?:\/\//i.test(API_BASE)) {
		throw new Error(
			`NEXT_PUBLIC_API_URL is "${API_BASE}", which has no http(s):// scheme, so ` +
				`"${API_BASE}${path}" resolves against this site's own origin instead of the API. ` +
				`Set it to "https://${API_BASE.replace(/^\/+/, "")}".`,
		);
	}
};

/**
 * `fetchurl` resolves with its failure instead of throwing: a body that is not
 * JSON arrives as an Error, and a JSON failure arrives as the parsed body.
 * Both are turned back into throws so SWR and the submit handler see them.
 */
const callApi = async (
	path,
	{ method = "GET", body = null, isRemote = false } = {},
) => {
	if (!isRemote) assertUsableBase(path);

	const url = resolveUrl(path, isRemote);
	const payload = await fetchurl(
		path,
		method,
		"no-cache",
		body,
		undefined,
		false,
		isRemote,
	);

	// fetchurl only builds an Error when the response was not JSON — in practice
	// an HTML 404 or 500 page, which is what shows up as "Unexpected token '<'"
	// once something downstream tries to parse it.
	if (payload instanceof Error) {
		console.error(
			`[CommentBox] ${method} ${url} did not return JSON.`,
			payload,
		);
		throw new Error(
			`${method} ${url} did not answer with JSON. Check that the path exists and accepts ${method}.`,
		);
	}

	// fetchurl hands back a rejected body and a successful one as the same kind
	// of plain object, and drops the status code on the way, so shape is all
	// there is to tell them apart. The API fails as `{ status, message }`, the
	// Next proxy in front of it as `{ error }`.
	if (
		payload?.success === false ||
		payload?.status === "error" ||
		payload?.error
	) {
		const detail = payload.message || payload.error;
		throw new Error(
			typeof detail === "string" && detail
				? detail
				: `${method} ${url} failed.`,
		);
	}

	return payload;
};

/** Accepts a bare array or any of the usual envelope shapes. */
const rowsOf = (payload) => {
	if (Array.isArray(payload)) return payload;
	if (Array.isArray(payload?.comments)) return payload.comments;
	if (Array.isArray(payload?.data)) return payload.data;
	return [];
};

/** Fallback identity for an API that answers a write without the document. */
const sameComment = (a, b) =>
	a.name === b.name && a.parentId === b.parentId && a.html === b.html;

const CommentBox = ({
	/** Id of the Blog / Post / Snippet these comments belong to. */
	resourceId = null,
	/** Which collection `resourceId` points at. */
	onModel = "Blog",
	postType = "comment",
	/**
	 * Swaps the composer body between MyTextArea's plain textarea and its rich
	 * editor. Rich mode posts markup instead of text, and sends `mentions`,
	 * `hashtags` and `extras` alongside it.
	 */
	advancedTextEditor = false,
	/**
	 * Bearer token for MyTextArea's uploader, which sends it as the
	 * `Authorization` header. Rich-mode uploads fail without it.
	 */
	token = {},
	/** Session object. A truthy `auth.userId` switches the composer to signed-in mode. */
	auth = {},

	/**
	 * Path handed to `fetchurl`, which prepends NEXT_PUBLIC_API_URL — so this is
	 * `/global/comments`, not `/api/global/comments`.
	 */
	endpoint = "/global/comments",
	/**
	 * POST path. The API mounts creates at `/global/comments/:resourceId`, so
	 * that is what this defaults to. Set it only if yours differs.
	 */
	createEndpoint = null,
	/** Skip the NEXT_PUBLIC_API_URL prefix, for a same-origin route. */
	isRemote = false,
	/** Pre-fetched rows. Supplying these skips fetching entirely. */
	comments = null,
	/** Override the write, e.g. to call a server action instead. */
	onCreate = null,
	/** Called with the created comment after a successful post. */
	onPosted = null,

	/** The page's awaited searchParams. Falls back to useSearchParams(). */
	searchParams = null,

	heading = "Comments",
	emptyText = "No comments yet. Be the first to comment.",
	/** Threads per page when the URL carries no `limit`. */
	pageSize = 5,
	siblings = 1,
	displayPagination = true,
	displayComposer = true,
	newestFirst = true,
	/** Author names link to `${profileBasePath}/${userId}/${username}` when set. */
	profileBasePath = null,
	/** Turn off when the API already returns decoded HTML. */
	decodeStoredEntities = true,
	className = "",
}) => {
	const [replyingToId, setReplyingToId] = useState(null);
	/**
	 * The thread whose reply form is open down in a card footer. Recorded when
	 * the form opens, because by the time the optimistic reply lands the card
	 * no longer looks childless and the placement can no longer be re-derived.
	 */
	const [footerReplyId, setFooterReplyId] = useState(null);
	const [pending, setPending] = useState([]);
	const [local, setLocal] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [notice, setNotice] = useState(null);
	const listRef = useRef(null);

	const router = useRouter();
	const hookParams = useSearchParams();

	// The page's own awaited searchParams win, matching how they are threaded
	// down elsewhere; the hook only covers callers that pass nothing.
	const params = useMemo(
		() => searchParams ?? Object.fromEntries(hookParams.entries()),
		[searchParams, hookParams],
	);

	const limit = Math.max(1, Number(params.limit) || pageSize);
	const isControlled = comments !== null;
	const writePath =
		createEndpoint || `${endpoint}/${encodeURIComponent(resourceId)}`;

	// Replies carry the same resourceId as their parent, so one request returns
	// the whole thread and paging happens below. The limit has to stay high
	// enough to cover replies, or one lands off-page and renders as an orphan.
	const query = resourceId
		? `${endpoint}?resourceId=${encodeURIComponent(resourceId)}` +
			`&postType=${encodeURIComponent(postType)}&decrypt=true&limit=100&sort=-createdAt`
		: null;

	const { data, error, isLoading, mutate } = useSWR(
		isControlled ? null : query,
		(path) => callApi(path, { isRemote }),
		{ revalidateOnFocus: false },
	);

	const rows = useMemo(
		() => rowsOf(isControlled ? comments : data),
		[isControlled, comments, data],
	);

	const normalized = useMemo(
		() => rows.map((row) => toComment(row, decodeStoredEntities)),
		[rows, decodeStoredEntities],
	);

	const all = useMemo(
		() => [...normalized, ...local, ...pending],
		[normalized, local, pending],
	);
	const threads = useMemo(
		() => buildCommentTree(all, newestFirst),
		[all, newestFirst],
	);

	const pendingIds = useMemo(
		() => new Set(pending.map((row) => row._id)),
		[pending],
	);

	const totalPages = Math.max(1, Math.ceil(threads.length / limit));
	// Clamped rather than trusted, so neither ?page=99 nor deleting the last
	// thread on a page can strand the list on an empty one.
	const currentPage = Math.min(
		Math.max(1, Number(params.page) || 1),
		totalPages,
	);
	const start = (currentPage - 1) * limit;
	const visible = displayPagination
		? threads.slice(start, start + limit)
		: threads;

	// NumericPagination rebuilds every href from what it is handed, so it has to
	// see the limit actually in force even when the URL omits it.
	const pagerParams = useMemo(
		() => ({ ...params, page: String(currentPage), limit: String(limit) }),
		[params, currentPage, limit],
	);

	useEffect(() => {
		setLocal([]);
	}, [resourceId]);

	// Drop a locally held comment as soon as the incoming list contains it, so a
	// parent that refreshes on its own never shows the same comment twice.
	useEffect(() => {
		setLocal((current) => {
			if (current.length === 0) return current;

			const next = current.filter(
				(row) =>
					!normalized.some(
						(incoming) =>
							incoming._id === row._id || sameComment(incoming, row),
					),
			);

			return next.length === current.length ? current : next;
		});
	}, [normalized]);

	/**
	 * A new root comment sorts onto page 1, so posting from any other page would
	 * file it straight out of sight. Unlike the pager's own hrefs this preserves
	 * every existing parameter, since it is the host page's URL being rewritten.
	 */
	const showFirstPage = () => {
		if (currentPage === 1) return;
		const next = new URLSearchParams(params);
		next.set("page", "1");
		router.push(`?${next.toString()}`, { scroll: false });
	};

	/*
	 * The rich editor already emits markup, so only the plain textarea's
	 * newlines need turning into paragraphs. Running the converter over rich
	 * output would escape every tag it just produced.
	 */
	const bodyHtmlOf = (text) =>
		advancedTextEditor ? String(text ?? "") : plainTextToHtml(text);

	const submit = async (parentId, values) => {
		setIsSubmitting(true);
		setSubmitError(null);

		const draft = {
			_id: `pending_${Date.now()}`,
			parentId: parentId || null,
			userId: auth?.userId || null,
			username: auth?.username || null,
			name: auth?.userId ? authorNameOf(auth) : values.name,
			isRegistered: Boolean(auth?.userId),
			avatarUrl: auth?.userId ? authorAvatarOf(auth) : null,
			// Only the server knows how "example.com" normalises into a followable
			// href, so the in-flight preview leaves the link off.
			website: null,
			title: values.title || null,
			html: bodyHtmlOf(values.text),
			locked: false,
			createdAt: new Date().toISOString(),
		};

		setPending((current) => [...current, draft]);

		try {
			const payload = {
				...values,
				text: bodyHtmlOf(values.text),
				resourceId,
				parentId: parentId || null,
				postType,
				onModel,
				user: auth?.userId || undefined,
			};

			let created = null;

			if (onCreate) {
				created = await onCreate(payload);
			} else {
				// fetchurl serialises the body itself, so it takes the plain object.
				const body = await callApi(writePath, {
					method: "POST",
					body: payload,
					isRemote,
				});
				created = body?.comment ?? body?.data ?? body;
			}

			const createdId = created?._id ? String(created._id) : null;
			const fresh = isControlled ? null : await mutate();

			if (isControlled) {
				// Nothing refetches in controlled mode, so the comment is held here
				// until the list the parent owns catches up with it.
				setLocal((current) => [
					...current,
					createdId
						? toComment(created, decodeStoredEntities)
						: { ...draft, _id: `local_${draft._id}` },
				]);
			} else if (
				fresh &&
				createdId &&
				!rowsOf(fresh).some((row) => String(row._id) === createdId)
			) {
				// A 201 only means the API accepted the write. Confirm the comment is
				// readable back, so a moderation hold or a comment saved without its
				// post reference cannot look like a silent success.
				setNotice(
					"The API accepted this comment, but it is not in the refreshed list yet. It may be held for moderation or stored without a link to this post.",
				);
			}

			setReplyingToId(null);
			if (!parentId) showFirstPage();
			if (onPosted) onPosted(created);
			return true;
		} catch (failure) {
			setSubmitError(failure.message);
			return false;
		} finally {
			setPending((current) => current.filter((row) => row._id !== draft._id));
			setIsSubmitting(false);
		}
	};

	const toggleReply = (id, inFooter = false) => {
		const opening = replyingToId !== id;
		setSubmitError(null);
		setReplyingToId(opening ? id : null);
		setFooterReplyId(opening && inFooter ? id : null);
	};

	/**
	 * The form is rendered by whichever comment is being replied to, so a
	 * childless parent opens it directly underneath. `liftsTo` is only set for a
	 * reply to a reply, which still lands in the root thread.
	 */
	const composerFor = (comment, thread) =>
		replyingToId === comment._id ? (
			<Composer
				auth={auth}
				token={token}
				onModel={onModel}
				advancedTextEditor={advancedTextEditor}
				replyingTo={{
					name: comment.name,
					liftsTo: comment._id === thread._id ? null : thread.name,
				}}
				isSubmitting={isSubmitting}
				error={submitError}
				onCancel={() => setReplyingToId(null)}
				onSubmit={(values) => submit(comment._id, values)}
			/>
		) : null;

	const rowProps = (comment, thread, size) => ({
		comment,
		size,
		isAuthor: Boolean(auth?.userId) && comment.userId === auth.userId,
		isReplying: replyingToId === comment._id,
		isPending: pendingIds.has(comment._id),
		profileBasePath,
		onReply: () =>
			toggleReply(
				comment._id,
				comment._id === thread._id && thread.children.length === 0,
			),
		replySlot: composerFor(comment, thread),
	});

	if (!resourceId) {
		return (
			<div className="alert alert-warning" role="alert">
				<i
					className="bi bi-exclamation-triangle-fill me-2"
					aria-hidden="true"
				/>
				CommentBox needs a <code>resourceId</code> to load comments.
			</div>
		);
	}

	return (
		<section className={`comment-box ${className}`.trim()} ref={listRef}>
			<style href="comment-box" precedence="default">
				{STYLES}
			</style>

			<h2 className="h6 d-flex align-items-center gap-2">
				<i className="bi bi-chat-left-text text-primary" aria-hidden="true" />
				{heading}
				<span className="badge bg-secondary-subtle text-secondary-emphasis">
					{isLoading ? "…" : all.length}
				</span>
			</h2>

			{displayComposer && (
				<div className="mb-4">
					<Composer
						auth={auth}
						token={token}
						onModel={onModel}
						advancedTextEditor={advancedTextEditor}
						isSubmitting={isSubmitting && replyingToId === null}
						error={replyingToId === null ? submitError : null}
						onSubmit={(values) => submit(null, values)}
					/>
				</div>
			)}

			{notice && (
				<div className="alert alert-warning alert-dismissible d-flex align-items-start gap-2">
					<i
						className="bi bi-exclamation-triangle-fill mt-1"
						aria-hidden="true"
					/>
					<p className="mb-0">{notice}</p>
					<button
						type="button"
						className="btn-close"
						aria-label="Dismiss"
						onClick={() => setNotice(null)}
					/>
				</div>
			)}

			<div aria-live="polite">
				{isLoading && (
					<div className="card mb-3">
						<div className="card-body d-flex align-items-center gap-3">
							<span
								className="spinner-border spinner-border-sm text-primary"
								aria-hidden="true"
							/>
							<span className="text-body-secondary">Loading comments…</span>
						</div>
					</div>
				)}

				{error && (
					<div className="alert alert-danger d-flex align-items-start gap-2">
						<i
							className="bi bi-exclamation-octagon-fill mt-1"
							aria-hidden="true"
						/>
						<div className="flex-grow-1">
							<p className="mb-2">{error.message}</p>
							<button
								type="button"
								className="btn btn-sm btn-outline-danger"
								onClick={() => mutate()}
							>
								Retry
							</button>
						</div>
					</div>
				)}

				{!isLoading && !error && threads.length === 0 && (
					<div className="card mb-3">
						<div className="card-body text-center py-5">
							<i
								className="bi bi-chat-square-dots fs-3 text-body-secondary"
								aria-hidden="true"
							/>
							<p className="text-body-secondary mt-2 mb-0">{emptyText}</p>
						</div>
					</div>
				)}
			</div>

			{visible.map((thread) => {
				const rootProps = rowProps(thread, thread, 48);
				const hasReplies = thread.children.length > 0;

				/*
				 * A footer is unambiguous only while the card holds one comment —
				 * below a reply list it would read as replying to the last reply — so
				 * placement follows `hasReplies`, except while the form is open. Then
				 * the choice made at open time is held, which keeps the whole card
				 * still as the optimistic reply arrives underneath it.
				 */
				const replyInFooter =
					replyingToId === thread._id
						? footerReplyId === thread._id
						: !hasReplies;

				return (
					<article className="card mb-3" key={thread._id}>
						{/* With replies under it the root needs the cap tint to read as
                the thread's head; alone it is simply the card's content. */}
						<div className={replyInFooter ? "card-body" : "card-header py-3"}>
							<Row {...rootProps} showReply={!replyInFooter} />
						</div>

						{hasReplies && (
							<div className="card-body">
								<div className="d-flex flex-column gap-4">
									{thread.children.map((child) => (
										<Row key={child._id} {...rowProps(child, thread, 40)} />
									))}
								</div>
							</div>
						)}

						{replyInFooter && (
							<div className="card-footer">
								<ReplyAction {...rootProps} />
							</div>
						)}
					</article>
				);
			})}

			{displayPagination && threads.length > 0 && (
				<div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
					<small className="text-body-secondary">
						{`Showing ${start + 1}–${Math.min(start + limit, threads.length)} of ${
							threads.length
						} ${threads.length === 1 ? "thread" : "threads"}`}
					</small>
					<NumericPagination
						totalPages={totalPages}
						searchParams={pagerParams}
						siblings={siblings}
					/>
				</div>
			)}
		</section>
	);
};

export default CommentBox;
