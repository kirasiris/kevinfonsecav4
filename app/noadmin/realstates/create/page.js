import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateRealStateForm from "@/forms/noadmin/realstates/createrealstateform";

const CreateRealState = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return <CreateRealStateForm token={token} auth={auth} />;
};

export default CreateRealState;
