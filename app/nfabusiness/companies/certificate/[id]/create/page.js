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

	return (
		<div className="container-fluid px-0">
			<CreateCertificateForm token={token} auth={auth} params={awtdParams} />
		</div>
	);
};

export default CreateCertificate;
