import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateAcquisitionDisposalForm from "@/forms/nfabusiness/acquisitionsdisposals/createacquisitiondisposalform";

const CreateAcquisitionDisposal = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return <CreateAcquisitionDisposalForm token={token} auth={auth} />;
};

export default CreateAcquisitionDisposal;
