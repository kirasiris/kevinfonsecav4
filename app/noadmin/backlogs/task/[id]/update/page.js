import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
// import UpdateTaskForm from "@/forms/noadmin/backlogs/updatetaskform";

async function getTask(params) {
	const res = await fetchurl(`/global/tasks${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateTask = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const task = await getTask(`/${awtdParams.id}`);

	return (
		<div className="container-fluid px-0">
			{/* <UpdateTaskForm
				token={token}
				auth={auth}
				object={task}
				searchParams={awtdSearchParams}
			/> */}
		</div>
	);
};

export default UpdateTask;
