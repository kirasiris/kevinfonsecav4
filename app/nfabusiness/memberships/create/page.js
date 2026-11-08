import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import OnboardingLink from "@/components/nfabusiness/onboardinglink";
import CreateMembershipForm from "@/forms/nfabusiness/memberships/createmembershipform";

const CreateMembership = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	// Redirect if not charges enabled
	!auth?.userStripeChargesEnabled && <OnboardingLink />;

	return (
		<div className="container-fluid px-0">
			<CreateMembershipForm token={token} auth={auth} />
		</div>
	);
};

export default CreateMembership;
