import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/comment/list";

async function getComments(params) {
	const res = await fetchurl(`/comments${params}`, "GET", "no-cache");
	return res;
}

const CommentIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getCommentsData = getComments(
		`?page=${page}&limit=${limit}&sort=-createdAt&status=published${decrypt}`
	);

	const [comments] = await Promise.all([getCommentsData]);

	return (
		<>
			<Header
				title="Welcome to my comments"
				description="See what everyone is commenting!"
			/>
			<List objects={comments} searchParams={searchParams} />
		</>
	);
};

export default CommentIndex;
