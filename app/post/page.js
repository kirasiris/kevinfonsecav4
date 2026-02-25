import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/profile/list";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getPosts(params) {
	const res = await fetchurl(`/global/posts${params}`, "GET", "no-cache");
	return res;
}

const PostIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = "-createdAt";
	const decrypt =
		awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "&decrypt=true";

	const { settings } = await getGlobalData();

	const getPostsData = getPosts(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&postType=post${decrypt}`,
	);

	const [posts] = await Promise.all([getPostsData]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Post`}
				description={"Find out the community's members and become friends"}
				favicon={settings?.data?.favicon}
				postImage={settings.data.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/blog`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header
						title="Welcome to my Users Page"
						description="Find out the community's members and become friends"
					/>
					<div className="container">
						<div className="row">
							<List
								params={params}
								objects={posts}
								searchParams={awtdSearchParams}
							/>
						</div>
					</div>
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default PostIndex;
