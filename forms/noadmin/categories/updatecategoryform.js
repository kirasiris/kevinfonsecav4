"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

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

const resolveParent = (parentId, parent, list) => {
	if (!parentId) {
		return null;
	}
	if (typeof parentId === "object" && parentId.title) {
		return { _id: toId(parentId), title: parentId.title };
	}
	const fromProp = parent?.data || parent;
	if (fromProp && toId(fromProp) === parentId && fromProp.title) {
		return { _id: parentId, title: fromProp.title };
	}
	const inList = list.find((item) => toId(item._id) === parentId);
	if (inList) {
		return { _id: parentId, title: inList.title };
	}
	const viaSibling = list.find(
		(item) => toId(item.parentId) === parentId && item.parentId?.title,
	);
	if (viaSibling) {
		return { _id: parentId, title: viaSibling.parentId.title };
	}
	return { _id: parentId, title: `Current parent (${parentId})` };
};

const UpdateCategoryForm = ({
	currentpage = "",
	object = {},
	objects = [],
	parent = null,
}) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const categoryId = toId(object?.data?._id);
	const currentParentId = toId(object?.data?.parentId);
	const categoryList = Array.isArray(objects?.data) ? objects.data : [];
	const currentParent = resolveParent(
		object?.data?.parentId ? currentParentId : "",
		parent,
		categoryList,
	);
	const parentOptions = categoryList.filter((item) => {
		const id = toId(item._id);
		return id !== categoryId && id !== currentParentId;
	});

	const upgradeCategory = async (e) => {
		e.preventDefault();
		setBtnText(`Processing...`);
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
			parentId: formData.get("parentId") || undefined,
			deletable: formData.get("deletable"),
		};

		const res = await fetchurl(
			`/noadmin/categories/${categoryId}`,
			"PUT",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		if (res.status === "error") {
			toast.error(res.message);
			setBtnText(btnText);
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message);
			setBtnText(btnText);
			return;
		}
		setBtnText(btnText);
		router.push(currentpage);
	};

	return (
		<form key={`${categoryId}-${currentParentId}`} onSubmit={upgradeCategory}>
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
			<br />
			<FormButtons />
		</form>
	);
};

export default UpdateCategoryForm;
