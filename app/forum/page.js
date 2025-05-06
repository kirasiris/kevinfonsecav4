import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/forum/list";

async function getForums(params) {
	const res = await fetchurl(`/global/forums${params}`, "GET", "no-cache");
	return res;
}

const ForumIndex = async ({ params, searchParams }) => {
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getForumsData = getForums(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${decrypt}`
	);

	const [forums] = await Promise.all([getForumsData]);

	return (
		<>
			<Header
				title="Welcome to my Forum"
				description="Learn everything about my programming and life journey"
			/>
			<List
				featured={{}}
				objects={forums}
				params={params}
				searchParams={awtdSearchParams}
			/>
		</>
	);
};

export default ForumIndex;
