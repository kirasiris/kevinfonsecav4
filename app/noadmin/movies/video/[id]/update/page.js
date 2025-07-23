import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateVideoForm from "@/forms/noadmin/movies/updatevideoform";

async function getChapter(params) {
	const res = await fetchurl(`/global/videos${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateVideo = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const chapter = await getChapter(`/${awtdParams.id}`);

	return (
		<UpdateVideoForm
			token={token}
			auth={auth}
			object={chapter}
			params={awtdParams}
		/>
	);
};

export default UpdateVideo;
