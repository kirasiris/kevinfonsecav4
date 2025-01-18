import { fetchurl } from "@/helpers/setTokenOnServer";
import { redirect } from "next/navigation";
import Sidebar from "@/layout/auth/sidebar";
import Globalcontent from "@/layout/content";
// MyTextArea
import FormButtons from "@/components/global/formbuttons";

async function getAuthenticatedUser() {
	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
	return res;
}

const UpdateNotifications = async ({ params, searchParams }) => {
	const auth = await getAuthenticatedUser();

	// Redirect if user is not logged in
	(auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
		redirect(`/auth/login`);

	const upgradeNotifications = async (formData) => {
		"use server";
		const rawFormData = {
			fromBlogNotification: formData.get("fromBlogNotification"),
			fromPostNotification: formData.get("fromPostNotification"),
			fromVideoNotification: formData.get("fromVideoNotification"),
			fromMediaNotification: formData.get("fromMediaNotification"),
			fromJobNotification: formData.get("fromJobNotification"),
			fromCommentNotification: formData.get("fromCommentNotification"),
			fromBlogNewsNotification: formData.get("fromBlogNewsNotification"),
			fromUserNewsNotification: formData.get("fromUserNewsNotification"),
		};
		await fetchurl(`/auth/updatenotifications`, "PUT", "no-cache", rawFormData);
		redirect(`/auth/profile`);
	};

	return (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header">Edit&nbsp;Notifications</div>
						<div className="card-body">
							<form action={upgradeNotifications}>
								<h6 className="display-6 text-center text-decoration-underline">
									Comments
								</h6>
								<label htmlFor="fromBlogNotification" className="form-label">
									From&nbsp;Blog
								</label>
								<select
									id="fromBlogNotification"
									name="fromBlogNotification"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.notifications.comments
											.fromBlogNotification
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label htmlFor="fromPostNotification" className="form-label">
									From&nbsp;Post
								</label>
								<select
									id="fromPostNotification"
									name="fromPostNotification"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.notifications.comments
											.fromPostNotification
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label htmlFor="fromVideoNotification" className="form-label">
									From&nbsp;Video
								</label>
								<select
									id="fromVideoNotification"
									name="fromVideoNotification"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.notifications.comments
											.fromVideoNotification
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label htmlFor="fromMediaNotification" className="form-label">
									From&nbsp;Media&nbsp;/&nbsp;Files
								</label>
								<select
									id="fromMediaNotification"
									name="fromMediaNotification"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.notifications.comments
											.fromMediaNotification
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label htmlFor="fromJobNotification" className="form-label">
									From&nbsp;Job
								</label>
								<select
									id="fromJobNotification"
									name="fromJobNotification"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.notifications.comments
											.fromJobNotification
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label htmlFor="fromCommentNotification" className="form-label">
									From&nbsp;Comment
								</label>
								<select
									id="fromCommentNotification"
									name="fromCommentNotification"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.notifications.comments
											.fromCommentNotification
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<h6 className="display-6 text-center text-decoration-underline">
									News
								</h6>
								<label
									htmlFor="fromBlogNewsNotification"
									className="form-label"
								>
									From&nbsp;Blog
								</label>
								<select
									id="fromBlogNewsNotification"
									name="fromBlogNewsNotification"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.notifications.news
											.fromBlogNewsNotification
									}
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label
									htmlFor="fromUserNewsNotification"
									className="form-label"
								>
									From&nbsp;User
								</label>
								<select
									id="fromUserNewsNotification"
									name="fromUserNewsNotification"
									className="form-control mb-3"
									defaultValue={
										auth.data.settings.notifications.news
											.fromUserNewsNotification
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

export default UpdateNotifications;
