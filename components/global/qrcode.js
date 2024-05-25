"use client";
import QRCode from "qrcode.react";

const QRC = ({ value = `` }) => {
	return (
		<QRCode
			value={value}
			includeMargin={true}
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
