import {
	fetchurl,
	// getAuthTokenOnServer,
	getUserEmailOnServer,
	getUserIdOnServer,
	getUserUsernameOnServer,
} from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateChangelog = async ({ params, searchParams }) => {
	const userId = await getUserIdOnServer();
	const username = await getUserUsernameOnServer();
	const email = await getUserEmailOnServer();

	const auth = {
		id: userId?.value,
		username: username?.value,
		email: email?.value,
	};

	const addChangelog = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			status: formData.get("status"),
			postType: formData.get("postType"),
			version: formData.get("version"),
		};
		await fetchurl(`/changelogs`, "POST", "no-cache", rawFormData);
		redirect(`/noadmin/changelogs`);
	};

	return (
		<form className="row" action={addChangelog}>
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
					id="text"
					name="text"
					onModel="Changelog"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue="No description..."
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
					placeholder=""
				/>
				<label htmlFor="postType" className="form-label">
					Post type
				</label>
				<select
					id="postType"
					name="postType"
					defaultValue="enhancement"
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

export default CreateChangelog;
