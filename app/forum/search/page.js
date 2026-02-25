import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/forum/list";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getForums(params) {
	const res = await fetchurl(`/global/forums${params}`, "GET", "no-cache");
	return res;
}

const ForumSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const keyword = awtdSearchParams.keyword;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const keywordQuery =
		keyword !== "" && keyword !== undefined ? `&keyword=${keyword}` : "";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getForumsData = getForums(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${keywordQuery}${decrypt}`,
	);

	const [forums] = await Promise.all([getForumsData]);

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
				url={`/forum/search?keyword=${awtdSearchParams.keyword}&page=${page}&limit=${limit}&sort=${sort}`}
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
						featured={{}}
						objects={forums}
						params={awtdParams}
						searchParams={awtdSearchParams}
					/>
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default ForumSearchIndex;
