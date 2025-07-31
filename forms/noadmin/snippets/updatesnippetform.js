"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import LiveCode from "@/components/noadmin/snippets/livecode";
import FormButtons from "@/components/global/formbuttons";

const UpdateSnippetForm = ({ object = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const upgradeSnippet = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			html: formData.get("html"),
			css: formData.get("css"),
			js: formData.get("js"),
			featured: formData.get("featured"),
			commented: formData.get("commented"),
			status: formData.get("status"),
		};

		const res = await fetchurl(
			`/noadmin/snippets/${object?.data?._id}`,
			"PUT",
			"no-cache",
			rawFormData
		);

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
		toast.success(`Snippet updated`, "bottom");
		router.push(`/noadmin/snippets`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={upgradeSnippet}>
			<div className="col">
				<label htmlFor="title" className="form-label">
					Title
				</label>
				<input
					id="title"
					name="title"
					defaultValue={object?.data?.title}
					type="text"
					className="form-control mb-3"
					placeholder=""
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
					onModel="Snippet"
					advancedTextEditor={false}
					customPlaceholder="No description"
				/>
			</div>
			<div className="col-lg-2">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={undefined}
					avatarFormat={"image"}
					status={object?.data?.status}
					fullWidth={false}
					password=""
					featured={object?.data?.featured.toString()}
					commented={object?.data?.commented.toString()}
					embedding={false}
					github_readme={""}
					category={undefined}
					categories={[]}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
			<div className="mt-3 mb-3" />
			<div className="col-lg-12">
				<LiveCode
					title={object?.data?.title}
					MyHtml={object?.data?.code?.html}
					MyCss={object?.data?.code?.css}
					MyJs={object?.data?.code?.javascript}
					hasId={false}
				/>
			</div>
		</form>
	);
};

export default UpdateSnippetForm;
