import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/secret/list";

async function getSecrets(params) {
	const res = await fetchurl(`/extras/secrets${params}`, "GET", "no-cache");
	return res.json();
}

const SecretSearchIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getSecretsData = getSecrets(
		`?keyword=${searchParams.keyword}&age=${searchParams.age}&sex=${searchParams.sex}&nsfw=${searchParams.nsfw}&page=${page}&limit=${limit}&sort=-createdAt&status=published${decrypt}`
	);

	const [secrets] = await Promise.all([getSecretsData]);

	return (
		<>
			<Header
				title={`${searchParams.keyword}`}
				description="Search results..."
			/>
			<List objects={secrets} searchParams={searchParams} />
		</>
	);
};

export default SecretSearchIndex;
