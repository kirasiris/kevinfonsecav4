import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import ProfilesList from "@/components/profile/profileslist";

async function getProfiles(params) {
	const res = await fetchurl(`/users${params}`, "GET", "no-cache");
	return res;
}

const ProfileSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const limit = awtdSearchParams.limit || 10;
	const page = awtdSearchParams.page || 1;
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getProfilesData = getProfiles(
		`?page=${page}&limit=${limit}&sort=-createdAt&isEmailConfirmed=true&keyword=${awtdSearchParams.keyword}${decrypt}`
	);

	const [profiles] = await Promise.all([getProfilesData]);

	return (
		<>
			<Header
				title="Welcome to my Users Page"
				description="Find out the community's members and become friends"
			/>
			<ProfilesList objects={profiles} searchParams={awtdSearchParams} />
		</>
	);
};

export default ProfileSearchIndex;
