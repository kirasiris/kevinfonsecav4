"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FormButtons from "@/components/global/formbuttons";
import { isFailure, safeFetch } from "@/helpers/filemanagerhelpers";
import { useIsMounted } from "@/components/global/filemanagerui";
import {
	actionMessage,
	shakeElement,
} from "@/components/global/actionfeedback";
import MyTextArea from "@/components/global/myfinaltextarea";

const CreateBlogCategoryForm = ({ objects = [] }) => {
	const router = useRouter();
	const isMountedRef = useIsMounted();
	const submittingRef = useRef(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const createCategory = async (e) => {
		e.preventDefault();
		if (submittingRef.current) return;
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			mentions: JSON.parse(formData.get("text_users") || "[]"),
			tags: JSON.parse(formData.get("text_hashtags") || "[]"),
			parentId: formData.get("parentId"),
			deletable: formData.get("deletable"),
			categoryType: "blog",
		};

		submittingRef.current = true;
		setIsSubmitting(true);
		setError("");

		const res = await safeFetch(
			`/noadmin/categories`,
			"POST",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		submittingRef.current = false;
		if (!isMountedRef.current) return;
		setIsSubmitting(false);

		if (isFailure(res)) {
			setError(actionMessage(res, "Could not create the category"));
			shakeElement(form);
			return;
		}
		toast.success(`Category "${rawFormData.title}" created`);
		form.reset();
		form.elements.namedItem("title")?.focus();
		router.refresh();
	};

	return (
		<form onSubmit={createCategory} onReset={() => setError("")}>
			<label htmlFor="category-title" className="form-label">
				Title
			</label>
			<input
				id="category-title"
				name="title"
				defaultValue=""
				type="text"
				className="form-control mb-3"
				required
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
				defaultValue=""
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
				defaultValue=""
				className="form-select mb-3"
			>
				<option value="">Select category</option>
				{objects?.data?.map((item) => (
					<option key={item._id} value={item._id}>
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
				defaultValue={false}
				className="form-select"
			>
				<option value={true}>Yes</option>
				<option value={false}>No</option>
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
			<FormButtons pending={isSubmitting} />
		</form>
	);
};

export default CreateBlogCategoryForm;
