import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import OnboardingLink from "@/components/nfabusiness/onboardinglink";
import UpdateMembershipForm from "@/forms/nfabusiness/memberships/updatemembershipform";

async function getMembership(params) {
	const res = await fetchurl(`/global/memberships${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateMembership = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const membership = await getMembership(`/${awtdParams.id}`);

	// Redirect if not charges enabled
	!auth?.userStripeChargesEnabled && <OnboardingLink auth={auth} />;

	return <UpdateMembershipForm token={token} auth={auth} object={membership} />;
};

export default UpdateMembership;
