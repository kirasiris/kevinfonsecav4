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

	return (
		<div className="container-fluid px-0">
			<CreatePageForm token={token} auth={auth} params={awtdParams} />
		</div>
	);
};

export default CreatePage;
