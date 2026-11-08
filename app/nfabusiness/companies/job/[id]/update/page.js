import { notFound } from "next/navigation";
import {
	fetchurl,
	getAuthTokenOnServer,
	getUserOnServer,
} from "@/helpers/setTokenOnServer";
import UpdateJobForm from "@/forms/nfabusiness/companies/updatejobform";

async function getJob(params) {
	const res = await fetchurl(`/global/jobs${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

const UpdateJob = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const token = await getAuthTokenOnServer();
	const auth = await getUserOnServer();

	const job = await getJob(`/${awtdParams.id}`);

	return (
		<div className="container-fluid px-0">
			<UpdateJobForm token={token} auth={auth} object={job} />
		</div>
	);
};

export default UpdateJob;
