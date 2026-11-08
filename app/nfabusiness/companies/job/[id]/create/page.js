import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateJobForm from "@/forms/nfabusiness/companies/createjobform";

const CreateJob = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<div className="container-fluid px-0">
			<CreateJobForm token={token} auth={auth} params={awtdParams} />
		</div>
	);
};

export default CreateJob;
