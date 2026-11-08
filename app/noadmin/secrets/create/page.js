import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateSecretForm from "@/forms/noadmin/secrets/createsecretform";

const CreateSecret = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();
	return (
		<div className="container-fluid px-0">
			<CreateSecretForm token={token} auth={auth} />
		</div>
	);
};

export default CreateSecret;
