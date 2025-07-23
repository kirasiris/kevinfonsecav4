import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateVideoForm from "@/forms/noadmin/movies/createvideoform";

const CreateVideo = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<CreateVideoForm
			token={token}
			auth={auth}
			params={awtdParams}
			searchParams={awtdSearchParams}
		/>
	);
};

export default CreateVideo;
