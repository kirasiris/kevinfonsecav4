import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import OnboardingLink from "@/components/dashboard/onboardinglink";
import CreateMembershipForm from "@/forms/noadmin/memberships/createmembershipform";

const CreateMembership = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	// Redirect if not charges enabled
	!auth?.userStripeChargesEnabled && <OnboardingLink auth={auth} />;

	return <CreateMembershipForm token={token} auth={auth} />;
};

export default CreateMembership;
