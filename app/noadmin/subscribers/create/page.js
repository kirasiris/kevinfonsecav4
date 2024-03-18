"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "@/components/admin/adminsidebar";
import AuthContext from "@/helpers/globalContext";

const CreateSubscriber = () => {
	const { auth } = useContext(AuthContext);
	const router = useRouter();

	// Redirec if not founder
	auth.isAuthenticated &&
		!auth.user.role.includes("founder") &&
		router.push("/dashboard");

	const [users, setUsers] = useState([]);
	const [courses, setCourses] = useState([]);

	const fetchUsers = async (params = "") => {
		try {
			const res = await axios.get(`/users${params}`);
			setUsers(res?.data?.data);
		} catch (err) {
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
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

	useEffect(() => {
		fetchUsers(`?page=1&sort=-createdAt&isEmailConfirmed=true`);
	}, []);

	const fetchCourses = async (params = "") => {
		try {
			const res = await axios.get(`/courses${params}`);
			setCourses(res?.data?.data);
		} catch (err) {
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
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

	useEffect(() => {
		fetchCourses(`?page=1&sort=-createdAt`);
	}, []);

	const [subscriberData, setSubscriberData] = useState({
		resourceId: undefined,
		user: undefined,
		onModel: ``,
		status: `draft`,
	});
	const { resourceId, user, onModel, status } = subscriberData;

	const addSubscriber = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`/subscribers`, subscriberData);
			toast.success(`Item created`);
			resetForm();
			router.push(`/noadmin/subscribers`);
		} catch (err) {
			console.log(err);
			// const error = err.response.data.message;
			const error = err?.response?.data?.error?.errors;
			const errors = err?.response?.data?.errors;

			if (error) {
				// dispatch(setAlert(error, 'danger'));
				error &&
					Object.entries(error).map(([, value]) => toast.error(value.message));
			}

			if (errors) {
				errors.forEach((error) => toast.error(error.msg));
			}

			toast.error(err?.response?.statusText);
			return { msg: err?.response?.statusText, status: err?.response?.status };
		}
	};

	const resetForm = () => {
		setSubscriberData({
			resourceId: undefined,
			user: undefined,
			onModel: ``,
			status: `draft`,
		});
	};

	return (
		<form className="row" onSubmit={addSubscriber}>
			<div className="col">
				<label htmlFor="user" className="form-label">
					User
				</label>
				<select
					id="user"
					name="user"
					value={user}
					onChange={(e) => {
						setSubscriberData({
							...subscriberData,
							user: e.target.value,
						});
					}}
					className="form-control"
				>
					{users.map((user) => (
						<option key={user._id} value={user._id}>
							{user.username}
						</option>
					))}
				</select>
				<div className="row">
					<div className="col">
						<label htmlFor="onModel" className="form-label">
							On Model
						</label>
						<select
							id="onModel"
							name="onModel"
							value={onModel}
							onChange={(e) => {
								setSubscriberData({
									...subscriberData,
									onModel: e.target.value,
								});
							}}
							className="form-control"
						>
							<option value={`User`}>User</option>
							<option value={`Course`}>Course</option>
							<option value={`Playlist`}>Playlist</option>
						</select>
					</div>
					<div className="col">
						{onModel === "User" && (
							<>
								<label htmlFor="resourceId" className="form-label">
									Subscribe to User
								</label>
								<select
									id="resourceId"
									name="resourceId"
									value={resourceId}
									onChange={(e) => {
										setSubscriberData({
											...subscriberData,
											resourceId: e.target.value,
										});
									}}
									className="form-control"
								>
									{users
										.filter((u) => u._id !== user)
										.map((user) => (
											<option key={user._id} value={user._id}>
												{user.username}
											</option>
										))}
								</select>
							</>
						)}
						{onModel === "Course" && (
							<>
								<label htmlFor="resourceId" className="form-label">
									Enroll in Course
								</label>
								<select
									id="resourceId"
									name="resourceId"
									value={resourceId}
									onChange={(e) => {
										setSubscriberData({
											...subscriberData,
											resourceId: e.target.value,
										});
									}}
									className="form-control"
								>
									{courses.map((course) => (
										<option key={course._id} value={course._id}>
											{course.title}
										</option>
									))}
								</select>
							</>
						)}
						{onModel === "Playlist" && <>User selected playlist</>}
					</div>
				</div>
			</div>
			<div className="col-lg-3">
				<AdminSidebar
					displayAvatar={false}
					avatar={""}
					status={status}
					fullWidth={false}
					password={""}
					featured={false}
					commented={false}
					embedding={false}
					github={false}
					category={undefined}
					categories={[]}
					objectData={subscriberData}
					setObjectData={setSubscriberData}
					multipleFiles={false}
					onModel={"Subscriber"}
				/>
				<br />
				<button
					type="submit"
					className="btn btn-secondary btn-sm float-start"
					disabled={onModel.length > 0 ? !true : !false}
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
			</div>
		</form>
	);
};

export default CreateSubscriber;
