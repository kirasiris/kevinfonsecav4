"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateQuickDraftBlogForm = ({ token = {}, auth = {}, objects = [] }) => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const blogCategories = objects.data.filter((c) => c.categoryType === "blog");
	const defaultCategory = objects.data.filter(
		(c) =>
			c.categoryType === "blog" &&
			(c.title === "Default" || c.slug === "default"),
	);

	const addBlog = async (e) => {
		e.preventDefault();
		if (isSubmitting) return;
		const form = e.currentTarget;
		const formData = new FormData(form);
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

		const res = await fetchurl(
			`/noadmin/blogs`,
			"POST",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		setIsSubmitting(false);

		if (res.status === "error") {
			toast.error(res.message);
			return;
		}

		if (res.status === "fail") {
			toast.error(res.message);
			return;
		}

		toast.success(`Blog created`);
		form.reset();
		router.refresh();
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
			<label htmlFor="category" className="form-label">
				Category
			</label>
			<select
				id="category"
				name="category"
				defaultValue={defaultCategory[0]._id}
				className="form-select mb-3"
			>
				<option value="">Select Category</option>
				{blogCategories.map((item) => (
					<option key={item._id} value={item._id}>
						{item.title}
					</option>
				))}
			</select>
			<FormButtons pending={isSubmitting} />
		</form>
	);
};

export default CreateQuickDraftBlogForm;
