import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import UpdateMenuForm from "@/forms/noadmin/menus/updatemenuform";

async function getMenu(params) {
	const res = await fetchurl(`/global/menus${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateMenu = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const menu = await getMenu(`/${awtdParams.id}`);

	return <UpdateMenuForm object={menu} />;
};

export default UpdateMenu;
