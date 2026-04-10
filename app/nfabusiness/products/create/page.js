import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import OnboardingLink from "@/components/nfabusiness/onboardinglink";
import CreateProductForm from "@/forms/nfabusiness/products/createproductform";

const CreateWeapon = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	// Redirect if not charges enabled
	!auth?.userStripeChargesEnabled && <OnboardingLink />;

	return <CreateProductForm token={token} auth={auth} />;
};

export default CreateWeapon;
