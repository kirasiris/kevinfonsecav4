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

const ForumSubCategoryIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 32;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getForumsData = getForums(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&sub_category=${awtdParams.subcategory}${decrypt}`,
	);

	const [forums] = await Promise.all([getForumsData]);

	const capitalizeWord = awtdParams.subcategory
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	return (
		<>
			<Head
				title={`${settings?.data?.title} - ${capitalizeWord}`}
				description={`${capitalizeWord} search results`}
				favicon={settings?.data?.favicon}
				postImage={settings.data.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/forum/subcategory/${awtdParams.subcategory}?page=${page}&limit=${limit}&sort=${sort}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header
						title={`Welcome to my ${capitalizeWord} Forums`}
						description="Learn everything about my programming and life journey"
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

export default ForumSubCategoryIndex;
