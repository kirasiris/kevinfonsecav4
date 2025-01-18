import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const UpdateNotificationEmails = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const upgradeNotifications = async (formData) => {
		"use server";
		const rawFormData = {
			fromBlogComments: formData.get("fromBlogComments"),
			fromPostComments: formData.get("fromPostComments"),
			fromVideoComments: formData.get("fromVideoComments"),
			fromMediaComments: formData.get("fromMediaComments"),
			fromJobComments: formData.get("fromJobComments"),
			fromCommentComments: formData.get("fromCommentComments"),
		};
		await fetchurl(
			`/auth/updateemailnotifications`,
			"PUT",
			"no-cache",
			rawFormData
		);
		redirect(`/auth/profile`);
	};

	return (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header">
							Edit&nbsp;Email&nbsp;Notifications
						</div>
						<div className="card-body">
							<form action={upgradeNotifications}>
								<label htmlFor="fromBlogComments" className="form-label">
									From&nbsp;Blog
								</label>
								<select
									id="fromBlogComments"
									name="fromBlogComments"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.emails.comments.fromBlogComments
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label htmlFor="fromPostComments" className="form-label">
									From&nbsp;Post
								</label>
								<select
									id="fromPostComments"
									name="fromPostComments"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.emails.comments.fromPostComments
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label htmlFor="fromVideoComments" className="form-label">
									From&nbsp;Video
								</label>
								<select
									id="fromVideoComments"
									name="fromVideoComments"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.emails.comments.fromVideoComments
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label htmlFor="fromMediaComments" className="form-label">
									From&nbsp;Media&nbsp;/&nbsp;Files
								</label>
								<select
									id="fromMediaComments"
									name="fromMediaComments"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.emails.comments.fromMediaComments
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label htmlFor="fromJobComments" className="form-label">
									From&nbsp;Job
								</label>
								<select
									id="fromJobComments"
									name="fromJobComments"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.emails.comments.fromJobComments
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label htmlFor="fromCommentComments" className="form-label">
									From&nbsp;Comment
								</label>
								<select
									id="fromCommentComments"
									name="fromCommentComments"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.emails.comments.fromCommentComments
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<FormButtons />
							</form>
						</div>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdateNotificationEmails;
