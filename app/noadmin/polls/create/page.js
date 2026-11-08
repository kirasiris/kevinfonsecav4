import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreatePollForm from "@/forms/noadmin/polls/createpollform";

const CreatePoll = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<div className="container-fluid px-0">
			<CreatePollForm token={token} auth={auth} />
		</div>
	);
};

export default CreatePoll;
