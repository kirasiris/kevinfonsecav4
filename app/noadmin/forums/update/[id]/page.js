import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateForumForm from "@/forms/noadmin/forums/updateforum";

async function getForum(params) {
	const res = await fetchurl(`/global/forums${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateForum = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const forum = await getForum(`/${awtdParams.id}`);

	// FILES
	// CATEGORIES

	return <UpdateForumForm token={token} auth={auth} object={forum} />;
};

export default UpdateForum;
