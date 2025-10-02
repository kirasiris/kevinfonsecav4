import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateUserForm from "@/forms/noadmin/users/updateuserform";

async function getUsers(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateUser = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const user = await getUsers(`/${awtdParams.id}`);

	const users = await getUsers(`?isEmailConfirmed=true`);

	return <UpdateUserForm auth={auth} object={user} objects={users} />;
};

export default UpdateUser;
