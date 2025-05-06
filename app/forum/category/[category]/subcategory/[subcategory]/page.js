import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/forum/list";

async function getForums(params) {
	const res = await fetchurl(`/global/forums${params}`, "GET", "no-cache");
	return res;
}

const ForumCategorySubCategoryIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 32;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getForumsData = getForums(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&category=${awtdParams.category}&sub_category=${awtdParams.subcategory}${decrypt}`
	);

	const [forums] = await Promise.all([getForumsData]);

	const capitalizeWord = awtdParams.category + " > " + awtdParams.subcategory;

	return (
		<>
			<Header
				title={`Welcome to my ${capitalizeWord
					.split("-")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" ")} Forums`}
				description="Learn everything about my programming and life journey"
			/>
			<List
				featured={{}}
				objects={forums}
				params={awtdParams}
				searchParams={awtdSearchParams}
			/>
		</>
	);
};

export default ForumCategorySubCategoryIndex;
