import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import OnboardingLink from "@/components/nfabusiness/onboardinglink";
import CreateRealEstateForm from "@/forms/nfabusiness/realestates/createrealestateform";

const CreateRealEstate = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	// Redirect if not charges enabled
	!auth?.userStripeChargesEnabled && <OnboardingLink />;

	return <CreateRealEstateForm token={token} auth={auth} />;
};

export default CreateRealEstate;
