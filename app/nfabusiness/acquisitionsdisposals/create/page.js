import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateAcquisitionDisposalForm from "@/forms/nfabusiness/acquisitionsdisposals/createacquisitiondisposalform";

const CreateAcquisitionDisposal = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<div className="container-fluid px-0">
			<CreateAcquisitionDisposalForm token={token} auth={auth} />
		</div>
	);
};

export default CreateAcquisitionDisposal;
