import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import OnboardingLink from "@/components/nfabusiness/onboardinglink";
import UpdateRealEstateForm from "@/forms/nfabusiness/realestates/updaterealestateform";

async function getRealState(params) {
	const res = await fetchurl(`/global/realestates${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateRealEstate = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const realstate = await getRealState(`/${awtdParams.id}`);

	// Redirect if not charges enabled
	!auth?.userStripeChargesEnabled && <OnboardingLink />;

	return <UpdateRealEstateForm token={token} auth={auth} object={realstate} />;
};

export default UpdateRealEstate;
