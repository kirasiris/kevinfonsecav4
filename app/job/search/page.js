import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/job/list";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getJobs(params) {
	const res = await fetchurl(`/global/jobs${params}`, "GET", "no-cache");
	return res;
}

const JobSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const { settings } = await getGlobalData();

	const getFeaturedJobsData = getJobs(
		`?featured=true&status=published${decrypt}`,
	);

	const getJobsData = getJobs(
		`?page=${page}&limit=${limit}&sort=${sort}&status=published&keyword=${awtdSearchParams.keyword}&experience_level=${awtdSearchParams.experience_level}&job_type=${awtdSearchParams.job_type}&starting_at=${awtdSearchParams.starting_at}&provides_training=${awtdSearchParams.provides_training}&security_clearance=${awtdSearchParams.security_clearance}${decrypt}`,
	);

	const [featured, jobs] = await Promise.all([
		getFeaturedJobsData,
		getJobsData,
	]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - Search results of ${awtdSearchParams.keyword}`}
				description={"Search results..."}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/job/search?keyword=${awtdSearchParams.keyword}&page=${page}&limit=${limit}&sort=${sort}`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<Header
				title={`${awtdSearchParams.keyword}`}
				description="Search results..."
			/>
			<List
				featured={featured}
				objects={jobs}
				searchParams={awtdSearchParams}
			/>
		</>
	);
};

export default JobSearchIndex;
