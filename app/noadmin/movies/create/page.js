import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateMovieForm from "@/forms/noadmin/movies/createmovieform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

const CreateMovie = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const categories = await getCategories(`?categoryType=movie`);

	return (
		<div className="container-fluid px-0">
			<CreateMovieForm token={token} auth={auth} objects={categories} />
		</div>
	);
};

export default CreateMovie;
