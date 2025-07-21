import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import OnboardingLink from "@/components/dashboard/onboardinglink";
import UpdateCourseForm from "@/forms/noadmin/courses/updatecourseform";

async function getCourse(params) {
	const res = await fetchurl(
		`/extras/stripe/courses${params}`,
		"GET",
		"no-cache"
	);
	if (!res.success) notFound();
	return res;
}

const UpdateCourse = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const course = await getCourse(`/${awtdParams.id}`);

	// Redirect if not charges enabled
	!auth?.data?.stripe?.stripeChargesEnabled && <OnboardingLink auth={auth} />;

	return <UpdateCourseForm token={token} auth={auth} object={course} />;
};

export default UpdateCourse;
