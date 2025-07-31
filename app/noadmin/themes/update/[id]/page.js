import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateThemeForm from "@/forms/noadmin/themes/updatethemeform";

async function getCategories(params) {
	const res = await fetchurl(`/global/categories${params}`, "GET", "no-cache");
	return res;
}

async function getTheme(params) {
	const res = await fetchurl(`/global/themes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateTheme = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const theme = await getTheme(`/${awtdParams.id}`);

	const categories = await getCategories(`?categoryType=theme`);

	return (
		<UpdateThemeForm
			token={token}
			auth={auth}
			object={theme}
			objects={categories}
		/>
	);
};

export default UpdateTheme;
