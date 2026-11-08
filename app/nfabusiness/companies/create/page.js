import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateCompanyForm from "@/forms/nfabusiness/companies/createcompanyform";

const CreateCompany = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<div className="container-fluid px-0">
			<CreateCompanyForm token={token} auth={auth} />
		</div>
	);
};

export default CreateCompany;
