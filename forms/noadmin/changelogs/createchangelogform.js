"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateChangelogForm = ({ token = {}, auth = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const addChangelog = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			status: formData.get("status"),
			postType: formData.getAll("postType"),
			version: formData.get("version"),
			project: formData.get("project"),
		};

		const res = await fetchurl(
			`/noadmin/changelogs`,
			"POST",
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
		setBtnText(btnText);
		//resetForm();
		router.push(`/noadmin/changelogs`);
	};

	const resetForm = (e) => {
		e.target.closest("form").reset();
	};

	return (
		<form className="row" onSubmit={addChangelog}>
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
					required
					placeholder="Untitled"
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
					onModel="Changelog"
					advancedTextEditor={true}
					customPlaceholder="Type something..."
					charactersLimit={99999}
					isRequired={true}
				/>
				<label htmlFor="version" className="form-label">
					Version
				</label>
				<input
					id="version"
					name="version"
					defaultValue="1.0.0"
					type="text"
					className="form-control mb-3"
					required
					placeholder="1.0.0"
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="postType" className="form-label">
							Post type
						</label>
						<select
							id="postType"
							name="postType"
							defaultValue={["enhancement"]}
							className="form-control"
							multiple
						>
							<option value={`bug`}>Bug</option>
							<option value={`dependencies`}>Dependencies</option>
							<option value={`duplicate`}>Duplicate</option>
							<option value={`enhancement`}>Enhancement</option>
							<option value={`help`}>Help</option>
							<option value={`invalid`}>Invalid</option>
							<option value={`question`}>Question</option>
							<option value={`wontfix`}>Wontfix</option>
						</select>
					</div>
					<div className="col">
						<label htmlFor="project" className="form-label">
							Project
						</label>
						<select
							id="project"
							name="project"
							defaultValue="all"
							className="form-control"
						>
							<option value={`all`}>All</option>
							<option value={`personal`}>Personal</option>
							<option value={`armedcodellc`}>Armed Code, LLC</option>
							<option value={`anonymous-secrets-app`}>
								Anonymous Secrets App
							</option>
							<option value={`play-it-now-app`}>Play It Now App</option>
						</select>
					</div>
				</div>
				<label htmlFor="status" className="form-label">
					Status
				</label>
				<select
					id="status"
					name="status"
					defaultValue="draft"
					className="form-control"
				>
					<option value={`draft`}>Draft</option>
					<option value={`published`}>Published</option>
					<option value={`trash`}>Trash</option>
					<option value={`scheduled`}>Scheduled</option>
				</select>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateChangelogForm;
