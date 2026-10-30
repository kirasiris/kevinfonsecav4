"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateBlogForm = ({ token = {}, auth = {}, objects = [] }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const addBlog = async (e) => {
		e.preventDefault();
		setBtnText(`Processing...`);
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			mentions: JSON.parse(formData.get("text_users") || "[]"),
			tags: JSON.parse(formData.get("text_hashtags") || "[]"),
			featured: formData.get("featured"),
			embedding: formData.get("embedding"),
			category: formData.get("category"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			status: formData.get("status"),
			fullWidth: formData.get("fullWidth"),
			files: {
				avatar: formData.get("file") || undefined,
				extras: JSON.parse(formData.get("text_files") || "[]"),
			},
			project: formData.get("project"),
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

		toast.success(`Blog created`);
		router.push(`/noadmin/blogs`);
	};

	return (
		<form className="row" onSubmit={addBlog}>
			<div className="col">
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
					advancedTextEditor={true}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
				<label htmlFor="project" className="form-label">
					Project
				</label>
				<select
					id="project"
					name="project"
					defaultValue="all"
					className="form-select"
				>
					<option value={`all`}>All</option>
					<option value={`personal`}>Personal</option>
					<option value={`armedcodellc`}>Armed Code, LLC</option>
					<option value={`armedcodellc-entertainment`}>
						Armed Code, LLC - Entertainment
					</option>
					<option value={`armedcodellc-smartpresentation`}>
						Armed Code, LLC - Smart Presentation
					</option>
					<option value={`anonymous-secrets-app`}>Anonymous Secrets App</option>
					<option value={`play-it-now-app`}>Play It Now App</option>
				</select>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={true}
					displayAvatar={true}
					avatar={undefined}
					avatarFormat={"image"}
					status="draft"
					fullWidth={true}
					password=""
					featured={true}
					commented={true}
					embedding={true}
					category={undefined}
					categories={objects?.data}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateBlogForm;
