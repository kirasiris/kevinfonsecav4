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

	console.log("Current comment", comment);

	const upgradeComment = async (formData) => {
		"use server";
		const rawFormData = {
			user: formData.get("user") || undefined,
			name: formData.get("name"),
			email: formData.get("email"),
			website: formData.get("website"),
			title: formData.get("title"),
			text: formData.get("text"),
			status: formData.get("status"),
		};
		await fetchurl(`/noadmin/comments/${awtdParams.id}`, "PUT", "no-cache", {
			...rawFormData,
			resourceId: comment?.data?.resourceId?._id,
			onModel: comment?.data?.onModel,
		});
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
