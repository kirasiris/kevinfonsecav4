"use client";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";
import { isFailure, safeFetch } from "@/helpers/filemanagerhelpers";
import { useIsMounted } from "@/components/global/filemanagerui";
import {
	actionMessage,
	shakeElement,
} from "@/components/global/actionfeedback";

const toId = (value) => {
	if (!value) {
		return "";
	}
	if (typeof value === "string" || typeof value === "number") {
		return String(value);
	}
	return String(value._id || value.id || "");
};

const toMention = (value) =>
	typeof value === "string" || typeof value === "number"
		? { id: String(value), username: "" }
		: { id: toId(value), username: value?.username || "" };

const resolveParent = (parentId, list) => {
	const id = toId(parentId);
	if (!id) {
		return null;
	}
	if (parentId?.title) {
		return { _id: id, title: parentId.title };
	}
	const inList = list.find((item) => toId(item._id) === id);
	if (inList) {
		return { _id: id, title: inList.title };
	}
	const viaSibling = list.find(
		(item) => toId(item.parentId) === id && item.parentId?.title,
	);
	if (viaSibling) {
		return { _id: id, title: viaSibling.parentId.title };
	}
	return { _id: id, title: `Current parent (${id})` };
};

const selfAndDescendantIds = (categoryId, list) => {
	const ids = new Set([categoryId]);
	let grew = true;
	while (grew) {
		grew = false;
		for (const item of list) {
			const id = toId(item._id);
			if (!ids.has(id) && ids.has(toId(item.parentId))) {
				ids.add(id);
				grew = true;
			}
		}
	}
	return ids;
};

const UpdateCategoryForm = ({
	currentpage = "",
	object = {},
	objects = [],
}) => {
	const router = useRouter();
	const isMountedRef = useIsMounted();
	const submittingRef = useRef(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLeaving, startLeaving] = useTransition();
	const [error, setError] = useState("");

	const categoryId = toId(object?.data?._id);
	const currentParentId = toId(object?.data?.parentId);
	const categoryList = Array.isArray(objects?.data) ? objects.data : [];
	const currentParent = resolveParent(object?.data?.parentId, categoryList);
	const unavailableIds = selfAndDescendantIds(categoryId, categoryList);
	const parentOptions = categoryList.filter((item) => {
		const id = toId(item._id);
		return !unavailableIds.has(id) && id !== currentParentId;
	});

	const upgradeCategory = async (e) => {
		e.preventDefault();
		if (submittingRef.current) {
			return;
		}
		const form = e.target;
		const formData = new FormData(form);

		const text = formData.get("text") || "";
		const mentions = JSON.parse(formData.get("text_users") || "[]");
		const tags = JSON.parse(formData.get("text_hashtags") || "[]");

		const bodyUnchanged = text === (object?.data?.text || "");

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			mentions:
				bodyUnchanged && !mentions.length
					? (object?.data?.mentions || []).map(toMention)
					: mentions,
			tags: bodyUnchanged && !tags.length ? object?.data?.tags || [] : tags,
			parentId: parentId || (currentParentId ? null : undefined),
			deletable: formData.get("deletable"),
		};

		submittingRef.current = true;
		setIsSubmitting(true);
		setError("");

		const res = await safeFetch(
			`/noadmin/categories/${categoryId}`,
			"PUT",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		submittingRef.current = false;
		if (!isMountedRef.current) {
			return;
		}
		setIsSubmitting(false);

		if (isFailure(res)) {
			setError(actionMessage(res, "Could not update the category"));
			shakeElement(form);
			return;
		}
		toast.success(`Category "${rawFormData.title}" updated`);
		startLeaving(() => router.push(currentpage));
	};

	return (
		<form
			key={`${categoryId}-${currentParentId}`}
			onSubmit={upgradeCategory}
			onReset={() => setError("")}
		>
			<label htmlFor="category-title" className="form-label">
				Title
			</label>
			<input
				id="category-title"
				name="title"
				defaultValue={object?.data?.title}
				type="text"
				className="form-control mb-3"
				placeholder="Untitled"
			/>
			<label htmlFor="text" className="form-label">
				Text
			</label>
			<MyTextArea
				auth={undefined}
				token={undefined}
				id="text"
				name="text"
				defaultValue={object?.data?.text}
				onModel="Category"
				advancedTextEditor={false}
				customPlaceholder="Type something..."
				charactersLimit={99999}
				isRequired={true}
			/>
			<label htmlFor="parentId" className="form-label">
				Parent Category
			</label>
			<select
				id="parentId"
				name="parentId"
				defaultValue={currentParentId}
				className="form-select mb-3"
			>
				<option value="">Select category</option>
				{currentParent && (
					<option value={currentParent._id}>{currentParent.title}</option>
				)}
				{parentOptions.map((item) => (
					<option key={toId(item._id)} value={toId(item._id)}>
						{item.title}
					</option>
				))}
			</select>
			<label htmlFor="deletable" className="form-label">
				Deletable
			</label>
			<select
				id="deletable"
				name="deletable"
				defaultValue={String(object?.data?.deletable ?? false)}
				className="form-select"
			>
				<option value="true">Yes</option>
				<option value="false">No</option>
			</select>
			{error && (
				<div
					className="alert alert-danger py-2 px-3 mt-3 mb-0 small"
					role="alert"
				>
					{error}
				</div>
			)}
			<br />
			<FormButtons pending={isSubmitting || isLeaving} />
		</form>
	);
};

export default UpdateCategoryForm;
