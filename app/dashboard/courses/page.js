// import { redirect } from "next/navigation";
// import { fetchurl } from "@/helpers/setTokenOnServer";

// async function getAuthenticatedUser() {
// 	const res = await fetchurl(`/auth/me`, "GET", "no-cache");
// 	return res.json();
// }

// async function getCourses(params) {
// 	const res = await fetchurl(`/courses${params}`, "GET", "no-cache");
// 	return res.json();
// }

const DashboardCoursesIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const sortby = searchParams.sortby || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	// const auth = await getAuthenticatedUser();

	// // Redirect if user is not loggedIn
	// (auth?.error?.statusCode === 401 || !auth?.data?.isOnline) &&
	// 	redirect(`/auth/login?returnpage=/dashboard`);

	// const getCoursesData = getCourses(
	// 	`?user=${auth.data._id}&page=${page}&limit=${limit}&sort=${sortby}${decrypt}`
	// );

	// const [courses] = await Promise.all([getCoursesData]);

	return <>DASHBOARD COURSE MAIN PAGE</>;
};

export default DashboardCoursesIndex;
