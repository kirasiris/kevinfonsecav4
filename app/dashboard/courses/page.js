"use client";
import { fetchurl } from "@/helpers/setTokenOnServer";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/dashboard/courses/single";
import { AuthContext } from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import DashboardCardHeaderMenu from "@/layout/dashboard/dashboardcardheadermenu";
import ClientNumericPagination from "@/layout/clientnumericpagination";
import OnboardingLink from "@/components/dashboard/courses/onboardinglink";

const DashboardCoursesIndex = () => {
	const {
		auth,
		totalPages,
		setTotalPages,
		currentResults,
		setCurrentResults,
		totalResults,
		setTotalResults,
	} = useContext(AuthContext);
	const router = useRouter();

	// Redirect if not authenticated
	!auth.isAuthenticated && router.push("/auth/login");

	const [courses, setCourses] = useState([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [sortby] = useState(`-createdAt`);
	const [params, setParams] = useState(
		`?page=${page}&limit=${limit}&sort=${sortby}`
	);
	const [keyword, setKeyword] = useState("");
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchCourses = async () => {
		try {
			const res = await fetchurl(`/courses${params}`, "GET", "no-cache");
			setCourses(res?.data);
			setTotalPages(res?.pagination?.totalpages);
			setCurrentResults(res?.count);
			setTotalResults({ ...totalResults, courses: res?.countAll });
			setPage(res?.pagination?.current);
			setLoading(false);
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
		fetchCourses();
	}, [router, params]);

	useEffect(() => {
		setList(courses);
	}, [courses]);

	useEffect(() => {
		if (keyword !== "") {
			const result = courses.filter((object) => {
				return object.title.toLowerCase().startsWith(keyword.toLowerCase());
			});
			setList(result);
		} else {
			setList(courses);
		}
	}, [keyword]);

	const draftIt = async (id) => {
		try {
			await fetchurl(`/courses/${id}/draftit`, "PUT", "no-cache");
			toast.success("Course drafted");
			fetchCourses();
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
			fetchCourses();
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
			fetchCourses();
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
			fetchCourses();
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

	const handleDelete = async (id) => {
		try {
			await fetchurl(`/courses/${id}/permanently`, "DELETE", "no-cache");
			toast.success("Course deleted");
			fetchCourses();
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

	const handleTrashAll = async () => {
		try {
			await fetchurl(`/courses/deleteall`, "PUT", "no-cache");
			toast.success("Courses trashed");
			fetchCourses();
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

	const handleDeleteAll = async () => {
		try {
			await fetchurl(`/courses/deleteall/permanently`, "PUT", "no-cache");
			toast.success("Courses deleted");
			fetchCourses();
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
					allLink={`/dashboard/courses`}
					pageText="Courses"
					currentResults={currentResults}
					totalResults={totalResults.courses}
					addLink={`/dashboard/courses/create`}
					addLinkText={`course`}
					handleTrashAllFunction={handleTrashAll}
					handleDeleteAllFunction={handleDeleteAll}
					keyword={keyword}
					setKeyword={setKeyword}
				/>
				{list?.length > 0 ? (
					auth?.user?.stripe?.stripeOnboardingLink === "" &&
					auth?.user?.stripe?.stripeOnboardingLink === null &&
					auth?.user?.stripe?.stripeOnboardingLink === undefined ? (
						<>
							<ul className="list-group list-group-flush">
								{list?.map((course) => (
									<Single
										key={course._id}
										object={course}
										handleDraft={draftIt}
										handlePublish={publishIt}
										handleTrash={trashIt}
										handleSchedule={scheduleIt}
										handleDelete={handleDelete}
										objects={list}
										setObjects={setCourses}
										setTotalResults={setTotalResults}
									/>
								))}
								<li className="list-group-item">
									{page} / {totalPages}
								</li>
							</ul>
							<ClientNumericPagination
								totalPages={totalPages || Math.ceil(list.length / limit)}
								page={page}
								limit={limit}
								sortby={sortby}
								siblings={1}
								setParams={setParams}
								router={router}
							/>
						</>
					) : (
						<OnboardingLink auth={auth} />
					)
				) : (
					<div
						className={`alert alert-${
							loading ? "primary" : "danger"
						} rounded-0 m-0 border-0`}
					>
						{loading ? "Loading" : "Nothing found"}
					</div>
				)}
			</div>
		</>
	);
};

export default DashboardCoursesIndex;