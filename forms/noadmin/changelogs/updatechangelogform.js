"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchurl } from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const UpdateChangelogForm = ({ token = {}, auth = {}, object = {} }) => {
	const router = useRouter();

	const [btnText, setBtnText] = useState(`Submit`);
	const [draft, setDraft] = useState({ html: null, users: [], hashtags: [] });

	const upgradeChangelog = async (e) => {
		e.preventDefault();
		setBtnText("...");
		const form = e.target;
		const formData = new FormData(form);
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			// mentions: JSON.parse(formData.get("text_users") || "[]"),
			// hashtags: JSON.parse(formData.get("text_hashtags") || "[]"),
			status: formData.get("status"),
			postType: formData.getAll("postType"),
			version: formData.get("version"),
			project: formData.get("project"),
		};

		const res = await fetchurl(
			`/noadmin/changelogs/${object?.data?._id}`,
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
		setBtnText(btnText);
		router.push(`/noadmin/changelogs`);
	};

	return (
		<form className="row" onSubmit={upgradeChangelog}>
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
					defaultValue={object?.data?.text}
					value={draft.html ?? undefined}
					onChange={setDraft}
					onModel="Changelog"
					advancedTextEditor={true}
					customPlaceholder="Type something..."
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
				<label htmlFor="version" className="form-label">
					Version
				</label>
				<input
					id="version"
					name="version"
					defaultValue={object?.data?.version}
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
							defaultValue={[object?.data?.postType]}
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
							defaultValue={object?.data?.project}
							className="form-control"
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
					defaultValue={object?.data?.status}
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

export default UpdateChangelogForm;
