import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateForumForm from "@/forms/noadmin/forums/createforum";

const CreateForum = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	// FILES
	// CATEGORIES

	return <CreateForumForm token={token} auth={auth} />;
};

export default CreateForum;
