import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/realstate/list";

async function getFeaturedHouse(params) {
	const res = await fetchurl(`/realstate${params}`, "GET", "no-cache");
	return res;
}

async function getHouses(params) {
	const res = await fetchurl(`/realstate${params}`, "GET", "no-cache");
	return res;
}

const RealStateIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedHousesData = getFeaturedHouse(
		`?featured=true&status=published${decrypt}`
	);

	const getHousesData = getHouses(
		`?page=${page}&limit=${limit}&sort=-createdAt&status=published${decrypt}`
	);

	const [featured, houses] = await Promise.all([
		getFeaturedHousesData,
		getHousesData,
	]);

	return (
		<>
			<Header
				title="Welcome to my Real State Listing"
				description="Houses, Studios, Business Buildings and More!"
			/>
			HERE GOES THE LIST
		</>
	);
};

export default RealStateIndex;