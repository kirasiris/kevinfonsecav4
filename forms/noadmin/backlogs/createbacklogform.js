"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateBacklogForm = ({ token = {}, auth = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);

	const addBacklog = async (e) => {
		e.preventDefault();
		setBtnText(`Processing...`);
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			status: formData.get("status"),
			viewtype: formData.get("viewtype"),
		};

		console.log("rawformData", rawFormData);

		const res = await fetchurl(
			`/noadmin/backlogs`,
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
		toast.success(`Backlog created`);
		// router.push(`/noadmin/backlogs`);
		console.log("response", res);
	};

	return (
		<form className="row" onSubmit={addBacklog}>
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
					required
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
					onModel="Backlog"
					advancedTextEditor={true}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
			</div>
			<div className="col-lg-3">
				<label htmlFor="status" className="form-label">
					Status
				</label>
				<select
					id="status"
					name="status"
					defaultValue="draft"
					className="form-select mb-3"
					required
				>
					<option value={`draft`}>Draft</option>
					<option value={`published`}>Published</option>
					<option value={`trash`}>Trash</option>
				</select>
				<label htmlFor="viewtype" className="form-label">
					View Type
				</label>
				<select
					id="viewtype"
					name="viewtype"
					defaultValue="board"
					className="form-select"
					required
				>
					<option value={`table`}>Table</option>
					<option value={`board`}>Board</option>
					<option value={`roadmap`}>Roadmap</option>
				</select>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateBacklogForm;
