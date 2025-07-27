import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateNewsletterEmailForm from "@/forms/noadmin/newsletteremails/updatenewsletteremailform";

async function getUsersSubscribed(params) {
	const res = await fetchurl(
		`/global/newslettersubscribers${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

async function getNewsletterEmail(params) {
	const res = await fetchurl(
		`/global/newsletteremails${params}`,
		"GET",
		"no-cache"
	);
	if (!res.success) notFound();
	return res;
}

const UpdateEmail = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const newsletteremail = await getNewsletterEmail(`/${awtdParams.id}`);

	const users = await getUsersSubscribed(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	return (
		<UpdateNewsletterEmailForm
			token={token}
			auth={auth}
			object={newsletteremail}
			objects={users}
		/>
	);
};

export default UpdateEmail;
