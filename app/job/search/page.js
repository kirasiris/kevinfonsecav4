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

const JobSearchIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getFeaturedJobsData = getFeaturedJob(
		`?featured=true&status=published${decrypt}`
	);

	const getJobsData = getJobs(
		`?page=${page}&limit=${limit}&sort=-createdAt&status=published&keyword=${searchParams.keyword}&experience_level=${searchParams.experience_level}&job_type=${searchParams.job_type}&starting_at=${searchParams.starting_at}&provides_training=${searchParams.provides_training}&security_clearance=${searchParams.security_clearance}${decrypt}`
	);

	const [featured, jobs] = await Promise.all([
		getFeaturedJobsData,
		getJobsData,
	]);

	return (
		<>
			<Header
				title={`${searchParams.keyword}`}
				description="Search results..."
			/>
			<List featured={featured} objects={jobs} searchParams={searchParams} />
		</>
	);
};

export default JobSearchIndex;
