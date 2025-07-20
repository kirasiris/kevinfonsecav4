import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateChangelogForm from "@/forms/noadmin/changelogs/updatechangelogform";

async function getChangelog(params) {
	const res = await fetchurl(`/global/changelogs${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateChangelog = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();

	const auth = await getUserOnServer();

	const changelog = await getChangelog(`/${awtdParams.id}`);

	return <UpdateChangelogForm token={token} auth={auth} object={changelog} />;
};

export default UpdateChangelog;
