import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/forum/list";

async function getForums(params) {
	const res = await fetchurl(`/forums${params}`, "GET", "no-cache");
	return res;
}

const ForumSearchIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getForumsData = getForums(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&keyword=${searchParams.keyword}${decrypt}`
	);

	const [forums] = await Promise.all([getForumsData]);

	return (
		<>
			<Header
				title={`${searchParams.keyword}`}
				description="Search results..."
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

export default ForumSearchIndex;
