"use client";
import ParseHtml from "@/layout/parseHtml";

const Text = ({ object = {}, classList = "" }) => {
	return typeof object.text === "object" ? (
		"TEXT IS EITHER ENCRYPTED OR PASSWORD PROTECTED"
	) : (
		<ParseHtml className={classList} text={JSON.stringify(object.text)} />
	);
};

export default Text;
