import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateAcquisitionDisposalForm from "@/forms/nfabusiness/acquisitionsdisposals/updateacquisitiondisposalform";

async function getAcquisitionsDisposals(params) {
	const res = await fetchurl(
		`/global/weaponacquisitionsdisposals${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const UpdateAcquisitionDisposal = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const acquisitiondisposal = await getAcquisitionsDisposals(
		`/${awtdParams.id}`
	);

	return (
		<UpdateAcquisitionDisposalForm
			object={acquisitiondisposal}
			token={token}
			auth={auth}
		/>
	);
};

export default UpdateAcquisitionDisposal;
