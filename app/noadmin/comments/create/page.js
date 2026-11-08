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
		<div className="container-fluid px-0">
			<CreateCommentForm
				token={token}
				auth={auth}
				params={awtdParams}
				searchParams={awtdSearchParams}
			/>
		</div>
	);
};

export default CreateComment;
