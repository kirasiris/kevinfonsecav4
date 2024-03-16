"use client";
import axios from "axios";
import { toast } from "react-toastify";
import DashboardCardHeaderMenu from "@/components/dashboard/dashboardcardheadermenu";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import NothingFoundAlert from "@/layout/nothingfoundalert";
import NumericPagination from "@/layout/numericpagination";
import Single from "./single";
import { fetchurl } from "@/helpers/setTokenOnServer";

const List = ({ auth = {}, objects = [], params = {}, searchParams = {} }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const sortby = searchParams.sortby || "-createdAt";
	const status =
		searchParams.status !== "" ? `&status${searchParams.status}` : "";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	console.log(params);

	const fetchCourses = async () => {
		try {
			const res = await fetchurl(
				`/courses?user=${auth.data._id}&page=${page}&limit=${limit}&sort=${sortby}${status}${decrypt}`,
				"GET",
				"no-cache"
			);
			console.log("Hola", res);
			return res.json();
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

	const draftIt = async (id) => {
		try {
			await fetchurl(`/courses/${id}/draftit`, "PUT", "no-cache");
			toast.success("Course drafted");
			await fetchCourses();
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

	const publishIt = async (id) => {
		try {
			await fetchurl(`/courses/${id}/publishit`, "PUT", "no-cache");
			toast.success("Course published");
			await fetchCourses(
				`?user=${auth.data._id}&page=${page}&limit=${limit}&sort=${sortby}&status=published${decrypt}`
			);
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

	const trashIt = async (id) => {
		try {
			await fetchurl(`/courses/${id}/trashit`, "PUT", "no-cache");
			toast.success("Course trashed");
			await fetchCourses(
				`?user=${auth.data._id}&page=${page}&limit=${limit}&sort=${sortby}&status=trash${decrypt}`
			);
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

	const scheduleIt = async (id) => {
		try {
			await fetchurl(`/courses/${id}/scheduleit`, "PUT", "no-cache");
			toast.success("Course scheduled");
			await fetchCourses(
				`?user=${auth.data._id}&page=${page}&limit=${limit}&sort=${sortby}&status=scheduled${decrypt}`
			);
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

	return (
		<>
			<AdminStatusesMenu
				allLink="/dashboard/courses"
				publishedLink="/dashboard/courses/published"
				draftLink="/dashboard/courses/draft"
				scheduledLink="/dashboard/courses/scheduled"
				trashedLink="/dashboard/courses/trashed"
			/>
			<div className="card rounded-0">
				<DashboardCardHeaderMenu
					allLink="/dashboard/courses"
					pageText="Courses"
					currentResults={objects.count}
					totalResults={objects.countAll}
					addLink="/dashboard/courses/create"
					addLinkText="course"
				/>
				{objects?.data?.length > 0 ? (
					<>
						<ul className="list-group list-group-flush">
							{objects?.data?.map((course) => (
								<Single
									key={course._id}
									object={course}
									handleDraft={draftIt}
									handlePublish={publishIt}
									handleTrash={trashIt}
									handleSchedule={scheduleIt}
									// handleDelete={handleDelete}
									objects={objects.data}
								/>
							))}
							<li className="list-group-item">
								{searchParams.page} / {objects?.pagination?.totalpages}
							</li>
						</ul>
						<NumericPagination
							totalPages={
								objects?.pagination?.totalpages ||
								Math.ceil(objects?.data?.length / searchParams.limit)
							}
							page={searchParams.page}
							limit={searchParams.limit}
							keyword={searchParams.keyword}
							sortby={"-createdAt"}
							siblings={1}
						/>
					</>
				) : (
					<NothingFoundAlert
						classNames={`alert-danger rounded-0 m-0 border-0`}
						text={`${objects?.data?.length >= 1 ? "Loading" : "Nothing found"}`}
					/>
				)}
			</div>
		</>
	);
};

export default List;
