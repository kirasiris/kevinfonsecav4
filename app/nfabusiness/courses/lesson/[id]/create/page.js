import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateLessonForm from "@/forms/nfabusiness/courses/createlessonform";

const CreateLesson = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<div className="container-fluid px-0">
			<CreateLessonForm token={token} auth={auth} params={awtdParams} />
		</div>
	);
};

export default CreateLesson;
