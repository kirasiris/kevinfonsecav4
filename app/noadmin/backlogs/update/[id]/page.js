import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateBacklogForm from "@/forms/noadmin/backlogs/updatebacklogform";

async function getBacklog(params) {
	const res = await fetchurl(`/global/backlogs${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateBacklog = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const backlog = await getBacklog(`/${awtdParams.id}`);

	return (
		<div className="container-fluid px-0">
			<UpdateBacklogForm token={token} auth={auth} object={backlog} />
		</div>
	);
};

export default UpdateBacklog;
