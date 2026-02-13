import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/snippet/list";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getSnippets(params) {
	const res = await fetchurl(`/global/snippets${params}`, "GET", "no-cache");
	return res;
}

const SnippetCategoryIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getFeaturedSnippetsData = getSnippets(
		`?featured=true&status=published${decrypt}`,
	);

	const getSnippetsData = getSnippets(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&category=${awtdParams.categoryid}${decrypt}`,
	);

	const [featured, snippets] = await Promise.all([
		getFeaturedSnippetsData,
		getSnippetsData,
	]);

	const capitalizeWord = awtdParams.categoryslug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return (
		<>
			<Head
				title={`${settings?.data?.title} - ${capitalizeWord}`}
				description={`${capitalizeWord} search results`}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/snippet/category/${awtdParams.categoryid}/${awtdParams.categoryslug}?page=${page}&limit=${limit}&sort=${sort}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<Header
				title={`Welcome to my ${capitalizeWord} Snippets`}
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

export default SnippetCategoryIndex;
