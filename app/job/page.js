import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/job/list";

async function getFeaturedJob(params) {
	const res = await fetchurl(`/jobs${params}`, "GET", "no-cache");
	return res;
}

async function getJobs(params) {
	const res = await fetchurl(`/jobs${params}`, "GET", "no-cache");
	return res;
}

const JobIndex = async ({ params, searchParams }) => {
	const page = searchParams.page || 1;
	const limit = searchParams.limit || 10;
	const sort = searchParams.sort || "-createdAt";
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

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
			<List featured={featured} objects={jobs} searchParams={searchParams} />
		</>
	);
};

export default JobIndex;
