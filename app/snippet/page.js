import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/snippet/list";

async function getFeaturedSnippet(params) {
	const res = await fetchurl(`/snippets${params}`, "GET", "no-cache");
	return res;
}

async function getSnippets(params) {
	const res = await fetchurl(`/snippets${params}`, "GET", "no-cache");
	return res;
}

const SnippetIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedSnippetsData = getFeaturedSnippet(
		`?featured=true&status=published${decrypt}`
	);

	const getSnippetsData = getSnippets(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${decrypt}`
	);

	const [featured, snippets] = await Promise.all([
		getFeaturedSnippetsData,
		getSnippetsData,
	]);

	return (
		<>
			<Header
				title="Welcome to my Snippets"
				description="Create and Share HTML code with your Peers!"
			/>
			<List
				featured={featured}
				objects={snippets}
				searchParams={awtdSearchParams}
			/>
		</>
	);
};

export default SnippetIndex;
