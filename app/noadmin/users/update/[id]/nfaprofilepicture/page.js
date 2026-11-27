import { notFound } from "next/navigation";
import { fetchurl, getUserOnServer } from "@/helpers/setTokenOnServer";
import UploadPictureForm from "@/forms/noadmin/users/uploadnfapictureform";

async function getUser(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getNFAAvatar(file) {
	const res = await fetchurl(`/global/files/${file}`, "GET", "no-cache");
	return res;
}

const UpdateUserNFAProfilePicture = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const auth = await getUserOnServer();

	const user = await getUser(`/${awtdParams.id}`);
	const nfaAvatar = await getNFAAvatar(user?.data?.files?.nfa_avatar);

	return (
		<div className="container-fluid px-0">
			<UploadPictureForm object={user} nfaAvatar={nfaAvatar?.data} />
		</div>
	);
};

export default UpdateUserNFAProfilePicture;
