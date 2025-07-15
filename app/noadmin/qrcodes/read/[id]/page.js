import { fetchurl } from "@/helpers/setTokenOnServer";
import QRC from "@/components/global/qrcode";

async function getQRCodes(params) {
	const res = await fetchurl(
		`/extras/tools/qrcodes${params}`,
		"GET",
		"no-cache"
	);
	return res;
}

const ReadQrCode = async ({ params, searchParams }) => {
	const awtdParams = await params;
	const awtdSearchParams = await searchParams;

	const qrcode = await getQRCodes(`/${awtdParams.id}`);

	return (
		<div className="row">
			<div className="col-lg-12">
				<QRC
					value={qrcode?.data?.url}
					qrmargin={qrcode?.data?.qrmargin}
					qrcodesize={qrcode?.data?.qrcodesize}
					securitylevel={qrcode?.data?.securitylevel}
					imgsrc={qrcode?.data?.imageurl}
					imgwidth={qrcode?.data?.imagewidth}
					imgheight={qrcode?.data?.imageheight}
				/>
			</div>
		</div>
	);
};

export default ReadQrCode;
