import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/forum/list";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getForums(params) {
	const res = await fetchurl(`/global/forums${params}`, "GET", "no-cache");
	return res;
}

const ForumIndex = async ({ params, searchParams }) => {
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getForumsData = getForums(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${decrypt}`,
	);

	const [forums] = await Promise.all([getForumsData]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Forum`}
				description={"Questions and Answers from people around the world!"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/forum`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<Header
				title="Welcome to my Forum"
				description="Questions and Answers from people around the world!"
			/>
			<List
				featured={{}}
				objects={forums}
				params={params}
				searchParams={awtdSearchParams}
			/>
		</>
	);
};

export default ForumIndex;
