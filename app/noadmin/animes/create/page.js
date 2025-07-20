import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateAnimeForm from "@/forms/noadmin/animes/createanimeform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

const CreateAnime = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const categories = await getCategories(`?categoryType=anime`);

	return <CreateAnimeForm token={token} auth={auth} objects={categories} />;
};

export default CreateAnime;
