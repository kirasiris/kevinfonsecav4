import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateRealEstateForm from "@/forms/nfabusiness/realestates/createrealestateform";

const CreateRealEstate = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return <CreateRealEstateForm token={token} auth={auth} />;
};

export default CreateRealEstate;
