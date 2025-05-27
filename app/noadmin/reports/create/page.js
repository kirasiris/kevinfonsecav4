import { redirect } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateReport = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const addComment = async (formData) => {
		"use server";
		const rawFormData = {
			resourceId: formData.get("resourceId"),
			onModel: formData.get("onModel"),
			title: formData.get("title"),
			text: formData.get("text"),
			website: formData.get("website"),
		};

		await fetchurl(`/noadmin/reports`, "POST", "no-cache", rawFormData);
		redirect(`/noadmin/reports`);
	};

	return (
		<form className="row" action={addComment}>
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
					required={true}
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
					onModel="Report"
					advancedTextEditor={false}
					customPlaceholder="No description"
					charactersLimit={99999}
					isRequired={true}
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="resourceId" className="form-label">
							ResourceId
						</label>
						<input
							id="resourceId"
							name="resourceId"
							defaultValue=""
							type="text"
							className="form-control mb-3"
							placeholder="0123456789"
							required={true}
						/>
					</div>
					<div className="col">
						<label htmlFor="onModel" className="form-label">
							Model
						</label>
						<select
							id="onModel"
							name="onModel"
							defaultValue="Post"
							className="form-control"
							required={true}
						>
							<option value={`none`}>Choose an option</option>
							<option value={`Post`}>Post</option>
							<option value={`Video`}>Video</option>
							<option value={`Job`}>Job</option>
							<option value={`Comment`}>Comment</option>
							<option value={`Product`}>Product</option>
							<option value={`User`}>User</option>
							<option value={`Course`}>Course</option>
							<option value={`Lesson`}>Lesson</option>
							<option value={`Playlist`}>Playlist</option>
							<option value={`Song`}>Song</option>
							<option value={`Blog`}>Blog</option>
							<option value={`Quiz`}>Quiz</option>
							<option value={`Question`}>Question</option>
							<option value={`Company`}>Company</option>
							<option value={`File`}>File</option>
							<option value={`Secret`}>Secret</option>
							<option value={`RealState`}>RealState</option>
							<option value={`Forum`}>Forum</option>
							<option value={`Poll`}>Poll</option>
						</select>
					</div>
					<div className="col">
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
					</div>
				</div>
				<br />
				<FormButtons />
			</div>
		</form>
	);
};

export default CreateReport;
