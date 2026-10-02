import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdatePageForm from "@/forms/noadmin/menus/updatepageform";

async function getPage(params) {
	const res = await fetchurl(`/global/pages${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdatePage = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = getUserOnServer();

	const page = await getPage(`/${awtdParams.id}`);

	return (
		<UpdatePageForm
			token={token}
			auth={auth}
			object={page}
			params={awtdParams}
		/>
	);
};

export default UpdatePage;
