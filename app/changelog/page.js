import Header from "@/layout/header";
import Head from "@/app/head";
import List from "@/components/changelog/list";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getChangelogs(params) {
	const res = await fetchurl(`/changelogs${params}`, "GET", "no-cache");
	return res;
}

const ChangelogIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 1000;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

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
			<List objects={changelogs} searchParams={searchParams} />
		</>
	);
};

export default ChangelogIndex;
