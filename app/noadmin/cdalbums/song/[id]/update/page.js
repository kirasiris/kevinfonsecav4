import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateSongForm from "@/forms/noadmin/cdalbums/updatesongform";

async function getSong(params) {
	const res = await fetchurl(`/global/songs${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateSong = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const song = await getSong(`/${awtdParams.id}`);

	return <UpdateSongForm token={token} auth={auth} object={song} />;
};

export default UpdateSong;
