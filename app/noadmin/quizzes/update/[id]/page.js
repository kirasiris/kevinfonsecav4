import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateQuizForm from "@/forms/noadmin/quizzes/updatequizform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

async function getQuiz(params) {
	const res = await fetchurl(`/global/quizzes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateQuiz = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const quiz = await getQuiz(`/${awtdParams.id}`);

	const categories = await getCategories(`?categoryType=quiz`);

	return (
		<UpdateQuizForm
			token={token}
			auth={auth}
			object={quiz}
			objects={categories}
		/>
	);
};

export default UpdateQuiz;
