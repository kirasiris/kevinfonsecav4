import Header from "@/layout/header";
import Head from "@/app/head";
import List from "@/components/changelog/list";
import { fetchurl } from "@/helpers/setTokenOnServer";

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

	const getChangelogsData = getChangelogs(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${decrypt}`
	);

	const [changelogs] = await Promise.all([getChangelogsData]);

	return (
		<>
			<Head
				title="Changelog"
				description="Here you can see every change that is taking place with the development of this app!"
			/>
			<Header
				title="Changelog"
				description="Here you can see every change that is taking place with the development of this app!"
			/>
			<List objects={changelogs} searchParams={awtdSearchParams} />
		</>
	);
};

export default ChangelogIndex;
