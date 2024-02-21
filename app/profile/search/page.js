import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import ProfilesList from "@/components/profile/profileslist";

async function getProfiles(params) {
	const res = await fetchurl(`http://localhost:5000/api/v1/users${params}`);
	return res.json();
}

const ProfileSearchIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getProfilesData = getProfiles(
		`?page=${page}&limit=${limit}&sort=-createdAt&isEmailConfirmed=true&keyword=${searchParams.keyword}${decrypt}`
	);

	const [profiles] = await Promise.all([getProfilesData]);

	return (
		<>
			<Header
				title="Welcome to my Users Page"
				description="Find out the community's members and become friends"
			/>
			<ProfilesList objects={profiles} searchParams={searchParams} />
		</>
	);
};

export default ProfileSearchIndex;
