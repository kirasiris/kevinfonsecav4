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
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getFeaturedSnippetsData = getSnippets(
		`?featured=true&status=published${decrypt}`,
	);

	const getSnippetsData = getSnippets(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&keyword=${awtdSearchParams.keyword}${decrypt}`,
	);

	const [featured, snippets] = await Promise.all([
		getFeaturedSnippetsData,
		getSnippetsData,
	]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Search results of ${awtdSearchParams.keyword}`}
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
				url={`/snippet/search?keyword=${awtdSearchParams.keyword}&page=${page}&limit=${limit}&sort=${sort}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
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
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default SnippetSearchIndex;
