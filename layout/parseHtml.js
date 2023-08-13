"use client";
import he from "he";
const ParseHtml = ({ text = "" }) => {
	return <div dangerouslySetInnerHTML={{ __html: he.decode(text) }} />;
};

export default ParseHtml;
