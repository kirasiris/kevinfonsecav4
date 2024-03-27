"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Sidebar from "@/layout/auth/sidebar";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import AuthContext from "@/helpers/globalContext";

const UpdateNotificationEmails = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const [notificationsEmailData, setNotificationsEmailData] = useState({
		fromBlogComments: false,
		fromPostComments: false,
		fromVideoComments: false,
		fromMediaComments: false,
		fromProducerComments: false,
		fromJobComments: false,
		fromCommentComments: false,
	});

	const {
		fromBlogComments,
		fromPostComments,
		fromVideoComments,
		fromMediaComments,
		fromProducerComments,
		fromJobComments,
		fromCommentComments,
	} = notificationsEmailData;

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetchurl(`/auth/me`, "GET", "no-cache");
				setProfile(res?.data);
				setNotificationsEmailData({
					fromBlogComments: res.data.settings.emails.comments.fromBlogComments,
					fromPostComments: res.data.settings.emails.comments.fromPostComments,
					fromVideoComments:
						res.data.settings.emails.comments.fromVideoComments,
					fromMediaComments:
						res.data.settings.emails.comments.fromMediaComments,
					fromProducerComments:
						res.data.settings.emails.comments.fromProducerComments,
					fromJobComments: res.data.settings.emails.comments.fromJobComments,
					fromCommentComments:
						res.data.settings.emails.comments.fromCommentComments,
				});
				setLoading(false);
			} catch (err) {
				console.log(err);
				setError(true);
				// const error = err.response.data.message;
				const error = err?.response?.data?.error?.errors;
				const errors = err?.response?.data?.errors;

				if (error) {
					// dispatch(setAlert(error, 'danger'));
					error &&
						Object.entries(error).map(([, value]) =>
							toast.error(value.message)
						);
				}

				if (errors) {
					errors.forEach((error) => toast.error(error.msg));
				}

				toast.error(err?.response?.statusText);
				return {
					msg: err?.response?.statusText,
					status: err?.response?.status,
				};
			}
		};
		fetchUser();
	}, [loading]);

	const upgradeNotifications = async (e) => {
		e.preventDefault();
		await fetchurl(
			`/auth/updateemailnotifications`,
			"PUT",
			"no-cache",
			notificationsEmailData
		);
		router.push(`/auth/profile`);
	};

	const resetForm = () => {
		setNotificationsEmailData({
			fromBlogComments: false,
			fromPostComments: false,
			fromVideoComments: false,
			fromMediaComments: false,
			fromProducerComments: false,
			fromJobComments: false,
			fromCommentComments: false,
		});
	};

	return loading || profile === null || profile === undefined ? (
		error ? (
			<>Not found</>
		) : (
			<>Loading...</>
		)
	) : (
		<div className="container my-4">
			<div className="row">
				<Sidebar />
				<Globalcontent>
					<div className="card">
						<div className="card-header">
							Edit&nbsp;Email&nbsp;Notifications
						</div>
						<div className="card-body">
							<form onSubmit={upgradeNotifications}>
								<label htmlFor="fromBlogComments" className="form-label">
									From&nbsp;Blog
								</label>
								<select
									id="fromBlogComments"
									name="fromBlogComments"
									value={fromBlogComments}
									onChange={(e) => {
										setNotificationsEmailData({
											...notificationsEmailData,
											fromBlogComments: e.target.value,
										});
									}}
									className="form-control mb-3"
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
									value={fromPostComments}
									onChange={(e) => {
										setNotificationsEmailData({
											...notificationsEmailData,
											fromPostComments: e.target.value,
										});
									}}
									className="form-control mb-3"
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
									value={fromVideoComments}
									onChange={(e) => {
										setNotificationsEmailData({
											...notificationsEmailData,
											fromVideoComments: e.target.value,
										});
									}}
									className="form-control mb-3"
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
									value={fromMediaComments}
									onChange={(e) => {
										setNotificationsEmailData({
											...notificationsEmailData,
											fromMediaComments: e.target.value,
										});
									}}
									className="form-control mb-3"
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label htmlFor="fromProducerComments" className="form-label">
									From&nbsp;Producer&nbsp;/&nbsp;Channel
								</label>
								<select
									id="fromProducerComments"
									name="fromProducerComments"
									value={fromProducerComments}
									onChange={(e) => {
										setNotificationsEmailData({
											...notificationsEmailData,
											fromProducerComments: e.target.value,
										});
									}}
									className="form-control mb-3"
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
									value={fromJobComments}
									onChange={(e) => {
										setNotificationsEmailData({
											...notificationsEmailData,
											fromJobComments: e.target.value,
										});
									}}
									className="form-control mb-3"
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
									value={fromCommentComments}
									onChange={(e) => {
										setNotificationsEmailData({
											...notificationsEmailData,
											fromCommentComments: e.target.value,
										});
									}}
									className="form-control mb-3"
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<button
									type="submit"
									className="btn btn-secondary btn-sm float-start"
								>
									Submit
								</button>
								<button
									type="button"
									className="btn btn-secondary btn-sm float-end"
									onClick={resetForm}
								>
									Reset
								</button>
							</form>
						</div>
					</div>
				</Globalcontent>
			</div>
		</div>
	);
};

export default UpdateNotificationEmails;
