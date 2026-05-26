import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/snippet/list";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getSnippets(params) {
	const res = await fetchurl(`/global/snippets${params}`, "GET", "no-cache");
	return res;
}

const SnippetSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword || "";
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getFeaturedSnippetsData = getSnippets(
		`?featured=true&status=published${decrypt}`,
	);

	const getSnippetsData = getSnippets(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${keywordQuery}${decrypt}`,
	);

	const [featured, snippets] = await Promise.all([
		getFeaturedSnippetsData,
		getSnippetsData,
	]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Search results of ${keyword}`}
				description={"Search results..."}
				favicon={settings?.data?.favicon}
				postImage={settings.data.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/snippet/search?page=${page}&limit=${limit}&sort=${sort}${keywordQuery}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header title={`${keyword}`} description="Search results..." />
					<List
						featured={featured}
						objects={snippets}
						searchParams={awtdSearchParams}
					/>
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default SnippetSearchIndex;
