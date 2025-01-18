import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/forum/list";

async function getForums(params) {
	const res = await fetchurl(`/forums${params}`, "GET", "no-cache");
	return res;
}

const ForumSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getForumsData = getForums(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&keyword=${awtdSearchParams.keyword}${decrypt}`
	);

	const [forums] = await Promise.all([getForumsData]);

	return (
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
	);
};

export default ForumSearchIndex;
