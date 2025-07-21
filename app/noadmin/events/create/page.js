import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateEventForm from "@/forms/noadmin/events/createeventform";

const CreateEvent = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return <CreateEventForm token={token} auth={auth} />;
};

export default CreateEvent;
