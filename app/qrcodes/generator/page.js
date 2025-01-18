import Header from "@/layout/header";
import QRCodeGeneratorPage from "@/components/qrcode/qrcodegeneratorpage";

const QRCodeGeneratorIndex = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	return (
		<>
			<Header title="QR Code Generator" description="Give it a try!" />
			<QRCodeGeneratorPage searchParams={awtdSearchParams} pushTo={true} />
		</>
	);
};

export default QRCodeGeneratorIndex;
