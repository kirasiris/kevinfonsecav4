import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/changelog/list";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getChangelogs(params) {
	const res = await fetchurl(`/global/changelogs${params}`, "GET", "no-cache");
	return res;
}

const ChangelogIndex = async ({ params, searchParams }) => {
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 1000;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getChangelogsData = getChangelogs(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${decrypt}`,
	);

	const [changelogs] = await Promise.all([getChangelogsData]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Changelog`}
				description={
					"Here you can see every change that is taking place with the development of this app!"
				}
				favicon={settings?.data?.favicon}
				postImage={settings.data.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`changelog`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header
						title="Changelog"
						description="Here you can see every change that is taking place with the development of this app!"
					/>
					<List objects={changelogs} searchParams={awtdSearchParams} />
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default ChangelogIndex;
