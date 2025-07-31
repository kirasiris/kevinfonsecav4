import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import UpdateSnippetForm from "@/forms/noadmin/snippets/updatesnippetform";

async function getSnippet(params) {
	const res = await fetchurl(`/global/snippets${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateSnippet = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const snippet = await getSnippet(`/${awtdParams.id}`);

	return <UpdateSnippetForm object={snippet} />;
};

export default UpdateSnippet;
