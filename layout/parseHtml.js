"use client";
import he from "he";
import { useEffect, useState } from "react";
const ParseHtml = ({ text = "" }) => {
	const [decodedText, setDecodedText] = useState("");

	useEffect(() => {
		setDecodedText(he.decode(text));
	}, [text]);

	if (typeof window !== undefined) {
		return <div dangerouslySetInnerHTML={{ __html: decodedText }} />;
	}
};

export default ParseHtml;
