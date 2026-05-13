import { Suspense } from "react";
import { fetchurl } from "@/helpers/setTokenOnServer";
import Header from "@/layout/header";
import List from "@/components/qrcode/list";
import ErrorPage from "@/layout/errorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

async function getQRCode(params) {
	const res = await fetchurl(`/global/qrcodes${params}`, "GET", "no-cache");
	if (!res.success) notFound();
	return res;
}

async function getQRCodes(params) {
	const res = await fetchurl(`/global/qrcodes${params}`, "GET", "no-cache");
	return res;
}

const QRCodeGeneratorRead = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;
	const page = awtdSearchParams.page || 1;
	const limit = awtdSearchParams.limit || 10;
	const sort = awtdSearchParams.sort || "-createdAt";

	const { settings } = await getGlobalData();

	const getQRCodeData = getQRCode(`/${awtdParams.id}`);

	const getQRCodesData = getQRCodes(
		`?page=${page}&limit=${limit}&sort=${sort}`,
	);

	const [qrcode, qrcodes] = await Promise.all([getQRCodeData, getQRCodesData]);

	return (
		<>
			<Head
				title={`${settings?.data?.title} - ${qrcode?.data?.title}`}
				description={"Give it a try!"}
				favicon={settings?.data?.favicon}
				postImage={qrcode?.data?.logo?.url}
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/qrcode/generator/${qrcode?.data?._id}`}
				author={qrcode?.data?.name}
				createdAt={qrcode?.data?.createdAt}
				updatedAt={qrcode?.data?.updatedAt}
				locales=""
				posType="blog"
			/>
			{settings?.data?.maintenance === false ? (
				<Suspense fallback={<>Loading qrcodes...</>}>
					<Header title={qrcode?.data?.title} />
					<List
						object={qrcode}
						objects={qrcodes}
						searchParams={awtdSearchParams}
					/>
				</Suspense>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default QRCodeGeneratorRead;
