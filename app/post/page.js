import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/profile/list";

async function getPosts(params) {
	const res = await fetchurl(`/posts${params}`, "GET", "no-cache");
	return res;
}

const PostIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = "-createdAt";
	const decrypt =
		searchParams.decrypt === "true" ? "&decrypt=true" : "&decrypt=true";

	const getPostsData = getPosts(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&postType=post${decrypt}`
	);

	const [posts] = await Promise.all([getPostsData]);

	return (
		<>
			<Header
				title="Welcome to my Users Page"
				description="Find out the community's members and become friends"
			/>
			<div className="container">
				<div className="row">
					<List params={params} objects={posts} searchParams={searchParams} />
				</div>
			</div>
		</>
	);
};

export default PostIndex;
