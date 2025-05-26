import { redirect } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

const CreateComment = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const addComment = async (formData) => {
		"use server";
		const rawFormData = {
			resourceId: formData.get("resourceId"),
			user: formData.get("user"),
			name: formData.get("name"),
			email: formData.get("email"),
			title: formData.get("title"),
			text: formData.get("text"),
			status: formData.get("status"),
		};

		const res = await fetchurl(
			`/noadmin/comments`,
			"POST",
			"no-cache",
			rawFormData
		);
		console.log("comments response", res);
		// redirect(`/noadmin/comments`);
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
					onModel="Comment"
					advancedTextEditor={true}
					customPlaceholder="No description"
				/>
				<label htmlFor="user" className="form-label">
					User ID
				</label>
				<input
					id="user"
					name="user"
					defaultValue=""
					type="text"
					className="form-control mb-3"
					placeholder="0123456789"
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="name" className="form-label">
							Name
						</label>
						<input
							id="name"
							name="name"
							defaultValue=""
							type="text"
							className="form-control mb-3"
							placeholder="John Doe"
						/>
					</div>
					<div className="col">
						<label htmlFor="email" className="form-label">
							Email
						</label>
						<input
							id="email"
							name="email"
							defaultValue=""
							type="email"
							className="form-control mb-3"
							placeholder="john@doe.com"
						/>
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

export default CreateComment;
