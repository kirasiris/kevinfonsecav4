import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/realstate/list";

async function getFeaturedRealStates(params) {
	const res = await fetchurl(`/realstates${params}`, "GET", "no-cache");
	return res;
}

async function getRealStates(params) {
	const res = await fetchurl(`/realstates${params}`, "GET", "no-cache");
	return res;
}

const RealStateIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedRealStateData = getFeaturedRealStates(
		`?featured=true&status=published${decrypt}`
	);

	const getRealStateData = getRealStates(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${decrypt}`
	);

	const [featured, realstates] = await Promise.all([
		getFeaturedRealStateData,
		getRealStateData,
	]);

	return (
		<>
			<Header
				title="Welcome to my Real State"
				description="Find out whats on Sale!"
			/>
			<List
				featured={featured}
				objects={realstates}
				searchParams={searchParams}
			/>
		</>
	);
};

export default RealStateIndex;
