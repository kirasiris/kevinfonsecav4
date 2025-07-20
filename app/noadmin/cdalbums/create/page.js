import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateCDAlbumForm from "@/forms/noadmin/cdalbums/createcdalbumform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

const CreateCDAlbum = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const categories = await getCategories(`?categoryType=album`);

	return <CreateCDAlbumForm token={token} auth={auth} objects={categories} />;
};

export default CreateCDAlbum;
