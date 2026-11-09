"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const idOf = (value) => {
	if (!value) return "";
	if (typeof value === "object") {
		const id = value._id || value.id || "";
		return id ? String(id) : "";
	}
	return String(value);
};

const toIdList = (value) =>
	(Array.isArray(value) ? value : value ? [value] : [])
		.map(idOf)
		.filter(Boolean);

const toCategoryArray = (value) => {
	if (Array.isArray(value)) return value;
	if (value && Array.isArray(value.data)) return value.data;
	return [];
};

const mergeCategories = (fromProps, created) => {
	const seen = new Set();
	const out = [];
	for (const c of [...fromProps, ...created]) {
		const id = idOf(c);
		if (!id || seen.has(id)) continue;
		seen.add(id);
		out.push(c);
	}
	return out;
};

const flattenCategoryTree = (list) => {
	const byId = new Map();
	for (const c of list) {
		const id = idOf(c);
		if (id && !byId.has(id)) byId.set(id, c);
	}
	const children = new Map();
	const roots = [];
	byId.forEach((c, id) => {
		const parentId = idOf(c.parentId);
		if (parentId && parentId !== id && byId.has(parentId)) {
			if (!children.has(parentId)) children.set(parentId, []);
			children.get(parentId).push(c);
		} else {
			roots.push(c);
		}
	});
	const byTitle = (a, b) =>
		String(a.title || "").localeCompare(String(b.title || ""), undefined, {
			sensitivity: "base",
		});

	const out = [];
	const seen = new Set();
	const walk = (c, depth) => {
		const id = idOf(c);
		if (seen.has(id)) return;
		seen.add(id);
		out.push({
			id,
			title: c.title || "Untitled",
			depth,
			parentId: idOf(c.parentId),
		});
		(children.get(id) || []).sort(byTitle).forEach((k) => walk(k, depth + 1));
	};
	roots.sort(byTitle).forEach((r) => walk(r, 0));
	byId.forEach((c, id) => {
		if (!seen.has(id)) walk(c, 0);
	});
	return out;
};

const indentLabel = (node) => "\u2014\u00A0".repeat(node.depth) + node.title;

const isFailedResponse = (res) =>
	!res ||
	res instanceof Error ||
	res.status === "error" ||
	res.status === "fail" ||
	res.success === false;

const CreateQuickDraftBlogForm = ({ token = {}, auth = {}, objects = [] }) => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isMountedRef = useRef(true);
	const submittingRef = useRef(false);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const blogCategories = useMemo(
		() => toCategoryArray(objects).filter((c) => c.categoryType === "blog"),
		[objects],
	);
	const defaultCategoryId = useMemo(
		() =>
			idOf(
				blogCategories.find(
					(c) => c.title === "Default" || c.slug === "default",
				),
			),
		[blogCategories],
	);

	const addBlog = async (e) => {
		e.preventDefault();
		if (isSubmitting.current) return;
		const form = e.currentTarget;
		const formData = new FormData(form);
		submittingRef.current = true;
		setIsSubmitting(true);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			mentions: [],
			tags: [],
			featured: false,
			embedding: false,
			category: formData.get("category"),
			commented: false,
			password: "",
			status: "draft",
			fullWidth: false,
			files: {
				avatar: undefined,
				extras: [],
			},
			project: "personal",
			postType: "blog",
		};

		try {
			const res = await fetchurl(
				`/noadmin/blogs`,
				"POST",
				"no-cache",
				rawFormData,
				undefined,
				false,
				false,
			);
			if (!isMountedRef.current) return;

			if (isFailedResponse(res)) {
				toast.error((res && res.message) || "Couldn't create the blog.");
				return;
			}

			toast.success(`Blog created`);
			form.reset();
			router.refresh();
		} catch (err) {
			if (!isMountedRef.current) return;
			toast.error((err && err.message) || "Couldn't create the blog.");
		} finally {
			submittingRef.current = false;
			if (isMountedRef.current) setIsSubmitting(false);
		}
	};

	return (
		<form className="form" onSubmit={addBlog}>
			<label htmlFor="blog-title" className="form-label">
				Title
			</label>
			<input
				id="blog-title"
				name="title"
				defaultValue=""
				type="text"
				className="form-control mb-3"
				placeholder="Untitled"
				required
			/>
			<label htmlFor="text" className="form-label">
				Text
			</label>
			<MyTextArea
				auth={auth}
				token={token}
				id="text"
				name="text"
				defaultValue=""
				onModel="Blog"
				advancedTextEditor={false}
				customPlaceholder="No description"
				charactersLimit={99999}
				isRequired={true}
			/>
			<CategoryField
				category={defaultCategoryId}
				categories={blogCategories}
				multiple={false}
				allowCreate={true}
				categoryType="blog"
			/>
			<FormButtons pending={isSubmitting} />
		</form>
	);
};

function CategoryField({
	category,
	categories,
	multiple,
	allowCreate,
	categoryType,
}) {
	const baseId = useId();
	const panelId = baseId + "-new-category";
	const titleId = baseId + "-new-title";
	const descriptionId = baseId + "-new-description";
	const childToggleId = baseId + "-new-is-child";
	const parentSelectId = baseId + "-new-parent";

	const wrapperRef = useRef(null);
	const titleInputRef = useRef(null);
	const isMountedRef = useRef(true);
	const creatingRef = useRef(false);
	const resetTimerRef = useRef(0);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			clearTimeout(resetTimerRef.current);
		};
	}, []);

	const [created, setCreated] = useState([]);
	const propList = toCategoryArray(categories);
	const list = useMemo(
		() => mergeCategories(propList, created),
		[propList, created],
	);
	const tree = useMemo(() => flattenCategoryTree(list), [list]);

	// Selection is controlled so a newly created category can be selected for the
	// user. The seed is keyed by its ids, because `category` is often a fresh
	// object on every parent render.
	const defaults = toIdList(category);
	const defaultsKey = defaults.join(",");
	const defaultsRef = useRef(defaults);
	defaultsRef.current = defaults;
	const touchedRef = useRef(false);
	const [selected, setSelected] = useState(defaults);

	useEffect(() => {
		if (touchedRef.current) return;
		setSelected(defaultsRef.current);
	}, [defaultsKey]);

	const [showAdd, setShowAdd] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const [newDescription, setNewDescription] = useState("");
	const [isChild, setIsChild] = useState(false);
	const [newParent, setNewParent] = useState("");
	const [creating, setCreating] = useState(false);
	const [createError, setCreateError] = useState("");
	const [createNotice, setCreateNotice] = useState("");

	// A native reset runs right after the "reset" event and would overwrite the
	// controlled <select>, so restore state on the next task instead. New
	// categories stay in the list because they already exist in the DB.
	useEffect(() => {
		const form = wrapperRef.current?.closest("form");
		if (!form) return;
		const onReset = () => {
			clearTimeout(resetTimerRef.current);
			resetTimerRef.current = setTimeout(() => {
				if (!isMountedRef.current) return;
				touchedRef.current = false;
				setSelected([...defaultsRef.current]);
				setShowAdd(false);
				setNewTitle("");
				setNewDescription("");
				setIsChild(false);
				setNewParent("");
				setCreateError("");
				setCreateNotice("");
			}, 0);
		};
		form.addEventListener("reset", onReset);
		return () => form.removeEventListener("reset", onReset);
	}, []);

	const onSelectChange = (e) => {
		touchedRef.current = true;
		setSelected(
			multiple
				? Array.from(e.target.selectedOptions, (o) => o.value).filter(Boolean)
				: e.target.value
					? [e.target.value]
					: [],
		);
	};

	const toggleAddPanel = () => {
		setShowAdd((open) => !open);
		setCreateError("");
		setCreateNotice("");
	};

	// Focus once the panel exists; an effect avoids reaching for a node that
	// hasn't mounted yet.
	useEffect(() => {
		if (showAdd) titleInputRef.current?.focus();
	}, [showAdd]);

	const submitNewCategory = async () => {
		if (creatingRef.current) return;
		const title = newTitle.trim();
		if (!title) {
			setCreateError("Please enter a name for the new category.");
			titleInputRef.current?.focus();
			return;
		}
		if (isChild && !newParent) {
			setCreateError(
				"Choose a parent category, or untick \u201CMake this a subcategory\u201D.",
			);
			return;
		}
		const parentKey = isChild ? newParent : "";
		const lower = title.toLowerCase();
		const duplicate = tree.some(
			(n) => n.title.trim().toLowerCase() === lower && n.parentId === parentKey,
		);
		if (duplicate) {
			setCreateError(
				`A category named \u201C${title}\u201D already exists ${
					isChild ? "under that parent" : "at the top level"
				}.`,
			);
			return;
		}

		creatingRef.current = true;
		setCreating(true);
		setCreateError("");
		setCreateNotice("");
		try {
			const body = {
				title,
				// The model requires `text`; fall back to the title when no description is given.
				text: newDescription.trim() || title,
				mentions: [],
				tags: [],
				deletable: false,
				status: "published",
			};
			if (isChild) body.parentId = newParent;
			if (categoryType) body.categoryType = categoryType;

			// fetchurl(url, method, cache, bodyData, signal, multipart, isRemote)
			const res = await fetchurl(
				`/noadmin/categories`,
				"POST",
				"no-cache",
				body,
				undefined,
				false,
				false,
			);
			if (!isMountedRef.current) return;
			if (isFailedResponse(res)) {
				throw new Error(
					(res && res.message) || "Couldn't create the category.",
				);
			}
			const doc =
				res.data && typeof res.data === "object" && !Array.isArray(res.data)
					? res.data
					: res;
			const newId = idOf(doc);
			if (!newId) {
				throw new Error(
					"The category was created, but the API didn't return its id. Reload the page to see it.",
				);
			}
			const record = {
				...doc,
				_id: newId,
				title: doc.title || title,
				parentId: doc.parentId ?? (isChild ? newParent : undefined),
			};

			setCreated((prev) => [...prev.filter((c) => idOf(c) !== newId), record]);
			touchedRef.current = true;
			setSelected((prev) =>
				multiple ? (prev.includes(newId) ? prev : [...prev, newId]) : [newId],
			);
			setNewTitle("");
			setNewDescription("");
			setCreateNotice(`\u201C${record.title}\u201D was added and selected.`);
			titleInputRef.current?.focus();
		} catch (err) {
			if (!isMountedRef.current) return;
			setCreateError((err && err.message) || "Couldn't create the category.");
		} finally {
			creatingRef.current = false;
			if (isMountedRef.current) setCreating(false);
		}
	};

	// The panel lives inside the parent <form>, so Enter must not submit it.
	const onTitleKeyDown = (e) => {
		if (e.key !== "Enter") return;
		e.preventDefault();
		if (e.nativeEvent.isComposing || e.keyCode === 229) return;
		submitNewCategory();
	};

	const singleValue = selected[0] || "";

	return (
		<div ref={wrapperRef} className="mb-3">
			<label htmlFor="category" className="form-label">
				Category
			</label>
			<select
				id="category"
				name="category"
				value={multiple ? selected : singleValue}
				onChange={onSelectChange}
				className="form-select"
				multiple={multiple}
				size={multiple ? Math.min(Math.max(tree.length, 4), 10) : undefined}
			>
				{!multiple && <option value="">Select category</option>}
				{tree.map((node) => (
					<option key={node.id} value={node.id}>
						{indentLabel(node)}
					</option>
				))}
			</select>
			{multiple && (
				<div className="form-text">
					Hold Ctrl (Cmd on Mac) to select more than one.
				</div>
			)}

			{allowCreate && (
				<>
					<button
						type="button"
						className="btn btn-link btn-sm px-0 mt-1"
						aria-expanded={showAdd}
						aria-controls={panelId}
						onClick={toggleAddPanel}
					>
						<i
							className={"fa-solid me-1 " + (showAdd ? "fa-minus" : "fa-plus")}
							aria-hidden="true"
						/>
						Add new category
					</button>

					{/* No `name` on these fields and no native `required`, so they never
					    leak into or block the parent form's submit. */}
					{showAdd && (
						<div id={panelId} className="border rounded p-3 mt-1">
							<label htmlFor={titleId} className="form-label">
								New category name
							</label>
							<input
								ref={titleInputRef}
								id={titleId}
								type="text"
								className={
									"form-control mb-2" +
									(createError && !newTitle.trim() ? " is-invalid" : "")
								}
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								onKeyDown={onTitleKeyDown}
								placeholder="e.g. JavaScript"
								aria-required="true"
								maxLength={120}
								disabled={creating}
							/>

							<label htmlFor={descriptionId} className="form-label">
								Description{" "}
								<span className="text-body-secondary">(optional)</span>
							</label>
							<textarea
								id={descriptionId}
								className="form-control mb-2"
								rows={2}
								value={newDescription}
								onChange={(e) => setNewDescription(e.target.value)}
								disabled={creating}
							/>

							<div className="form-check mb-2">
								<input
									id={childToggleId}
									type="checkbox"
									className="form-check-input"
									checked={isChild}
									onChange={(e) => {
										setIsChild(e.target.checked);
										if (!e.target.checked) setNewParent("");
										setCreateError("");
									}}
									disabled={creating || tree.length === 0}
								/>
								<label htmlFor={childToggleId} className="form-check-label">
									Make this a subcategory
								</label>
							</div>

							{isChild && (
								<>
									<label htmlFor={parentSelectId} className="form-label">
										Parent category <span className="text-danger">*</span>
									</label>
									<select
										id={parentSelectId}
										className={
											"form-select mb-2" +
											(createError && !newParent ? " is-invalid" : "")
										}
										value={newParent}
										onChange={(e) => {
											setNewParent(e.target.value);
											setCreateError("");
										}}
										aria-required="true"
										disabled={creating}
									>
										<option value="">&mdash; Choose parent &mdash;</option>
										{tree.map((node) => (
											<option key={node.id} value={node.id}>
												{indentLabel(node)}
											</option>
										))}
									</select>
								</>
							)}

							{createError && (
								<div
									className="alert alert-danger py-2 small mb-2"
									role="alert"
								>
									{createError}
								</div>
							)}
							<div className="visually-hidden" aria-live="polite">
								{createNotice}
							</div>
							{createNotice && !createError && (
								<div className="small text-success mb-2" aria-hidden="true">
									<i className="fa-solid fa-check me-1" />
									{createNotice}
								</div>
							)}

							<div className="d-flex gap-2">
								<button
									type="button"
									className="btn btn-primary btn-sm"
									onClick={submitNewCategory}
									disabled={creating}
								>
									{creating ? (
										<>
											<span
												className="spinner-border spinner-border-sm me-1"
												aria-hidden="true"
											/>
											Adding...
										</>
									) : (
										"Add category"
									)}
								</button>
								<button
									type="button"
									className="btn btn-outline-secondary btn-sm"
									onClick={toggleAddPanel}
									disabled={creating}
								>
									Cancel
								</button>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default CreateQuickDraftBlogForm;
