import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreatePageForm from "@/forms/noadmin/menus/createpageform";

const CreatePage = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return <CreatePageForm token={token} auth={auth} params={awtdParams} />;
};

export default CreatePage;
