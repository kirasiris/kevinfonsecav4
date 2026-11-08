import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateThemeForm from "@/forms/noadmin/themes/createthemeform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

const CreateTheme = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const categories = await getCategories(`?categoryType=theme`);

	return (
		<div className="container-fluid px-0">
			<CreateThemeForm token={token} auth={auth} objects={categories} />
		</div>
	);
};

export default CreateTheme;
