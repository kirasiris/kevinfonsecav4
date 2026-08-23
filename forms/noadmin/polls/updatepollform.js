"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import AdminSidebar from "@/components/noadmin/myfinaladminsidebar";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdatePollForm = ({ token = {}, auth = {}, object = {} }) => {
	const router = useRouter();

	const [, setBtnText] = useState(`Submit`);
	const [draft, setDraft] = useState({ html: null, users: [], hashtags: [] });

	const upgradePoll = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);

		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			// mentions: JSON.parse(formData.get("text_users") || "[]"),
			// hashtags: JSON.parse(formData.get("text_hashtags") || "[]"),
			featured: formData.get("featured"),
			status: formData.get("status"),
		};

		const res = await fetchurl(
			`/noadmin/polls/${object?.data?._id}`,
			"PUT",
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
		toast.success(`Poll updated`);
		router.push(`/noadmin/polls`);
	};

	return (
		<form className="row" onSubmit={upgradePoll}>
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
					auth={auth}
					token={token}
					id="text"
					name="text"
					defaultValue={object?.data?.text}
					value={draft.html ?? undefined}
					onChange={setDraft}
					onModel="Poll"
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
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayCategoryField={false}
					displayAvatar={false}
					avatar={undefined}
					avatarFormat={"image"}
					status={object?.data?.status}
					fullWidth={false}
					password=""
					featured={object?.data?.featured}
					commented={false}
					embedding={false}
					category={undefined}
					categories={[]}
					multiple_categories={false}
				/>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default UpdatePollForm;
