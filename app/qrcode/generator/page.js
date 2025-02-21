import Header from "@/layout/header";
import QRCodeGeneratorPage from "@/components/qrcode/qrcodegeneratorpage";
import Head from "@/app/head";

const QRCodeGeneratorIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	return (
		<>
			<Head title="QR Code Generator" description="Give it a try!" />
			<Header title="QR Code Generator" description="Give it a try!" />
			<QRCodeGeneratorPage searchParams={awtdSearchParams} pushTo={true} />
		</>
	);
};

export default QRCodeGeneratorIndex;
