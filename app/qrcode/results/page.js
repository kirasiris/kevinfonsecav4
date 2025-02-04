import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/qrcode/resultlist";

async function getQRCodeGeneratorResult(params) {
	const res = await fetchurl(
		`/extras/tools/qrcodes${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const QRCodeGeneratorResultIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";
	const decrypt = awtdSearchParams.decrypt === "true" ? "&decrypt=true" : "";

	const getResultsData = getQRCodeGeneratorResult(
		`?page=${page}&limit=${limit}&sort=${sort}&email=${awtdSearchParams.email}${decrypt}`
	);

	const [results] = await Promise.all([getResultsData]);

	return (
		<>
			<Header
				title={`QrCode results of ${awtdSearchParams.email}`}
				description="Check your previous qrcodes!"
			/>
			<List objects={results} searchParams={awtdSearchParams} />
		</>
	);
};

export default QRCodeGeneratorResultIndex;
