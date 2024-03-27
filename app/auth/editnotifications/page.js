"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Sidebar from "@/layout/auth/sidebar";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Globalcontent from "@/layout/content";
import AuthContext from "@/helpers/globalContext";
import MyTextArea from "@/components/global/mytextarea";

const UpdateNotifications = ({ params, searchParams }) => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const [notificationsData, setNotificationsData] = useState({
		fromBlogNotification: false,
		fromPostNotification: false,
		fromVideoNotification: false,
		fromMediaNotification: false,
		fromProducerNotification: false,
		fromJobNotification: false,
		fromCommentNotification: false,
		fromBlogNewsNotification: false,
		fromProducerNewsNotification: false,
		fromUserNewsNotification: false,
	});

	const {
		fromBlogNotification,
		fromPostNotification,
		fromVideoNotification,
		fromMediaNotification,
		fromProducerNotification,
		fromJobNotification,
		fromCommentNotification,
		fromBlogNewsNotification,
		fromProducerNewsNotification,
		fromUserNewsNotification,
	} = notificationsData;

	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetchurl(`/auth/me`, "GET", "no-cache");
				setProfile(res?.data);
				setNotificationsData({
					fromBlogNotification:
						res.data.settings.notifications.comments.fromBlogNotification,
					fromPostNotification:
						res.data.settings.notifications.comments.fromPostNotification,
					fromVideoNotification:
						res.data.settings.notifications.comments.fromVideoNotification,
					fromMediaNotification:
						res.data.settings.notifications.comments.fromMediaNotification,
					fromProducerNotification:
						res.data.settings.notifications.comments.fromProducerNotification,
					fromJobNotification:
						res.data.settings.notifications.comments.fromJobNotification,
					fromCommentNotification:
						res.data.settings.notifications.comments.fromCommentNotification,
					fromBlogNewsNotification:
						res.data.settings.notifications.news.fromBlogNewsNotification,
					fromProducerNewsNotification:
						res.data.settings.notifications.news.fromProducerNewsNotification,
					fromUserNewsNotification:
						res.data.settings.notifications.news.fromUserNewsNotification,
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
			`/auth/updatenotifications`,
			"PUT",
			"no-cache",
			notificationsData
		);
		// router.push(`/auth/profile`);
	};

	const resetForm = () => {
		setNotificationsData({
			fromBlogNotification: false,
			fromPostNotification: false,
			fromVideoNotification: false,
			fromMediaNotification: false,
			fromProducerNotification: false,
			fromJobNotification: false,
			fromCommentNotification: false,
			fromBlogNewsNotification: false,
			fromProducerNewsNotification: false,
			fromUserNewsNotification: false,
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
						<div className="card-header">Edit&nbsp;Notifications</div>
						<div className="card-body">
							<form onSubmit={upgradeNotifications}>
								<h6 className="display-6 text-center text-decoration-underline">
									Comments
								</h6>
								<label htmlFor="fromBlogNotification" className="form-label">
									From&nbsp;Blog
								</label>
								<select
									id="fromBlogNotification"
									name="fromBlogNotification"
									value={fromBlogNotification}
									onChange={(e) => {
										setNotificationsData({
											...notificationsData,
											fromBlogNotification: e.target.value,
										});
									}}
									className="form-control mb-3"
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
									value={fromPostNotification}
									onChange={(e) => {
										setNotificationsData({
											...notificationsData,
											fromPostNotification: e.target.value,
										});
									}}
									className="form-control mb-3"
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
									value={fromVideoNotification}
									onChange={(e) => {
										setNotificationsData({
											...notificationsData,
											fromVideoNotification: e.target.value,
										});
									}}
									className="form-control mb-3"
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
									value={fromMediaNotification}
									onChange={(e) => {
										setNotificationsData({
											...notificationsData,
											fromMediaNotification: e.target.value,
										});
									}}
									className="form-control mb-3"
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label
									htmlFor="fromProducerNotification"
									className="form-label"
								>
									From&nbsp;Producer&nbsp;/&nbsp;Channel
								</label>
								<select
									id="fromProducerNotification"
									name="fromProducerNotification"
									value={fromProducerNotification}
									onChange={(e) => {
										setNotificationsData({
											...notificationsData,
											fromProducerNotification: e.target.value,
										});
									}}
									className="form-control mb-3"
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
									value={fromJobNotification}
									onChange={(e) => {
										setNotificationsData({
											...notificationsData,
											fromJobNotification: e.target.value,
										});
									}}
									className="form-control mb-3"
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
									value={fromCommentNotification}
									onChange={(e) => {
										setNotificationsData({
											...notificationsData,
											fromCommentNotification: e.target.value,
										});
									}}
									className="form-control mb-3"
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
									value={fromBlogNewsNotification}
									onChange={(e) => {
										setNotificationsData({
											...notificationsData,
											fromBlogNewsNotification: e.target.value,
										});
									}}
									className="form-control mb-3"
								>
									<option value={true}>Yes</option>
									<option value={false}>No</option>
								</select>
								<label
									htmlFor="fromProducerNewsNotification"
									className="form-label"
								>
									From&nbsp;Producer
								</label>
								<select
									id="fromProducerNewsNotification"
									name="fromProducerNewsNotification"
									value={fromProducerNewsNotification}
									onChange={(e) => {
										setNotificationsData({
											...notificationsData,
											fromProducerNewsNotification: e.target.value,
										});
									}}
									className="form-control mb-3"
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
									value={fromUserNewsNotification}
									onChange={(e) => {
										setNotificationsData({
											...notificationsData,
											fromUserNewsNotification: e.target.value,
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

export default UpdateNotifications;
