import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateChapterForm from "@/forms/noadmin/animes/createchapterform";

const CreateChapter = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<div className="container-fluid px-0">
			<CreateChapterForm
				token={token}
				auth={auth}
				params={awtdParams}
				searchParams={awtdSearchParams}
			/>
		</div>
	);
};

export default CreateChapter;
