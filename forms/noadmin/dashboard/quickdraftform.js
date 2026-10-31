"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateQuickDraftBlogForm = ({ token = {}, auth = {} }) => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

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
			category: undefined,
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
				defaultValue="Untitled"
				type="text"
				className="form-control mb-3"
				placeholder=""
			/>
			<label htmlFor="text" className="form-label">
				Text
			</label>
			<MyTextArea
				auth={auth}
				token={token}
				id="text"
				name="text"
				defaultValue="No description..."
				onModel="Blog"
				advancedTextEditor={false}
				customPlaceholder="No description"
				charactersLimit={99999}
				isRequired={true}
			/>
			<FormButtons pending={isSubmitting} />
		</form>
	);
};

export default CreateQuickDraftBlogForm;
