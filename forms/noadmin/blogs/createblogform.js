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
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			featured: formData.get("featured"),
			embedding: formData.get("embedding"),
			category: formData.get("category"),
			commented: formData.get("commented"),
			password: formData.get("password"),
			status: formData.get("status"),
			fullWidth: formData.get("fullWidth"),
			files: { avatar: formData.get("file") || undefined },
		};

		const res = await fetchurl(`/noadmin/blogs`, "POST", "no-cache", {
			...rawFormData,
			postType: "blog",
		});

		if (res.status === "error") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message, "bottom");
			setBtnText("Submit");
			return;
		}
		toast.success(`Blog created`, "bottom");
		router.push(`/noadmin/blogs`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
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
				/>
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
					github_readme={""}
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
