"use client";
import ParseHtml from "@/layout/parseHtml";

const Text = ({ object = {}, classList = "" }) => {
	return <ParseHtml text={object.text} classList={classList} />;
};

export default Text;
