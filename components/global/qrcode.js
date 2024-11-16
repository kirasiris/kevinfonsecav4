"use client";
import { QRCodeSVG } from "qrcode.react";

const QRC = ({ value = `` }) => {
	return (
		<QRCodeSVG
			value={value}
			marginSize={4}
			size={200}
			level={`L`}
			imageSettings={{
				src: `https://static.thenounproject.com/png/649740-200.png`,
				height: 30,
				width: 30,
				excavate: true,
			}}
		/>
	);
};

export default QRC;
