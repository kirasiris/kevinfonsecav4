import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import ProfilesList from "@/components/profile/profileslist";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getProfiles(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	return res;
}

const ProfileIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const limit = awtdSearchParams.limit || 10;
	const page = awtdSearchParams.page || 1;
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getProfilesData = getProfiles(
		`?page=${page}&limit=${limit}&sort=-createdAt&isEmailConfirmed=true${decrypt}`,
	);

	const [profiles] = await Promise.all([getProfilesData]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Profiles`}
				description={"Find out the community's members and become friends"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/profile`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<Header
				title="Welcome to my Users Page"
				description="Find out the community's members and become friends"
			/>
			<ProfilesList objects={profiles} searchParams={awtdSearchParams} />
		</>
	);
};

export default ProfileIndex;
