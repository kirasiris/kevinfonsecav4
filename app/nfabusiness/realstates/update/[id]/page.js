import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateRealStateForm from "@/forms/nfabusiness/realstates/updaterealstateform";

async function getRealState(params) {
	const res = await fetchurl(`/global/realstates${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateRealState = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const realstate = await getRealState(`/${awtdParams.id}`);

	return <UpdateRealStateForm token={token} auth={auth} object={realstate} />;
};

export default UpdateRealState;
