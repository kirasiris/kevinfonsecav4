import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateNewsletterEmailForm from "@/forms/noadmin/newsletteremails/createnewsletteremailform";

async function getUsersSubscribed(params) {
	const res = await fetchurl(
		`/global/newslettersubscribers${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const CreateEmail = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const users = await getUsersSubscribed(
		`?page=${page}&limit=${limit}&sort=${sort}`
	);

	return (
		<CreateNewsletterEmailForm token={token} auth={auth} objects={users} />
	);
};

export default CreateEmail;
