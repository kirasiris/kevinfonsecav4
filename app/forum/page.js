import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/forum/list";

async function getForums(params) {
	const res = await fetchurl(`/forums${params}`, "GET", "no-cache");
	return res;
}

const ForumIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getForumsData = getForums(
		`?page=${page}&limit=${limit}&sort=-createdAt&status=published${decrypt}`
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
				searchParams={searchParams}
			/>
		</>
	);
};

export default ForumIndex;
