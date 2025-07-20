import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateCommentForm from "@/forms/noadmin/comments/createcommentform";

const CreateComment = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<CreateCommentForm
			token={token}
			auth={auth}
			params={awtdParams}
			searchParams={awtdSearchParams}
		/>
	);
};

export default CreateComment;
