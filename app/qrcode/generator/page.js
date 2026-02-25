import Header from "@/layout/header";
import QRCodeGeneratorPage from "@/components/qrcode/qrcodegeneratorpage";
import ErrorPage from "@/layout/errorpage";
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
				postImage={settings.data.showcase_image}
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
			{settings?.data?.maintenance === false ? (
				<>
					<Header title="QR Code Generator" description="Give it a try!" />
					<QRCodeGeneratorPage searchParams={awtdSearchParams} pushTo={true} />
				</>
			) : (
				<ErrorPage />
			)}
		</>
	);
};

export default QRCodeGeneratorIndex;
