import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateQuizForm from "@/forms/noadmin/quizzes/createquizform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

const CreateQuiz = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const categories = await getCategories(`?categoryType=quiz`);

	return (
		<div className="container-fluid px-0">
			<CreateQuizForm token={token} auth={auth} objects={categories} />
		</div>
	);
};

export default CreateQuiz;
