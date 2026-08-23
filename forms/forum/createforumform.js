"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateForumForm = ({ params, searchParams }) => {
	const router = useRouter();

	const [, setBtnText] = useState(`Submit`);
	const [draft, setDraft] = useState({ html: null, users: [], hashtags: [] });

	const addForum = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			// mentions: JSON.parse(formData.get("text_users") || "[]"),
			// hashtags: JSON.parse(formData.get("text_hashtags") || "[]"),
			category: params.category,
			sub_category: params.subcategory,
			status: "published",
			commented: true,
		};

		const res = await fetchurl(
			`/protected/forums`,
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
		toast.success(`Forum created`);
		router.push(`/forum`);
	};

	return (
		<form className="row mb-5" onSubmit={addForum}>
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
					auth={undefined}
					token={undefined}
					id="text"
					name="text"
					defaultValue="No description..."
					value={draft.html ?? undefined}
					onChange={setDraft}
					onModel="Forum"
					advancedTextEditor={true}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
				<p className="form-text mt-1 mb-3">
					{/* {draft.html.replace(/<[^>]*>/g, "").length} characters */}
					{draft.users.length > 0 &&
						" · mentions: " +
							draft.users.map((u) => "@" + u.username).join(", ")}
					{draft.hashtags.length > 0 &&
						" · tags: " + draft.hashtags.map((t) => "#" + t).join(", ")}
				</p>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateForumForm;
