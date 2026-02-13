import Header from "@/layout/header";
import QRCodeGeneratorPage from "@/components/qrcode/qrcodegeneratorpage";
import Head from "@/app/head";
import { getGlobalData } from "@/helpers/globalData";

const QRCodeGeneratorIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const { settings } = await getGlobalData();

	return (
		<>
			<Head
				title={`${settings?.data?.title} - QR Code Generator`}
				description={"Give it a try!"}
				favicon={settings?.data?.favicon}
				postImage=""
				imageWidth=""
				imageHeight=""
				videoWidth=""
				videoHeight=""
				card="summary"
				robots=""
				category=""
				url={`/blog`}
				author=""
				createdAt=""
				updatedAt=""
				locales=""
				posType="page"
			/>
			<Header title="QR Code Generator" description="Give it a try!" />
			<QRCodeGeneratorPage searchParams={awtdSearchParams} pushTo={true} />
		</>
	);
};

export default QRCodeGeneratorIndex;
