import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateCommentForm from "@/forms/noadmin/comments/updatecommentform";

async function getComment(params) {
	const res = await fetchurl(`/global/comments${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateComment = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const comment = await getComment(`/${awtdParams.id}`);

	return <UpdateCommentForm token={token} auth={auth} object={comment} />;
};

export default UpdateComment;
