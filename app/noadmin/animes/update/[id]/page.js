import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateAnimeForm from "@/forms/noadmin/animes/updateanimeform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

async function getAnime(params) {
	const res = await fetchurl(`/global/playlists${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateAnime = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const anime = await getAnime(`/${awtdParams.id}`);
	const categories = await getCategories(`?categoryType=anime`);

	return (
		<UpdateAnimeForm
			token={token}
			auth={auth}
			object={anime}
			objects={categories}
		/>
	);
};

export default UpdateAnime;
