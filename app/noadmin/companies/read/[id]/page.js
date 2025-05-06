import { revalidatePath } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import ParseHtml from "@/layout/parseHtml";
import JobList from "@/components/admin/companies/joblist";
import Map from "@/components/global/map";

async function getCompany(params) {
	const res = await fetchurl(`/global/companies${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getJobs(params) {
	const res = await fetchurl(`/global/jobs${params}`, "GET", "no-cache");
	return res;
}

const ReadCompany = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const company = await getCompany(`/${awtdParams.id}`);
	const jobs = await getJobs(
		`?resourceId=${company?.data?._id}&page=${page}&limit=${limit}&sort=${sort}`
	);

	const draftIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/jobs/${id}/draftit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/companies/read/${awtdParams.id}`);
	};

	const publishIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/jobs/${id}/publishit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/companies/read/${awtdParams.id}`);
	};

	const trashIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/jobs/${id}/trashit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/companies/read/${awtdParams.id}`);
	};

	const scheduleIt = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/jobs/${id}/scheduleit`, "PUT", "no-cache");
		revalidatePath(`/noadmin/companies/read/${awtdParams.id}`);
	};

	const handleDelete = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/jobs/${id}/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/companies/read/${awtdParams.id}`);
	};

	const handleTrashAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/jobs/deleteall`, "PUT", "no-cache");
		revalidatePath(`/noadmin/companies/read/${awtdParams.id}`);
	};

	const handleDeleteAll = async (id) => {
		"use server";
		// const rawFormData = {}
		await fetchurl(`/noadmin/jobs/deleteall/permanently`, "DELETE", "no-cache");
		revalidatePath(`/noadmin/companies/read/${awtdParams.id}`);
	};

	return (
		<div className="row">
			<div className="col-lg-10">
				<div className="card rounded-0 mb-3">
					<div className="card-header">
						{company?.data?.title || "Untitled"}
					</div>
					<div className="card-body">
						<ParseHtml text={company?.data?.text} />
					</div>
				</div>
				<div className="card rounded-0 mb-3">
					<JobList
						allLink={`/noadmin/companies/read/${company?.data?._id}`}
						pageText="Jobs"
						addLink={`/noadmin/companies/job/${company?.data?._id}/create`}
						searchOn={`/noadmin/companies/read/${company?.data?._id}`}
						objects={jobs}
						searchParams={awtdSearchParams}
						handleDraft={draftIt}
						handlePublish={publishIt}
						handleTrash={trashIt}
						handleSchedule={scheduleIt}
						handleDelete={handleDelete}
						handleTrashAllFunction={handleTrashAll}
						handleDeleteAllFunction={handleDeleteAll}
					/>
				</div>
				<Map object={company?.data} />
			</div>
			<div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-xs-12 d-none d-sm-none d-md-none d-lg-block dm-xl-block">
				<figure className="mb-3 bg-dark">
					<Image
						className="img-fluid p-3"
						src={
							company?.data?.files?.avatar?.location?.secure_location ||
							`https://source.unsplash.com/random/260x370`
						}
						alt={`${company?.data?.files?.avatar?.location?.filename}'s featured image`}
						width={440}
						height={570}
						priority
					/>
				</figure>
			</div>
		</div>
	);
};

export default ReadCompany;
