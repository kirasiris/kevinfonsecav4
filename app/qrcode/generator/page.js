import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/qrcode/list";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getQRCodes(params) {
	const res = await fetchurl(`/global/qrcodes${params}`, "GET", "no-cache");
	return res;
}

const QRCodeGeneratorIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const { settings } = await getGlobalData();

	const getQRCodesData = getQRCodes(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	const [qrcodes] = await Promise.all([getQRCodesData]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - QR Code Generator`}
				description={"Give it a try!"}
				favicon={settings?.data?.favicon}
				postImage={settings.data.showcase_image}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/qrcode/generator`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			{settings?.data?.maintenance === false ? (
				<>
					<Header title="QR Code Generator" description="Give it a try!" />
					<List objects={qrcodes} searchParams={awtdSearchParams} />
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default QRCodeGeneratorIndex;
