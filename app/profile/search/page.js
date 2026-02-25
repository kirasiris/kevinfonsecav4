import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import ProfilesList from "@/components/profile/profileslist";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getProfiles(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	return res;
}

const ProfileSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.page || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getProfilesData = getProfiles(
		`?page=${page}&limit=${limit}&sort=-createdAt&isEmailConfirmed=true&keyword=${awtdSearchParams.keyword}${decrypt}`,
	);

	const [profiles] = await Promise.all([getProfilesData]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Search results of ${awtdSearchParams.keyword}`}
				description={"Search results..."}
				favicon={settings?.data?.favicon}
				postImage={settings?.data?.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/profile/search?keyword=${awtdSearchParams.keyword}&page=${page}&limit=${limit}&sort=${sort}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header
						title={awtdSearchParams.keyword}
						description="Search results..."
					/>
					<ProfilesList objects={profiles} searchParams={awtdSearchParams} />
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default ProfileSearchIndex;
