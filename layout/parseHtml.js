"use client";
import React, { useEffect, useState } from "react";
import he from "he";

const ParseHtml = ({
	text = "",
	classList = "",
	styleList = {},
	parseAs = "div",
}) => {
	const [decodedText, setDecodedText] = useState("");

	useEffect(() => {
		setDecodedText(he.decode(text));
	}, [text]);

	if (typeof window !== undefined) {
		return React.createElement(parseAs, {
			dangerouslySetInnerHTML: { __html: decodedText },
			className: classList || undefined,
			style: styleList || undefined,
		});
	}
};

export default ParseHtml;
