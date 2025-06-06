import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import { notFound, redirect } from "next/navigation";
import MyTextArea from "@/components/global/myfinaltextarea";
import FormButtons from "@/components/global/formbuttons";

async function getComment(params) {
	const res = await fetchurl(`/global/comments${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateComment = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const comment = await getComment(`/${awtdParams.id}`);

	const upgradeComment = async (formData) => {
		"use server";
		const rawFormData = {
			resourceId: formData.get("resourceId"),
			onModel: formData.get("onModel"),
			user: formData.get("user") || undefined,
			name: formData.get("name"),
			email: formData.get("email"),
			website: formData.get("website"),
			title: formData.get("title"),
			text: formData.get("text"),
			status: formData.get("status"),
		};
		await fetchurl(
			`/noadmin/comments/${awtdParams.id}`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/noadmin/comments`);
	};

	return (
		<form className="row" action={upgradeComment}>
			<div className="col">
				<label htmlFor="blog-title" className="form-label">
					Title
				</label>
				<input
					id="blog-title"
					name="title"
					defaultValue={comment?.data?.title}
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
					onModel="Comment"
					advancedTextEditor={true}
					customPlaceholder="No description"
					defaultValue={comment?.data?.text}
				/>
				<label htmlFor="user" className="form-label">
					User ID
				</label>
				<input
					id="user"
					name="user"
					defaultValue={comment?.data.user?._id || undefined}
					type="text"
					className="form-control mb-3"
					placeholder="0123456789"
				/>
				<div className="row">
					<div className="col">
						<label htmlFor="resourceId" className="form-label">
							Resource ID
						</label>
						<input
							id="resourceId"
							name="resourceId"
							defaultValue={comment?.data?.resourceId?._id}
							type="text"
							className="form-control mb-3"
							placeholder="0123456789"
						/>
					</div>
					<div className="col">
						<label htmlFor="onModel" className="form-label">
							On Model
						</label>
						<select
							id="onModel"
							name="onModel"
							defaultValue={comment?.data?.onModel}
							className="form-control"
						>
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
				</div>
				<div className="row">
					<div className="col">
						<label htmlFor="name" className="form-label">
							Name
						</label>
						<input
							id="name"
							name="name"
							defaultValue={comment?.data?.name}
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
							defaultValue={comment?.data?.email}
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
							defaultValue={comment?.data?.website}
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
					defaultValue={comment?.data?.status}
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

export default UpdateComment;
