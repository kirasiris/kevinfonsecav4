"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateNewsletterEmailForm = ({ token = {}, auth = {}, objects = [] }) => {
	const router = useRouter();

	const [, setBtnText] = useState(`Submit`);
	const [draft, setDraft] = useState({ html: null, users: [], hashtags: [] });

	const addEmail = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			recipients: formData.getAll("recipients"),
			text: formData.get("text"),
			// mentions: JSON.parse(formData.get("text_users") || "[]"),
			// hashtags: JSON.parse(formData.get("text_hashtags") || "[]"),
			subject: formData.get("subject"),
			status: formData.get("status"),
		};

		const res = await fetchurl(
			`/noadmin/newsletteremails`,
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
		toast.success(`Newsletter email created and sent`);
		router.push(`/noadmin/newsletteremails`);
	};

	return (
		<form className="row" onSubmit={addEmail}>
			<div className="col">
				<label htmlFor="recipients" className="form-label">
					To
				</label>
				<select
					id="recipients"
					name="recipients"
					defaultValue={[]}
					className="form-control"
					multiple
				>
					{objects?.data
						.filter((user) => user.email !== auth?.email)
						.map((user) => (
							<option key={user._id} value={user.name + "|" + user.email}>
								{user?.email}
							</option>
						))}
				</select>
				<label htmlFor="subject" className="form-label">
					Subject
				</label>
				<input
					id="subject"
					name="subject"
					defaultValue="Subject"
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
					value={draft.html ?? undefined}
					onChange={setDraft}
					onModel="NewsletterEmail"
					advancedTextEditor={false}
					customPlaceholder="No description"
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
			</div>
			<div className="col-lg-3">
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

export default CreateNewsletterEmailForm;
