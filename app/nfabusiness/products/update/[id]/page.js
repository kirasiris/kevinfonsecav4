import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateProductForm from "@/forms/nfabusiness/products/updateproductform";

async function getProduct(params) {
	const res = await fetchurl(`/global/products${params}`, "GET", "no-cache");
	return res;
}

const UpdateProduct = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const weapon = await getProduct(`/${awtdParams.id}`);

	return <UpdateProductForm token={token} auth={auth} object={weapon} />;
};

export default UpdateProduct;
