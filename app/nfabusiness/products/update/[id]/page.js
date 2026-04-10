import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import OnboardingLink from "@/components/nfabusiness/onboardinglink";
import UpdateProductForm from "@/forms/nfabusiness/products/updateproductform";

async function getProduct(params) {
	const res = await fetchurl(`/global/products${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateProduct = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const weapon = await getProduct(`/${awtdParams.id}`);

	// Redirect if not charges enabled
	!auth?.userStripeChargesEnabled && <OnboardingLink />;

	return <UpdateProductForm token={token} auth={auth} object={weapon} />;
};

export default UpdateProduct;
