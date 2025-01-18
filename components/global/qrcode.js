"use client";
import { QRCodeSVG } from "qrcode.react";

const QRC = ({
	value = ``,
	qrmargin = 4,
	qrcodesize = 200,
	securitylevel = "L",
	imgsrc = "",
	imgwidth = 30,
	imgheight = 30,
}) => {
	return (
		<QRCodeSVG
			value={value}
			marginSize={qrmargin || 4}
			size={qrcodesize || 200}
			level={securitylevel || `L`}
			imageSettings={{
				src:
					imgsrc ||
					`https://res.cloudinary.com/dgq2klit7/image/upload/v1735397803/6665c4a6658b7dc837479ea3-kirasiris-kuaf1998%40gmail.com/posts/croppedkevinurielfonsecalogopng-6665c4a6658b7dc837479ea3-kuaf1998-gmail-com.png`,
				width: imgwidth || 30,
				height: imgheight || 30,
				excavate: true,
			}}
		/>
	);
};

export default QRC;
