import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateQuestionForm from "@/forms/noadmin/polls/createquestionform";

const CreateQuestion = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<div className="container-fluid px-0">
			<CreateQuestionForm
				token={token}
				auth={auth}
				params={awtdParams}
				searchParams={awtdSearchParams}
			/>
		</div>
	);
};

export default CreateQuestion;
