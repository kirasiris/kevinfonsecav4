import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateQuestionForm from "@/forms/noadmin/polls/updatequestionform";

async function getQuestion(params) {
	const res = await fetchurl(`/global/questions${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateQuestion = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const question = await getQuestion(`/${awtdParams.id}`);

	return (
		<UpdateQuestionForm
			token={token}
			auth={auth}
			object={question}
			params={awtdParams}
		/>
	);
};

export default UpdateQuestion;
