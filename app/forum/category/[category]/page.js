import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/forum/list";

async function getForums(params) {
	const res = await fetchurl(`/forums${params}`, "GET", "no-cache");
	return res;
}

const ForumCategoryIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 32;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getForumsData = getForums(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&category=${params.category}${decrypt}`
	);

	const [forums] = await Promise.all([getForumsData]);

	const capitalizeWord = params.category;

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
				params={params}
				searchParams={searchParams}
			/>
		</>
	);
};

export default ForumCategoryIndex;
