import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateCompanyForm from "@/forms/nfabusiness/companies/createcompanyform";

const CreateCompany = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return <CreateCompanyForm token={token} auth={auth} />;
};

export default CreateCompany;
