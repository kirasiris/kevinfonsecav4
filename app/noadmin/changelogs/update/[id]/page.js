import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import MyTextArea from "@/components/global/mytextarea";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "force-cache");
	return res;
}

async function getChangelog(params) {
	const res = await fetchurl(`/changelogs${params}`, "GET", "no-cache");
	return res;
}

const UpdateChangelog = async ({ params, searchParams }) => {
	const changelog = await getChangelog(`/${params.id}`);

	const auth = await getAuthenticatedUser();
	const upgradeChangelog = async (formData) => {
		"use server";
		const rawFormData = {
			title: formData.get("title"),
			text: formData.get("text"),
			status: formData.get("status"),
			postType: formData.get("postType"),
			version: formData.get("version"),
		};
		await fetchurl(`/changelogs/${params.id}`, "PUT", "no-cache", rawFormData);
		redirect(`/noadmin/changelogs`);
	};

	return (
		<form className="row" action={upgradeChangelog}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={changelog?.data?.title}
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
					defaultValue={changelog?.data?.text}
				/>
				<label htmlFor="version" className="form-label">
					Version
				</label>
				<input
					id="version"
					name="version"
					defaultValue={changelog?.data?.version}
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
					defaultValue={changelog?.data?.postType}
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
					defaultValue={changelog?.data?.status}
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

export default UpdateChangelog;
