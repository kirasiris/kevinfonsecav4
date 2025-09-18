import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import OnboardingLink from "@/components/dashboard/onboardinglink";
import CreateCourseForm from "@/forms/nfabusiness/courses/createcourseform";

const CreateCourse = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	// Redirect if not charges enabled
	!auth?.userStripeChargesEnabled && <OnboardingLink auth={auth} />;

	return <CreateCourseForm token={token} auth={auth} />;
};

export default CreateCourse;
