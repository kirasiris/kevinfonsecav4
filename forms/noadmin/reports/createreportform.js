"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateReportForm = ({ token = {}, auth = {}, searchParams = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);
	const [draft, setDraft] = useState({ html: null, users: [], hashtags: [] });

	const addReport = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			// mentions: JSON.parse(formData.get("text_users") || "[]"),
			// hashtags: JSON.parse(formData.get("text_hashtags") || "[]"),
			website: formData.get("website"),
			resourceId: searchParams.resourceId,
			onModel: searchParams.onModel,
		};

		const res = await fetchurl(
			`/noadmin/reports`,
			"POST",
			"no-cache",
			rawFormData,
			undefined,
			false,
			false,
		);

		if (res.status === "error") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}
		if (res.status === "fail") {
			toast.error(res.message);
			setBtnText("Submit");
			return;
		}
		setBtnText(btnText);
		router.push(`/noadmin/reports`);
	};

	return (
		<form className="row" onSubmit={addReport}>
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
					value={draft.html ?? undefined}
					onChange={setDraft}
					onModel="Report"
					advancedTextEditor={false}
					customPlaceholder="Type something..."
					charactersLimit={99999}
					isRequired={true}
				/>
				{/* <p className="form-text mt-1 mb-3">
					{draft.html.replace(/<[^>]*>/g, "").length} characters
					{draft.users.length > 0 &&
						" · mentions: " +
							draft.users.map((u) => "@" + u.username).join(", ")}
					{draft.hashtags.length > 0 &&
						" · tags: " + draft.hashtags.map((t) => "#" + t).join(", ")}
				</p> */}
				<label htmlFor="website" className="form-label">
					Website
				</label>
				<input
					id="website"
					name="website"
					defaultValue=""
					type="website"
					className="form-control mb-3"
					placeholder="https://demo.com/"
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateReportForm;
