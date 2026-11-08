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

	return (
		<div className="container-fluid px-0">
			<CreateForumForm token={token} auth={auth} />
		</div>
	);
};

export default CreateForum;
