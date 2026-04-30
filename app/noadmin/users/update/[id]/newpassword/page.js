import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import UpdateUserPasswordForm from "@/forms/noadmin/users/updateuserpasswordform";

async function getUser(params) {
	const res = await fetchurl(`/protected/users${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateUserPassword = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const user = await getUser(`/${awtdParams.id}`);

	return <UpdateUserPasswordForm object={user} />;
};

export default UpdateUserPassword;
