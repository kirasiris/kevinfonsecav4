import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/secret/list";

async function getSecrets(params) {
	const res = await fetchurl(
		`http://localhost:5000/api/v1/extras/secrets${params}`
	);
	return res.json();
}

const SecretIndex = async ({ params, searchParams }) => {
	const limit = searchParams.limit || 10;
	const page = searchParams.page || 1;
	const decrypt = searchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getSecretsData = getSecrets(
		`?page=${page}&limit=${limit}&sort=-createdAt&status=published${decrypt}`
	);

	const [secrets] = await Promise.all([getSecretsData]);

	return (
		<>
			<Header
				title="Welcome to Secrets"
				description="You're seeing secrets from people age 13 to 100"
			/>
			<List objects={secrets} searchParams={searchParams} />
		</>
	);
};

export default SecretIndex;
