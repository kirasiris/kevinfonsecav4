"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Single from "@/components/admin/courses/single";
import AuthContext from "@/helpers/globalContext";
import AdminStatusesMenu from "@/components/admin/adminstatusesmenu";
import AdminCardHeaderMenu from "@/components/admin/admincardheadermenu";

const AdminCoursesIndex = () => {
	const { totalResults, setTotalResults } = useContext(AuthContext);

	const router = useRouter();

	const [courses, setCourses] = useState([]);

	const [params] = useState(`?page=1&limit=10&sort=-createdAt`);

	const fetchCourses = async () => {
		try {
			const res = await axios.get(`/courses${params}`);
			setCourses(res?.data?.data);
			setTotalResults({ ...totalResults, courses: res?.data?.countAll });
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
	}, [router]);

	const handleDelete = async (id) => {
		try {
			await axios.delete(`/courses/${id}`);
			toast.success("Playlist deleted");
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
			await axios.delete(`/courses/deleteall`);
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
				allLink="/noadmin/courses"
				publishedLink="/noadmin/courses/published"
				draftLink="/noadmin/courses/draft"
				scheduledLink="/noadmin/courses/scheduled"
				trashedLink="/noadmin/courses/trashed"
				categoriesLink="/noadmin/courses/categories"
				categoryType="course"
			/>
			<div className="card rounded-0">
				<AdminCardHeaderMenu
					allLink={`/noadmin/courses`}
					pageText="Courses"
					totalResults={totalResults.courses}
					addLink={`/noadmin/courses/create`}
					addLinkText={`course`}
					handleDeleteAllFunction={handleDeleteAll}
				/>
				{courses?.length > 0 ? (
					<ul className="list-group list-group-flush">
						{courses?.map((courses) => (
							<Single
								key={courses._id}
								object={courses}
								handleDelete={handleDelete}
								objects={courses}
								setObjects={setCourses}
								setTotalResults={setTotalResults}
							/>
						))}
					</ul>
				) : (
					<div className="alert alert-danger rounded-0 m-0 border-0">
						Nothing found
					</div>
				)}
			</div>
		</>
	);
};

export default AdminCoursesIndex;
