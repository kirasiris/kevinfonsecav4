import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/job/list";

async function getFeaturedJob(params) {
	const res = await fetchurl(`/global/jobs${params}`, "GET", "no-cache");
	return res;
}

async function getJobs(params) {
	const res = await fetchurl(`/global/jobs${params}`, "GET", "no-cache");
	return res;
}

const JobIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedJobsData = getFeaturedJob(
		`?featured=true&status=published${decrypt}`
	);

	const getJobsData = getJobs(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published${decrypt}`
	);

	const [featured, jobs] = await Promise.all([
		getFeaturedJobsData,
		getJobsData,
	]);

	return (
		<>
			<Header
				title="Welcome to my Jobs"
				description="Find and Apply to Programming Jobs"
			/>
			<List
				featured={featured}
				objects={jobs}
				searchParams={awtdSearchParams}
			/>
		</>
	);
};

export default JobIndex;
