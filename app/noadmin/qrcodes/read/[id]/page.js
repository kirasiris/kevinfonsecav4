import { notFound } from "next/navigation";
import { fetchurl } from "@/helpers/setTokenOnServer";
import QRC from "@/components/global/qrcode";

async function getQRCode(params) {
	const res = await fetchurl(
		`/extras/tools/qrcodes${params}`,
		"GET",
		"no-cache",
	);
	if (!res.success) notFound();
	return res;
}

const ReadQrCode = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const qrcode = await getQRCode(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<QRC
					value={qrcode?.data?.url}
					qrmargin={qrcode?.data?.qrmargin}
					qrcodesize={qrcode?.data?.qrcodesize}
					securitylevel={qrcode?.data?.securitylevel}
					imgsrc={qrcode?.data?.logo?.url}
					imgwidth={qrcode?.data?.logo?.width}
					imgheight={qrcode?.data?.logo?.height}
				/>
			</div>
		</div>
	);
};

export default ReadQrCode;
