import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreatePollForm from "@/forms/noadmin/polls/createpollform";

const CreatePoll = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return <CreatePollForm token={token} auth={auth} />;
};

export default CreatePoll;
