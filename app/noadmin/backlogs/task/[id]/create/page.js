import {
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import CreateTaskForm from "@/forms/noadmin/backlogs/createtaskform";

const CreateTask = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	return (
		<div className="container-fluid px-0">
			<CreateTaskForm
				token={token}
				auth={auth}
				params={awtdParams}
				searchParams={awtdSearchParams}
			/>
		</div>
	);
};

export default CreateTask;
