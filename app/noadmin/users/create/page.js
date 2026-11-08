import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateUserForm from "@/forms/noadmin/users/createuserform";

async function getUsers(params) {
	const res = await fetchurl(`/global/users${params}`, "GET", "no-cache");
	return res;
}

const CreateUser = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const users = await getUsers(`?isEmailConfirmed=true`);

	return (
		<div className="container-fluid px-0">
			<CreateUserForm auth={auth} objects={users} />
		</div>
	);
};

export default CreateUser;
