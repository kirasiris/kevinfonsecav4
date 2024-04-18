"use client";
import ParseHtml from "@/layout/parseHtml";

const Text = ({ object = {} }) => {
	return typeof object.text === "object" ? (
		"TEXT IS EITHER ENCRYPTED OR PASSWORD PROTECTED"
	) : (
		<ParseHtml text={JSON.stringify(object.text)} />
	);
};

export default Text;
