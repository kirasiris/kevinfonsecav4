import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateFileForm from "@/forms/noadmin/files/updatefileform";

async function getFile(params) {
	const res = await fetchurl(`/global/files${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateFile = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const file = await getFile(`/${awtdParams.id}`);

	return <UpdateFileForm token={token} auth={auth} object={file} />;
};

export default UpdateFile;
