import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdatePollForm from "@/forms/noadmin/polls/updatepollform";

async function getPoll(params) {
	const res = await fetchurl(`/global/polls${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdatePoll = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const poll = await getPoll(`/${awtdParams.id}`);

	return <UpdatePollForm token={token} auth={auth} object={poll} />;
};

export default UpdatePoll;
