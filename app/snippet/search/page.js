import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/snippet/list";

async function getFeaturedSnippet(params) {
	const res = await fetchurl(`/global/snippets${params}`, "GET", "no-cache");
	return res;
}

async function getSnippets(params) {
	const res = await fetchurl(`/global/snippets${params}`, "GET", "no-cache");
	return res;
}

const SnippetSearchIndex = async ({ params, searchParams }) => {
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
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&keyword=${awtdSearchParams.keyword}${decrypt}`
	);

	const [featured, snippets] = await Promise.all([
		getFeaturedSnippetsData,
		getSnippetsData,
	]);

	return (
		<>
			<Header
				title={`${awtdSearchParams.keyword}`}
				description="Search results..."
			/>
			<List
				featured={featured}
				objects={snippets}
				searchParams={awtdSearchParams}
			/>
		</>
	);
};

export default SnippetSearchIndex;
