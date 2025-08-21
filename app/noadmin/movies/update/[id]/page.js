import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateMovieForm from "@/forms/noadmin/movies/updatemovieform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

async function getMovie(params) {
	const res = await fetchurl(`/global/playlists${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateMovie = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const movie = await getMovie(`/${awtdParams.id}`);
	const categories = await getCategories(`?categoryType=movie`);

	return (
		<UpdateMovieForm
			token={token}
			auth={auth}
			object={movie}
			objects={categories}
		/>
	);
};

export default UpdateMovie;
