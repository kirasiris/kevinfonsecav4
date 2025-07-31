import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateQuestionForm from "@/forms/noadmin/quizzes/createquestionform";

const CreateQuestion = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<CreateQuestionForm
			token={token}
			auth={auth}
			params={awtdParams}
			searchParams={awtdSearchParams}
		/>
	);
};

export default CreateQuestion;
