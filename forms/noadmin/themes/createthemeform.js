"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateThemeForm = ({ token = {}, auth = {}, objects = [] }) => {
	const router = useRouter();

	const [, setBtnText] = useState(`Submit`);

	const addTheme = async (e) => {
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
			preview_theme_url: formData.get("preview_theme_url"),
			github_readme: formData.get("github_readme"),
			files: { avatar: formData.get("file") || undefined },
		};

		const res = await fetchurl(`/noadmin/themes`, "POST", "no-cache", {
			...rawFormData,
			postType: "theme",
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
		toast.success(`Theme created`, "bottom");
		router.push(`/noadmin/themes`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={addTheme}>
			<div className="col">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
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
				<div className="row">
					<div className="col">
						<label htmlFor="preview_theme_url" className="form-label">
							Preview URL
						</label>
						<input
							id="preview_theme_url"
							name="preview_theme_url"
							defaultValue="#"
							type="text"
							className="form-control"
							placeholder=""
						/>
					</div>
					<div className="col">
						<label htmlFor="github_readme" className="form-label">
							GitHub ReadME.md
						</label>
						<input
							id="github_readme"
							name="github_readme"
							defaultValue="#"
							type="text"
							className="form-control"
							placeholder=""
						/>
					</div>
				</div>
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

export default CreateThemeForm;
