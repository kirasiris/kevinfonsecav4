import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/comment/list";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getComments(params) {
	const res = await fetchurl(`/global/comments${params}`, "GET", "no-cache");
	return res;
}
const CommentIndex = async ({ params, searchParams }) => {
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getCommentsData = getComments(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${decrypt}`,
	);
	const [comments] = await Promise.all([getCommentsData]);
	return (
		<>
			<Head
				title={`${settings?.data?.title} - Comments`}
				description={"See what everyone is commenting!"}
				favicon={settings?.data?.favicon}
				postImage={settings.data.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`comment`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header
						title="Welcome to my comments"
						description="See what everyone is commenting!"
					/>
					<List objects={comments} searchParams={awtdSearchParams} />
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};
export default CommentIndex;
