import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/comment/list";

async function getComments(params) {
	const res = await fetchurl(`/comments${params}`, "GET", "no-cache");
	return res;
}
const CommentIndex = async ({ params, searchParams }) => {
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getCommentsData = getComments(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${decrypt}`
	);
	const [comments] = await Promise.all([getCommentsData]);
	return (
		<>
			<Header
				title="Welcome to my comments"
				description="See what everyone is commenting!"
			/>
			<List objects={comments} searchParams={awtdSearchParams} />
		</>
	);
};
export default CommentIndex;
