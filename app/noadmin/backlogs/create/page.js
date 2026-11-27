import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateBacklogForm from "@/forms/noadmin/backlogs/createbacklogform";

const CreateBacklog = async ({ params, searchParams }) => {
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<div className="container-fluid px-0">
			<CreateBacklogForm token={token} auth={auth} />
		</div>
	);
};

export default CreateBacklog;
