import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateJobForm from "@/forms/noadmin/companies/createjobform";

const CreateJob = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	// Redirect if not company
	// !auth?.data?.hasCompany && redirect(`/noadmin/companies`);

	return <CreateJobForm token={token} auth={auth} params={awtdParams} />;
};

export default CreateJob;
