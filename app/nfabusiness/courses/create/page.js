import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import OnboardingLink from "@/components/nfabusiness/onboardinglink";
import CreateCourseForm from "@/forms/nfabusiness/courses/createcourseform";

const CreateCourse = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	// Redirect if not charges enabled
	!auth?.userStripeChargesEnabled && <OnboardingLink />;

	return (
		<div className="container-fluid px-0">
			<CreateCourseForm token={token} auth={auth} />
		</div>
	);
};

export default CreateCourse;
