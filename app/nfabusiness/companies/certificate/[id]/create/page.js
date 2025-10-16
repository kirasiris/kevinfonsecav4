import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateCertificateForm from "@/forms/nfabusiness/companies/createcertificateform";

const CreateCertificate = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	// Redirect if not company
	// !auth?.data?.hasCompany && redirect(`/noadmin/companies`);

	return (
		<CreateCertificateForm token={token} auth={auth} params={awtdParams} />
	);
};

export default CreateCertificate;
