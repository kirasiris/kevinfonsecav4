import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateCDAlbumForm from "@/forms/noadmin/cdalbums/updatecdalbumform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

async function getCDAlbum(params) {
	const res = await fetchurl(`/global/playlists${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateCDAlbum = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const cdalbum = await getCDAlbum(`/${awtdParams.id}`);

	const categories = await getCategories(`?categoryType=album`);

	return (
		<UpdateCDAlbumForm
			token={token}
			auth={auth}
			object={cdalbum}
			objects={categories}
		/>
	);
};

export default UpdateCDAlbum;
