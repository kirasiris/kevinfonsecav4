import Header from "@/layout/header";
import Head from "@/app/head";
import List from "@/components/changelog/list";
import { fetchurl } from "@/helpers/setTokenOnServer";

async function getChangelogs(params) {
	const res = await fetchurl(`/changelogs${params}`, "GET", "no-cache");
	return res.json();
}

const ChangelogIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 1000;
	const page = searchParams.page || 1;

	const getChangelogsData = getChangelogs(
		`?page=${page}&limit=${limit}&sort=-createdAt&status=published`
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
