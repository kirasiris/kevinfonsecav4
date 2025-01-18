import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/secret/list";

async function getSecrets(params) {
	const res = await fetchurl(`/extras/secrets${params}`, "GET", "no-cache");
	return res;
}

const SecretSearchIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getSecretsData = getSecrets(
		`?keyword=${awtdSearchParams.keyword}&age=${awtdSearchParams.age}&sex=${awtdSearchParams.sex}&nsfw=${awtdSearchParams.nsfw}&page=${page}&limit=${limit}&sort=${sort}&status=published${decrypt}`
	);

	const [secrets] = await Promise.all([getSecretsData]);

	return (
		<>
			<Header
				title={`${awtdSearchParams.keyword}`}
				description="Search results..."
			/>
			<List objects={secrets} searchParams={awtdSearchParams} />
		</>
	);
};

export default SecretSearchIndex;
