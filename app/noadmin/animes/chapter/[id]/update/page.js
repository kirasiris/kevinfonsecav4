import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateChapterForm from "@/forms/noadmin/animes/updatechapterform";

async function getChapter(params) {
	const res = await fetchurl(`/global/videos${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateChapter = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const chapter = await getChapter(`/${awtdParams.id}`);

	return (
		<UpdateChapterForm
			token={token}
			auth={auth}
			object={chapter}
			params={awtdParams}
		/>
	);
};

export default UpdateChapter;
