import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import UpdatePageForm from "@/forms/noadmin/menus/updatepageform";

async function getPage(params) {
	const res = await fetchurl(`/global/pages${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdatePage = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const page = await getPage(`/${awtdParams.id}`);

	return <UpdatePageForm object={page} params={awtdParams} />;
};

export default UpdatePage;
